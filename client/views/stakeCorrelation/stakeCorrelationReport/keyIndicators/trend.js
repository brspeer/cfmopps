import c3 from 'c3';              // import npm c3 charts package



Template.trends.events({
  "click div.ui.button": function() {
    Session.set('drilldownUnitSC', null);
  },
});

Template.trends.helpers({
  units: function() {
    if (Roles.userIsInRole(Meteor.user(), 'office')) {
      return Units.find({stake: Session.get('drilldownStakeSC') });
    }
    
    return Units.find({stake: Session.get('drilldownStakeSC')});
  },
  getProgress: function(){
    let filter = Session.get('currFilter');

    //get progress and goal
    if (filter && filter.stakeId){
      const stakeId = filter.stakeId;
      const stake = Stakes.findOne({_id:stakeId});
      if (stake && stake.thisYearGoal){
        const thisYearGoal = stake.thisYearGoal;      
        return "("+thisYearGoal.progress + "/" + thisYearGoal.goal +") ("+thisYearGoal.lastMonthProgress+")";
      }

    } else if (filter && filter.unitId){
      const unitId = filter.unitId;
      const unit = Units.findOne({_id:unitId});

      if (unit && unit.thisYearGoal){
        const thisYearGoal = unit.thisYearGoal; 
        return "("+thisYearGoal.progress + "/" + thisYearGoal.goal +") ("+thisYearGoal.lastMonthProgress+")";
      }
    }
  }
});

Template.trends.onRendered(function() {
  $('#kiUnitDrilldownSC')
    .dropdown({
      onChange: function(value) {
        Session.set('drilldownUnitSC', value);
      }
    });
    const currMonth = moment().month();
    const currYear = moment().year();
  let months = ['Months'];
  for (let month = currMonth - 12; month < currMonth; month++){
    m = month < 0? month + 12: month;
    y = month < 0? currYear - 1: currYear;
    months.push(moment().month(m).year(y).format('YYYY-MM') + '-01');
  }
  var chart = c3.generate({
    bindto: '#trendsChart',
    data: {
      x: 'Months',
      columns: [
        months,
        ['Baptized', 9000, 9000, 9000, 9000, 9000, 9000, 8000, 8000, 9000, 9000, 8000, 8000],
        ['With Date', 9000, 9000, 9000, 9000, 9000, 9000, 8000, 8000, 9000, 9000, 8000, 8000],
        ['@ Sacrament', 9000, 9000, 9000, 9000, 9000, 900, 8000, 8000, 9000, 9000, 8000, 8000],
        ['New Investigators', 9000, 9000, 9000, 9000, 9000, 9000, 8000, 8000, 9000, 9000, 8000, 8000],
        ['Member Presents', 9000, 9000, 9000, 9000, 9000, 9000, 8000, 8000, 9000, 9000, 8000, 8000]

      ],
      type: 'line',
    },
                        axis : {
                            x : {
                                type : 'timeseries',
                                tick: {
                                    format: function(time){
                                        var dat = new Date(time);
                                        return moment(dat).format("MMM YY");
                                    }
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
    const currMonth = moment().month();
    const currYear = moment().year();

    var stake = Stakes.findOne({ zones: Meteor.user().profile.zone });
    if (Roles.userIsInRole(Meteor.user(), ['office', 'zoneLeader']) && Session.get('drilldownStakeSC')) {
        stake = Stakes.findOne({ _id: Session.get('drilldownStakeSC') });
    }

    let baptized = ['Baptized'];
    let withDate = ['With Date'];
    let sacrament = ['@ Sacrament'];
    let newInvestigators = ['New Investigators'];
    let memberPresent = ['Member Presents'];

    //generate ki data for chart
    for (let month = currMonth - 12; month < currMonth; month++) {
        m = month < 0 ? month + 12 : month;
        y = month < 0 ? currYear - 1 : currYear;

        let filter = { name: moment.monthsShort()[m] + " " + y };
        let ki = {
            bap: 0,
            wd: 0,
            atsac: 0,
            ni: 0,
            mp: 0
        };
        if (Session.get('drilldownUnitSC')) {
            filter.unitId = Session.get('drilldownUnitSC');
            Session.set("currFilter",{unitId:filter.unitId});
            currKi = MonthlyKis.findOne(filter);
            if (currKi){ ki = currKi};
        } else if (stake) {
            filter.stakeId = stake._id;
            Session.set("currFilter",{stakeId:filter.stakeId});
            MonthlyKis.find(filter).map(function(doc){
              ki.bap += doc.bap;
              ki.wd += doc.wd;
              ki.atsac += doc.atsac;
              ki.ni += doc.ni;
              ki.mp += doc.mp;
            });
        }
        
        baptized.push(ki.bap);
        withDate.push(ki.wd);
        sacrament.push(ki.atsac);
        newInvestigators.push(ki.ni);
        memberPresent.push(ki.mp);
    }
    //update chart
    chart.load({
        columns: [
            months, baptized, withDate, sacrament, newInvestigators, memberPresent
        ]
    });
  });
});