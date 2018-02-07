import c3 from 'c3';              // import npm c3 charts package


Template.kiTrends.helpers({
  //current:
})

Template.kiTrends.onRendered(function() {
  var chart = c3.generate({
    bindto: '#kiTrendsChart',
    data: {
      x: 'Weeks',
      columns: [
        ['Weeks', '', '2016-03-13', '2016-03-20', '2016-03-27', '2016-04-3', '2016-04-10'],
        ['Baptized', 9000, 9000, 9000, 9000, 9000, 9000],
        ['With Date', 9000, 9000, 9000, 9000, 9000, 9000],
        ['@ Sacrament', 9000, 9000, 9000, 9000, 9000, 9000],
        ['New Investigators', 9000, 9000, 9000, 9000, 9000, 9000],
        ['Member Presents', 9000, 9000, 9000, 9000, 9000, 9000]

      ],
      type: 'line',
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d'
        }
      }
    },
    color: {
      pattern: ['1ca8dd', '1bc98e', 'FF7700', 'BF00FF', '152859']
    },
    padding: {
      right: 30,
    }
  });
  
  Tracker.autorun(function() {
    var baptized1 = 0, wd1 = 0, atS1 = 0, ni1 = 0, mp1 = 0;
    var baptized2 = 0, wd2 = 0, atS2 = 0, ni2 = 0, mp2 = 0;
    var baptized3 = 0, wd3 = 0, atS3 = 0, ni3 = 0, mp3 = 0;
    var baptized4 = 0, wd4 = 0, atS4 = 0, ni4 = 0, mp4 = 0;
    var baptized5 = 0, wd5 = 0, atS5 = 0, ni5 = 0, mp5 = 0;
    var date1 = moment().startOf('week').subtract(4, 'weeks').format("YYYY-MM-DD");
    var date2 = moment().startOf('week').subtract(3, 'weeks').format("YYYY-MM-DD");
    var date3 = moment().startOf('week').subtract(2, 'weeks').format("YYYY-MM-DD");
    var date4 = moment().startOf('week').subtract(1, 'weeks').format("YYYY-MM-DD");
    var date5 = moment().startOf('week').format("YYYY-MM-DD");
    var name = Meteor.user().profile.area;
    var area = Areas.findOne({name : name});
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
            ki.push(y);
          })
      } else if (Session.get('drilldownDistrict') != null) {
        //Code for drilldown district in office dash
        Areas.find({active: true, district: district}).forEach(function(x) {
          Kis.find({areaId: x._id}).forEach(function(y) {
            ki.push(y);
          })
        })
      } else if (Session.get('drilldownZone') != null) {
        //Code for drilldown zone in office dash
        Areas.find({active: true, zone: zone}).forEach(function(x) {
          Kis.find({areaId: x._id}).forEach(function(y) {
            ki.push(y);
          })
        }) 
      } else {
        //Code for the whole mission in office dash
        Areas.find({active: true}).forEach(function(x) {
          Kis.find({areaId : x._id}).forEach(function(y) {
            ki.push(y);
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
            ki.push(y);
          })
      } else if (Session.get('drilldownDistrict') != null) {
        //Code for drilldown district for zl account
        Areas.find({active: true, district: district}).forEach(function(x) {
          Kis.find({areaId: x._id}).forEach(function(y) {
            ki.push(y);
          })
        })
      } else {
        //Code to show ki's for the whole zone for zl account
        zone = Meteor.user().profile.zone;
        Areas.find({active: true, zone: zone}).forEach(function(x) {
          Kis.find({areaId: x._id}).forEach(function(y) {
            ki.push(y);
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
          ki.push(y);
        })
      } else if (Session.get('drilldownDistrict') != null) {
        //Code to view district totals for dl account
        Areas.find({active: true, district: district}).forEach(function(x) {
          Kis.find({areaId: x._id}).forEach(function(y) {
            ki.push(y);
          })
        })
      } else {
        //Code to view zone by default for dl account
        zone = Meteor.user().profile.zone;
        Areas.find({active: true, zone: zone}).forEach(function(x) {
          Kis.find({areaId: x._id}).forEach(function(y) {
            ki.push(y);
          })
        }) 
      }
    } else
    //END CONTROL FLOW FOR DISTRICT LEADER ACCOUNTS
      
    //CONTROL FLOW FOR NORMAL ACCOUNT
      
        if (Session.get('drilldownArea') != null) {
          //Code for an area to view their own area
          Kis.find({areaId: id}).forEach(function(y) {
            ki.push(y);
          })
        } else 
          {
            zone = Meteor.user().profile.zone;
            Areas.find({zone: zone}).forEach(function(x) {
              Kis.find({areaId: x._id}).forEach(function(y) {
                ki.push(y);
              })
            })
          }
    
    for (i=0;i<ki.length;i++){
      if(ki[i].date === moment().startOf('week').toString().substring(0,15)){
        baptized5 += ki[i].bap;
        wd5 += ki[i].wd;
        atS5 += ki[i].atsac;
        ni5 += ki[i].ni;
        mp5 += ki[i].mp;
      }
      if(ki[i].date === moment().startOf('week').subtract(1, 'weeks').toString().substring(0,15)){
        baptized4 += ki[i].bap;
        wd4 += ki[i].wd;
        atS4 += ki[i].atsac;
        ni4 += ki[i].ni;
        mp4 += ki[i].mp;
      }
      if(ki[i].date === moment().startOf('week').subtract(2, 'weeks').toString().substring(0,15)){
        baptized3 += ki[i].bap;
        wd3 += ki[i].wd;
        atS3 += ki[i].atsac;
        ni3 += ki[i].ni;
        mp3 += ki[i].mp;
      }
      if(ki[i].date === moment().startOf('week').subtract(3, 'weeks').toString().substring(0,15)){
        baptized2 += ki[i].bap;
        wd2 += ki[i].wd;
        atS2 += ki[i].atsac;
        ni2 += ki[i].ni;
        mp2 += ki[i].mp;
      }
      if(ki[i].date === moment().startOf('week').subtract(4, 'weeks').toString().substring(0,15)){
        baptized1 += ki[i].bap;
        wd1 += ki[i].wd;
        atS1 += ki[i].atsac;
        ni1 += ki[i].ni;
        mp1 += ki[i].mp;
      }
    }
    
    
    
    
    chart.load({
      columns: [
        ['Weeks', date1, date2, date3, date4, date5],
        ['Baptized', baptized1, baptized2, baptized3, baptized4, baptized5],
        ['With Date', wd1, wd2, wd3, wd4, wd5],
        ['@ Sacrament', atS1, atS2, atS3, atS4, atS5],
        ['New Investigators', ni1, ni2, ni3, ni4, ni5],
        ['Member Presents', mp1, mp2, mp3, mp4, mp5]
      ]
    });
  });
});