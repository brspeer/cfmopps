Template.districts.onRendered(function(){
  dragula([document.querySelector('#dragList1'), document.querySelector('#dragList2'), document.querySelector('#dragList3')])
});

Template.districts.helpers({
  districts: function(){
    return Districts.find();
  },
  
  // areas: function(){
  //   return Areas.find();
  // },
  
  // zones: function(){
  //   return Zones.find();
  // },
  
  isCreatingDistrict: function(){
    return Session.get('isCreatingDistrict');
  }
});

Template.districts.events({
  "click button.ui.blue.basic.button": function(e, tpl){
    e.preventDefault();
    Session.set('isCreatingDistrict', true);
  },
  
  "click a.cancel": function(e, tpl){
    e.preventDefault();
    Session.set('isCreatingDistrict', false);
  },
  /*
  "submit form.create-district": function(e, tpl){
    e.preventDefault();
    
    var areaDL = {
      id: tpl.$("select[name=areaDL]").val(),
      name: tpl.$("select[name=areaDL] option:selected").text()
    }
    
    var area1 = {
      _id: tpl.$("select[name=areaOne]").val(),
      name: tpl.$("select[name=areaOne] option:selected").text(),
    }
    
    var area2 = {
      _id: tpl.$("select[name=areaTwo]").val(),
      name: tpl.$("select[name=areaTwo] option:selected").text()
    }
    
    var area3 = {
      _id: tpl.$("select[name=areaThree]").val(),
      name: tpl.$("select[name=areaThree] option:selected").text()
    }
    
    var district = {
      createdAt: new Date(),
      name: name,
      areas: [areaDL, area1, area2, area3]
    }
    
    var districtId = Districts.insert(district);
    
    Areas.update({_id: areaDL._id}, {$set: {districtId: districtId}});
    Areas.update({_id: areaDL._id}, {$addToSet: {districtname: areaDL.name}});
    Areas.update({_id: area1._id}, {$set: {districtId: districtId}});
    Areas.update({_id: area1._id}, {$addToSet: {districtname: areaDL.name}});
    Areas.update({_id: area2._id}, {$set: {districtId: districtId}});
    Areas.update({_id: area3._id}, {$set: {districtId: districtId}});
    
    Session.set('isCreatingDistrict', false);
  }*/
})