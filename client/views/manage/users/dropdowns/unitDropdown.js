Template.unitDropdown.onRendered(function(){
  $('.ui.search.selection.dropdown')
  .dropdown()
  ;
});

Template.unitDropdown.helpers({
  units: function() {
    return Units.find({stake : Session.get('zoneEdit')});
  }
});