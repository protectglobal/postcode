import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import InstallersCollection from './collection.js';
import InstallersApiBoth from './api.js';

/**
* @namespace Installers
*/
const Installers = {
  collection: InstallersCollection,
  apiBoth: InstallersApiBoth,
  // both methods and publications live in the Meteor namespace
};

// Load server-only utilities
if (Meteor.isServer) {
  import InstallersApiServer from './server/api.js';
  _.extend(Installers, { apiServer: InstallersApiServer });
}

export default Installers;
