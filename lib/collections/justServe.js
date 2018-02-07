JustServeHours = new Mongo.Collection('justservehours');

JustServeHours.allow({
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

JustServeHours.attachSchema(new SimpleSchema({
  areaName: {
    type: String,
  },
  validation: {
    type: String,
    unique: true,
    optional: true,
  },
  date: {
    type: String,
  },
  litw: {
    type: String,
  },
  hours: {
    type: String,
  },
  
  zoneId: {
    type: String,
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