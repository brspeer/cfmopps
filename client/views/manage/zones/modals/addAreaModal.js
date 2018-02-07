Template.addAreaModal.onRendered(function() {
  $('#multi-select')
    .dropdown();
  $('#areaDis')
    .dropdown();
  $('.ui.checkbox')
    .checkbox();
});

Template.addAreaModal.helpers({
  units: function(){
    return Units.find();
  },
  districts: function(){
    return Districts.find();
  },
  zoneEdit: function(){
    return Session.get("zoneEdit");
  }
});

Template.addAreaModal.events({
  'click button.ui.button.positive': function(e,tpl) {
    e.preventDefault();
    aler("this is stupid");
  },

  'click button.ui.button.cancel': function(e,tpl) {
    e.preventDefault();
    //I know this line of router code looks pointless, but it helps cure some bugginess with the modals and template loadin
    }
});