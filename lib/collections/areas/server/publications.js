// import {Units} from '../../units.js';


// Meteor.publishTransformed('area.byId', function(areaId){
//   const userId = this.userId;
//   if (!userId){throw new Meteor.Error('unauthorized','Must be logged in to get this data')};

//   return Areas.find({_id:areaId})
//     .serverTransform({
//       'user.area': function(area){
//         return Meteor.users.find({area: area._id});
//       },
//       // 'user.profile.area': function(area){
//       //   return Meteor.users.findOne({"profile.area": area._id});
//       // }
//     });
// });

// // XXX return user not userID
// export function filterAreasByRole(userId, filter){

//   if (!userId){ throw new Error('userId must be defined');}

//   const user = Meteor.users.findOne({_id:userId});
//   if (Roles.userIsInRole(user, 'office')){
//     // return all
//   } else
//   if (Roles.userIsInRole(user, 'zoneLeader')) {
//     const zone = user.profile.zone;

//     let districts = Districts.find({
//       zone: user.profile.zone
//     }).map(function(district){
//       return district._id;
//     });

//     filter = {
//         ...filter,
//         $or: [{ zone: zone }, {
//             district: { $in: districts }
//         }],
//         active: true
//     };
//   } else 
//   if (Roles.userIsInRole(user, 'districtLeader')){
//     const leader = user.profile.area;
//     const zone = user.profile.zone;
//     const district = user.profile.district;
    
//     // const zone = user.profile.zone;
//     // const district = user.profile.district;

//     // let districts = Districts.find({
//     //   $or:[{zone: user.profile.zone},{_id:district}]
//     // }).map(function(district){
//     //   return district._id;
//     // });

//     var myDistrictId = Districts.findOne({leader: leader})._id;
//     // filter.district = district;

//     filter = {
//       ...filter,
//       $or: [
//         {district: myDistrictId},
//         {zone: zone},
//         {_id: district}
//       ],
//       active: true
//     }

//   } else
//   if (!user.roles || user.roles.length === 0){
//     const area = user.profile.area;
//     filter._id = area;
//     filter.active = true;
//   }
//   return filter;
// }