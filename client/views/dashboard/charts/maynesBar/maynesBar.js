import c3 from 'c3';              // import npm c3 charts package


Template.maynesBar.helpers({

  zoneEdit: function() {
    return Session.get('zoneEdit');
  },

  areaEdit: function() {
    return Session.get('areaEdit');
  }
});

Template.maynesBar.onRendered(function() {

  var chart = c3.generate({
    bindto: '#maynesBarChart',
    data: {
      columns: [
        ['New Investigators', 100, 30],
        ['Baptized', 30, 100]
      ],
      type: 'bar',
      labels: {
             format: function (value) { return value + "%"; }
            }
    },
    axis: {
      x: {
            type: 'category',
            categories: ['Through Missionaries', 'Through Members']
        },
      y: {
            tick: {
              format: function (value) {return value + "%"; }
            }
      }
    },
    color: {
      pattern: ['1ca8dd', '1bc98e']
    },
  })
  
Tracker.autorun(function() {
  var niM=0, niFTM=0, bapM=0, bapFTM=0;
  var name = Meteor.user().profile.area;
  var area = Areas.findOne({_id : name});
  var ki = [];
  
  
  //CODE FOR FUNCTIONALITY OF DASHBOARD DRILLDOWN FOR EACH ROLE
    
    //WORKS PERFECTLY LEAVE IT ALONE
    var zone = Session.get('drilldownZone');
    var id = Session.get('drilldownArea');
    var district = Session.get('drilldownDistrict');
    //CONTROL FLOW FOR OFFICE ACCOUNTS
    if (Roles.userIsInRole(Meteor.user(), 'office')) {
      if (Session.get('drilldownArea') != null) {
        //Code for drilldown area in office dash
        Kis.find({areaId: id}).forEach(function(y) {
            if (y.date.substring(11,15) == moment().year()) {
                  ki.push(y);
                }
          })
      } else if (Session.get('drilldownDistrict') != null) {
        //Code for drilldown district in office dash
        Areas.find({active: true, district: district}).forEach(function(x) {
          Kis.find({areaId: x._id}).forEach(function(y) {
            if (y.date.substring(11,15) == moment().year()) {
                  ki.push(y);
                }
          })
        })
      } else if (Session.get('drilldownZone') != null) {
        //Code for drilldown zone in office dash
        Areas.find({active: true, zone: zone}).forEach(function(x) {
          Kis.find({areaId: x._id}).forEach(function(y) {
            if (y.date.substring(11,15) == moment().year()) {
                  ki.push(y);
                }
          })
        }) 
      } else {
        //Code for the whole mission in office dash
        Areas.find({active: true}).forEach(function(x) {
          Kis.find({areaId : x._id}).forEach(function(y) {
            if (y.date.substring(11,15) == moment().year()) {
                  ki.push(y);
                }
          })
        })
      }
    } else
    //END CONTROL FLOW FOR OFFICE ACCOUNTS
      
    //CONTROL FLOW FOR ZONE LEADER ACCOUNTS
    if (Roles.userIsInRole(Meteor.user(), 'zoneLeader')) {
      if (Session.get('drilldownArea') != null) {
        //Code for drilldown area for zl account
        Kis.find({areaId: id}).forEach(function(y) {
            if (y.date.substring(11,15) == moment().year()) {
                  ki.push(y);
                }
          })
      } else if (Session.get('drilldownDistrict') != null) {
        //Code for drilldown district for zl account
        Areas.find({active: true, district: district}).forEach(function(x) {
          Kis.find({areaId: x._id}).forEach(function(y) {
            if (y.date.substring(11,15) == moment().year()) {
                  ki.push(y);
                }
          })
        })
      } else {
        //Code to show ki's for the whole zone for zl account
        zone = Meteor.user().profile.zone;
        Areas.find({active: true, zone: zone}).forEach(function(x) {
          Kis.find({areaId: x._id}).forEach(function(y) {
            if (y.date.substring(11,15) == moment().year()) {
                  ki.push(y);
                }
          })
        }) 
      }
    } else
    //END CONTROL FLOW FOR ZONE LEADER ACCOUNTS
      
    //CONTROL FLOW FOR DISTRICT LEADER ACCOUNTS
    if (Roles.userIsInRole(Meteor.user(), 'districtLeader')) {
      if (Session.get('drilldownArea') != null) {
        //Code for drilldown area for dl account
        Kis.find({areaId: id}).forEach(function(y) {
          if (y.date.substring(11,15) == moment().year()) {
                  ki.push(y);
                }
        })
      } else if (Session.get('drilldownDistrict') != null) {
        //Code to view district totals for dl account
        Areas.find({active: true, district: district}).forEach(function(x) {
          Kis.find({areaId: x._id}).forEach(function(y) {
            if (y.date.substring(11,15) == moment().year()) {
                  ki.push(y);
                }
          })
        })
      } else {
        //Code to view zone by default for dl account
        zone = Meteor.user().profile.zone;
        Areas.find({active: true, zone: zone}).forEach(function(x) {
          Kis.find({areaId: x._id}).forEach(function(y) {
            if (y.date.substring(11,15) == moment().year()) {
                  ki.push(y);
                }
          })
        }) 
      }
    } else
    //END CONTROL FLOW FOR DISTRICT LEADER ACCOUNTS
      
    //CONTROL FLOW FOR NORMAL ACCOUNT
      
        if (Session.get('drilldownArea') != null) {
          //Code for an area to view their own area
          Kis.find({areaId: id}).forEach(function(y) {
            if (y.date.substring(11,15) == moment().year()) {
                  ki.push(y);
                }
          })
        } else 
          {
            zone = Meteor.user().profile.zone;
            Areas.find({zone: zone}).forEach(function(x) {
              Kis.find({areaId: x._id}).forEach(function(y) {
                if (y.date.substring(11,15) == moment().year()) {
                  ki.push(y);
                }
              })
            })
          }
  
  
  for (i=0;i<ki.length;i++){
    var x = (ki.length-1);
    niM += ki[x-i].niM;
    niFTM += ki[x-i].niFTM;
    bapM += ki[x-i].bapM;
    bapFTM += ki[x-i].bapFTM;
  }
  var niPercent = 100 / (niM + niFTM);
  var bapPercent = 100 / (bapM + bapFTM);
  niM = niPercent * niM;
  niFTM = niPercent * niFTM;
  bapM = bapPercent * bapM;
  bapFTM = bapPercent * bapFTM;
  if (bapM == null) {
    bapM = 0;
  }
  niM = Math.round(niM);
  niFTM = Math.round(niFTM);
  bapM = Math.round(bapM);
  bapFTM = Math.round(bapFTM);
  chart.load({
    columns: [
      ['New Investigators', niFTM, niM],
      ['Baptized', bapFTM, bapM]
    ]
  });
});

});