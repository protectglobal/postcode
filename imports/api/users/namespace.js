import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import UsersCollection from './collection.js';
import UsersApiBoth from './api.js';

/**
* @namespace Users
*/
const Users = {
  collection: UsersCollection,
  apiBoth: UsersApiBoth,
  // both methods and publications live in the Meteor namespace
};

// Load server-only utilities
if (Meteor.isServer) {
  import UsersApiServer from './server/api.js';
  _.extend(Users, { apiServer: UsersApiServer });
}

export default Users;
