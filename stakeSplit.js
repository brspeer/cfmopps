
//CREATES STAKES & ASSIGNS STAKE PRESIDENTS TO THEIR STAKE
/*Zones.find().forEach(function(x) {
  var leader = Users.findOne({roles: "SP", zone: x._id})._id;
  Stakes.insert({
    name: x.name,
    zones: [x._id],
    leader: leader
  });
  //ADDS STAKEID FIELD TO ALL KIS WITH THEIR STAKE
  Kis.find().forEach(function(y) {
    var zone =  Zones.findOne({_id: y.zoneId}).name;
    var stake = Stakes.findOne({name: zone})._id;
    Kis.update({_id: y._id}, {$set: { stakeId: stake }});
  });
  MonthlyKis.find().forEach(function(z) {
    var zone = Zones.findOne({_id: z.zoneId}).name;
    var stake = Stakes.findOne({name: zone})._id;
    MonthlyKis.update({_id: z._id}, {$set: { stakeId: stake}});
  });
  //CORRECT STAKE ID FIELD OF UNITS COLLECTION
  Units.find().forEach(function(a) {
    var zone = Zones.findOne({_id: a.stake});
    var stake = Stakes.findOne({name: zone.name});
    Units.update({_id: a._id}, {$set: { stake: stake._id } });
  })
});
*/

//Need to display which stakes are in a zone. And add way to edit that.