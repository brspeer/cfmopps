Template.overview.helpers({
  stake: function() {
    var stake = Stakes.findOne({zones: Meteor.user().profile.zone});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'zoneLeader'])) {
      stake = Stakes.findOne({_id: Session.get('drilldownStakeSC')});
    }
    return stake;
  },
  stakeBap: function() {
    var stakeBap = 0;
    var stake = Stakes.findOne({zones: Meteor.user().profile.zone});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'zoneLeader'])) {
      stake = Stakes.findOne({_id: Session.get('drilldownStakeSC')});
    }
    var year = moment().year();
    var month = moment().month() - 1;
    if (moment().month() === 0) {
      year = year - 1;
      month = 11;
    }
    if (stake){
      MonthlyKis.find({
        stakeId: stake._id,
        name: moment.monthsShort()[month] + " " + year, 
      }).forEach(function(x) {
        stakeBap += x.bap;
      });
      return stakeBap;
    } 
  },
  stakeConf: function() {
    var stakeConf = 0;
    var stake = Stakes.findOne({zones: Meteor.user().profile.zone});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'zoneLeader'])) {
      stake = Stakes.findOne({_id: Session.get('drilldownStakeSC')});
    }
    var month = moment().month() - 1;
    if (stake){
    MonthlyKis.find({
      stakeId: stake._id,
      name: moment.monthsShort()[month] + " " + moment().year(), 
    }).forEach(function(x) {
      stakeConf = stakeConf + x.conf;
    });
    return stakeConf;
    } 
  },
  stakeWD: function() {
    var stakeWD = 0;
    var stake = Stakes.findOne({zones: Meteor.user().profile.zone});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'zoneLeader'])) {
      stake = Stakes.findOne({_id: Session.get('drilldownStakeSC')});
    }
    var month = moment().month() - 1;
    if (stake){
    MonthlyKis.find({
      stakeId: stake._id,
      name: moment.monthsShort()[month] + " " + moment().year(), 
    }).forEach(function(x) {
      stakeWD = stakeWD + x.wd;
    });
    return stakeWD;
    }
  },
  stakeAtSac: function() {
    var stakeAtSac = 0;
    var stake = Stakes.findOne({zones: Meteor.user().profile.zone});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'zoneLeader'])) {
      stake = Stakes.findOne({_id: Session.get('drilldownStakeSC')});
    }
    var month = moment().month() - 1;
    if (stake){
    MonthlyKis.find({
      stakeId: stake._id,
      name: moment.monthsShort()[month] + " " + moment().year(), 
    }).forEach(function(x) {
      stakeAtSac = stakeAtSac + x.atsac;
    });
    return stakeAtSac;
    }
  },
  stakeMP: function() {
    var stakeMP = 0;
    var stake = Stakes.findOne({zones: Meteor.user().profile.zone});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'zoneLeader'])) {
      stake = Stakes.findOne({_id: Session.get('drilldownStakeSC')});
    }
    var month = moment().month() - 1;
    if (stake){
    MonthlyKis.find({
      stakeId: stake._id,
      name: moment.monthsShort()[month] + " " + moment().year(), 
    }).forEach(function(x) {
      stakeMP = stakeMP + x.mp;
    });
    return stakeMP;
    }
  },
  stakeNI: function() {
    var stakeNI = 0;
    var stake = Stakes.findOne({zones: Meteor.user().profile.zone});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'zoneLeader'])) {
      stake = Stakes.findOne({_id: Session.get('drilldownStakeSC')});
    }
    var month = moment().month() - 1;
    if (stake){
    MonthlyKis.find({
      stakeId: stake._id,
      name: moment.monthsShort()[month] + " " + moment().year(), 
    }).forEach(function(x) {
      stakeNI = stakeNI + x.ni;
    });
    return stakeNI;
    }
  },
  stakeMH: function() {
    var stakeMH = 0;
    var stake = Stakes.findOne({zones: Meteor.user().profile.zone});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'zoneLeader'])) {
      stake = Stakes.findOne({_id: Session.get('drilldownStakeSC')});
    }
    var month = moment().month() - 1;
    if(stake){
    MonthlyKis.find({
      stakeId: stake._id,
      name: moment.monthsShort()[month] + " " + moment().year(), 
    }).forEach(function(x) {
      stakeMH = stakeMH + x.mh;
    });
    return stakeMH;
    }
  },
});