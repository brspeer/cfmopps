Template.conference.onRendered(function() {
  Session.set('zoneSolids', null);
  Session.set('viewNotReported', false);
  Session.set('zoneSolidsNM', null);
  Session.set('zoneActuals', null);
});

Template.conference.events({
  'click .solids': function(event) {
    if (this.tmSolids === 0) {
      Session.set('zoneSolids', null);
      Session.set('zoneSolidsNM', null);
      Session.set('zoneActuals', null);
    } else {
      Session.set('zoneSolidsNM', null);
      Session.set('zoneActuals', null);
      Session.set('zoneSolids', this.zoneId);
      Session.set('zoneName', Zones.findOne({_id: this.zoneId}).name);
    }
  },
  'click .solidsNM': function(event) {
    if (this.nmSolids === 0) {
      Session.set('zoneSolids', null)
      Session.set('zoneSolidsNM', null);
      Session.set('zoneActuals', null);
    } else {
      Session.set('zoneSolids', null);
      Session.set('zoneActuals', null);
      Session.set('zoneSolidsNM', this.zoneId);
      Session.set('zoneName', Zones.findOne({_id: this.zoneId}).name);
      
    }
  },
  'click .actuals': function(event) {
    if (this.actuals === 0) {
      Session.set('zoneSolids', null)
      Session.set('zoneSolidsNM', null);
      Session.set('zoneActuals', null);
    } else {
      Session.set('zoneSolids', null);
      Session.set('zoneSolidsNM', null);
      Session.set('zoneActuals', this.zoneId);
      Session.set('zoneName', Zones.findOne({_id: this.zoneId}).name);
      
    }
  },
  'click button.ui.positive.button': function() {
    var id = Meteor.user()._id;
    var notes = $('#notes').val();
    Meteor.users.update(id, {$set: {"profile.notes": notes}});
  },
  'click button.ui.right.floated.button': function() {
     Session.set('viewNotReported', !Session.get('viewNotReported'));
  },
  'click hoooahhh': function() {
    Zones.find().forEach(function(x) {
      Zones.update({_id: x._id}, {$set: {solids: []} });
    })
  }
});

Template.conference.helpers({
  notes: function() {
    return Meteor.user().profile.notes;
  },
  tmSolid: function() {
    var solid = [];
    if (Roles.userIsInRole(Meteor.user(), 'ward')) {
      Investigators.find({unitId: Meteor.user().profile.unit, solid: true, bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).forEach(function(x) {
      var obj = {
        firstName: x.firstName,
        lastName: x.lastName,
        bapMonth: x.bapMonth,
        bapDay: x.bapDay,
        bapYear: x.bapYear
      }
      solid.push(obj);
    })
    return solid;
    } else {
      Investigators.find({zoneId: Session.get('zoneSolids'), solid: true, bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).forEach(function(x) {
      var obj = {
        firstName: x.firstName,
        lastName: x.lastName,
        bapMonth: x.bapMonth,
        bapDay: x.bapDay,
        bapYear: x.bapYear,
        areaName: Areas.findOne({_id: x.areaId}).name
      }
      solid.push(obj);
    })
    return solid;
    }
  },
  solidNM: function() {
    var solidNM = [];
    var bapYear = moment().year().toString();
    var bapMonth = moment().month() + 1;
    if (bapMonth == 11) {
      bapMonth = 0;
      bapYear = moment().add(1, 'year').year().toString();
    }
    if (Roles.userIsInRole(Meteor.user(), 'ward')) {
      var unit = Meteor.user().profile.unit;
      Investigators.find({unitId: unit, bapYear: bapYear, bapMonth: moment.months()[bapMonth], solid: true}).forEach(function(x) {
      var obj = {
        firstName: x.firstName,
        lastName: x.lastName,
        bapMonth: x.bapMonth,
        bapDay: x.bapDay,
        bapYear: x.bapYear
      }
      solidNM.push(obj);
    })
    return solidNM;
    } else {
      Investigators.find({zoneId: Session.get('zoneSolidsNM'), solid: true, bapYear: bapYear, bapMonth: moment.months()[bapMonth]}).forEach(function(x) {
      var obj = {
        firstName: x.firstName,
        lastName: x.lastName,
        bapMonth: x.bapMonth,
        bapDay: x.bapDay,
        bapYear: x.bapYear,
        areaName: Areas.findOne({_id: x.areaId}).name
      }
      solidNM.push(obj);
    })
    return solidNM;
    }
    
  },
  /*dropped: function() {
    var dropped = [];
    var bapYear = moment().year().toString();
    var bapMonth = moment().month() + 1;
    if (bapMonth == 11) {
      bapMonth = 0;
      bapYear = moment().add(1, 'year').year().toString();
    }
    if (Roles.userIsInRole(Meteor.user(), 'ward')) {
      var unit = Meteor.user().profile.unit;
      Investigators.find({unitId: unit, bapYear: bapYear, bapMonth: moment.months()[bapMonth], solid: true}).forEach(function(x) {
      var then = moment(x.bapMonth + " " + x.bapDay + ", " + x.bapYear);
      var now = moment();
      if (id of this record was is last weeks array) {
        
      }
        var obj = {
        firstName: x.firstName,
        lastName: x.lastName,
        bapMonth: x.bapMonth,
        bapDay: x.bapDay,
        bapYear: x.bapYear
      }
      solidNM.push(obj);
    })
    return solidNM;
    }
    
  },*/
  actual: function() {
    var actual = [];
    if (Roles.userIsInRole(Meteor.user(), 'ward')) {
      Converts.find({unitId: Meteor.user().profile.unit, bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).forEach(function(x) {
      var obj = {
        firstName: x.firstName,
        lastName: x.lastName,
        bapMonth: x.bapMonth,
        bapDay: x.bapDay,
        bapYear: x.bapYear,
        areaName: Areas.findOne({_id: x.areaId}).name
      }
      actual.push(obj);
    })
    return actual;
    } else {
      Converts.find({zoneId: Session.get('zoneActuals'), bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).forEach(function(x) {
      var obj = {
        firstName: x.firstName,
        lastName: x.lastName,
        bapMonth: x.bapMonth,
        bapDay: x.bapDay,
        bapYear: x.bapYear,
        areaName: Areas.findOne({_id: x.areaId}).name
      }
      actual.push(obj);
    })
    return actual;
    }
  },
  names: function() {
    return Session.get('zoneSolids') !== null;
  },
  namesNM: function() {
    return Session.get('zoneSolidsNM') !== null;
  },
  namesActuals: function() {
    return Session.get('zoneActuals') !== null;
  },
  zoneName: function() {
    return Session.get('zoneName');
  },
  viewNotReported: function () {
    return Session.get('viewNotReported');
  },
  notReported: function () {
    var date = moment().startOf('week').toDate();
    var notReported = [];
    var reported = [];
    Kis.find({name: date}).forEach(function(x) {
      if ($.inArray( x.areaId, reported ) === -1) {
      reported.push(x.areaId);
      }
    });
    Areas.find({active: true}).forEach(function(y) {
      if ($.inArray( y._id, reported ) === -1) {
      notReported.push(y);
      }
    });
    return notReported;
  },
  totalNums:function() {
    var date = moment().startOf('week').toDate().toString().substring(0,15);
    var year = moment().year();
    var month = moment().month() - 1;
    if (moment().month() === 0) {
      year = year - 1;
      month = 11;
    }
    var monthString = moment.monthsShort()[month];
    var goalDate = monthString + " " + year;
    totalNums = [];
    var yc = Areas.find({active: true}).count();
    var goal = 0;
    Zones.find().forEach(function(x) {
      var zoneGoal = MonthlyKis.findOne({areaId: x.leader, name: goalDate});
      if (zoneGoal === undefined) {
        zoneGoal = 0;
      } else {
        zoneGoal = zoneGoal.goal
      }
      goal += zoneGoal;
    });
    var hb = [];
    Converts.find({bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).forEach(function(a) {	
        if ($.inArray( a.areaId, hb ) === -1) { //Checks to see if the area id already exist in the array before adding itfor the purpose of calculating has baptized by companionship
         hb.push(a.areaId)
        }
      });
    var wb = [];
    Investigators.find({solid: true, bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).forEach(function(z) {	
        if ($.inArray( z.areaId, wb ) === -1 && $.inArray(z.areaId, hb) === -1) { //Checks to see if the area id already exist in the hb and wb array before adding itfor the purpose of calculating will baptize by companionship
         wb.push(z.areaId)
        }
      });
    var ni = 0;
    var mp = 0;
    Kis.find({date: date}).forEach(function(y) {
        ni += y.ni;
        mp += y.mp;
      });
    
    var nmBapYear = moment().year().toString();
    var nmBapMonth = moment().month() + 1;
    if (nmBapMonth == 12) {
      nmBapMonth = 0;
      nmBapYear = moment().add(1, 'year').year().toString();
    }
    
    var totalNumbsObj = {
      yc: yc,
      goal: goal,
      hb: hb.length,
      wb: wb.length,
      actuals: Converts.find({bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).count(),
      tmSolids: Investigators.find({solid: true, bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).count(),
      nmSolids:Investigators.find({solid: true, bapYear: nmBapYear, bapMonth: moment.months()[nmBapMonth]}).count(),
      mp: mp,
      pi: Investigators.find().count(),
      ni: ni,
    }
    
    totalNums.push(totalNumbsObj)
    return totalNums
  },
  conferenceNums: function() {
    conferenceNums = [];
    
    Zones.find().forEach(function(x) {
      var date = moment().startOf('week').toDate().toString().substring(0,15);
      var wb = [];
      var hb = [];
      var ni = 0;
      var mp = 0;
      var year = moment().year();
      var month = moment().month() - 1;
      if (moment().month() === 0) {
        year = year - 1;
        month = 11;
      }
      var monthString = moment.monthsShort()[month];
      var goalDate = monthString + " " + year;
      Kis.find({zoneId: x._id, date: date}).forEach(function(y) {
        ni += y.ni;
        mp += y.mp;
      });
      
      Converts.find({zoneId: x._id, bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).forEach(function(a) {	
        //Checks to see if the area id already exist in the array before adding itfor the purpose of calculating has baptized by companionship
        if ($.inArray( a.areaId, hb ) === -1) { 
         hb.push(a.areaId)
        }
      });
      
      Investigators.find({zoneId: x._id, solid: true, bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).forEach(function(z) {	
        //Checks to see if the area id already exist in the hb and wb array before adding itfor the purpose of calculating will baptize by companionship
        if ($.inArray( z.areaId, wb ) === -1 && $.inArray(z.areaId, hb) === -1) {
         wb.push(z.areaId)
        }
      });
      var goal = MonthlyKis.findOne({areaId: x.leader, name: goalDate});
      if (goal === undefined) {
        goal = 0;
      } else {
        goal = goal.goal
      }
      var nmBapYear = moment().year().toString();
      var nmBapMonth = moment().month() + 1;
      if (nmBapMonth == 12) {
        nmBapMonth = 0;
        nmBapYear = moment().add(1, 'year').year().toString();
      }
      var obj = {
        name: x.name,
        yc: Areas.find({zone: x._id, active: true}).count(),
        goal: goal,
        hb: hb.length,
        wb: wb.length,
        actuals: Converts.find({zoneId: x._id, bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).count(),
        tmSolids: Investigators.find({zoneId: x._id, solid: true, bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).count(),
        nmSolids: Investigators.find({zoneId: x._id, solid: true, bapYear: nmBapYear, bapMonth: moment.months()[nmBapMonth]}).count(),
        mp: mp,
        pi: Investigators.find({zoneId: x._id}).count(),
        ni: ni,
        zoneId: x._id
      }
      
      conferenceNums.push(obj);
    })
    
    return conferenceNums;
  },
  wardNums: function() {
    var unit = Meteor.user().profile.unit;
    var stake = Meteor.user().profile.stake;
    var date = moment().startOf('week').toDate();
    var wardNums = [];
    var mp = 0;
    var ni = 0;
    Kis.find({unitId: unit, name: date}).forEach(function(y) {
        ni += y.ni;
        mp += y.mp;
      });
    var obj = {
      actuals: Converts.find({unitId: unit, bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()]}).count(),
      tmSolids: Investigators.find({unitId: unit, bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month()], solid: true}).count(),
      nmSolids: Investigators.find({unitId: unit, bapYear: moment().year().toString(), bapMonth: moment.months()[moment().month() + 1], solid: true}).count(),
      mp: mp,
      pi: Investigators.find({unitId: unit}).count(),
      ni: ni,
      zoneId: stake
    }
    wardNums.push(obj);
    return wardNums;
  }
})