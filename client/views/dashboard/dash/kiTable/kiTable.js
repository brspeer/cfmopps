Template.kiTable.helpers({
  areasKIs: function() {
    var zone = Meteor.user().profile.zone;
    var month = moment().month() - 1;
    if (Roles.userIsInRole(Meteor.user(), 'office')) {
      zone = Session.get('drilldownZone')
    }
    var areasKIs = [];
    Areas.find({zone: zone, active: true}).forEach(function(x) {
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
      var units = [];
      var date = moment().startOf('week').toDate().toString().substring(0,15);
       Kis.find({areaId: x._id, date: date}).forEach(function(y) {
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
        bapFTM += y.bapM;
        units.push(y.unitId);
        
      });
      
      var obj = {
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
        "units": units
      }
      
      areasKIs.push(obj);
    });
    
    return areasKIs;
  }
});

Template.kiTable.events({
  'click td.edit': function() {
    console.log(this);
  }
  
});