Template.zones.helpers({
  zones: function(){
    return Zones.find();
  },
  leaderArea : function(){
    return Areas.findOne({_id: this.leader}).name;
  },
  // areas: function(){
  //   return Areas.find();
  // },
  
  isCreatingZone: function(){
    return Session.get('isCreatingZone');
  },
  
  zoneEdit: function(){
    return Session.get('zoneEdit');
  }
});

Template.zones.events({
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
  
  "click button.ui.button.cancel": function(e, tpl){
    e.preventDefault();
    Session.set('isCreatingZone', false);
  },
  
  // This is going to be done automatically when a Stake is made
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
    var thisZone = this._id;    
    Session.set('zoneEdit', thisZone);
    var stakesZones = [];
    Stakes.find({zones: thisZone}).forEach(function(x) {
      stakesZones.push(x._id);
    });
    Session.set('stakesZones', stakesZones);
    Router.go('/zone');
  }
  
  /*"submit form.create-district": function(e, tpl){
    e.preventDefault();
    
    var areaDL = {
      id: tpl.$("select[name=areaDL]").val(),
      name: tpl.$("select[name=areaDL] option:selected").text()
    }
    
    var area1 = {
      _id: tpl.$("select[name=areaOne]").val(),
      name: tpl.$("select[name=areaOne] option:selected").text(),
    }
    
    var area2 = {
      _id: tpl.$("select[name=areaTwo]").val(),
      name: tpl.$("select[name=areaTwo] option:selected").text()
    }
    
    var area3 = {
      _id: tpl.$("select[name=areaThree]").val(),
      name: tpl.$("select[name=areaThree] option:selected").text()
    }
    
    var district = {
      createdAt: new Date(),
      name: name,
      areas: [areaDL, area1, area2, area3]
    }
    
    //var districtId = Districts.insert(district);
    
    //Areas.update({_id: areaDL._id}, {$set: {districtId: districtId}});
    //Areas.update({_id: areaDL._id}, {$addToSet: {districtname: areaDL.name}});
    //Areas.update({_id: area1._id}, {$set: {districtId: districtId}});
    //Areas.update({_id: area1._id}, {$addToSet: {districtname: areaDL.name}});
    //Areas.update({_id: area2._id}, {$set: {districtId: districtId}});
    //Areas.update({_id: area3._id}, {$set: {districtId: districtId}});
   
  
  Session.set('isCreatingZone', false); 
  }*/
});










