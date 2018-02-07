Investigators = new Mongo.Collection('investigators');

// Permissions
Investigators.allow({
  insert: function (userId){
    return userId;
  },
  update: function (userId){
    return userId;
  },
  remove: function (userId){
    return userId;
  }
  
});

// Schemas
Investigators.attachSchema(new SimpleSchema({
  areaId: {
    type: String
  },
  zoneId: {
    type: String
  },
  unitId: {
    type: String
  },
  districtId: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  age: {
    type: String
  },
  sex: {
    type: String
  },
  lessons: {
    type: [String]
  },
  fellowship: {
    type: String
  },
  timesAtSac: {
    type: String
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  bapMonth: {
    type: String
  },
  bapYear: {
    type: String
  },
  bapDay: {
    type: String
  },
  conMonth: {
    type: String
  },
  conYear: {
    type: String
  },
  conDay: {
    type: String
  },
  helpNeeded: {
    type: String
  },
  solid: {
    type: Boolean
  }
}));