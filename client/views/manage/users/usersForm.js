Template.usersForm.onRendered(function(){
  $('.ui.search.selection.dropdown')
  .dropdown()
  ;
  $('#miss')
  .checkbox({
    onChecked: function() {
      console.log("true");
      $('#off').checkbox('uncheck');
      $('#adm').checkbox('uncheck');
      $('#stk').checkbox('uncheck');
      $('#wml').checkbox('uncheck');
      Session.set('isMissAcct', true);
    },
    onUnchecked: function() {
      console.log("false");
      Session.set('isMissAcct', false);
    }
  });
  $('#off')
  .checkbox({
    onChecked: function() {
      console.log("true");
      $('#miss').checkbox('uncheck');
      $('#adm').checkbox('uncheck');
      $('#stk').checkbox('uncheck');
      $('#wml').checkbox('uncheck');
      Session.set('isOffAcct', true);
    },
    onUnchecked: function() {
      console.log("false");
      Session.set('isOffAcct', false);
    }
  });
  $('#adm')
  .checkbox({
    onChecked: function() {
      console.log("true");
      $('#miss').checkbox('uncheck');
      $('#off').checkbox('uncheck');
      $('#stk').checkbox('uncheck');
      $('#wml').checkbox('uncheck');
      Session.set('isAdmAcct', true);
    },
    onUnchecked: function() {
      console.log("false");
      Session.set('isAdmAcct', false);
    }
  });
  $('#stk')
  .checkbox({
    onChecked: function() {
      console.log("true");
      $('#miss').checkbox('uncheck');
      $('#off').checkbox('uncheck');
      $('#adm').checkbox('uncheck');
      $('#wml').checkbox('uncheck');
      Session.set('isStkAcct', true);
    },
    onUnchecked: function() {
      console.log("false");
      Session.set('isStkAcct', false);
    }
  });
  $('#wml')
  .checkbox({
    onChecked: function() {
      console.log("true");
      $('#miss').checkbox('uncheck');
      $('#off').checkbox('uncheck');
      $('#adm').checkbox('uncheck');
      $('#stk').checkbox('uncheck');
      Session.set('isWMLAcct', true);
    },
    onUnchecked: function() {
      console.log("false");
      Session.set('isWMLAcct', false);
    }
  });
});

Template.usersForm.helpers({
  zones: function(){
    return Zones.find();
  },  
  areas: function(){
    return Areas.find({zone: Session.get('zoneEdit')});
  },  
  users: function(){
    return Meteor.users.find();
  },  
  units: function(){
    return Units.find({stake : Session.get('zoneEdit')});
  },
  createdAtFormatted: function (user) {
    return user.createdAt.format('MM/DD/YYYY, HH:MM');
  },
  isCreatingUser: function(){
    return Session.get('isCreatingUser');
  },
  isMissAcct: function() {
    return Session.get('isMissAcct');
  },
  isOffAcct: function() {
    return Session.get('isOffAcct');
  },
  isAdmAcct: function() {
    return Session.get('isAdmAcct');
  },
  isStkAcct: function() {
    return Session.get('isStkAcct');
  },
  isWMLAcct: function() {
    return Session.get('isWMLAcct');
  }
});


Template.usersForm.events({
  "click button.ui.positive.button.addUser": function(e,tpl){
    e.preventDefault();
    var username = document.getElementById("user name").value;
    var password = document.getElementById("password").value;
    var area = document.getElementById("area").value;
    var zone = Areas.findOne({name : area}).zone;
    var passwordCon = document.getElementById("confirm password").value;
    if (password === passwordCon){
      Meteor.call("createUsers", username, password, area, zone);
      if($('#miss').is(':checked')){
        console.log("missionary!");
      }
      if($('#off').is(':checked')){
        console.log("office!");
      }
      if($('#adm').is(':checked')){
        console.log("administrator!");
      }
      if($('#stk').is(':checked')){
        console.log("stake president!");
      }
      if($('#wml').is(':checked')){
        console.log("Ward Mission Leader!");
      }
      document.getElementById("user name").value = "";
      document.getElementById("password").value = "";
      document.getElementById("confirm password").value = "";
      document.getElementById("area").value = "";
      document.getElementById("confirm password").value = "";
    } else {
      alert("Password and Password Confirmation don't match");
    }
  }
})