Template.areaForm.onRendered(function(){
  $('#multi-select')
  .dropdown();
  $('#areaDis')
  .dropdown();
  $('.ui.checkbox')
  .checkbox();
});

Template.areaForm.helpers({
  units: function(){
    var unitsArray = [];
    Session.get('stakesZones').forEach(function(x) {
      Units.find({stake: x}).forEach(function(y) {
        unitsArray.push(y);
      });
    });
    return unitsArray;
  },
  districts: function(){
    return Districts.find({zone: Session.get('zoneEdit')});
  },
  stakeEdit: function(){
    return Session.get("zoneEdit");
  }
});

Template.areaForm.events({
  "click #addArea": function(e, tpl) {
    e.preventDefault();
    Session.set('isCreatingArea', true);
  },
  
  "click button.ui.button.cancel": function(){
    event.preventDefault();
    Session.set('isCreatingArea', false);
  },
  
  "click button.ui.positive.button.addArea": function(e, tpl) {
    e.preventDefault();
    var name = $('#areaName').val();
    var district = Districts.findOne({name: $('#areaDis').val()})._id;
    var unit = $('#multi-select').val();
    var zone = Session.get('zoneEdit');
    var userAct = $('.ui.checkbox').checkbox('is checked');
    var phone = document.getElementById('areaPhone').value;
    Areas.insert({
      "name": name,
      "units": unit,
      "district": district,
      "zone": zone,
      "phone": phone
    });
    var area = Areas.findOne({name: name})._id;
    if (userAct) {
      var password = "california1830";
      Meteor.call("createMissUser", name, password, area, zone);
    }
    Session.set('isCreatingArea', false)
  }
});