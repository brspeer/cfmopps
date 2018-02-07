Template.weeklyReporting.helpers({
  getKey: function(obj, key){
    return obj[key];
  },
  date: function() {
    return moment().startOf('week').format("MMMM DD, YYYY");
  },
  unitsInZone: function() {

    const user = Meteor.user();
    const myZoneId = user.profile.zone;

    //get all stakes in a zone 
    let stakes = []
    Stakes.find({}).map(function(stake){
      const zones = stake.zones;
      for(let i = 0; i < zones.length; i++){
        let zoneId = zones[i];
        if (zoneId === myZoneId){
          stakes.push(stake._id)
        }
      }
    });
    
    if (stakes.length > 0){
      //get all units in each stake
      let unitsCursor = Units.find({stake:{$in:stakes}});

      //get only units that don't have goals for this year
      const currYear = moment().year();
      let unitsToUpdate = [];
      unitsCursor.map(function(unit) {
          const goals = unit.baptismalGoals;
          if (goals) {
              for (let i = 0; i < goals.length; i++) {
                  let goal = goals[i];
                  if (goal.year === currYear) {
                      return;
                  }
              }
          }
          unitsToUpdate.push(unit);
      });
      Template.instance().unitsToUpdate = unitsToUpdate;
      return unitsToUpdate;
    }
  },
  'isZoneLeader':function(){
    return Roles.userIsInRole(Meteor.userId(),['zoneLeader']);
  }
});

Template.weeklyReporting.events({

    "submit #kiForm": function(event) {
        event.preventDefault();

        let currData = Template.currentData();

        //get jsh
        const myArea = currData.myArea;
        let jsh = null;
        if (!myArea.thisWeekJSH){
          jsh = {
            litw: document.getElementById('litw').value,
            hours: document.getElementById("jsh").value
          }
        }

        //get kis to submit
        let kis = [];
        const units = currData.unitsInArea;
        const indicators = currData.indicators;
        for (i in units) {
            let unit = units[i];
            if (!unit.thisWeekKI){
              var ki = {
                unitId: unit._id
              }
              for (i in indicators){
                if (indicators[i].input){
                  let key = indicators[i].key;
                  let value = document.getElementById(key+"-" + unit._id).value
                  ki[key] = parseInt(value);
                }
              }

              if (ki.bap < ki.bapM) {
                sAlert.error(unit.name + " unit: You could not have baptized more investigators through members than the total number you baptized. Try again.");
                return;
              } else {
                ki["bapFTM"] = ki.bap - ki.bapM;
              }

              if (ki.ni < ki.niM) {
                sAlert.error(unit.name + " unit: You could not have found more investigators through members than the total number you found. Try again.");
                return;
              } else {
                ki["niFTM"] = ki.ni - ki.niM;
              }
              kis.push(ki);
            }
        }
        // submit kis and jsh
        if (kis.length > 0 || jsh){
          Meteor.call("Kis.insertWeeklyReport", kis, jsh, function(err,res){
            if (err){
              sAlert.error(err.reason);
            } else {
              sAlert.success("Thank you, your numbers have been submitted successfully!");
            }
          });
        } else {
          sAlert.warning("No weekly report has been submitted")
        }

        // submit goals
        let unitsToUpdate = Template.instance().unitsToUpdate;
        if (unitsToUpdate){
          let goals = [];
          const year = moment().year();
          for (let i = 0; i < unitsToUpdate.length; i++) {
              let unit = unitsToUpdate[i];
              let goal = $("#goal_" + unit._id).val();
              if (goal) {
                goals.push({ unitId: unit._id, year: year, goal: goal })
              }
          }
          if (goals.length > 0){
            Meteor.call("addYearlyGoal", goals, function(err) {
                if (err) {
                    sAlert.error(err.reason);
                } else {
                    sAlert.success("Updated yearly goals successfully.")
                }
            });
          }
        }

    }
});

