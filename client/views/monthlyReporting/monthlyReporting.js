Template.monthlyReporting.helpers({
  // units: function()  {
  //   return Areas.findOne({_id: Meteor.user().profile.area}).units;
  // },
  
  // zones: function(){
  //   return Zones.find();
  // },
  
  // areas: function(){
  //   return Areas.find({_id: Meteor.user().area})
  // },
  
  // districts: function(){
  //   return Districts.find();
  // },
  
  zoneEditRep: function(){
    return Session.get('zoneEditRep');
  },
  
  disEdit: function(){
    return Session.get('disEdit');
  },
  
  areaEdit: function(){
    return Session.get('areaEdit');
  },
  // districtsInZone: function() {
  //   return Districts.find( { zone: Session.get('zoneEditRep') } );
  // },
  unitsInArea: function() {
    var x = [];
    var area = Meteor.user().profile.area;
    var y = Areas.findOne({_id : area});
    for (i=0; i < y.units.length; i++){
      var m = Units.findOne({_id : y.units[i]});
      x.push(m.name);
    }
    return x;
  },
  date: function() {
    return moment().startOf('month').subtract(1, 'months').format("MMMM");
  },
  goalDate: function() {
    return moment().startOf('month').format("MMMM");
  },
  currentArea: function() {
    return Areas.findOne({_id: Meteor.user().profile.area}).name
  }
});

Template.monthlyReporting.events({
  "click div.item.zoneRep.name": function(e,tpl){
    e.preventDefault();
    Session.set('zoneEditRep', this.name);
    Session.set('disEdit', null)
  },
  
  "click div.item.disRep.name": function(e,tpl){
    e.preventDefault();
    Session.set('disEdit', this.name);
  },
  
  "click button.ui.positive.button.ki.submit": function() {
    event.preventDefault();
    var goal = document.getElementById("zbg")
    if (document.getElementById('zbg') === null) {
      goal = null
    } else {
      goal = goal.value
    }
    var area = Areas.findOne({_id : Meteor.user().profile.area});
    var zone = area.zone;
    var district = area.district;
    var units = area.units;
    var year = moment().year();
    var month = moment().month() - 1;
    if (moment().month() === 0) {
      year = year - 1;
      month = 11;
    }
    var monthString = moment.monthsShort()[month];
    var date = monthString + " " + year;
    for (i=0; i<units.length; i++){
    var name = Units.findOne({_id : units[i]}).name;
      if ((document.getElementById("ni" + name).value - document.getElementById("nim" + name).value) < 0 || 
         (document.getElementById("bap" + name).value - document.getElementById("bapm" + name).value) < 0) {
        alert("For the " + name + " unit: You could not have found or baptized more investigators through members than the total number you found or baptized. Try again.");
        break;
      } else {
      var id = MonthlyKis.insert({
        unitName  : name,
        name : date,
        validation : (date.toString() + units[i] + area._id), //  <<< Changed this!
        areaId : area._id,
        unitId : units[i],
        zoneId : zone,
        stakeId: Units.findOne({_id: units[i]}).stake,
        districtId : district,
        bap : document.getElementById("bap" + name).value,
        conf : document.getElementById("conf" + name).value,
        wd : document.getElementById("wd" + name).value,
        atsac : document.getElementById("sac" + name).value,
        mp : document.getElementById("mp" + name).value,
        ni : document.getElementById("ni" + name).value,
        mh  : document.getElementById('mh' + name).value,
        niM : document.getElementById("nim" + name).value,
        niFTM : (document.getElementById("ni" + name).value - document.getElementById("nim" + name).value),
        bapM : document.getElementById("bapm" + name).value,
        bapFTM : (document.getElementById("bap" + name).value - document.getElementById("bapm" + name).value),
        strength : (document.getElementById("strength" + name).value),
        weakness : (document.getElementById("weakness" + name).value),
        solution  : (document.getElementById("solution" + name).value),
        goal      : goal
        
      });
      // var ki = MonthlyKis.findOne({validation : (date.toString() + units[i] + area._id)});
      //Areas.update({_id : area._id}, {$addToSet : {ki : ki._id}});
      //Units.update({_id : units[i]}, {$addToSet : {kis : ki._id}});
      //Districts.update({_id : district._id}, {$addToSet : {ki : ki._id}});
      //Zones.update({_id : zone._id}, {$addToSet : {ki : ki._id}});
      if (i == units.length - 1) {
        alert('Thank you, your numbers have been submitted successfully!');
        document.getElementById("kiForm").reset(); 
      }     
      }
    }
  }});