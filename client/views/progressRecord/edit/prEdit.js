Template.prEdit.onRendered(function(){
  var inv = Investigators.findOne( { _id: Session.get('recordEdit')});
  if ( inv !== undefined && inv.solid === true) {
      $('#solid').checkbox('check');
    }
   $('#solid')
          .checkbox();
  $('.age.ui.dropdown')
    .dropdown({
      action: 'activate',
        });
  $('.date.ui.compact.selection.dropdown')
    .dropdown({
      action: 'activate',
        });
  $('.sex.ui.dropdown')
    .dropdown({
      action: 'activate',
      onChange: function(value) {
        if (value == 'Male') {
          Session.set('male', true)
        } else {
          Session.set('male', false);
        }
      }
        });
  $('.units.ui.dropdown')
    .dropdown({
      action: 'activate',
        });
  $('.bap.ui.toggle.checkbox')
    .checkbox({
      onChecked: function(){
        Session.set('baptized', true);
      },
      onUnchecked: function(){
        Session.set('baptized', false);
      }
  });
  var lessons = "lessons"
  if (Investigators.findOne( { _id: Session.get('recordEdit') } ) !== undefined) {
      lessons = Investigators.findOne( { _id: Session.get('recordEdit') } ).lessons;
    } else {
      Session.set('baptized', true);
      lessons =  Converts.findOne( { _id: Session.get('recordEdit')}).lessons;
      $('.bap.ui.toggle.checkbox').checkbox('set checked');
      $('.bap.ui.toggle.checkbox').checkbox('set disabled');
    }
  $('.lessons.ui.dropdown').dropdown('set selected', lessons);
  
  var myForm = $('#prEdit');
    // Validation rules
    myForm
      .form({
        firstName: {
          identifier: 'firstName',
          rules: [
            {
              type: 'empty',
              prompt: 'Please enter a first name for this record.'
            },
          ]
        },
        lastName: {
          identifier: 'lastName',
          rules: [
            {
              type: 'empty',
              prompt: 'Please enter a last name for this record.'
            }
          ]
        },
        age: {
          identifier: 'age',
          rules: [
            {
              type: 'empty',
              prompt: 'Please enter an age for this record.'
            },
            {
              type: 'integer[1..100]',
              prompt: 'Please enter an age for this record.'
            }
          ]
        },
      sex: {
        identifier: 'sex',
        rules: [
          {
            type: 'empty',
            prompt: 'Please selext a gender for this record.'
          }
        ]
      },
      address: {
        identifier: 'streetAddress',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter a street address for this record.'
          }
        ]
      },
      phone: {
        identifier: 'phone',
        rules: [
          {
            type: 'integer',
            prompt: 'Phone numbers should be numbers only. No spaces, hyphens or parenthesis. E.g "5592310700"'
          },
          {
            type: 'empty',
            prompt: 'Please enter a phone number for this record.'
          }
        ]
      },
      unit: {
        identifier: 'unit',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select a unit for this record.'
          }
        ]
      },
      fellowship: {
        identifier: 'fellowship',
        rules: [
          {
            type: 'empty',
            prompt: 'Please indicate who this persons fellowship is.'
          }
        ]
      },
      church: {
        identifier: 'attendedChurch',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select how many times this person has attended church.'
          }
        ]
      },
      bapMonth: {
        identifier: 'bapMonth',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select a baptism month.'
          }
        ]
      },
      bapDay: {
        identifier: 'bapDay',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select a baptism day.'
          }
        ]
      },
      bapYear: {
        identifier: 'bapYear',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select a baptism year.'
          }
        ]
      },
      conMonth: {
        identifier: 'conMonth',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select a confirmation month.'
          }
        ]
      },
      conDay: {
        identifier: 'conDay',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select a confirmation day.'
          }
        ]
      },
      conYear: {
        identifier: 'conYear',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select a confirmation year.'
          }
        ]
      },
      helpNeeded: {
        identifier: 'helpNeeded',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter the help needed for this investigator or recent convert to progress.'
          }
        ]
      }
      },
      {
        inline: true,
        on: 'blur',
        transition: 'slide down',
        onSuccess: function (e) {
          // Save your data here
          e.preventDefault();
           var area = Areas.findOne({_id : Meteor.user().profile.area});
    var zone = Zones.findOne({_id : area.zone});
    var district = Districts.findOne({_id : area.district});
    var units = area.units;
    //Sets date to the begininning of the previous month that you should be reporting for.
    var date = moment().startOf('month').subtract(1, 'months').toDate();
    var lessons = [];
    if (Investigators.findOne( { _id: Session.get('recordEdit') } ) !== undefined && Session.get('baptized') === true) {
      Converts.insert({ 
        areaId : area._id,
        zoneId : zone._id,
        unitId   : document.getElementById('unit').value,
        districtId : district._id,
        firstName : document.getElementById('firstName').value,
        lastName  : document.getElementById('lastName').value,
        age : document.getElementById('age').value,
        sex : document.getElementById('sex').value,
        lessons : lessons,
        bapYear: document.getElementById('bapYear').value,
        bapDay: document.getElementById('bapDay').value,
        bapMonth: document.getElementById('bapMonth').value,
        conYear: document.getElementById('conYear').value,
        conDay: document.getElementById('conDay').value,
        conMonth: document.getElementById('conMonth').value,
        helpNeeded: document.getElementById('helpNeeded').value,
        fellowship: document.getElementById('fellowship').value,
        timesAtSac: document.getElementById('attendedChurch').value,
        address : document.getElementById("streetAddress").value,
        phone : document.getElementById("phone").value,
        temple : $('#temple').hasClass('checked'),
        calling : $('#calling').hasClass('checked'),
        priesthood : $('#priesthood').hasClass('checked'),
        teachers : $('#teachers').hasClass('checked'),
        fh  : $('#fh').hasClass('checked'),
        church  : $('#church').hasClass('checked'),
        progressed  : $('#progressed').hasClass('checked')
    });
      Investigators.remove(
   {_id: Session.get('recordEdit')},
   {
     justOne: true,
   });
      
    } else if (Session.get('baptized') === null) {
    $('.item.active.filtered').each(function(i){
    lessons.push($(this).html()); });
      Investigators.update({
      _id : Session.get('thisRec') },{
      $set : { 
        areaId : area._id,
        zoneId : zone._id,
        unitId   : Units.findOne({_id: document.getElementById('unit').value})._id,
        districtId : district._id,
        firstName : document.getElementById('firstName').value,
        lastName  : document.getElementById('lastName').value,
        age : document.getElementById('age').value,
        sex : document.getElementById('sex').value,
        lessons : lessons,
        bapYear: document.getElementById('bapYear').value,
        bapDay: document.getElementById('bapDay').value,
        bapMonth: document.getElementById('bapMonth').value,
        conYear: document.getElementById('conYear').value,
        conDay: document.getElementById('conDay').value,
        conMonth: document.getElementById('conMonth').value,
        helpNeeded: document.getElementById('helpNeeded').value,
        fellowship: document.getElementById('fellowship').value,
        timesAtSac: document.getElementById('attendedChurch').value,
        address : document.getElementById("streetAddress").value,
        phone : document.getElementById("phone").value,
        solid : $('#solid').hasClass('checked'),
             }
    });
            
      document.getElementById("prEdit").reset();
      Session.set('addRec', false);
      Router.go('/progressRecord');
    } else {
      $('.item.active.filtered').each(function(i){
      lessons.push($(this).html()); });
      Converts.update(
        {_id : Session.get('thisRec') },
        {
        $set : { 
        areaId : area._id,
        zoneId : zone._id,
        unitId   : document.getElementById('unit').value,
        districtId : district._id,
        firstName : document.getElementById('firstName').value,
        lastName  : document.getElementById('lastName').value,
        age : document.getElementById('age').value,
        sex : document.getElementById('sex').value,
        lessons : lessons,
        bapYear: document.getElementById('bapYear').value,
        bapDay: document.getElementById('bapDay').value,
        bapMonth: document.getElementById('bapMonth').value,
        conYear: document.getElementById('conYear').value,
        conDay: document.getElementById('conDay').value,
        conMonth: document.getElementById('conMonth').value,
        helpNeeded: document.getElementById('helpNeeded').value,
        fellowship: document.getElementById('fellowship').value,
        timesAtSac: document.getElementById('attendedChurch').value,
        address : document.getElementById("streetAddress").value,
        phone : document.getElementById("phone").value,
        temple : $('#temple').hasClass('checked'),
        calling : $('#calling').hasClass('checked'),
        priesthood : $('#priesthood').hasClass('checked'),
        teachers : $('#teachers').hasClass('checked'),
        fh  : $('#fh').hasClass('checked'),
        church  : $('#church').hasClass('checked'),
        progressed  : $('#progressed').hasClass('checked')
      }
    });    
    }
      Session.set('editRec', false);
      Session.set('baptized', null);
      Session.set('thisRec', null);
      Session.set('male', null);
      $(window).scrollTop(Session.get('scrollHeight'));
      Session.set('scrollHeight', null);
        }
    });
  });

Template.prEdit.helpers({
  currentRec: function() {
    if (Investigators.findOne( { _id: Session.get('recordEdit') } ) !== undefined) {
      return Investigators.findOne( { _id: Session.get('recordEdit') } )
    } else
      return Converts.findOne( { _id: Session.get('recordEdit')});
  },
  currentRecUnit: function() {
    if (Investigators.findOne( { _id: Session.get('recordEdit') } ) !== undefined) {
      return Units.findOne({_id: Investigators.findOne( { _id: Session.get('recordEdit') } ).unitId})._id;
    } else
      return Units.findOne({_id: Converts.findOne( { _id: Session.get('recordEdit')}).unitId})._id;
  },
  baptized: function() {
    return Session.get('baptized');
  },
  notBaptized: function() {
    return !Session.get('baptized');
  },
  
  units: function() {
    var area = Areas.findOne({_id : Meteor.user().profile.area});
    return Units.find( { _id: { $in: area.units } } )
  },
  age: function() {
    var age = [];
    for (var i=8; i<100; i++) {
      age.push(i);
    }
    return age;
  },
  day: function() {
    var day = [];
    for (var i=1; i<32; i++) {
      day.push(i);
    }
    return day;
  },
  year: function() {
    var year = [];
    year.push(moment().subtract(1, 'year').year().toString());
    year.push(moment().year().toString());
    year.push(moment().add(1, 'year').year().toString());
    return year;
  },
  currentRecLessons: function() {
    $('.lessons.ui.dropdown')
    .dropdown({
      action: 'activate',
        });
  }
})
  
  
  
Template.prEdit.events({
    /*'click button.ui.positive.button': function(e,tpl){
      e.preventDefault();
      //Submit Data to Collection
      //Copied from weekyreporting.js
      event.preventDefault();
    var area = Areas.findOne({_id : Meteor.user().profile.area});
    var zone = Zones.findOne({_id : area.zone});
    var district = Districts.findOne({_id : area.district});
    var units = area.units;
    //Sets date to the begininning of the previous month that you should be reporting for.
    var date = moment().startOf('month').subtract(1, 'months').toDate();
    var lessons = [];
    if (Investigators.findOne( { _id: Session.get('recordEdit') } ) !== undefined && Session.get('baptized') === true) {
      Converts.insert({ 
        areaId : area._id,
        zoneId : zone._id,
        unitId   : document.getElementById('unit').value,
        districtId : district._id,
        firstName : document.getElementById('firstName').value,
        lastName  : document.getElementById('lastName').value,
        age : document.getElementById('age').value,
        sex : document.getElementById('sex').value,
        lessons : lessons,
        bapYear: document.getElementById('bapYear').value,
        bapDay: document.getElementById('bapDay').value,
        bapMonth: document.getElementById('bapMonth').value,
        conYear: document.getElementById('conYear').value,
        conDay: document.getElementById('conDay').value,
        conMonth: document.getElementById('conMonth').value,
        helpNeeded: document.getElementById('helpNeeded').value,
        fellowship: document.getElementById('fellowship').value,
        timesAtSac: document.getElementById('attendedChurch').value,
        address : document.getElementById("streetAddress").value,
        phone : document.getElementById("phone").value,
        temple : $('#temple').hasClass('checked'),
        calling : $('#calling').hasClass('checked'),
        priesthood : $('#priesthood').hasClass('checked'),
        teachers : $('#teachers').hasClass('checked'),
        fh  : $('#fh').hasClass('checked'),
        church  : $('#church').hasClass('checked'),
        progressed  : $('#progressed').hasClass('checked')
    });
      Investigators.remove(
   {_id: Session.get('recordEdit')},
   {
     justOne: true,
   });
      
    } else if (Session.get('baptized') === null) {
    $('.item.active.filtered').each(function(i){
    lessons.push($(this).html()); });
      Investigators.update({
      _id : Session.get('thisRec') },{
      $set : { 
        areaId : area._id,
        zoneId : zone._id,
        unitId   : Units.findOne({_id: document.getElementById('unit').value})._id,
        districtId : district._id,
        firstName : document.getElementById('firstName').value,
        lastName  : document.getElementById('lastName').value,
        age : document.getElementById('age').value,
        sex : document.getElementById('sex').value,
        lessons : lessons,
        bapYear: document.getElementById('bapYear').value,
        bapDay: document.getElementById('bapDay').value,
        bapMonth: document.getElementById('bapMonth').value,
        conYear: document.getElementById('conYear').value,
        conDay: document.getElementById('conDay').value,
        conMonth: document.getElementById('conMonth').value,
        helpNeeded: document.getElementById('helpNeeded').value,
        fellowship: document.getElementById('fellowship').value,
        timesAtSac: document.getElementById('attendedChurch').value,
        address : document.getElementById("streetAddress").value,
        phone : document.getElementById("phone").value,
        solid : $('#solid').hasClass('checked'),
             }
    });
            
      document.getElementById("prEdit").reset();
      Session.set('addRec', false);
      Router.go('/progressRecord');
    } else {
      $('.item.active.filtered').each(function(i){
      lessons.push($(this).html()); });
      Converts.update(
        {_id : Session.get('thisRec') },
        {
        $set : { 
        areaId : area._id,
        zoneId : zone._id,
        unitId   : document.getElementById('unit').value,
        districtId : district._id,
        firstName : document.getElementById('firstName').value,
        lastName  : document.getElementById('lastName').value,
        age : document.getElementById('age').value,
        sex : document.getElementById('sex').value,
        lessons : lessons,
        bapYear: document.getElementById('bapYear').value,
        bapDay: document.getElementById('bapDay').value,
        bapMonth: document.getElementById('bapMonth').value,
        conYear: document.getElementById('conYear').value,
        conDay: document.getElementById('conDay').value,
        conMonth: document.getElementById('conMonth').value,
        helpNeeded: document.getElementById('helpNeeded').value,
        fellowship: document.getElementById('fellowship').value,
        timesAtSac: document.getElementById('attendedChurch').value,
        address : document.getElementById("streetAddress").value,
        phone : document.getElementById("phone").value,
        temple : $('#temple').hasClass('checked'),
        calling : $('#calling').hasClass('checked'),
        priesthood : $('#priesthood').hasClass('checked'),
        teachers : $('#teachers').hasClass('checked'),
        fh  : $('#fh').hasClass('checked'),
        church  : $('#church').hasClass('checked'),
        progressed  : $('#progressed').hasClass('checked')
      }
    });    
    }
      Session.set('editRec', false);
      Session.set('baptized', null);
      Session.set('thisRec', null);
      Session.set('male', null);
    },*/
    
  'click button.cancel.ui.button': function(e,tpl){
      e.preventDefault();
      document.getElementById("prEdit").reset();
      Session.set('editRec', false);
      Session.set('baptized', null);
      Session.set('thisRec', null);
      Session.set('male', null);
      $(window).scrollTop(Session.get('scrollHeight'));
      Session.set('scrollHeight', null);

    },
  
  'click button.right.floated.ui.negative.button': function(e, tpl){
    e.preventDefault();
    if (Investigators.findOne( { _id: Session.get('recordEdit') } ) !== undefined) {
      Investigators.remove( { _id: Session.get('recordEdit') } )
      Session.set('editRec', false);
      Session.set('baptized', null);
      Session.set('male', null);
      Session.set('thisRec', null);
    } else
      Converts.remove( { _id: Session.get('recordEdit')});
      Session.set('editRec', false);
      Session.set('baptized', null);
      Session.set('thisRec', null);
      Session.set('male', null);
    $(window).scrollTop(Session.get('scrollHeight'));
      Session.set('scrollHeight', null);
  }
  
});