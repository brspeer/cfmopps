import c3 from 'c3';              // import npm c3 charts package


Template.funnel.onRendered(function() {
  var chart = c3.generate({
    bindto: '#funnelchart',
    data: {
      columns: [
        ['data1', 25.7, 20.1, 13.5, 1],
        ['data2', -25.7, -20.1, -13.5, 1]
      ],
      type: 'line',
      labels: true,
    },
    axis: {
      rotated: true,
      x: {
        type: 'category',
        categories: ['NI', '@SAC', 'W/D', 'BAP'],
      },
      y: {
        tick: {
          values: []
        }
      }
    },
    legend: {
      show: false
    },
    color: {
      pattern: ['#1ca8dd', '#1ca8dd', '#EFEFEF', '#EFEFEF']
    },
    tooltip: {
      show: false,
    }
  });

  Tracker.autorun(function() {
    var ni = 0, atS = 0, wd = 0, bap = 0;
    var name = Meteor.user().profile.area;
    var area = Areas.findOne({name : name});
    var ki = [];
    
    
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
      ni += ki[i].ni;
      atS += ki[i].atsac;
      wd += ki[i].wd;
      bap += ki[i].bap;
    }
    
    if (bap > 0){
      ni = (Math.round(ni/bap));
      atS = (Math.round(atS/bap));
      wd = (Math.round(wd/bap));
    }
    
      chart.load({
        columns: [
          ['data1', ni, atS, wd, 1],
          ['data2', (-ni+2), (-atS+2), (-wd+2), 1],
          ['data3', 10, 6, 5, 1],
          ['data4', -8, -4, -3, 1]
        ],
      });
    //chart.axis.range({max: { y : (ni+atS) }, min: { y : (-ni-atS) }});
  });

});