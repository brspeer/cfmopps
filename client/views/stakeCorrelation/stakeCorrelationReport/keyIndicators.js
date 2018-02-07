Template._keyIndicators.onRendered(function() {
  Session.set('editing', null);
  
});

Template._keyIndicators.helpers({
  editing: function() {
    return Session.get('editing');
  },
  unitsKIs: function() {
    var year = moment().year();
    var month = moment().month() - 1;
    if (moment().month() === 0) {
      month = 11;
      year = year - 1;
    }
    if (Meteor.user() && Meteor.user().profile){
      var stake = Stakes.findOne({zones: Meteor.user().profile.zone});
    }
    if (Roles.userIsInRole(Meteor.user(), ['office', 'zoneLeader'])) {
      stake = Stakes.findOne({_id: Session.get('drilldownStakeSC')});
    }
    var unitsKIs = [];
    if (stake){
    Units.find({stake: stake._id}).forEach(function(x) {
      var bap = 0;
      var conf = 0;
      var wd = 0;
      var atsac = 0;
      var mp = 0;
      var ni = 0;
      var mh = 0;
      var niM = 0;
      var niFTM = 0;
      var bapM = 0;
      var bapFTM = 0;   
      var areaNums = []; //an array with an object of numbers for units with multiple areas serving in them
      
      Areas.find({ units: { $in: [x._id] }, active: true }).forEach(function(z) {
        var areaNumsArr = [];
        var areaNumsName = z.name;
        var areaNumsBap = 0;
        var areaNumsConf = 0;
        var areaNumsWD = 0;
        var areaNumsAtSac = 0;
        var areaNumsMP = 0;
        var areaNumsNI = 0;
        var areaNumsMH = 0;
        var areaNumsNiM = 0;
        var areaNumsNiFTM = 0;
        var areaNumsBapM = 0;
        var areaNumsBapFTM = 0;
        var areaNumsKiId = null;
        
        MonthlyKis.find({areaId: z._id, unitId: x._id, name: moment.monthsShort()[month] + " " + year}).forEach(function(a) {
          areaNumsBap += a.bap,
          areaNumsConf += a.conf,
          areaNumsWD += a.wd,
          areaNumsAtSac += a.atsac,
          areaNumsMP += a.mp,
          areaNumsNI += a.ni,
          areaNumsMH += a.mh,
          areaNumsNiM += a.niM,
          areaNumsNiFTM += a.niFTM,
          areaNumsBapM += a.bapM,
          areaNumsBapFTM += a.bapFTM,
          areaNumsKiId = a._id
        });
        
        areaNumsObj = {
          "name": areaNumsName,
          "bap": areaNumsBap,
          "conf": areaNumsConf,
          "wd": areaNumsWD,
          "atsac": areaNumsAtSac,
          "mp": areaNumsMP,
          "ni": areaNumsNI,
          "mh": areaNumsMH,
          "niM": areaNumsNiM,
          "niFTM": areaNumsNiFTM,
          "bapM": areaNumsBapM,
          "bapFTM": areaNumsBapFTM,
          "kiId": areaNumsKiId
        };
        
        areaNumsArr.push(areaNumsObj);
        areaNums.push(areaNumsArr);
        
      });
      
      MonthlyKis.find({unitId: x._id, name: moment.monthsShort()[month] + " " + year}).forEach(function(y) {
        bap += y.bap;
        conf += y.conf;
        wd += y.wd;
        atsac += y.atsac;
        mp += y.mp;
        ni += y.ni;
        mh += y.mh;
        niM += y.niM;
        niFTM += y.niFTM;
        bapM += y.bapM;
        bapFTM += y.bapFTM;        
      });
      
      
      
      obj = {
        "name": x.name,
        "bap": bap,
        "conf": conf,
        "wd": wd,
        "atsac": atsac,
        "mp": mp,
        "ni": ni,
        "mh": mh,
        "niM": niM,
        "niFTM": niFTM,
        "bapM": bapM,
        "bapFTM": bapFTM,
        "areaNums": areaNums,
      }
      
      unitsKIs.push(obj);
    });
    
    return unitsKIs;
  }
  }
});

Template._keyIndicators.events({
  'click .ui.icon.primary.button': function() {
    Session.set('editing', true);
  },
  'click .ui.icon.positive.button': function() {
    var stake;
    if (Roles.userIsInRole(Meteor.user(), 'zoneLeader')) {
      stake = Stakes.findOne({_id: Session.get('drilldownStakeSC')});
    }
    var year = moment().year();
    var month = moment().month() - 1;
    if (moment().month === 0) {
      year = year - 1;
      month = 11;
    }
    MonthlyKis.find({stakeId: stake._id, name: moment.monthsShort()[month] + " " + year}).forEach(function(x) {
      if (document.getElementById(x._id + "bap") !== null) {
        MonthlyKis.update({_id: x._id}, { $set: {
          bap: document.getElementById(x._id + "bap").value,
          conf: document.getElementById(x._id + "conf").value,
          wd: document.getElementById(x._id + "wd").value,
          atsac: document.getElementById(x._id + "atsac").value,
          mp: document.getElementById(x._id + "mp").value,
          ni: document.getElementById(x._id + "ni").value,
          mh: document.getElementById(x._id + "conf").value
        }})
      }
    });
    Session.set('editing', false);
  }
  
})