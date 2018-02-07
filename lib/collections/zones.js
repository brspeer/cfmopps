Zones = new Mongo.Collection('zones');

//  Permissions

Zones.allow({
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

Zones.attachSchema(new SimpleSchema({
  name: {
    type: String,
    index: true,
    unique: true,
    max: 20
  },
  
  districts: {
    type: [String],
    label: "Districts",
    optional: true
  },
  
  ki: {
    type: [String],
    label: "KI ids that are linked to this area",
    optional: true,
    defaultValue: [],
    unique: false,
  },
  
  leader: {
    type: String,
    label: "Zone Leader Area",
    optional: true
  },
  
  areas: {
    type: [String],
    label: "Areas",
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