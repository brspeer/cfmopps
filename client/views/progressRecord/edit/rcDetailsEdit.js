Template.rcDetailsEdit.onRendered(function(){
  var rec = Converts.findOne( { _id: Session.get('recordEdit')});
  if ( rec !== undefined && rec.temple === true) {
      $('#temple').checkbox('check');
    }
  if ( rec !== undefined && rec.calling === true) {
      $('#calling').checkbox('check');
    }
  if ( rec !== undefined && rec.teachers === true) {
      $('#teachers').checkbox('check');
    }
  if ( rec !== undefined && rec.church === true) {
      $('#church').checkbox('check');
    }
  if ( rec !== undefined && rec.fh === true) {
      $('#fh').checkbox('check');
    }
  if ( rec !== undefined && rec.progressed === true) {
      $('#progressed').checkbox('check');
    }
  $('#temple')
          .checkbox();
  $('#calling')
        .checkbox();
  $('#teachers')
          .checkbox();
  $('#fh')
          .checkbox();
  $('#church')
          .checkbox();
  $('#progressed')
          .checkbox();
  Session.set('male', document.getElementById('sex').value == "Male" && document.getElementById('age').value >= 12)
});

Template.rcDetailsEdit.helpers({
  male: function() {
    return Session.get('male');
  }
});