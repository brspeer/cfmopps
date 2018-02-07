Template.usersZone.helpers({
  units: function() {
    return Units.find({
      stake: Session.get('zoneEdit')
    }, {
      sort: {
        stake: -1
      }
    });
  },
  isCreatingUser: function() {
    return Session.get('isCreatingUser');
  },
  currentZone: function() {
    return Zones.findOne({_id: Session.get('zoneEdit')}).name;
  },
  areaName: function() {
    return Areas.findOne({_id: this.profile.area}).name;
  },
  isEditingUser: function() {
    return Session.get('editedUserName') === this.username;
  },
  users: function(){
    return Meteor.users.find({"profile.zone": Session.get('zoneEdit')});
  },
})

Template.usersZone.events({
  "click a.edit": function(e, tpl) {
    Session.set('editedUserName', this.username);
  },
  "click a.delete": function(e, tpl) {
    e.preventDefault();
    Meteor.users.remove(this._id);
  },
  "click button.ui.green.mini.button": function(e, tpl) {
    e.preventDefault();
    var newName = $('#editName').val();
    var name = $('#update').attr("name");
    var user = Meteor.users.findOne({username : name});
    var userId = user._id;
    var password = $('#password').val();
    Meteor.users.update({
      _id : user._id },{
      $set : { username : newName}
    });
    Meteor.call('setPassword', userId, password);
    Session.set('editedUserName', null);
  },
  "click button.back.ui.basic.button": function() {
    Router.go('/usersZones');
    Session.set('isCreatingDistrict', false);
    Session.set('isCreatingArea', false)
    Session.set('editedAreaName', null);
  },
  "click #addUser": function(e, tpl) {
    e.preventDefault();
    Session.set('isCreatingUser', true);
  },

  "click a.cancel": function(e, tpl) {
    e.preventDefault();
    Session.set('isCreatingUser', false);
    Session.set('editedUserName', null)
  }

});