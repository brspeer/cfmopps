Template.areaOld.helpers({
  isEditingArea: function(){
    return Session.get('editedAreaId') === this._id;
  },
  
  //district: Districts.find({_id: this.districtId}, {fields: 'areaDL'})
  
});

Template.areaOld.events({
  "click a.edit": function(e, tpl){
    e.preventDefault();
    Session.set('editedAreaId', this._id);
  },
 
  "submit form.form-edit": function(e, tpl){
    e.preventDefault();
 
    var areaName = tpl.$('input[name="name"]').val();
    if(areaName.length){
      Areas.update(this._id, {$set: {name: areaName}});
      Session.set('editedAreaId', null);
    }
    
    var disName = tpl.$('input[district="district"]').val();
    if(disName.length){
      Areas.update(this._id, {$set: {district: disName}});
      Session.set('editedAreaId', null);
    }
    
    var zoName = tpl.$('input[zone="zone"]').val();
    if(zoName.length){
      Areas.update(this._id, {$set: {zone: zoName}});
      Session.set('editedAreaId', null);
    }
  },
 
  "click a.cancel": function(e, tpl){
    e.preventDefault();
    Session.set('editedAreaId', null);
  },
 
  'click a.delete': function(e, tpl){
    e.preventDefault();
    Areas.remove(this._id);
  }
});