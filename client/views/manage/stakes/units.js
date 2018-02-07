Template.stakeUnits.helpers({
  isCreatingUnit: function(){
    return Session.get('isCreatingUnit');
  },
  
  units: function(){
    return Units.find({}, {
      sort: { stake: -1 }
    });
  },
  
  stakes: function(){
    var stake = [];
    Units.find().forEach(function(unit){
      if ($.inArray(unit.stake, stake) < 0){
        stake.push(unit.stake);
      }
    });
    console.log(stake);
    return stake;
  }
});

Template.stakeUnits.events({
  "click button.ui.basic.button": function(){
    event.preventDefault();
    Session.set('isCreatingUnit', true);
  }
});