Template.area.onRendered(function() {
  $('.ui.toggle.checkbox');
  $('.ui.toggle.checkbox')
    .checkbox({
    onChecked: function() {
      var x = Areas.findOne({_id: Session.get('areaEdit')});
      Areas.update({_id: x._id}, {$push: { units: this.id }});
    },
    onUnchecked: function() {
      var x = Areas.findOne({_id: Session.get('areaEdit')});
      Areas.update({_id: x._id },  { $pull: { 'units': this.id  } });
    }
  });
  $('.area.ui.dropdown')
  .dropdown();
  $('.zone.ui.dropdown')
  .dropdown();
  
  //All code before this line in the onRendered function is for setting toggled state onRender
    function inArray(value,array)
  {
    var count=array.length;
    for(var i=0;i<count;i++)
    {
        if(array[i]===value){return true;}
    }
    return false;
  }
  var arr = Areas.findOne({_id: Session.get('areaEdit')}).units;
  var elements = document.getElementsByTagName('input');
  for (i=0;i<elements.length;i++) {
    if (elements[i].getAttribute('type') == 'checkbox') {
      if (inArray(elements[i].id, arr)) {
        var cls = '.ui.toggle.checkbox' + '.' + elements[i].id + 'a';
        $(cls).checkbox('set checked')
      }
    }
  }
});

Template.area.helpers({
  // UserDoesNotExist: function() {
  //   return Meteor.users.findOne({area: Session.get('areaEdit')})
  // },
  phone: function() {
    return Areas.findOne({name: Session.get('areaEdit')}).phone
  },
  // roles: function() {
  //   return Roles.getAllRoles();
  // },
  areaEdit: function() {
    return Areas.findOne({_id: Session.get('areaEdit')}).name;
  },
  phoneNumber: function() {
    var x = Session.get('areaEdit');
    var p = Areas.findOne({_id: x}).phone;
    return p;
  },
  district: function() {
    var x = Session.get('areaEdit');
    var y = Areas.findOne({name : x});
    return y.district;
  },
  districtName: function() {
    return Districts.findOne({_id: Areas.findOne({_id: Session.get('areaEdit')}).district}).name;
  },
  districts: function() {
    var x = Session.get('areaEdit');
    var y = Areas.findOne({_id : x});
    return Districts.find({zone : y.zone,
                          name : {$ne : y.district}});
  },
  zoneName: function() {
    var x = Session.get('areaEdit');
    var y = Areas.findOne({_id : x});
    return Zones.findOne({_id: y.zone}).name;
  },
  zones: function() {
    return Zones.find({name : {$ne : Session.get('zoneEdit')}});
  },
  units: function() {
    var unitsArray = [];
        Session.get('stakesZones').forEach(function(x) {
      Units.find({stake: x}).forEach(function(y) {
        unitsArray.push(y);
       });
    });
    return unitsArray;
  }
});

Template.area.events({
  "click button.back.ui.basic.button": function() {
    Router.go('/zone');
    Session.set('isCreatingDistrict', false);
    Session.set('isCreatingArea', false)
    Session.set('editedAreaName', null);
  },
  
  "click button.ui.positive.button.updateArea": function() {
    event.preventDefault();
    var x = Areas.findOne({_id : Session.get('areaEdit')});
    var name = $("#name").val();
    var district = $("#district").val();
    district = Districts.findOne({name: district})._id;
    var zone = $("#zone").val();
    zone = Zones.findOne({name: zone})._id;
    var phone = document.getElementById("phoneNumber").value;
    if (zone != x.zone) {
      var user = Meteor.users.findOne({"profile.area": Session.get('areaEdit')});
      Roles.removeUsersFromRoles(user._id, 'zoneLeader');
      Roles.removeUsersFromRoles(user._id, 'districtLeader');
      Areas.update({_id: x._id}, {$set : {
        name: name,
        district: null,
        zone: zone,
        phone : phone
      }});
      Meteor.users.update({_id: user._id}, {$set : {
        "profile.zone": zone,
      }});
    } else {
    //update area
    Areas.update({_id : x._id}, {$set : {
      name : name,
      district : district,
      zone : zone,
      phone : phone
    }});
    }
    //update user for that area
    //var id = Meteor.users.findOne({ "profile.area": Session.get('areaEdit') })._id
    //Meteor.users.update({ _id: id }, {$set : {"profile.area": }});
    //update districts
    //var d = Districts.findOne({leader : Session.get('areaEdit')});
    //if (d){
    //  Districts.update({_id : d._id}, {$set : {leader : name}});
    //}
    //update zones
    //var z = Zones.findOne({leader : Session.get('areaEdit')});
    //if (z){
    //  Zones.update({_id : z._id}, {$set : {leader : name}});
    //}
    Session.set('isCreatingArea', false)
    //update session
    Session.set('areaEdit', name);
    
    //return to zone page
    Router.go('/zone');
  },
  
  "click button.ui.right.floated.negative.button.deleteArea": function() {
    event.preventDefault();
    var r = confirm("This will delete the area for good. Click OK to delete area");
    if (r === true) {
      var a = Areas.findOne({_id : Session.get('areaEdit')});
      Areas.remove({_id : a._id});
    }
    Router.go("/zone");
    Session.set('areaEdit', null);
  }
});