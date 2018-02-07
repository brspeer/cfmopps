Template.activeToggle.onRendered(function() {
  $('.ui.toggle.checkbox')
  .checkbox({
    onChecked: function() {
      var x = Areas.findOne({name : this.name});
      Areas.update({_id : x._id}, {$set : {active : true}});
    },
    
    onUnchecked: function() {
      var x = Areas.findOne({name : this.name});
      Areas.update({_id : x._id}, {$set : {active : false}});
    }
  });
});

Template.activeToggle.helpers({
  
});

Template.activeToggle.events({
  
});