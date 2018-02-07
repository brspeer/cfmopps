Template.saw.onRendered(function() {
  Session.set('editing', null);

});

Template.saw.helpers({
   monthlykis: function()  {
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
    return MonthlyKis.find({
      stakeId: stake._id,
      name: moment.monthsShort()[month] + " " + year, 
    });
  },
  editing: function() {
    return Session.get('editing');
  }
 });

Template.saw.events({
  'click .ui.icon.primary.button': function() {
    Session.set('editing', true);
  },
  'click .ui.icon.positive.button': function() {
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
    
    MonthlyKis.find({stakeId: stake._id, name: moment.monthsShort()[month] + " " + year}).forEach(function(x) {
      console.log(x._id);
      if (document.getElementById(x._id + "strength") !== null) {
        MonthlyKis.update({_id: x._id}, { $set: {
          strength: document.getElementById(x._id + "strength").value,
          weakness: document.getElementById(x._id + "weakness").value,
          solution: document.getElementById(x._id + "solution").value
        }})
      }
    });
    Session.set('editing', false);
  }
})