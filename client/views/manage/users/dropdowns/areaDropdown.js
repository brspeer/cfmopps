Template.areaDropdown.onRendered(function(){
  $('.ui.search.selection.dropdown')
  .dropdown()
  ;
});

Template.areaDropdown.helpers({
  areas: function() {
    return Areas.find({zone : Session.get('zoneEdit')});
  }
});