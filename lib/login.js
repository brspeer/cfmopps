var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
var areasList = [];

Meteor.users.allow({
  insert: function(userId){
    return userId;
  },
  update: function(userId){
    return userId;
  },
  remove: function(userId){
    return userId;
  }
})

Meteor.roles.allow({
  insert: function(userId){
    return userId;
  },
  update: function(userId){
    return userId;
  },
  remove: function(userId){
    return userId;
  }
})

AccountsTemplates.addField({
    _id: 'area',
    type: 'text',
    required: true
    //select: Areas.find().forEach(function(area) {
     //   areasList.push({text: area.name, value: area.name});
     //   return areasList;
      //})
});

AccountsTemplates.addField({
  _id: 'zone',
  type: 'text',
  required: true
});

AccountsTemplates.addFields([
  {
    _id: "username",
    type: "text",
    displayName: "username",
    required: true,
    minLength: 5
  },
  pwd
]);