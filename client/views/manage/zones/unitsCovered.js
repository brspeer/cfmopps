Template.unitsCovered.onRendered(function() {
  //This is for the dropdown which selects what units the
  //  area covers
  $('.ui.units.dropdown')
  .dropdown()
  ;
  $('#mySelect')
  .dropdown({'set selected' : "Hanford 1"})
  ;
});

Template.unitsCovered.helpers({
  units: function() {
    return Units.find({stake: Session.get('zoneEdit')})
  }
})