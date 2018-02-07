Template.dashboard.helpers({
drilldownAreas: function() {
    return Areas.find({
      district: Session.get('drilldownDistrict')
    });
  }
});

Template.dashboard.onRendered(function() {
$('#drilldownArea')
    .dropdown({
      onChange: function(value) {
        Session.set('drilldownArea', value);
      }
    });
});
