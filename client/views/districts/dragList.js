Template.dragList.helpers({
  areas: function() {
    return Areas.find();
  },
  
  zoneEdit: function() {
    return Session.get('zoneEdit');
  }
});

Template.registerHelper('equals', function (a, b) {
  return a === b;
});

