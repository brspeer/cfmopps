/*Template.scUnitGuage.onRendered(function() {
  var chart = c3.generate({
    bindto: '#scUnitGuageChart',
    data: {
      columns: [
        ['Baptisms YTD', 6],
      ],
      type: 'gauge',
    },
    color: {
      pattern: ['1ca8dd', '1bc98e']
    },
    gauge: {
      min: 0,
      max: 12,
    },
    size: {
      height: 320,
    },
    width: 10,
  })
});

Tracker.autorun(function() {
  if (Session.get("zoneEdit") === "Hanford") {
    var chart = c3.generate({
      bindto: '#scUnitGuageChart',
      data: {
        columns: [
          ['Baptisms YTD', 18],
        ],
        type: 'gauge',
      },
      color: {
        pattern: ['1ca8dd', '1bc98e']
      },
      gauge: {
        min: 0,
        max: 24,
      },
      size: {
        height: 320,
      },
      width: 10,
    })
  }
});

Template.scUnitGuage.helpers({

  zoneEdit: function() {
    return Session.get('zoneEdit');
  },

  areaEdit: function() {
    return Session.get('areaEdit');
  }
});*/