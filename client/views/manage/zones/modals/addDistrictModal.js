Template.addDistrictModal.events({
  'click button.ui.button.positive': function(e,tpl) {
    e.preventDefault();
    var name = document.getElementById("disName").value;
    var zone = Session.get('zoneEdit');
    Districts.insert({
      "name": name,
      "zone": zone
    });
    document.getElementById("addDisForm").reset();
  },

  'click button.ui.button.cancel': function(e,tpl) {
    e.preventDefault();
    document.getElementById("addDisForm").reset();
    //I know this line of router code looks pointless, but it helps cure some bugginess with the modals and template loading
    Router.go('/zone')
  },
});