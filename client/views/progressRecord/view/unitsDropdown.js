Template.unitsDropdown.helpers({
    units: function() {
    var area = Areas.findOne({_id : Meteor.user().profile.area});
    return Units.find( { _id: { $in: area.units } } );
  }
});

Template.unitsDropdown.onRendered(function() {
  $('#selectUnit')
    .dropdown({
      onChange: function(value) {
        Session.set('unit', Units.findOne({name: value})._id);
      }
    });
});
