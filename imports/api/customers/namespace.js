import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import CustomersCollection from './collection.js';
import CustomersApiBoth from './api.js';

/**
* @namespace Customers
*/
const Customers = {
  collection: CustomersCollection,
  apiBoth: CustomersApiBoth,
  // both methods and publications live in the Meteor namespace
};

// Load server-only utilities
if (Meteor.isServer) {
  import CustomersApiServer from './server/api.js';
  _.extend(Customers, { apiServer: CustomersApiServer });
}

export default Customers;
