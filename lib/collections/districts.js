
Districts = new Mongo.Collection('districts');
Zone = 'zones'
//zoneEdit = Session.get('zoneEdit');

//  Permissions

Districts.allow({
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

var x = [];


Districts.attachSchema(new SimpleSchema({
  name: {
    type: String,
    index: true,
    unique: true,
    max: 20
  },
  
  zone: {
    type: String,
    label: "Zone"
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
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  
  areas: { 
    type: [String], //  Make this be an [Object] full of areas :)
    optional: true,
    label: "Areas"
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
    autoform: {
      type: 'hidden'
    }
  }
}));
