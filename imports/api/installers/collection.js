import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// =============================================================================
// COLLECTION:
// =============================================================================
const InstallersCollection = new Mongo.Collection('installers');

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
InstallersCollection.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

InstallersCollection.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// =============================================================================
// SCHEMA(S):
// =============================================================================
// SEE: http://themeteorchef.com/snippets/using-the-collection2-package/
InstallersCollection.attachSchema(new SimpleSchema({

  createdAt: {
    type: Date,
    denyUpdate: true,
  },

  createdBy: {
    type: String,
    denyUpdate: true,
  },

  companyName: {
    type: String,
  },

  logo: {
    type: Object,
    label: 'Cloudinary data',
  },

  'logo.publicId': {
    type: String,
  },

  'logo.resourceType': {
    type: String,
  },

  'logo.format': {
    type: String,
  },

  'logo.bytes': {
    type: Number,
  },

  'logo.height': {
    type: Number,
  },

  'logo.width': {
    type: Number,
  },

  'logo.url': {
    type: String,
  },

  'logo.secureUrl': {
    type: String,
  },

  isFallbackInstaller: {
    type: Boolean,
    optional: true,
  },

  addressOne: {
    type: String,
  },

  addressTwo: {
    type: String,
    optional: true,
  },

  postalCode: {
    type: String,
  },

  city: {
    type: String,
  },

  phoneNumber: {
    type: String,
  },

  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },

  postalAreas: {
    type: [String],
  },

  updatedAt: {
    type: Date,
    optional: true,
  },

  updatedBy: {
    type: String,
    optional: true,
  },

}));

export default InstallersCollection;
