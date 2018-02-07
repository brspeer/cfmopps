Template.layout.events({
  //sidenav events
  'click a.sidenav.item': function() {
    $('.ui.sidebar')
    .sidebar('toggle');
  //end sidenav events
}
});

Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.registerHelper('not', function(a) {
  return !a;
});

Template.registerHelper('notEquals', function(a, b) {
  return a !== b;
});

Template.registerHelper('or', function(a, b){
  return a || b;
});

Template.registerHelper('orFive', function(a, b, c, d, e){
  return a || b || c || d || e;
});

Template.registerHelper('orNot', function(a, b){
  return !a || !b;
});