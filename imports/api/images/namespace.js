// import { Meteor } from 'meteor/meteor';
// import _ from 'underscore';
import ImagesCollection from './collection.js';
import ImagesApiBoth from './api.js';

/**
* @namespace Images
*/
const Images = {
  collection: ImagesCollection,
  apiBoth: ImagesApiBoth,
  // both methods and publications live in the Meteor namespace
};

// Load server-only utilities
/* if (Meteor.isServer) {
  import ImagesApiServer from './server/api.js';
  _.extend(Images, { apiServer: ImagesApiServer });
} */

export default Images;
