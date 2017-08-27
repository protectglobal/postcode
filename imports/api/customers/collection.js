import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// =============================================================================
// COLLECTION:
// =============================================================================
const CustomersCollection = new Mongo.Collection('customers');

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
CustomersCollection.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

CustomersCollection.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// =============================================================================
// SCHEMA(S):
// =============================================================================
// SEE: http://themeteorchef.com/snippets/using-the-collection2-package/
CustomersCollection.attachSchema(new SimpleSchema({

  createdAt: {
    type: Date,
    denyUpdate: true,
  },

  name: {
    type: String,
    label: 'Customer\'s name',
  },

  postalCode: {
    type: String,
  },

  phoneNumber: {
    type: String,
  },

  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },

  installer: {
    type: Object,
    label: 'Installer assigned to this customer',
    optional: true,
  },

  'installer.id': {
    type: String,
  },

  'installer.companyName': {
    type: String,
  },

  emailDeliveryStatus: {
    type: String,
    label: 'Status of the email sent to the assigned installer',
    allowedValues: ['sent', 'failed'],
    optional: true,
  },

}));

export default CustomersCollection;
