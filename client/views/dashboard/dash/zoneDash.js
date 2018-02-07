Template.zoneDash.onRendered(function() {
  Session.set('areaEdit', null);
  Session.set('districtEdit', null);
  Session.set('zoneEdit', null);
  $('.ui.selection.dropdown')
  .dropdown()
  ;
});

Template.zoneDash.helpers({
  unitsShown: function() {
    //CODE FOR FUNCTIONALITY OF DASHBOARD DRILLDOWN FOR EACH ROLE
    
    //WORKS PERFECTLY LEAVE IT ALONE
    //CONTROL FLOW FOR OFFICE ACCOUNTS
    if (Roles.userIsInRole(Meteor.user(), 'office')) {
      if (Session.get('drilldownArea') != null) {
        var x = Areas.findOne({name: Session.get('drilldownArea')}).units;
        return Units.find({_id: { $in: x} });
    } else if (Session.get('drilldownDistrict') != null) {
      //Code for drilldown to District for Office Dash
      Areas.find({district : Session.get('drilldownDistrict')}).forEach(function(x) {
        Kis.find({areaId : x._id}).forEach(function(y) {
          ki.push(y);
        });
      });
      return Areas.find({district: Session.get('drilldownDistrict')});
      
    } else if (Session.get('drilldownZone') != null) {
      //Code for drilldown to Zone for Office Dash
      Areas.find({zone : Session.get('drilldownZone')}).forEach(function(x) {
        Kis.find({areaId : x._id}).forEach(function(y) {
          ki.push(y);
        })
      })
      return Districts.find({zone: Session.get('drilldownZone')});
    }
    }
    //END OFFICE
    
    //WORKS PERFECTLY LEAVE IT ALONE
    //CONTROL FLOW FOR ZONE LEADER ACCOUNTS
    else if (Roles.userIsInRole(Meteor.user(), 'zoneLeader')) {
    if (Session.get('drilldownArea') != null) {
      //Code for drilldown to area for ZL Dash
      Areas.find({name : Session.get('drilldownArea')}).forEach(function(x) {
        Kis.find({areaId : x._id}).forEach(function(y) {
          ki.push(y);
        })
      })
    } else if (Session.get('drilldownDistrict') != null) {
      //Code for drilldown to district for ZL Dash
      Areas.find({district : Session.get('drilldownDistrict')}).forEach(function(x) {
        Kis.find({areaId : x._id}).forEach(function(y) {
          ki.push(y);
        });
      });
    }
     else {
      //Code for zone total for ZL Dash
       Areas.find({zone : Meteor.user().profile.zone}).forEach(function(x) {
        Kis.find({areaId : x._id}).forEach(function(y) {
          ki.push(y);
        })
      })
    }
    }
    //END ZONE LEADER
    
    
    //CONTROL FLOW FOR DISTRICT LEADER ACCOUNTS
    else if (Roles.userIsInRole(Meteor.user(), 'districtLeader')) {
      if (Session.get('drilldownArea') != null) {
        //Code for a drilldown to area for a DL's dashboard
        Areas.find({name : Session.get('drilldownArea')}).forEach(function(x) {
        Kis.find({areaId : x._id}).forEach(function(y) {
          ki.push(y);
        })
      })
      } else if (Session.get('drilldownDistrict') != null) {
        Areas.find({district: Session.get('drilldownDistrict')}).forEach(function(x) {
          Kis.find({areaId : x._id}).forEach(function(y) {
            ki.push(y);
          })
        })
      } else {
        //Code for Ki's for the whole zone
        Areas.find({zone : Meteor.user().profile.zone}).forEach(function(x) {
        Kis.find({areaId : x._id}).forEach(function(y) {
          ki.push(y);
        })
      })
      }
    } else
    //END CONTROL FOR DISTRICT LEADER ACCOUNTS
    
      {  Areas.find({zone : Meteor.user().profile.zone}).forEach(function(x) {
        Kis.find({areaId : x._id}).forEach(function(y) {
          ki.push(y);
        })
      })
    }
    //END CONTROL FOR MISSIONARY ACCOUNTS
    //END DRILLDOWN FUNCTIONALITY CODE
  }, 
  
});