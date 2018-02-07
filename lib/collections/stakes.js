Stakes = new Mongo.Collection('stakes');

//  Permissions

Stakes.allow({
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



//  Schemas

Stakes.attachSchema(new SimpleSchema({
  name: {
    type: String,
    index: true,
    unique: true,
    max: 20
  },
  
  zones: {
    type: [String],
    label: "Districts",
    optional: true
  },
  
  leader: {
    type: String,
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
    }
  }
}));