Template.stakeCorrelation.onRendered(function() {
  var stake = Stakes.findOne()
  if (stake){
  Session.set('drilldownStakeSC', stake._id);
    $('#drilldownStakeSC')
    .dropdown({
      onChange: function(value) {
        Session.set('drilldownStakeSC', value);
        Session.set('drilldownUnitSC', null);
      }
    });
  }
  $('.menu .item').tab();

});

Template.stakeCorrelation.helpers({
  stakes: function() {
    if (Roles.userIsInRole(Meteor.user(), 'zoneLeader')) {
      return Stakes.find({zones: Meteor.user().profile.zone});
    } else {
      return Stakes.find();
    }
  },
});