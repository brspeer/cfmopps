Template.zone.onRendered(function() {
  //This is for the dropdown which selects the zone leader area
  $('.zone.ui.dropdown')
    .dropdown({
      action: 'activate',
      onChange: function(value) {
        var x = Areas.findOne({name: value});
        var y = Zones.findOne({_id: x.zone})
        Zones.update({
          _id: y._id
        }, {
          $set: {
            leader: x._id
          }
        });
        var user = Meteor.users.findOne({
          "profile.area" : x._id
        });
        
        Roles.addUsersToRoles(user._id, 'zoneLeader');
        
        Meteor.users.find({"profile.zone" : Session.get('zoneEdit')}).forEach(function(c){
           if (c._id != user._id){
             Roles.removeUsersFromRoles(c._id, 'zoneLeader');
           }
        });
      }
    });
});

Template.zone.helpers({
  currentZone: function() {
    return Session.get('zoneEdit');
  },
  currentZoneName: function() {
    return Zones.findOne({_id: Session.get('zoneEdit')}).name;
  },
  activeAreas: function() {
    return Areas.find({zone: Session.get('zoneEdit'), active: true});
  },
  inactiveAreas: function() {
    return Areas.find({$or: [{zone: Session.get('zoneEdit'), active: false}, {zone: Session.get('zoneEdit'), district: null}]});
  },
  zones: function() {
    return Zones.find();
  },
  districts: function() {
    var z = Session.get('zoneEdit');
    return Districts.find({zone : z}, {sort : {name : 1}});
  },
  isCreatingDistrict: function() {
    return Session.get('isCreatingDistrict');
  },
  isCreatingArea: function() {
    return Session.get('isCreatingArea');
  },
  areasInZone: function() {
    return Areas.find({
      zone: Session.get('zoneEdit'),
      active: true
    });
  },
  formValue: function() {
    return Session.get("formValue");
  },
  zoneLeaderArea: function() {
    var x = Session.get('zoneEdit');
    var y = Zones.findOne({
      _id: x
    });
    if (y) {
      return Areas.findOne({_id: y.leader}).name;
    } else {
      return null;
    }
  }
});

Template.zone.events({
  "click button.ui.green.mini.button": function(e, tpl) {
    e.preventDefault();
    //Code to submit new area name
  },

  "click button.mini.negative.ui.right.floated.labeled.icon.button": function(e, tpl) {
    e.preventDefault();
    var r = confirm("Are you sure you?");
    if (r === true) {
      var x = event.target.id;
      var y = Districts.findOne({name: x});
      Meteor.call("changeDistrictField", y._id);
      Districts.remove({
        _id: y._id
      });
    } else {}
  },

  "click a.edit.name": function(e, tpl) {
    Session.set('areaEdit', this._id);
    Router.go('/area');
  },

  "click a.area.delete": function(e, tpl) {
    e.preventDefault();
    var r = confirm("Are you sure you?");
    if (r === true) {
      var x = event.target.id;
      var y = Areas.findOne({
        name: x
      });
      Areas.remove({
        _id: y._id
      });
    } else {}
  },

  "click div.ui.dropdown.selection": function() {
    Session.set('isEditing', true);
  },

  "click button.back.ui.basic.button": function() {
    Session.set('isCreatingDistrict', false);
    Session.set('isCreatingArea', false)
    Session.set('areaEdit', null);
    Router.go('/zones');
  },

  "click button.add.district.ui.basic.button": function(e, tpl) {
    e.preventDefault();
    Session.set('isCreatingArea', false);
    Session.set('isCreatingDistrict', true);
  },

  "click button.add.area.ui.basic.button": function(e, tpl) {
    e.preventDefault();
    Session.set('isCreatingArea', true);
    Session.set('isCreatingDistrict', false);
  },

  "click a.cancel": function(e, tpl) {
    e.preventDefault();
    Session.set('isCreatingDistrict', false);
    Session.set('isCreatingArea', false);
    Session.set('areaEdit', null)
  },
});