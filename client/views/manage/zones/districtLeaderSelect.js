Template.districtLeaderSelect.onRendered(function(){
  $('.district.ui.dropdown')
    .dropdown({
      action: 'activate',
      onChange: function(value) {
        var x = Areas.findOne({name : value});
        var y = Districts.findOne({_id : x.district});
        Districts.update({
          _id : y._id
        },{
          $set:{
            leader : x._id
          }
        });
        var user = Meteor.users.findOne({
          "profile.area" : x._id
        });
        

        Roles.addUsersToRoles(user._id, 'districtLeader');
        var areasInDis = Areas.find({district : x.district});
        Meteor.users.find({"profile.zone": Session.get('zoneEdit')}).forEach(function(a) {
          areasInDis.forEach(function(b) {
            if (b._id === a.profile.area && a._id != user._id) {
              Roles.removeUsersFromRoles(a._id, 'districtLeader');
            }
          })
        })
      }
    });
});

Template.districtLeaderSelect.helpers({
  currentZone: function() {
    return Session.get('zoneEdit');
  },
  leaderName: function() {
    return Areas.findOne({_id: this.leader}).name;
  },
  areas: function(){
    return Areas.find({zone: Session.get('zoneEdit'), active: true});
  },

});