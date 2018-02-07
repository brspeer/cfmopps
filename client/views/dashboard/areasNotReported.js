Template.notReported.helpers({
  notReported: function() {
    var reportedAreas = [];
    var notReported = [];
    var areasNames = [];
    var kismission = Kis.find({name: moment().startOf('week').toDate()});
    var kiszone = Kis.find({
      name: moment().startOf('week').toDate(),
      zoneId: Zones.findOne({name: Meteor.user().profile.zone})._id
    });
    if (Roles.userIsInRole(Meteor.user(), 'office')) {
    kismission.forEach(function(x) {
        reportedAreas.push(x.areaId);
      });
    } else if (Roles.userIsInRole(Meteor.user(), 'zoneLeader')) {
      kiszone.forEach(function(x) {
        reportedAreas.push(x.areaId);
      });
    }
    reportedAreas.forEach(function(y) {
      if (areasNames.indexOf(Areas.findOne({_id: y, active: true}).name) === -1) {
        areasNames.push(Areas.findOne({_id: y, active: true}).name)
      }
    });
    if (Roles.userIsInRole(Meteor.user(), 'office')) {
      Areas.find({active: true}).forEach(function(x) {
      if (areasNames.indexOf(x.name) === -1) {
          notReported.push(x.name);
      }
    });
    return notReported;
    } else if (Roles.userIsInRole(Meteor.user(), 'zoneLeader')) {
      Areas.find({zone: Meteor.user().profile.zone, active: true}).forEach(function(x) {
      if (areasNames.indexOf(x.name) === -1) {
          notReported.push(x.name);
      }
    });
    return notReported;
    }
    
   },
});

Template.notReported.events({
  "click button.back.ui.basic.button": function() {
    Router.go('/');
  },
})