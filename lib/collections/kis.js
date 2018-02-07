Kis = new Mongo.Collection('kis');

Kis.allow({
  insert: function (userId){
    return userId;
  },
  update: function (userId){
    return userId;
  },
  remove: function (userId){
    return userId;
  }
})

Kis.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "The date for the KIs",
    unique: false,
    optional: true
  },
  date: {
    type: String,
    label: "The date for the KIs",
    unique: false,
    optional: true
  },
  validation: {
    type: String,
    unique: true
  },
  areaId: {
    type: String
  },
  districtId: {
    type: String
  },
  zoneId: {
    type: String
  },
  unitId:{
    type: String
  },
  stakeId:{
    type: String
  },
  bap: {
    type: Number
  },
  conf: {
    type: Number
  },
  wd: {
    type: Number
  },
  atsac: {
    type: Number
  },
  mp: {
    type: Number
  },
  ol: {
    type: Number
  },
  pi: {
    type: Number
  },
  refr: {
    type: Number
  },
  refc: {
    type: Number
  },
  ni: {
    type: Number
  },
  larc: {
    type: Number
  },
  qual: {
    type: Number
  },
  dwm: {
    type: Number
  },
  fol: {
    type: Number
  },
  niM: {
    type: Number
  },
  niFTM: {
    type: Number
  },
  bapM: {
    type: Number
  },
  bapFTM: {
    type: Number
  },
  
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    },
  }
}));

if (Meteor.isServer) {

    import {indicators} from './helpers.js';

    Meteor.methods({
        'Kis.insertWeeklyReport': function(kis, jsh) {
            var user = Meteor.user();
            if (!user)
                throw new Meteor.Error('unauthorized', 'user must be logged in')

            var areaId = user.profile.area;
            if (!areaId)
                throw new Meteor.Error('invalid-input', 'areaId not provided')
            var area = Areas.findOne({ _id: areaId });
            if (!area)
                throw new Meteor.Error('invalid-input', 'area for _id [' + areaId + '] not found') 
       
            const date = moment().startOf('week').toDate().toString().substring(0, 15);
            //validation on kis for each unit
            for (i in kis) {
                let ki = kis[i]; 
                let unitId = ki.unitId;
                if (!unitId)
                    throw new Meteor.Error('invalid-input', 'unitId not provided')
                let unit = Units.findOne({ _id: unitId });
                if (!unit)
                    throw new Meteor.Error('invalid-input', 'unit for _id [' + unitId + '] not found')
                if (!_.contains(area.units, unitId))
                    throw new Meteor.Error('invalid-input', 'unit not found in your area')

                //vlidation on ki input
                for (i in indicators) {
                    let key = indicators[i].key;
                    ki[key] = parseInt(ki[key]);
                    if (typeof ki[key] !== 'number' || isNaN(ki[key])) {
                        throw new Meteor.Error('invalid-input', 'indicator [' + key + '] must have a number value') };
                    if (ki[key] < 0) {
                        throw new Meteor.Error('invalid-input', 'indicator [' + key + '] must be more than or equal to 0') }
                }

                ki.date = date;
                ki.validation = date + unitId + areaId;            
                ki.areaId = areaId;
                ki.zoneId = area.zone;
                ki.stakeId = unit.stake;
                ki.districtId = area.district;
            }

            //validation on just serve hours input
            const jsh_fields = ['litw', 'hours'];
            for (key in jsh) {
                if (!_.contains(jsh_fields, key)) {
                    throw new Meteor.Error('invalid-input', 'key [' + key + '] does not exist') };
                let value = parseInt(jsh[key]);
                if (typeof value !== 'number' || isNaN(value)) {
                    throw new Meteor.Error('invalid-input', 'indicator [' + key + '] must have a number value') };
                if (value < 0) {
                    throw new Meteor.Error('invalid-input', 'indicator [' + key + '] must be more than or equal to 0') }
            }

            jsh.areaName = area.name;
            jsh.validation = date + areaId;
            jsh.date = date;
            jsh.zoneId = area.zone;

            for (i in kis){
              ki = kis[i];
              Kis.insert(ki);
            }
            JustServeHours.insert(jsh);

            report();
            // reporting(area);
        }
    })


function email(to, from, subject, text) {
    Email.send({
        to: to,
        from: from,
        subject: subject,
        text: text
    });
}

// after submission the numbers the input are sent via text message (through email) to their district leader.
// When all areas in a district have reported, they are totaled and those numbers are sent to a zone leader.
function reporting(area){
        var date = moment().startOf('week').toDate().toString().substring(0, 15);

        var district = Districts.findOne({ _id: area.district });
        var districtLeader = Areas.findOne({ _id: district.leader });
        var dlNumber = districtLeader.phone + "@txt.att.net";

        var progress = {};
        for (key in indicators){
          progress[key] = 0;
        }

        Kis.find({ areaId: area._id, date: date }).forEach(function(ki) {
            for (key in indicators){
              progress[key] += ki[key];
            }
        });

        //send area's numbers to district leader
        var subject = "Weekly Actuals For " + area.name;

        var message = "";
        for (key in progress){
          message = message + key + ":" + progress[key] + " "
        }

        email(dlNumber, "CFM OPPS <assistants@cfmopps.com>", subject, message);
}

function report() {
    const user = Meteor.user();
    var area = Areas.findOne({ _id: user.profile.area });
    var zone = Zones.findOne({ _id: area.zone });
    var district = Districts.findOne({ _id: area.district });
    var units = area.units;
    var date = moment().startOf('week').toDate().toString().substring(0, 15);

    var districtLeader = Areas.findOne({ _id: district.leader });
    var zoneLeader = Areas.findOne({ _id: zone.leader });
    var dlUser = Meteor.users.findOne({ "profile.area": district.leader })._id;
    var zlUser = Meteor.users.findOne({ "profile.area": zone.leader })._id;
    if (Meteor.users.findOne({ _id: dlUser }).profile.district === undefined) {
        Meteor.users.update({ _id: dlUser }, { $set: { "profile.district": [] } });
    }
    if (Meteor.users.findOne({ _id: dlUser }).profile.district.length !== Areas.find({ district: area.district }).count() && Meteor.users.find({ _id: dlUser, "profile.district": area._id }).count() !== 1) {
        var dlNumber = districtLeader.phone;
        var zlNumber = zoneLeader.phone;
        var bap = 0;
        var conf = 0;
        var wd = 0;
        var atsac = 0;
        var mp = 0;
        var ol = 0;
        var pi = 0;
        var refr = 0;
        var refc = 0;
        var ni = 0;
        var larc = 0;
        var qual = 0;
        var dwm = 0;
        var fol = 0;
        var niM = 0;
        var niFTM = 0;
        var bapM = 0;
        var bapFTM = 0;

        var dbap = 0;
        var dconf = 0;
        var dwd = 0;
        var datsac = 0;
        var dmp = 0;
        var dol = 0;
        var dpi = 0;
        var drefr = 0;
        var drefc = 0;
        var dni = 0;
        var dlarc = 0;
        var dqual = 0;
        var ddwm = 0;
        var dfol = 0;
        var dniM = 0;
        var dniFTM = 0;
        var dbapM = 0;
        var dbapFTM = 0;

        var zbap = 0;
        var zconf = 0;
        var zwd = 0;
        var zatsac = 0;
        var zmp = 0;
        var zol = 0;
        var zpi = 0;
        var zrefr = 0;
        var zrefc = 0;
        var zni = 0;
        var zlarc = 0;
        var zqual = 0;
        var zdwm = 0;
        var zfol = 0;
        var zniM = 0;
        var zniFTM = 0;
        var zbapM = 0;
        var zbapFTM = 0;

        Kis.find({ areaId: area._id, date: date }).forEach(function(a) {
            bap += a.bap;
            conf += a.conf;
            wd += a.wd;
            atsac += a.atsac;
            mp += a.mp;
            ol += a.ol;
            pi += a.pi;
            refr += a.refr;
            refc += a.refc;
            ni += a.ni;
            larc += a.larc;
            qual += a.qual;
            dwm += a.dwm;
            fol += a.fol;
            niM += a.niM;
            niFTM += a.niFTM;
            bapM += a.bapM;
            bapFTM += a.bapFTM;
        });

        Areas.find({ district: area.district }).forEach(function(s) {
            Kis.find({ areaId: s._id, date: date }).forEach(function(t) {
                dbap += t.bap;
                dconf += t.conf;
                dwd += t.wd;
                datsac += t.atsac;
                dmp += t.mp;
                dol += t.ol;
                dpi += t.pi;
                drefr += t.refr;
                drefc += t.refc;
                dni += t.ni;
                dlarc += t.larc;
                dqual += t.qual;
                ddwm += t.dwm;
                dfol += t.fol;
                dniM += t.niM;
                dniFTM += t.niFTM;
                dbapM += t.bapM;
                dbapFTM += t.bapFTM;
            });
        });

        Areas.find({ zone: zone._id }).forEach(function(u) {
            Kis.find({ areaId: u._id, date: date }).forEach(function(v) {
                zbap += v.bap;
                zconf += v.conf;
                zwd += v.wd;
                zatsac += v.atsac;
                zmp += v.mp;
                zol += v.ol;
                zpi += v.pi;
                zrefr += v.refr;
                zrefc += v.refc;
                zni += v.ni;
                zlarc += v.larc;
                zqual += v.qual;
                zdwm += v.dwm;
                zfol += v.fol;
                zniM += v.niM;
                zniFTM += v.niFTM;
                zbapM += v.bapM;
                zbapFTM += v.bapFTM;
            });
        });
        var message = "BAP:" + bap + " CONF:" + conf + " WD:" + wd + " @SAC:" + atsac + " MP:" + mp + " OL:" +
            ol + " PI:" + pi + " REFR:" + refr + " REFC:" + refc + " NI:" + ni + " LARC:" + larc + " QL:" +
            qual + " DWM:" + dwm + " FOL:" + fol + " NIMEM:" + niM + " NIFTM:" + niFTM + " BAPMEM:" + bapM +
            " BAPFTM:" + bapFTM;

        var districtMessage = "BAP:" + dbap + " CONF:" + dconf + " WD:" + dwd + " @SAC:" + datsac + " MP:" + dmp + " OL:" +
            dol + " PI:" + dpi + " REFR:" + drefr + " REFC:" + drefc + " NI:" + dni + " LARC:" + dlarc + " QL:" +
            dqual + " DWM:" + ddwm + " FOL:" + dfol + " NIMEM:" + dniM + " NIFTM:" + dniFTM + " BAPMEM:" + dbapM +
            " BAPFTM:" + dbapFTM;

        var zoneMessage = "BAP:" + zbap + " CONF:" + zconf + " WD:" + zwd + " @SAC:" + zatsac + " MP:" + zmp + " OL:" +
            zol + " PI:" + zpi + " REFR:" + zrefr + " REFC:" + zrefc + " NI:" + zni + " LARC:" + zlarc + " QL:" +
            zqual + " DWM:" + zdwm + " FOL:" + zfol + " NIMEM:" + zniM + " NIFTM:" + zniFTM + " BAPMEM:" + zbapM +
            " BAPFTM:" + zbapFTM;


        //send area's numbers to district leader
        Meteor.call("email", dlNumber + "@txt.att.net", "CFM OPPS <assistants@cfmopps.com>", "Weekly Actuals For " + area.name, message);
        Meteor.users.update({ _id: dlUser }, { $push: { "profile.district": area._id } });
        if (Meteor.users.findOne({ _id: dlUser }).profile.district.length == Areas.find({ district: area.district }).count()) {
            //resets the reported count for the district
            Meteor.users.update({ _id: dlUser }, { $set: { "profile.district": [] } });
            //send district total to district leader and to zone leaders
            Meteor.call("email", dlNumber + "@txt.att.net", "CFM OPPS <assistants@cfmopps.com>", "Weekly Actuals For " + districtLeader.name + "'s District", districtMessage);
            Meteor.call("email", zlNumber + "@txt.att.net", "CFM OPPS <assistants@cfmopps.com>", "Weekly Actuals For " + districtLeader.name + "'s District", districtMessage);
            //anything you want to happen after the last area has reported for a district and the district total text has been sent

            //check if zone is full or not
            if (Meteor.users.findOne({ _id: zlUser }).profile.zoneArray === undefined) {
                Meteor.users.update({ _id: zlUser }, { $set: { "profile.zoneArray": [] } });
            }
            if (Meteor.users.findOne({ _id: zlUser }).profile.zoneArray.length !== Districts.find({ zone: district.zone }).count()) {
                //if zone is not full
                //add district id to zone field of zlUser
                Meteor.users.update({ _id: zlUser }, { $push: { "profile.zoneArray": district._id } });

                //check if that was the last district reporting
                if (Meteor.users.findOne({ _id: zlUser }).profile.zoneArray.length == Districts.find({ zone: district.zone }).count()) {
                    //if so
                    //sends text with zone total to zone leaders and to us.
                    Meteor.call("email", zlNumber + "@txt.att.net", "CFM OPPS <assistants@cfmopps.com>", "Weekly Actuals For " + zone.name, zoneMessage);
                    //resets zone array after texts have been sent
                    Meteor.users.update({ _id: zlUser }, { $set: { "profile.zoneArray": [] } });
                }
            }
            //end code to handle the zone array
        }
    } else if (Meteor.users.findOne({ _id: dlUser }).profile.district.length !== Areas.find({ district: area.district }).count() && Meteor.users.find({ _id: dlUser, "profile.district": area._id }).count() !== 0) {
        //do nothing
        //your whole district has not reported, but you have. so we are not gonna do anything here.
    }
}

}