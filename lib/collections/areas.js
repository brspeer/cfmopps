Areas = new Mongo.Collection('areas');
//Sortable.collections = 'areas';

//  Permissions
Areas.allow({
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
Areas.attachSchema(new SimpleSchema({
  name: {
    type: String,
    unique: true,
    max: 20
  },
  
  units: {
    type: [String],
    label: "Unit ids this area covers",
    defaultValue: [],
    optional: true
  },
  
  ki: {
    type: [String],
    label: "KI ids that are linked to this area",
    optional: true,
    defaultValue: [],
    unique: false,
  },
  
  district: {
    type: String,
    label: "District",
    optional: true
  },
  
  zone: {
    type: String,
    label: "Zone",
  },
    
  order: {
    type: Number,
    label: "Order for the Sortable Package",
    optional: true,
  },
  
  active: {
    type: Boolean,
    label: "Whether this area is active or not",
    defaultValue: true
  },
  
  phone: {
    type: String
  },

 /* createdAt: {
    type: Date,
    autoValue: new Date(),
    optional: true,
    autoForm: {
      type: 'hidden'
    }
  }*/
  
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

