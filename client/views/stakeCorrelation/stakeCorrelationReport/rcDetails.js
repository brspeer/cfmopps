  Template.rcDetails.helpers({
    rcDetails2: function() {
    var units = [];
    var converts = [];
    var rcDetails = [];
    var stake = Stakes.findOne({zones: Meteor.user().profile.zone});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'zoneLeader'])) {
      stake = Stakes.findOne({_id: Session.get('drilldownStakeSC')});
    }
    Units.find({"stake": stake._id}).forEach(function(x) {
      units.push(x);
    });
    units.forEach(function(x) {
      //create an object for the rc numbers for each unit
      var templePercent = Math.round(Converts.find({unitId: x._id, temple: true}).count() / Converts.find({unitId: x._id, age: {$gte: "12"}}).count() * 100);
      templePercent = templePercent || 0;
      
      var convertsCompleted = [];
      Converts.find({unitId: x._id}).forEach(function(x) {
        if (x.lessons.length == 5) {
          convertsCompleted.push(x._id);
        }
      });
      convertsCompleted = convertsCompleted.length;
      convertsCompleted = convertsCompleted || 0;
      
      
      var progressed = [];
      Converts.find({unitId: x._id}).forEach(function(x) {
        if (x.lessons.length != 5 && x.progressed === true) {
          progressed.push(x._id);
        }
      });
      progressed = progressed.length;
      progressed = progressed || 0;
      
      //The code here evaluates percentages. The lines that set the var to self || 0 are for the purpose of preventing undefined being passed to the helper.
      var total = Converts.find({unitId: x._id}).count();
      var completePercent = Math.round(convertsCompleted / total * 100);
      completePercent = completePercent || 0;
      var callingPercent = Math.round(Converts.find({unitId: x._id, calling: true, age: {$gte: "18"}}).count() / Converts.find({unitId: x._id, age: {$gte: "18"}}).count() * 100);
      callingPercent = callingPercent || 0;
      var priesthoodPercent = Math.round(Converts.find({unitId: x._id, priesthood: true, age: {$gte: "12"}, sex: "Male"}).count() / Converts.find({unitId: x._id, age: {$gte: "12"}, sex: "Male"}).count() * 100);
      priesthoodPercent = priesthoodPercent || 0;
      var teacherPercent = Math.round(Converts.find({unitId: x._id, teachers: true}).count() / total * 100);
      teacherPercent = teacherPercent || 0;
      var fhPercent = Math.round(Converts.find({unitId: x._id, fh: true}).count() / total * 100);
      fhPercent = fhPercent || 0;
      var churchPercent = Math.round(Converts.find({unitId: x._id, church: true}).count() / total * 100);
      churchPercent = churchPercent || 0;
      var notCompleted = total - convertsCompleted;
      var progressedPercent = Math.round(progressed / notCompleted * 100);
      progressedPercent = progressedPercent || 0;
      
      
      var obj = 
        { name: Units.findOne({_id: x._id}).name,
         total: Converts.find({unitId: x._id}).count(),
         temple: Converts.find({unitId: x._id, temple: true}).count(),
         templeOutOf: Converts.find({unitId: x._id, age: {$gte: "12"}}).count(),
         templePercent: templePercent,
         calling : Converts.find({unitId: x._id, calling: true, age: {$gte: "18"}}).count(),
         callingOutOf : Converts.find({unitId: x._id, age: {$gte: "18"}}).count(),
         callingPercent: callingPercent,
         teacher : Converts.find({unitId: x._id, teachers: true}).count(),
         teacherPercent: teacherPercent,
         fh : Converts.find({unitId: x._id, fh: true}).count(),
         fhPercent: fhPercent,
         church: Converts.find({unitId: x._id, church: true}).count(),
         churchNames: Converts.find({unitId: x._id, church: false}),
         churchPercent: churchPercent,
         priesthood : Converts.find({unitId: x._id, priesthood: true, age: {$gte: "12"}, sex: "Male"}).count(),
         priesthoodOutOf  : Converts.find({unitId: x._id, age: {$gte: "12"}, sex: "Male"}).count(),
         priesthoodPercent : priesthoodPercent,
         nmlCompleted : convertsCompleted,
         nmlCompletedPercent : completePercent,
         progressed : progressed,
         progressedOutOf : notCompleted,
         progressedPercent : progressedPercent,
          };
      rcDetails.push(obj);
    });
    return rcDetails;
  }
  });