Template.areas.helpers({
  isCreatingArea: function() {
    return Session.get('isCreatingArea');
  },

  areas: function() {
    return Areas.find();
  },
});

Template.areas.events({
  'click button.ui.blue.basic.button': function(e, tpl) {
    e.preventDefault();
    Session.set('isCreatingArea', true);
  },
  
  'click a.cancel': function(e, tpl) {
    e.preventDefault();
    Session.set('isCreatingArea', false);
  },

  'submit form.ui.form.segment': function(e, tpl) {
  //'submit form.new-area-form': function(e,tpl) {
    e.preventDefault();
    var areaName = tpl.$('input[name=name]').val();
    Areas.insert({
      name: areaName
    }, function(error, _id) {
      if (error) {
        alert(error);
        Session.set('isCreatingArea', true);
        Tracker.afterFlush(function() {
          tpl.$('input[name=name]').val(areaName);
        });
      }
    });
    Session.set('isCreatingArea', false);
  },

  //'click a.remove': function(e, tpl){
  //e.preventDefault();
  //Areas.remove(this._id);
  //}
});
