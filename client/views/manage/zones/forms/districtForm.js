Template.districtForm.helpers({
  currentZone: function() {
    return Session.get('zoneEdit');
  },
  isCreatingDistrict: function() {
    return Session.get('isCreatingDistrict');
  },
  isCreatingArea: function() {
    return Session.get('isCreatingArea');
  },
  areasInZone: function() {
    return Areas.find( { zone: Session.get('zoneEdit') });
  }
});

Template.districtForm.events({
  "click #addDis": function(e, tpl) {
    e.preventDefault();
    Session.set('isCreatingDistrict', true);
  },
  
  "click button.ui.button.cancel": function() {
    event.preventDefault();
    Session.set('isCreatingDistrict', false);
  },
  
  "click button.ui.positive.button.addDistrict": function(e, tpl) {
    e.preventDefault();
    var name = document.getElementById("disName").value;
    var zone = Session.get('zoneEdit');
    Districts.insert({
      "name": name,
      "zone": zone
    });
    Session.set('isCreatingDistrict', false)
  }
});