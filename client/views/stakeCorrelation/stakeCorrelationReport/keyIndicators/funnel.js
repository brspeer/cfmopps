import c3 from 'c3';


Template.scFunnel.onRendered(function() {
  var chart = c3.generate({
    bindto: '#scFunnelchart',
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
    var ki = [];
    
    
    //CODE FOR FUNCTIONALITY OF DASHBOARD DRILLDOWN FOR EACH ROLE
    
    //WORKS PERFECTLY LEAVE IT ALONE
    
    //WORKS PERFECTLY LEAVE IT ALONE
    var year = moment().year();
    var month = moment().month() - 1;
    if (moment().month() === 0) {
      year = year -1;
      month = 11;
    }
    var monthString = moment.monthsShort()[month];
    var date = monthString + " " + year;
    var stake = Stakes.findOne({zones: Meteor.user().profile.zone});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'zoneLeader'])) {
      stake = Stakes.findOne({_id: Session.get('drilldownStakeSC')});
    }
    if (Session.get('drilldownUnitSC') != null) {
      MonthlyKis.find({unitId: Session.get('drilldownUnitSC'),
                      name: date}).forEach(function(z) {
        ki.push(z);
      })
    } else if (Session.get('drilldownUnitSC') == null && stake) {
    MonthlyKis.find({stakeId: stake._id,
                    name: date}).forEach(function(y) {
    ki.push(y);
    });
    }
    //END CONTROL FOR MISSIONARY ACCOUNTS
    //END DRILLDOWN FUNCTIONALITY CODE
    
    
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
        ],
      });
    //chart.axis.range({max: { y : (ni+atS) }, min: { y : (-ni-atS) }});
  });  
});
