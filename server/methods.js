Meteor.methods({
  
  setPassword: function (id, password) {
    Accounts.setPassword(id, password);
  },
  
  truncate: function (str) {
    function makeString(object) {
    if (object == null) return '';
    return String(object);
    }
    function truncate(str, length, truncateStr) {
    str = makeString(str);
    truncateStr = truncateStr || '...';
    length = ~~length;
    return str.length > length ? str.slice(0, length) + truncateStr : str;
    }
  },
  
  updateWOID: function (areaId, oldId, newId) {
   Areas.update({ _id: areaId, units: oldId }, { $set: { "units.$" : newId } } )

    
  },
  
  email: function (to, from, subject, text) {
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    // don’t allow sending email unless the user is logged in
    if (!Meteor.user())
      
      throw new Meteor.Error("403", 
  "The user must be logged in to send an email");

    // and here is where you can throttle the number of emails this user
    // is allowed to send per day

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  },
  
  changeDistrictField: function(dis) {
    Areas.update({ district: dis }, {$set: {district: null}}, {multi: true});
  },
  
  createMissUser: function(username, password, area, zone) {
    var i = Accounts.createUser({
        username: username,
        password: password,
        profile: {
          area : area,
          zone : zone
        }
    });
    return i;
    //Roles.addUsersToRoles(i._id, 'missionary');
  },
  
  createWardUser: function(username, password, stake) {
    var i = Accounts.createUser({
        username: username,
        password: password,
        profile: {
          stake : stake
        }
    });
    //Roles.addUsersToRoles(i._id, 'ward');
    return i;
    
  },
  
  createWMLUser: function(username, password, unit, stake){
    var i = Accounts.createUser({
        username: username,
        password: password,
        profile: {
          unit : unit,
          stake : stake
        }
    });
  },
  
  createStkPrsUser: function(username, password, stake){
    var i = Accounts.createUser({
        username: username,
        password: password,
        profile: {
          stake : stake
        }
    });
  },
  
  createAdminUser: function(username, password){
    var i = Accounts.createUser({
        username: username,
        password: password
    });
  },
  
  findUserByArea: function(name){
    return Meteor.users.find({"profile" : {"area" : name}});    
  },

  // //if all are complete for a district (or something like that)
  // afterWeeklyReport: 

  
  //addToRole: function(user, role){
  //  Roles.addUsersToRoles(user, role);
  //}
});