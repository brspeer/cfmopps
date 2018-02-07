Template.stakeDropdown.onRendered(function(){
  $('.ui.search.selection.dropdown')
  .dropdown()
  ;
});

Template.stakeDropdown.helpers({
  zones: function() {
    return Zones.find();
  }
});