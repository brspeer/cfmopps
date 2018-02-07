Template.usersZones.helpers({
  zones: function(){
    return Zones.find();
  },
  isCreatingZone: function(){
    return Session.get('isCreatingZone');
  }
});

Template.usersZones.events({
  'click a.delete': function(e, tpl){
    e.preventDefault();
    var r = confirm("Are you sure you?");
    if (r === true) {
      Zones.remove(this._id);
    } else {}
  },
  "click button.ui.basic.button": function(e, tpl){
    e.preventDefault();
    Session.set('isCreatingZone', true);
  },
  
  "click a.cancel": function(e, tpl){
    e.preventDefault();
    Session.set('isCreatingZone', false);
  },
  
  "click button.ui.positive.addZone": function(e, tpl){
    e.preventDefault();
    var name = document.getElementById("zoneName").value;
    Zones.insert({
      "name" : name
    });
    Session.set('isCreatingZone', false);
  },
  
  "click a.zone": function(e,tpl){
    e.preventDefault();
    var thisZone = this.name;    
    Session.set('zoneEdit', thisZone);
    Router.go('/usersZone');
  }
});