Meteor.startup(function () {
  if (Meteor.settings.public.isProduction){
    process.env.MAIL_URL = "smtp://postmaster%40mg.cfmopps.com:california1830@smtp.mailgun.org:587";
  }
  
  if (Meteor.users.find({username: "Office"}).count() === 0){
    
    var leader = Accounts.createUser({
      username: "Office",
      password: 'office1830'
    });
    Roles.addUserToRoles(this._id, 'office');
    // Create some areas
    [
      {
        name: "Hanford 1",
        districtId: null,
        leader: leader
      },
      {
        name: "Hanford 2",
        districtId: null,
        leader: leader
      },
      {
        name: "Corcoran",
        districtId: null,
        leader: leader
      },
      {
        name: "Lemoore Spanish",
        districtId: null,
        leader: leader
      }
    ].forEach(function(area){
      Areas.insert(area);
    });

    // Create a district
    var area1 = Areas.find().fetch()[0];
    var area2 = Areas.find().fetch()[1];
    var area3 = Areas.find().fetch()[2];
    var areaDL = Areas.find().fetch()[3];
    
    var district = {
      leader: areaDL,
      createdAt: new Date(),
      areas: [
        {name: area1.name, _id: area1._id},
        {name: area2.name, _id: area2._id},
        {name: area3.name, _id: area3._id},
        {name: areaDL.name, _id: areaDL._id}
      ]
    };
   
    districtId = Districts.insert(district);
    
    Areas.update({_id: area1._id}, {$addToSet: { districtId: districtId}});
    Areas.update({_id: area2._id}, {$addToSet: { districtId: districtId}});
    Areas.update({_id: area3._id}, {$addToSet: { districtId: districtId}});
    Areas.update({_id: areaDL._id}, {$addToSet: { districtId: districtId}});
  }
});