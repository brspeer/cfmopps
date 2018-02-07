Template.nav.events({
  'click .item': function() {
    Session.set('drilldownZone', null);
    Session.set('drilldownDistrict', null);
    Session.set('drilldownArea', null);
    Session.set('unit', null);
    Session.set('male', null);
    Session.set('baptized', null);
    Session.set('drilldownUnitPR', null);
  },
  'click .ui.primary.button': function(e){
      e.preventDefault();
      Meteor.logout();
      Router.go('login');
  },
  'click  button.mobile.ui.icon.button': function() {
    $('.ui.sidebar')
      .sidebar('toggle');
  },
  
  'click a.zone.item': function() {
    Session.set('zoneEdit', this._id);
  }
});

Template.nav.helpers({
  zones: function(){
    return Zones.find();
  }
})