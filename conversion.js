/*//Code to convert zone field of districts to zone Id's
var zones = [];
Zones.find().forEach(function(x) {
zones.push(x.name);
});

zones.forEach(function(x) {
  var districts = [];
  Districts.find({zone: x}).forEach(function(y) {
    districts.push(y._id);
  });
  districts.forEach(function(z) {
    Districts.update({_id: z}, {$set: {zone: Zones.findOne({name: x})._id}})
  })
});

//Code ti convert zone field of areas to zone Id's
var zones = [];
Zones.find().forEach(function(x) {
zones.push(x.name);
});

zones.forEach(function(x) {
  var areas = [];
  Areas.find({zone: x}).forEach(function(y) {
    areas.push(y._id);
  });
  areas.forEach(function(z) {
    Areas.update({_id: z}, {$set: {zone: Zones.findOne({name: x})._id}})
  })
});

//Code to convert district field of areas to district Id's
var districts = [];
Districts.find().forEach(function(x) {
districts.push(x.name);
});

districts.forEach(function(x) {
  var areas = [];
  Areas.find({district: x}).forEach(function(y) {
    areas.push(y._id);
  });
  areas.forEach(function(z) {
    Areas.update({_id: z}, {$set: {district: Districts.findOne({name: x})._id}})
  })
});


//Code to converts profile.zone field of users to zone Id's
Zones.find().forEach(function(x) {
  users = [];
  Meteor.users.find({"profile.zone": x.name}).forEach(function(y) {
    users.push(y._id);
  })
  users.forEach(function(z) {
  Meteor.users.update({_id: z}, {$set: {"profile.zone": x._id} });
  });
});

//Code to convert profile.area field of users to area Id's
Areas.find().forEach(function(x) {
  users = [];
  Meteor.users.find({"profile.area": x.name}).forEach(function(y) {
    users.push(y._id);
  })
  users.forEach(function(z) {
  Meteor.users.update({_id: z}, {$set: {"profile.area": x._id} });
  });
});
//Code to remove all district leaders from being district leader
users = [];
Roles.getUsersInRole('districtLeader').forEach(function(x) {
  users.push(x._id)
});
Roles.removeUsersFromRoles(users, ['districtLeader'])

//Code to remove all zone leaders from being zone leaders
users = [];
Roles.getUsersInRole('zoneLeader').forEach(function(x) {
  users.push(x._id)
});
Roles.removeUsersFromRoles(users, ['zoneLeader'])

//Code to change leader field of districts to the id of the leader area
Districts.find().forEach(function(x) {
  var area = Areas.findOne({name: x.leader});
  Districts.update({_id: x._id}, {$set: {leader: area._id}})
});

//Code to change leader field of districts to the id of the leader area
Zones.find().forEach(function(x) {
  var area = Areas.findOne({name: x.leader});
  Zones.update({_id: x._id}, {$set: {leader: area._id}})
});*/


/*Units.find().forEach(function(x) {
  var username = x.name.replace(/\s/g, '');
  username = username.toLowerCase() + "ward";
  var password = username.slice(0, -4) + "1830";
  var zone = x.stake
  Meteor.call("createWardUser", username, password, zone)
});*/


//Code to add in heritage's old numbers for FN zone
/*var name = "Heritage";
var unitId = Units.findOne({name: "Heritage"});
var areaId = Zones.findOne({name: "Fresno North"}).leader;
var month = moment().month() - 8;
var monthString = moment.monthsShort()[month];
var year = moment().year();
var date = monthString + " " + year;
var zone = Zones.findOne({name: "Fresno North"})._id;
var district = Areas.findOne({_id: areaId}).district;

MonthlyKis.insert({
        unitName  : name,
        name : date,
        validation : (date.toString() + unitId + areaId), //  <<< Changed this!
        areaId : area._id,
        zoneId : zone,
        unitId : units[i],
        districtId : district,
        bap : 2,
        conf : 2,
        wd : 7,
        atsac : 17,
        mp : 65,
        ni : 58,
        mh  : 11,
        niM : 0,
        niFTM : 0,
        bapM : 0,
        bapFTM : 2,
        strength : "N/A",
        weakness : "N/A",
        solution  : "N/A",
});*/