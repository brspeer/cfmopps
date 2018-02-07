Template.editAreaModal.onRendered(function() {
  $('#areaUnits')
    .dropdown();
   
  var x = Areas.findOne({name : Session.get('areaEdit')});
  var name = 'blahblahblah';
  var district = x.district;
  var zone = x.zone;
  var units = [];
  x.units.forEach(function(uID) {
    units.push(Units.findOne({ _id: uID}).name);
  });
  $('#name').val(name);
  $('#district').val(district);
  $('#zone').val(zone);
  $('#areaUnits').val(units);
})

Template.editAreaModal.helpers({
  areaEdit: function() {
    return Session.get('areaEdit');
  },
  areaID: function() {
    return Areas.findOne({name : Session.get('areaEdit')})._id;
  },
  modalArea: function() {
    return Session.get('modalArea');
  },
  district: function() {
    var x = Session.get('areaEdit');
    var y = Areas.findOne({
      name: x
    });
    return y.district;
  },
  districts: function() {
    var x = Session.get('areaEdit');
    var y = Areas.findOne({
      name: x
    });
    return Districts.find({
      zone: Session.get('zoneEdit'),
      name: {
        $ne: y.district
      }
    });
  },
  zone: function() {
    var x = Session.get('areaEdit');
    var y = Areas.findOne({
      name: x
    });
    return y.zone;
  },
  zones: function() {
    return Zones.find({
      name: {
        $ne: Session.get('zoneEdit')
      }
    });
  },
  units: function() {
    return Units.find({
      stake: Session.get('zoneEdit')
    });
  }
});

Template.editAreaModal.events({
  'click button.ui.button.positive': function(e, tpl) {
    event.preventDefault();
    var x = Areas.findOne({
      name: Session.get('areaEdit')
    });
    var name = $("#name").val();
    var district = $("#district").val();
    var zone = $("#zone").val();
    var y = $("#areaUnits").val();
    var units = [];
    y.forEach(function(selected) {
      Units.find({
        stake: x.zone
      }).forEach(function(unit) {
        if (unit.name == selected) {
          units.push(unit._id);
        }
      });
    });
    //update area
    Areas.update({
      _id: x._id
    }, {
      $set: {
        name: name,
        district: district,
        zone: zone,
        units: units
      }
    });
    //update districts
    var d = Districts.findOne({
      leader: Session.get('areaEdit')
    });
    if (d) {
      Districts.update({
        _id: d._id
      }, {
        $set: {
          leader: name
        }
      });
    }
    //update zones
    var z = Zones.findOne({
      leader: Session.get('areaEdit')
    });
    if (z) {
      Zones.update({
        _id: z._id
      }, {
        $set: {
          leader: name
        }
      });
    }
    //update session
    Session.set('areaEdit', name);
  },

  'click button.ui.negative.button.deleteArea': function(e, tpl) {
    e.preventDefault();
    var y = Areas.findOne({
      name: Session.get('areaEdit')
    });
    Areas.remove({
      _id: y._id
    });
  },
});