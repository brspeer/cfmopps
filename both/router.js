Router.configure({
  layoutTemplate: 'layout', 
  notFoundTemplate: '404',
  loadingTemplate: 'loading',
  waitOn: function(){
    return [
      //curr user

    ]
  }
});
 
Router.route('/', {
  name: 'login',
  waitOn: function(){
    if (Meteor.userId()){
      if (Roles.userIsInRole(Meteor.userId(), 'ward')){
        _.each(conferenceSubs, function(sub){
          Meteor.subscribe(sub);
        });
      } else {
        return [
          Meteor.subscribe('areas'),
          Meteor.subscribe('districts'),
          Meteor.subscribe('zones'),
          Meteor.subscribe('kis.last5weeks'),
        ];
      }
    }
    return;
  },
  onBeforeAction: function(){
    if (Meteor.userId()){
      Meteor.subscribe('kis.thisYear');
    }
    this.next();
  },
  action: function(){
    var currentUser = Meteor.user();
    if(Roles.userIsInRole(currentUser, 'ward')){
      this.render('conference');
    } else
    if(Roles.userIsInRole(currentUser, 'stakePresident')){
        Router.go('/stakeCorrelation');
    }
    else {
      this.render('login');
    }
    }
});

Router.route('/area', {
  waitOn: function(){
    if (Meteor.userId()){
      return [
        Meteor.subscribe('area.byId', Session.get('areaEdit')),
        Meteor.subscribe('districts'),
        Meteor.subscribe('zones'),
        Meteor.subscribe('units'),
      ];
    } 
    else {
      Router.go('/')
    }
  },
  action: function(){
    this.render('area');
  }
});

Router.route('/districts', {
  waitOn: function(){
    if (Meteor.userId()){
      return [
        Meteor.subscribe('districts'),
      ];
    } 
    else {
      Router.go('/')
    }
  },
  action: function(){
    this.render('districts');
  }
});

Router.route('/zone', {
  waitOn: function(){
    if (Meteor.userId()){
      return [
        Meteor.subscribe('areas'),
        Meteor.subscribe('districts'),
        Meteor.subscribe('zones'),
        Meteor.subscribe('allUsers'),
      ];
    } 
    else {
      Router.go('/')
    }
  },
  action: function(){
      this.render('zone')
  }
});


Router.route('/zones', {
  waitOn: function(){
    if (Meteor.userId()){
      return [
        Meteor.subscribe('areas'),
        Meteor.subscribe('zones'),
        Meteor.subscribe('stakes')
      ];
    } 
    else {
      Router.go('/')
    }
  },
  action: function(){
        this.render('zones');
  }
});

import {indicators} from '/lib/collections/helpers.js';
Router.route('/weeklyReporting', {
  waitOn: [
      function() {
          if (Meteor.userId()) {
              return [
                  Meteor.subscribe('areas.weeklyReports'),
              ];
          } else {
              Router.go('/')
          }
      },
      function() {
          // to add yearly goals to units
          if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'zoneLeader')) {
              return [
                Meteor.subscribe('unitsInStake'),
                Meteor.subscribe('stakes')
              ]
          }
      }
  ],
  action: function(){
      this.render('weeklyReporting');
  },
  data: function(){
    var data = {
      indicators:indicators
    };
    if (Meteor.user()){
      var areaId = Meteor.user().profile.area;
      var area = Areas.findOne({_id : areaId});
      if (area){
        data.myArea = area;
        if (area.units && area.units.length > 0){
          var units = Units.find({_id:{$in:area.units}}).fetch();
          data.unitsInArea = units;
        }
      }
    }
    return data;
  }
});

Router.route('/monthlyReporting', {
  waitOn: function(){
    if (Meteor.userId()){
      return [
        Meteor.subscribe('areas'),
        Meteor.subscribe('unitsInMyArea'),
      ];
    } 
    else {
      Router.go('/')
    }
  },
  action: function(){
      this.render("monthlyReporting");
  }
});

Router.route('/progressRecord', {
  waitOn: function(){
    if (Meteor.userId()){
      return [
        Meteor.subscribe('areas'),
        Meteor.subscribe('zones'),
        Meteor.subscribe('units'),
        Meteor.subscribe('stakes'),
        Meteor.subscribe('districts')
      ];
    } 
    else {
      Router.go('/')
    }
  },
  onBeforeAction: function(){
    if (Meteor.userId()){
      Meteor.subscribe('progressRecord');
    }
    this.next();
  },
  action: function(){
    this.render('progressRecord');
  }
});

Router.route('/stakes', {
  waitOn: function(){
    if (Meteor.userId()){
      return [
        Meteor.subscribe('zones'),
        Meteor.subscribe('stakes')
      ];
    } 
    else {
      Router.go('/')
    }
  },
  action: function(){
    this.render('stakes');
  }
});

Router.route('/stake', {
  waitOn: function(){
    if (Meteor.userId){
      return [
        Meteor.subscribe('areas'),
        Meteor.subscribe('zones'),
        Meteor.subscribe('units'),
        Meteor.subscribe('stakes')
      ];
    } 
    else {
      Router.go('/');
    }
  },
  action: function(){
      this.render('stake');
  }
});

Router.route('/usersZones', {
  waitOn: function(){
    if (Meteor.userId()){
      return [
        Meteor.subscribe('zones'),
      ];
    } 
    else {
      Router.go('/');
    }
  },
  action: function(){
      this.render('usersZones');
  }
});

Router.route('/usersZone', {
  waitOn: function(){
    if (Meteor.userId()){
      return [
        Meteor.subscribe('areas'),
        Meteor.subscribe('zones'),
        Meteor.subscribe('allUsers'),
        Meteor.subscribe('units'),
      ];
    } 
    else {
      Router.go('/');
    }
  },
  action: function(){
      this.render('usersZone');
  }
});


const conferenceSubs = [
  'areas', 'districts', 'zones', 'allUsers', 'units', 'units', 'kis.thisWeek', 'monthlykis.lastMonth', 'conference'
];

Router.route('/conference', {
  waitOn: function(){
    if (Meteor.userId()){
      _.each(conferenceSubs, function(sub){
        Meteor.subscribe(sub);
      });
    } 
    else {
      Router.go('/');
    }
  },
  action: function(){
      this.render('conference');
  }
});

Router.route('/units', {
  waitOn: function(){
    if (Meteor.userId()){
      return [
        Meteor.subscribe('units'),
      ];
    } 
    else {
      Router.go('/');
    }
  },
  action: function(){
    this.render('units');
  }
});

Router.route('/stakeCorrelation', {
  waitOn: function(){
    if (Meteor.userId()){
      return [
        Meteor.subscribe('stakes'),
        Meteor.subscribe('areas'),
        Meteor.subscribe('stakeCorrelation')      ];
    }
  },
  action: function(){
    this.render("stakeCorrelation");
  }
});