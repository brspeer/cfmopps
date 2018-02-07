import c3 from 'c3';


Template.scMaynesBar.helpers({

  zoneEdit: function() {
    return Session.get('zoneEdit');
  },

  areaEdit: function() {
    return Session.get('areaEdit');
  }
});

Template.scMaynesBar.onRendered(function() {

  var chart = c3.generate({
    bindto: '#scMaynesBarChart',
    data: {
      columns: [
        ['New Investigators', 100, 30],
        ['Baptized', 30, 100]
      ],
      type: 'bar',
      labels: {
          format: function(value) {return value + "%"}
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
  var area = Areas.findOne({name : name});
  var ki = [];
  
  
  //CODE FOR FUNCTIONALITY OF DASHBOARD DRILLDOWN FOR EACH ROLE
    
    //WORKS PERFECTLY LEAVE IT ALONE
    //CONTROL FLOW FOR OFFICE ACCOUNTS
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