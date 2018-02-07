Template.mergeUnits.onRendered(function() {
  $('.ui.selection.dropdown')
    .dropdown({
    onChange: function(value) {
      Session.set('moveTo', value)
    }
  });
  
});

Template.mergeUnits.helpers({
  unit: function() {
    return Units.findOne({_id: Session.get('deleting')});
  },
  units: function() {
    return Units.find({stake: Session.get('stakeEdit')})
  }
});

Template.mergeUnits.events({
  'click .ui.cancel.button': function() {
    Session.set('isDeleting', false);
    Session.set('deleting', null);
  },
  
  'click .ui.right.floated.negative.button': function() {
    const newUnitId = Session.get('moveTo');
    const oldUnitId = Session.get('deleting');

    Meteor.call("mergeUnits", oldUnitId, newUnitId, function(err, res){
      if (err){
        //sAlert.error(err.reason);
      } else {
        Session.set('moveTo', null);
        Session.set('deleting', null);
        Session.set('isDeleting', false);  
      }
    });
    
  }
});