import c3 from 'c3';

Template.stakeCorrelationReport.onRendered(function() {
  if (Roles.userIsInRole(Meteor.user(), 'ward')) {
    Session.set('keyIndicators', true)
  } else {
  Session.set('oview', true);
  }
  Session.set('saw', false);
  Session.set('keyIndicators', false);
  Session.set('drilldownUnitSC', null);
  
});
Template.stakeCorrelationReport.helpers({
  oview: function() {
    return Session.get('oview');
  },
  keyIndicators: function() {
    return Session.get('keyIndicators');
  },
  _saw: function() {
    return Session.get('saw');
  },
  _rcDetails: function() {
    return Session.get('rcDetails');
  },
  whoChurch: function() {
    Session.set('whoChurch', true);
    return Session.get('whoChurch');
  }
});

Template.stakeCorrelationReport.events({
  'click a.item.overview': function(event) {
    Session.set('oview', true);
    Session.set('saw', false);
    Session.set('keyIndicators', false);
    Session.set('rcDetails', false);
    $('a.item.sc.active').removeClass('active');
    $(event.target).addClass("active");
  },
  'click a.item.keyIndicators': function(event) {
    Session.set('keyIndicators', true);
    Session.set('saw', false);
    Session.set('oview', false);
    Session.set('rcDetails', false);
    $('a.item.sc.active').removeClass('active');
    $(event.target).addClass("active");
  },
  'click a.item.saw': function(event) {
    Session.set('saw', true);
    Session.set('keyIndicators', false);
    Session.set('oview', false);
    Session.set('rcDetails', false);
    $('a.item.sc.active').removeClass('active');
    $(event.target).addClass("active");
  },
  'click a.item.rcDetails': function(event) {
    Session.set('rcDetails', true);
    Session.set('saw', false);
    Session.set('keyIndicators', false);
    Session.set('oview', false);
    $('a.item.sc.active').removeClass('active');
    $(event.target).addClass("active");
  },
})