Template.deleteDistrictModal.events({
  "click div.ui.negative.labeled.icon.button": function() {
      Districts.remove({
        _id: Session.get('deleteDistrict')._id
      });
    //I know this line of router code looks pointless, but it helps cure some bugginess with the modals and template loading
  }
})