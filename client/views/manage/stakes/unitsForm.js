Template.unitsForm.onRendered(function(){
  $('.ui.checkbox')
  .checkbox()
  ;
});

Template.unitsForm.helpers({
  units: function() {
    return Units.find();
  }
});

Template.unitsForm.events({
  "click button.ui.positive.button.addUnit": function() {
    event.preventDefault();
    var name = document.getElementById("unitName").value;
    var stake = Session.get('stakeEdit');
    Units.insert({
      "name" : name,
      "stake" : stake,
    });
    Session.set('isCreatingUnit',false);
  },
  
  "click button.ui.button.cancel": function(){
    event.preventDefault();
    Session.set('isCreatingUnit', false);
  }
});