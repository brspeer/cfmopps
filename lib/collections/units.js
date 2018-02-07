Units = new Mongo.Collection('units');

Units.allow({
  insert: function(userId){
    return userId;
  },
  update: function(userId){
    return userId;
  },
  remove: function(userId){
    return userId;
  }
});

Units.attachSchema(new SimpleSchema({
  name: {
    type: String,
    unique: true,
    max: 20
  },
  
  stake: {
    type: String,
    label: "The Stake This Unit Is Located In",
  },
  baptismalGoals: {
    type: [Object],
    label: "Unit Yearly Batismal Goals",
    optional: true,
    defaultValue: []
  },
  'baptismalGoals.$.year': {
    type: Number,
  },
  'baptismalGoals.$.goal': {
    type: Number,
  }
}));

if (Meteor.isServer){

  Meteor.methods({
    // goals is an array of {unitId, goal, year} for new goals for different units
    'addYearlyGoal':function(goals){
      //check user Id
      if (!Meteor.userId()){throw new Meteor.Error("not-logged-in","Unauthorized action")}

      for (i in goals){
        let unitId = goals[i].unitId;
        let year = goals[i].year;
        let goal = goals[i].goal;

        let unit = Units.findOne({_id:unitId});
        if (!unit){throw new Meteor.Error("invalid-input","invalid unitId ["+unitId+"]")}

        //check that goal for year has not already been added
        let currGoals = unit.baptismalGoals;
        if (currGoals){
          _.each(currGoals,function(goal){
            if (goal.year === year){
              throw new Meteor.Error("invalid-input","year goal for [" + unit.name + "] already added");
            }
          });
          Units.update({ _id: unitId }, { $push: { baptismalGoals: { year, goal } } });
        } else {
          Units.update({ _id: unitId }, { $set: { baptismalGoals: [ {year, goal} ] } });
        }
      }
    },
    'mergeUnits': function(oldUnitId, newUnitId){
      
      var newUnit = Units.findOne({_id: newUnitId});
      var oldUnit = Units.findOne({_id: oldUnitId});

      //Move any Key Indicators (weekly & monthly) with that unitId and change the defined "Unit Name"
      MonthlyKis.find({unitId: oldUnit._id}).forEach(function(x) {
        MonthlyKis.update({_id: x._id}, {$set: {unitId: newUnit._id, unitName: newUnit.name } })
      });
      Kis.find({unitId: oldUnit._id}).forEach(function(y) {
        Kis.update({_id: y._id}, {$set: {unitId: newUnit._id}});
      });
      
        
      //Updates unit field of areas which have that unit listed.
      Areas.find().forEach(function(z) {
        var index = z.units.indexOf(oldUnit._id);
        if (index !== -1) {
          Meteor.call("updateWOID", z._id, oldUnit._id, newUnit._id)
          }
      });
      
      //Updates converts which are assigned to that unit
      Converts.find({unitId: oldUnit._id}).forEach(function(a) {
        Converts.update({_id: a._id}, {$set: {unitId: newUnit._id} })
      });
      
      //Updates investigators which are assigned to that unit
      Investigators.find({unitId: oldUnit._id}).forEach(function(b) {
        Investigators.update({_id: b._id}, {$set: {unitId: newUnit._id} })
      });
      
      
      //Remove the unit
      Units.remove({_id: oldUnit._id});
    }
  })
}