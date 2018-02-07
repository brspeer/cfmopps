Template.progressRecord.onRendered(function() {
  $('select.dropdown')
  .dropdown();
  $('#drilldownZoneSC')
    .dropdown({
      onChange: function(value) {
        Session.set('drilldownZoneSC', value);
        Session.set('drilldownUnitPR', null);
      }
    });
  $('#drilldownUnitPR')
    .dropdown({
      onChange: function(value) {
        Session.set('drilldownUnitPR', value);
      }
    });
  
  $('.ui.fitted.checkbox').checkbox();
  $('#selectUnit')
    .dropdown({
      onChange: function(value) {
        Session.set('unit', Units.findOne({name: value})._id);
      }
    });
});

Template.progressRecord.helpers({
    zones: function() {
    return Zones.find()
  },
    trunc: function(x, num) {
    //code used to truncate the help needed strings the pr displays
    var yourString = x; //replace with your string.
    var maxLength = num // maximum number of characters to extract
    
    //checks to see if your string needs to be truncated
    if (yourString.length <= maxLength) {
      return yourString
    } else {
    //trim the string to the maximum length
    var trimmedString = yourString.substr(0, maxLength);

    //re-trim if we are in the middle of a word
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
      return trimmedString + "...";
    }
    },
  addRec: function() {
    return Session.get('addRec');
  },
  editRec: function() {
    return Session.get('editRec');
  },
  units: function() {
    var area = Areas.findOne({_id : Meteor.user().profile.area});
    return Units.find( { _id: { $in: area.units } } );
  },
  unitsDrilldown: function() {
    var stake = Stakes.findOne({zones: Meteor.user().profile.zone});
    var area = Areas.findOne({_id : Meteor.user().profile.area});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'stakePresident'])) {
      if (Roles.userIsInRole(Meteor.user(), 'office')) {
        stake = Stakes.findOne({zones: Session.get('drilldownZoneSC')});
      }
      if (Roles.userIsInRole(Meteor.user(), 'stakePresident')) {
        stake = Stakes.findOne( { leader: Meteor.user()._id } );
      }
      return Units.find({stake: stake._id});
    } else {
    return Units.find( { _id: { $in: area.units } } );
    }
  },
  investigators: function() {
    if (Roles.userIsInRole(Meteor.user(), 'ward')) {
      return Investigators.find({unitId: Meteor.user().profile.unit})
    } else {
    if (Session.get('drilldownUnitPR') != null) {
      var id = Session.get('drilldownUnitPR');
        return Investigators.find({unitId: id});
    } else {
    var zone = Zones.findOne({_id: Meteor.user().profile.zone});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'stakePresident'])) {
      if (Roles.userIsInRole(Meteor.user(), 'office')) {
        zone = Zones.findOne({_id: Session.get('drilldownZoneSC')});
      }
      return Investigators.find({zoneId: zone._id});
    } else {
    var area = Areas.findOne({_id : Meteor.user().profile.area});
    if (Session.get('unit') == null || area.units.length < 1) {
      return Investigators.find(  {unitId: { $in: area.units }  });
    } else {
        return Investigators.find(  {unitId: Session.get('unit')  });
    }
    }
    }
    }
  },
  convert: function() {
    if (Roles.userIsInRole(Meteor.user(), 'ward')) {
      return Converts.find({unitId: Meteor.user().profile.unit})
    } else {
    if (Session.get('drilldownUnitPR') != null) {
      var id = Session.get('drilldownUnitPR');
        return Converts.find({unitId: id});
    } else {
    var zone = Zones.findOne({_id: Meteor.user().profile.zone});
    if (Roles.userIsInRole(Meteor.user(), ['office', 'stakePresident'])) {
      if (Roles.userIsInRole(Meteor.user(), 'office')) {
        zone = Zones.findOne({_id: Session.get('drilldownZoneSC')});
      }
      return Converts.find({zoneId: zone._id});
    } else {
    var area = Areas.findOne({_id : Meteor.user().profile.area});
    if (Session.get('unit') == null || area.units.length < 1) {
      return Converts.find(  {unitId: { $in: area.units }  });
    } else {
        return Converts.find(  {unitId: Session.get('unit')  });
    }
    }
    }
    }
  },
  multipleUnits: function() {
    var area = Areas.findOne({_id : Meteor.user().profile.area});
    if (area.units.length > 1) {
      return true
    } else {
      return false
    }
  },
});

Template.progressRecord.events({
  'click button.addRec.ui.basic.button': function(){
    Session.set('addRec', true);
  },
  
  /*'click a.inv.remove.record': function() {
    //Code to open the edit modal/view
    event.preventDefault();
    var r = confirm("Are you sure you?");
    if (r === true) {
      Investigators.remove(this._id);
    } else {}
  },
  
  'click a.rc.remove.record': function() {
    //Code to open the edit modal/view
    event.preventDefault();
    var r = confirm("Are you sure you?");
    if (r === true) {
      Converts.remove(this._id);
    } else {}
  },*/
  
  'click a.expand.record': function() {
    var height = $(window).scrollTop();
    Session.set('thisRec', this._id);
    
    Session.set('editRec', true);
    Session.set('recordEdit', null);
    Session.set('recordEdit', this._id);
    $(window).scrollTop(75);
    Session.set('scrollHeight', height);
  }
});