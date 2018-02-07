Template.stakes.helpers({
  zones: function(){
    return Zones.find();
  },
  isCreatingStake: function(){
    return Session.get('isCreatingStake');
  },
  stakes: function(){
    return Stakes.find();
  }
});

Template.stakes.events({
  'click a.delete': function(e, tpl){
    e.preventDefault();
    var r = confirm("Are you sure you?");
    if (r === true) {
      Stakes.remove(this._id);
    } else {}
  },
  "click button.ui.basic.button": function(e, tpl){
    e.preventDefault();
    Session.set('isCreatingStake', true);
  },
  
  "click button.ui.button.cancel": function(){
    event.preventDefault();
    Session.set('isCreatingStake', false);
  },
  
  "click button.ui.positive.addZone": function(e, tpl){
    e.preventDefault();
    var name = document.getElementById("stakeName").value;
    var zones = 
    /*Zones.insert({
      "name" : name
    });
    Districts.insert({
      "name" : (name+" D1"),
      "zone" : name
    });
    Districts.insert({
      "name" : (name+" D2"),
      "zone" : name
    });
    Districts.insert({
      "name" : (name+" D3"),
      "zone" : name
    });*/
    Stakes.insert({
      name: name
    });
    Session.set('isCreatingStake', false);
  },
  
  "click a.stake": function(e,tpl){
    e.preventDefault();
    var thisStake = this._id;    
    Session.set('stakeEdit', thisStake);
    Router.go('/stake');
  }
});