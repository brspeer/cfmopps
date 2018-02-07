import 'meteor/momentjs:moment';

Meteor.publishTransformed('areas', function(){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};

  let filter = {};

  filter = filterAreasByRole(userId, filter)

  return Areas.find(filter);
    // .serverTransform({
    //   'user.area': function(area){
    //     return Meteor.users.find({area: area._id});
    //   },
    //   'user.profile.area': function(area){
    //     return Meteor.users.find({"profile.area": area._id});
    //   }
    // });
});

Meteor.publishTransformed('area.byId', function(areaId){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};

  return Areas.find({_id:areaId})
    .serverTransform({
      'user.area': function(area){
        return Meteor.users.find({area: area._id});
      },
      // 'user.profile.area': function(area){
      //   return Meteor.users.findOne({"profile.area": area._id});
      // }
    });
});


Meteor.publishTransformed('areas.weeklyReports', function() {
    const userId = this.userId;
    if (!userId) {
        throw new Meteor.Error('unauthorized', 'Must be logged in to get this data') };

    const user = Meteor.users.findOne({ _id: this.userId });

    let filter = { _id: user.profile.area };

    // filter = filterAreasByRole(userId, filter)

    var date = moment().startOf('week').toDate().toString().substring(0, 15);

    const areasCursor = Areas.find(filter)
        .serverTransform({
            'thisWeekJSH': function(area) {
                var validation = date + area._id;
                var jsh = JustServeHours.findOne({ validation: validation });
                return jsh ? jsh : null;
            },
            'unitsCursor': function(area) {
              if (area.units && area.units.length > 0){
                return Units.find({ _id: { $in: area.units } })
                    .serverTransform({
                        'thisWeekKI': function(unit) {
                            var ki = Kis.findOne({ areaId: area._id, unitId: unit._id, date: date });
                            return ki ? ki : null;
                        }
                    })
              }
            }
        });
    return areasCursor;
});


Meteor.publish('districts', function(){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};
  const user = Meteor.users.findOne({_id:userId});

  let filter = {};
  if (Roles.userIsInRole(userId, 'zoneLeader')) {
    filter.zone = user.profile.zone
  } else
  if (Roles.userIsInRole(userId, 'districtLeader')){
    filter.leader = user.profile.area;
  }
  return Districts.find(filter);
});

Meteor.publishTransformed('zones', function(){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};
  const user = Meteor.users.findOne({_id:userId});

  let filter = {};
  if (Roles.userIsInRole(userId, 'zoneLeader')) {
    filter._id = user.profile.zone
  };
  return Zones.find(filter)
    // .serverTransform({
    //   'user.profile.zone': function(area){
    //     return Meteor.users.find({"profile.zone": area._id});
    //   }
    // });
});

const users_public_fields = {
  services:0
}

Meteor.publish('allUsers', function(){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};
  let mods = {fields: users_public_fields};
  return Meteor.users.find({},mods);
});

Meteor.publishTransformed('unitsInMyArea', function(){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};
  const user = Meteor.users.findOne({_id:userId});

  var area = user.profile.area;
  var units = Areas.findOne({_id : area}).units;

  return Units.find({_id:{$in:units}})
  .serverTransform({
    thisYearGoal: function(unit){
      return thisYearUnitGoal(unit);
    }
  });
});

Meteor.publishTransformed('unitsInStake', function(){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};
  const user = Meteor.users.findOne({_id:userId});

  // if (Roles.userIsInRole(userId, 'zoneLeader')) {
    const myZoneId = user.profile.zone;

    //get all stakes in a zone 
    let stakes = []
    Stakes.find({}).map(function(stake){
      const zones = stake.zones;
      for(let i = 0; i < zones.length; i++){
        let zoneId = zones[i];
        if (zoneId === myZoneId){
          stakes.push(stake._id)
        }
      }
    });

    return Units.find({stake:{$in:stakes}})
      .serverTransform({
        thisYearGoal: function(unit){
          return thisYearUnitGoal(unit);
        }
      });
  // }
});


Meteor.publishTransformed('units', function(){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};

  return Units.find()
  .serverTransform({
    thisYearGoal: function(unit){
      return thisYearUnitGoal(unit);
    }
  });
});

Meteor.publish('kis.last5weeks', function(){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};

  let dates = [];
  for (let i=0; i < 5; i++){
    let date  = moment().startOf('week').subtract(i, 'weeks').toString().substring(0,15);
    dates.push(date);
  }
  let filter = {
    date: {$in:dates}
  }

  filter = filterKisByRole(userId, filter);

  return Kis.find(filter);
});

Meteor.publish('kis.thisYear', function(){
  const currYear = moment().year();

  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};

  const year = currYear.toString();
  let filter = {
    'date':{$regex:".*"+year}
  }
  
  filter = filterKisByRole(userId, filter);

  return Kis.find(filter);
});

Meteor.publish('kis.thisWeek',function(){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};

  const date = moment().startOf('week').toDate().toString().substring(0,15);
  let filter = {'date':date}; 

  filter = filterKisByRole(userId, filter);
  return Kis.find(filter);
});

// Meteor.publish('roles', function (){
//   return Meteor.roles.find({});
// });

Meteor.publish('progressRecord', function(){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};
  const user = Meteor.users.findOne({_id:userId});

  let filter = {};
  filter = filterProgressRecordByRole(user, filter);

  let investigatorsCursor = Investigators.find(filter);
  let convertsCursor = Converts.find(filter);

  return [investigatorsCursor, convertsCursor];
});

Meteor.publish('investigators', function (){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};
  return Investigators.find();
});
Meteor.publish('converts', function (){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};
  return Converts.find();
});

Meteor.publish('justservehours', function (){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};
  return JustServeHours.find();
});

//starts at current month
Meteor.publish('monthlykis.pastYear', function (){
  const currYear = moment().year();
  let pastYearMonths = []; //starts at currrent month
  const currMonth = moment().month();
  for (let month = currMonth - 12; month < currMonth; month++) {
      m = month < 0 ? month + 12 : month;
      y = month < 0 ? currYear - 1 : currYear;
      pastYearMonths.push(moment.monthsShort()[m] + " " + y);
  }

  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};
  return MonthlyKis.find({name:{$in:pastYearMonths}});
});

Meteor.publish('monthlykis.lastMonth', function (){
  const currMonth = moment().month();
  const lastMonth = moment().month(currMonth-1).format('MMM YYYY');

  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};
  return MonthlyKis.find({name:lastMonth});
});

Meteor.publishTransformed('stakes', function(){
  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};

  let filter = {};
  filter = filterStakesByRole(userId, filter);

  return Stakes.find(filter)
  .serverTransform({
    thisYearGoal: function(stake){
      return thisYearStakeGoal(stake)
    }
  });
});

Meteor.publishTransformed('stakeCorrelation', function(){
  const currYear = moment().year();
  const currMonth = moment().month();
  let pastYearMonths = []; //starts at currrent month
  for (let month = currMonth - 12; month < currMonth; month++) {
      m = month < 0 ? month + 12 : month;
      y = month < 0 ? currYear - 1 : currYear;
      pastYearMonths.push(moment.monthsShort()[m] + " " + y);
  }

  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};

  let filter = {};

  filter = filterStakesByRole(userId, filter);

  return Stakes.find(filter)
  .serverTransform({
    thisYearGoal: function(stake){
      return thisYearStakeGoal(stake)
    },
    units: function(stake){
      return Units.find({stake:stake._id})
        .serverTransform({
          thisYearGoal: function(unit){
            return thisYearUnitGoal(unit);
          },
          converts: function(unit){
            return Converts.find({unitId:unit._id});
          }
          // monthlyKis: function(unit){
          //   return MonthlyKis.find({unitId: unit._id, name:{$in:pastYearMonths}});
          // } //stakeId is set for all these KIs, same thing as done below
        });
    },
    monthlyKis: function(stake){
      return MonthlyKis.find({stakeId: stake._id, name:{$in:pastYearMonths}});
    }
  });
});

Meteor.publishTransformed('conference',function(){
  const currYear = moment().year();
  const currMonth = moment().month();

  const userId = this.userId;
  if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};
  
  const user = Meteor.users.findOne({_id:userId});

  const thisYear = currYear.toString();
  const thisMonth = moment.months()[currMonth];
  
  let nextMonth = currMonth + 1;
  let nextYear = thisYear;
  if (nextMonth === 13){
    nextMonth = 0;
    nextYear = moment().add(1, 'year').year().toString();
  }
  nextMonth = moment.months()[nextMonth];

  let convertsFilter = {}
  let investigatorsFilter = {}

  if (Roles.userIsInRole(user, 'office')) {
    convertsFilter = {
      $or : [
        {
          bapMonth: thisMonth,
          bapYear: thisYear
        },
        {
          bapMonth: nextMonth,
          bapYear: nextYear
        }
      ] //cannot do this to investigators because /conference requires all investigators count for each zone (last column)
    }
  } else 
  if (Roles.userIsInRole(user, 'ward')) {
    const unitId = user.profile.unit;
    convertsFilter.unitId = unitId;
    investigatorsFilter.unitId = unitId;
  } else {
    throw new Meteor.Error('unauthorized','Not allowed to access this data');
  }

  let convertsCursor = Converts.find(convertsFilter);
  let investigatorsCursor = Investigators.find(investigatorsFilter);

  return [convertsCursor, investigatorsCursor]
});

function filterStakesByRole(userId, filter){
  if (!userId){ throw new Error('userId must be defined');}

  const user = Meteor.users.findOne({_id:userId});
  if (Roles.userIsInRole(user, 'office')) {
    // return all
  } else
  if (Roles.userIsInRole(user, 'zoneLeader')) {
    const myZoneId = user.profile.zone;

    //get all stakes in a zone 
    let stakes = []
    Stakes.find({}).map(function(stake){
      const zones = stake.zones;
      for(let i = 0; i < zones.length; i++){
        let zoneId = zones[i];
        if (zoneId === myZoneId){
          stakes.push(stake._id)
        }
      }
    });
    filter._id = {$in:stakes};
  } else
  if (Roles.userIsInRole(user, 'districtLeader')) {
    
  } else
  if (Roles.userIsInRole(user, 'stakePresident')) {
    filter = {
      ...filter,
      $or : [
          {zones : user.profile.zone},
          {leader: user._id }
        ]
    };
  }
  return filter;
}

function filterProgressRecordByRole(user, filter){
  if (Roles.userIsInRole(user, 'office')) {
    // return all
  } else  
  if (Roles.userIsInRole(user, 'ward')) {
    filter.unitId = user.profile.unit;
  } else
  if (Roles.userIsInRole(user, 'stakePresident')) {
    stakesFilter = filterStakesByRole(user._id, filter);
    stakeIds = Stakes.find(stakesFilter).map(function(stake){
      return stake._id;
    });
    unitIds = Units.find({stake: {$in: stakeIds}}).map(function(unit){
      return unit._id;
    });
    filter.unitId = {$in: unitIds};
    
  } else {
    area = Areas.findOne({_id : user.profile.area});
    filter.unitId = { $in: area.units };
  }
  return filter;
}

// XXX return user not userID
function filterKisByRole(userId, filter){
  if (!userId){ throw new Error('userId must be defined');}
  const user = Meteor.users.findOne({_id:userId});

  if (Roles.userIsInRole(user,'ward')){
      filter.unitId = user.profile.unit; 
  } else {

    let areasFilter = {active: true};
    areasFilter = filterAreasByRole(userId, areasFilter);

    let areaIds = Areas.find(areasFilter).map(function(area) {
        return area._id;
    });

    filter.areaId = {
      $in: areaIds
    }
  }

  return filter;
}

// XXX return user not userID
function filterAreasByRole(userId, filter){

  if (!userId){ throw new Error('userId must be defined');}

  const user = Meteor.users.findOne({_id:userId});
  if (Roles.userIsInRole(user, 'office')){
    // return all
  } else
  if (Roles.userIsInRole(user, 'zoneLeader')) {
    const zone = user.profile.zone;

    let districts = Districts.find({
      zone: user.profile.zone
    }).map(function(district){
      return district._id;
    });

    filter = {
        ...filter,
        $or: [{ zone: zone }, {
            district: { $in: districts }
        }],
        active: true
    };
  } else 
  if (Roles.userIsInRole(user, 'districtLeader')){
    const leader = user.profile.area;
    const zone = user.profile.zone;
    const district = user.profile.district;
    
    // const zone = user.profile.zone;
    // const district = user.profile.district;

    // let districts = Districts.find({
    //   $or:[{zone: user.profile.zone},{_id:district}]
    // }).map(function(district){
    //   return district._id;
    // });

    var myDistrictId = Districts.findOne({leader: leader})._id;
    // filter.district = district;

    filter = {
      ...filter,
      $or: [
        {district: myDistrictId},
        {zone: zone},
        {_id: district}
      ],
      active: true
    }

  } else
  if (!user.roles || user.roles.length === 0){
    const area = user.profile.area;
    filter._id = area;
    filter.active = true;
  }
  return filter;
}

function thisYearStakeGoal(stake){
      const currYear = moment().year();
      let months = [];
      for (let m = 0; m < 12;m++){
        months.push(moment().month(m).format('MMM YYYY'))
      }
      const currMonth = moment().month();
      const lastMonth = moment().month(currMonth-1).format('MMM YYYY');

      //calculate monthly progress so far towards goal by all units in this stake
      let progress = 0;
      let filter = {
        stakeId:stake._id,
        name: {$in: months}
      }
      MonthlyKis.find(filter).map(function(ki){
        progress += ki.bap;
      });

      //get all units in each stake
      let unitsCursor = Units.find({stake:stake._id});
      //calculate yearly goal for all units in this stake
      let summedGoals = 0;
      unitsCursor.map(function(unit) {
          let goals = unit.baptismalGoals;
          if (goals) {
              for (let i = 0; i < goals.length; i++) {
                  let goal = goals[i];
                  if (goal.year === currYear) {
                      summedGoals += goal.goal;
                      return;
                  }
              }
          }
      });

      filter.name = lastMonth;
      let lastMonthProgress = 0;
      MonthlyKis.find(filter).map(function(ki){
        lastMonthProgress += ki.bap;
      });

      return {
        goal: summedGoals,
        progress: progress,
        lastMonthProgress: lastMonthProgress
      }
}

function thisYearUnitGoal(unit){
      const currYear = moment().year();
      const currMonth = moment().month();
      let months = [];
      for (let m = 0; m < 12;m++){
        months.push(moment().month(m).format('MMM YYYY'))
      }
      const lastMonth = moment().month(currMonth-1).format('MMM YYYY');

      //calculate monthly progress so far towards goal by this unit
      let progress = 0;
      let filter = {
        unitId:unit._id,
        name: {$in: months}
      }
      MonthlyKis.find(filter).map(function(ki){
        progress += ki.bap;
      });

      //calculate sum of goal
      let thisGoal = 0;
      let goals = unit.baptismalGoals;
      if (goals) {
          for (let i = 0; i < goals.length; i++) {
              let goal = goals[i];
              if (goal.year === currYear) {
                  thisGoal = goal.goal;
                  break;
              }
          }
      }

      //calculate last month's progress for this unit
      filter.name = lastMonth;
      const ki = MonthlyKis.findOne(filter);
      const bp = ki? ki.bap: 0;


      return {
        goal: thisGoal,
        progress: progress,
        lastMonthProgress: bp
      }
}