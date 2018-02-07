Template.stake.onRendered(function() {
  Session.set('isDeleting', false);
  Session.set('deleting', null);
  $('.zones.ui.dropdown')
  .dropdown({
    action: 'activate',
    onChange: function() {
      var zones = $('.zones.ui.dropdown').dropdown('get value');
      Stakes.update({_id: Session.get('stakeEdit')}, {$set: {zones: zones}});
    }//,
    //onShow: function() {
    //  var current = Stakes.findOne({_id: Session.get('stakeEdit')}).zones;
    //  $('.zones.ui.dropdown').dropdown('set selected', current);
    //}
  });
  
  var current = Stakes.findOne({_id: Session.get('stakeEdit')}).zones;
  $('.zones.ui.dropdown').dropdown('set selected', current);
  
});

Template.stake.helpers({
  units: function() {
    return Units.find({
      stake: Session.get('stakeEdit')
    }, {
      sort: {
        stake: -1
      }
    });
  },
  isDeleting: function() {
    return Session.get('isDeleting')
  },
  isCreatingUnit: function() {
    return Session.get('isCreatingUnit');
  },
  currentStake: function() {
    return Stakes.findOne({_id: Session.get('stakeEdit')}).name;
  },
  isEditingUnit: function() {
    return Session.get('editedUnit') === this._id;
  },
  zones: function() {
    return Zones.find();
  }
})

Template.stake.events({
  "click a.edit": function(e, tpl) {
    Session.set('editedUnit', this._id);
  },
  "click a.delete": function(e, tpl) {
    e.preventDefault();
    Session.set('isDeleting', true);
    Session.set('deleting', this._id);
  },
  "click button.ui.green.mini.button": function(e, tpl) {
    e.preventDefault();
    var newName = $('#unitName').val();
    var id = $('#update').attr("name");
    var unit = Units.findOne({_id : id})
    Units.update({
      _id : id },{
      $set : { name : newName}
    });
    Session.set('editedUnit', null);
  },
  "click button.back.ui.basic.button": function() {
    Router.go('/stakes');
    Session.set('isCreatingDistrict', false);
    Session.set('isCreatingArea', false)
    Session.set('editedAreaName', null);
  },
  "click #addUnit": function(e, tpl) {
    e.preventDefault();
    Session.set('isCreatingUnit', true);
  },

  "click a.cancel": function(e, tpl) {
    e.preventDefault();
    Session.set('isCreatingUnit', false);
    Session.set('editedUnit', null)
  }

});