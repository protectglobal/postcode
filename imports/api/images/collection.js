import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// =============================================================================
// COLLECTION:
// =============================================================================
const ImagesCollection = new Mongo.Collection('images');

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
ImagesCollection.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

ImagesCollection.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// =============================================================================
// SCHEMA(S):
// =============================================================================
// SEE: http://themeteorchef.com/snippets/using-the-collection2-package/
ImagesCollection.attachSchema(new SimpleSchema({

  createdAt: {
    type: Date,
  },

  createdBy: {
    type: String,
  },

  publicId: {
    type: String,
    label: 'Cloudinary public id',
  },

  url: {
    type: String,
    label: 'Cloudinary url',
  },

  secureUrl: {
    type: String,
    label: 'Cloudinary secure url',
  },

  width: {
    type: Number,
  },

  height: {
    type: Number,
  },

}));

export default ImagesCollection;
