Template.rcDetailsInput.onRendered(function(){
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

Template.rcDetailsInput.helpers({
  male: function() {
     return Session.get('male');
  }
})