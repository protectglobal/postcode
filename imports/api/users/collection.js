import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Constants from '../constants.js';

// =============================================================================
// COLLECTION:
// =============================================================================
// UsersCollection = new Mongo.Collection('users');
const UsersCollection = Meteor.users;

// =============================================================================
// ALLOW & DENY RULES:
// =============================================================================
/*
SOURCE: https://themeteorchef.com/recipes/building-a-user-admin/
To save face, we can “lock down” all of our rules when we define our collection
to prevent any client-side database operations from taking place. This means
that when we interact with the database, we’re required to do it from the server
(a trusted environment) via methods.
SOURCE: http://docs.meteor.com/#/full/deny
When a client tries to write to a collection, the Meteor server first checks the
collection's deny rules. If none of them return true then it checks the
collection's allow rules. Meteor allows the write only if no deny rules return
true and at least one allow rule returns true.
*/
UsersCollection.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

UsersCollection.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// =============================================================================
// SCHEMA(S):
// =============================================================================
// SEE: http://themeteorchef.com/snippets/using-the-collection2-package/
UsersCollection.attachSchema(new SimpleSchema({

  createdAt: {
    type: Date,
  },

  profile: {
    type: Object,
  },

  'profile.name': {
    type: String,
    max: 150,
  },

  emails: {
    type: [Object],
    // this must be optional if you also use other login services like facebook,
    // but if you use only accounts-password, then it can be required
    // optional: true,
  },

  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },

  'emails.$.verified': {
    type: Boolean,
  },

  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },

  roles: {
    type: [String],
    allowedValues: Constants.ALL_ROLES,
    optional: true,
  },

  accountDeactivated: {
    type: Boolean,
    optional: true,
  },

  editing: {
    type: Boolean,
    defaultValue: false,
  },

  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true,
  },

}));

export default UsersCollection;
