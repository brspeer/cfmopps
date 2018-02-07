import '/imports/c3.min.css';     // import css to style charts c3 charts

Template.dashboard.onRendered(function() {
  $('#drilldownZone')
    .dropdown({
      onChange: function(value) {
        Session.set('drilldownArea', null);
        Session.set('drilldownDistrict', null);
        Session.set('drilldownZone', value);
      }
    });
  $('#drilldownDistrict')
    .dropdown({
      onChange: function(value) {
        Session.set('drilldownArea', null);
        Session.set('drilldownDistrict', value);
      }
    });
  $('#drilldownArea')
    .dropdown({
      onChange: function(value) {
        Session.set('drilldownArea', value);
      }
    });
  $('.ui.right.floated.small.statistic')
    .popup({
      position: 'right center',
      content: 'Clicking this number will give you a list of those who have not reported.'
    });
});

Template.dashboard.helpers({
  // scores: function() {
  //   scores = [];
  //   Zones.find().forEach(function(x) {
  //     var totalBap = 0;
  //     var monthBap = 0;
  //     MonthlyKis.find({zoneId: x._id}).forEach(function(y) {
  //       var year = y.name.split(' ');
  //       if (year[1] == moment().year()) {
  //         totalBap += y.bap ;
  //       }
  //     });
  //         var month = moment().month();
  //         var monthString = moment.monthsShort()[month];
  //     MonthlyKis.find({zoneId: x._id, name: monthString + " " + moment().year()}).forEach(function(z) {
  //       monthBap += z.bap;
  //     })
  //       var obj = {
  //         "name": x.name,
  //         "total": totalBap,
  //         "month": monthBap
  //       }
  //       scores.push(obj);
  //   })
  //    scores.sort(function(a, b) {
  //       return parseFloat(b.total) - parseFloat(a.total);
  //     });
  //   return scores;
  // },
  numberAreas: function() {
    if (Roles.userIsInRole(Meteor.user(), 'office')) {
      return Areas.find({active: true}).count();
    } else if (Roles.userIsInRole(Meteor.user(), 'zoneLeader')) {
      return Areas.find({
        zone: Meteor.user().profile.zone,
        active: true
      }).count();
    }
  },
  numberReported: function() {
    var reportedAreas = [];
    var notReported = [];
    var areasNames = [];
    var kismission = Kis.find({name: moment().startOf('week').toDate()});
    var kiszone = Kis.find({
      name: moment().startOf('week').toDate(),
      zoneId: Meteor.user().profile.zone
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
        areasNames.push(Areas.findOne({_id: y}).name)
      }
    });
    if (Roles.userIsInRole(Meteor.user(), 'office')) {
      Areas.find({active: true}).forEach(function(x) {
      if (areasNames.indexOf(x.name) === -1) {
          notReported.push(x.name);
      }
    });
    return Areas.find({active: true}).count() - notReported.length;
    } else if (Roles.userIsInRole(Meteor.user(), 'zoneLeader')) {
      Areas.find({zone: Meteor.user().profile.zone, active: true}).forEach(function(x) {
      if (areasNames.indexOf(x.name) === -1) {
          notReported.push(x.name);
      }
    });
    return Areas.find({zone: Meteor.user().profile.zone, active: true}).count() - notReported.length;
    }
    
   },
  zones: function() {
    return Zones.find();
  },
  districtsAP: function() {
    return Districts.find({
      zone: Session.get('drilldownZone')
    });
  },
  areasAP: function() {
    return Areas.find({
      district: Session.get('drilldownDistrict'),
      active: true,
    });
  },
  areaView: function() {
    return Session.get('areaView');
  },
  districtsZL: function() {
    return Districts.find({
      zone: Meteor.user().profile.zone
    });
  },
  areasZL: function() {
    return Areas.find({
      district: Session.get('drilldownDistrict'),
      active: true
    });
  },
  areasDL: function() {
    var leader = Meteor.user().profile.area;
    var district = Districts.findOne({leader: leader})._id;
    return Areas.find({
      district: district,
      active: true
    });
  },
  zoneEdit: function() {
    return Session.get('zoneEdit');
  },
  districtEdit: function() {
    return Session.get('districtEdit')
  },
  areaEdit: function() {
    return Session.get('areaEdit');
  },
  drillingDown: function() {
    return Session.get('drilldownDistrict') != null
  }
});

Template.dashboard.events({
  "click div.ui.right.floated.small.statistic": function() {
    $('.ui.right.floated.small.statistic')
      .popup('hide');
    Router.go('/notReported');

  },
  "click div.ui.right.floated.button": function() {
    Session.set('drilldownDistrict', null);
    Session.set('drilldownArea', null);
    Session.set('drilldownZone', null);
  },
  "click div.item.mission": function() {
    Session.set('areaEdit', null);
    Session.set('districtEdit', null);
    Session.set('zoneEdit', null);
  },
  "click div.district.button": function() {
    Session.set('drilldownDistrict', Districts.findOne({
      leader: Meteor.user().profile.area
    })._id)
  },
  "click div.area.ui.button": function () {
    Session.set('drilldownArea', Meteor.user().profile.area);
  },
  "click div.item.zone.name": function(e, tpl) {
    e.preventDefault();
    var thisZone = "Mission";
    if (this.name) {
      thisZone = this.name;
    }
    Session.set('zoneEdit', thisZone);
    Session.set('districtEdit', null);
    Session.set('areaEdit', null);
  },

  "click div.item.district.name": function(e, tpl) {
    e.preventDefault();
    var thisDistrict = "Zone";
    if (this.name) {
      thisDistrict = this.name;
    }
    Session.set('districtEdit', thisDistrict);
    Session.set('areaEdit', null);
  },

  "click div.item.area.name": function(e, tpl) {
    e.preventDefault();
    var thisArea = "Area";
    if (this.name) {
      thisArea = this.name;
    }
    Session.set('areaEdit', thisArea);
  }
});