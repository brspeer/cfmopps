Template.formSelect.onRendered(function() {
  //This is for the dropdown which selects what district an area is in
  $('.ui.area.dropdown')
  .dropdown({
    action: 'activate',
    onChange: function(value) {
      Areas.find({zone : Session.get('zoneEdit')}).forEach(function(area){
        if (document.getElementById("mySelect" + area.name) != null) {
          var x = document.getElementById("mySelect" + area.name);
          var strOptions = x.options[x.selectedIndex].value;
          if (strOptions === value) {
            Areas.update({
              _id : area._id
            }, {
              $set: {
                district : Districts.findOne({name: value})._id           
              }
            });
            var user = Meteor.users.findOne({"profile.area" : area._id});
          Roles.removeUsersFromRoles(user._id, 'districtLeader');
          }
        }
      });
    }
  });
});

Template.formSelect.helpers({
  districtName: function() {
    return Districts.findOne({_id: this.district}).name;
  },
  
  districtsInZone: function() {
    return Districts.find( { zone: Session.get('zoneEdit')  });
  },
});