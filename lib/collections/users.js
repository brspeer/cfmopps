const users_schema = new SimpleSchema({

    username: {
        type: String,
        optional: true,
        index: "text"
    },
    roles: {
        type: Array,
        optional: true,
        defaultValue: ['gamer']
    },
    'roles.$': {
        type: String,
    },
    // emails: {
    //     type: [Object],
    //     optional: true
    // },
    // "emails.$.address": {
    //     type: String,
    //     regEx: SimpleSchema.RegEx.Email
    // },
    // "emails.$.verified": {
    //     type: Boolean,
    //     defaultValue: true
    // },
    createdAt: {
        type: Date,
        defaultValue: new Date(),
        label: "createdAt"
    },
    profile: {
        type: Object,
        optional: true
    },
    'profile.area': {
    	type: String,
    	optional: true
    },
    'profile.zone': {
    	type: String,
    	optional: true
    },       
    'profile.unit': {
    	type: String,
    	optional: true
    },    
    'profile.district': {
    	type: [String],
    	optional: true
    },
    'profile.zoneArray':{
    	type: [String],
    	optional: true
    },
    services: {
        type: Object,
        blackbox: true
    },
});

Meteor.users.attachSchema(users_schema);

// Meteor.users.deny({
//     insert() {
//         return true;
//     },
//     update() {
//         return true;
//     },
//     remove() {
//         return true;
//     },
// });
