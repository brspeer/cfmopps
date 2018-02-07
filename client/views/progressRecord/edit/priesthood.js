Template.priesthood.onRendered(function(){
  var rec = Converts.findOne( { _id: Session.get('recordEdit')});
  if ( rec !== undefined && rec.priesthood === true && rec.sex == "Male") {
      $('#priesthood').checkbox('check');
  }
  $('#priesthood')
       .checkbox();
});