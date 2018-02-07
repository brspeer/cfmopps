MonthlyKis = new Mongo.Collection('monthlykis');

MonthlyKis.allow({
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

MonthlyKis.attachSchema(new SimpleSchema({
  unitName: {
    type: String
  },
  name: {
    type: String,
    label: "The date for the KIs",
    unique: false
  },
  
  validation: {
    type: String,
    unique: true
  },
  
  areaId: {
    type: String
  },
  districtId: {
    type: String
  },
  zoneId: {
    type: String
  },
  unitId:{
    type: String
  },
  stakeId:{
    type: String
  },
  bap: {
    type: Number
  },
  conf: {
    type: Number
  },
  wd: {
    type: Number
  },
  atsac: {
    type: Number
  },
  mp: {
    type: Number
  },
  ni: {
    type: Number
  },
  mh: {
    type: Number
  },
  niM: {
    type: Number
  },
  niFTM: {
    type: Number
  },
  bapM: {
    type: Number
  },
  bapFTM: {
    type: Number
  },
  strength: {
    type: String
  },
  weakness: {
    type: String
  },
  solution: {
    type: String
  },
  goal: {
    type: Number,
    optional: true
  },
  
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    },
  }
}));