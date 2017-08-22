/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
// import { check } from 'meteor/check';
// import _ from 'underscore';
import Constants from '../../constants.js';
import CustomersCollection from '../collection.js';
import Users from '../../users/namespace.js';

//------------------------------------------------------------------------------
Meteor.publish('Customers.publications.getAllCustomers', function () {
  // Get current user.
  const curUserId = this.userId;

  // Make sure the user is logged in!
  if (!curUserId) {
    console.log('User is not logged in at Customers.publications.getAllCustomers');
    return this.ready();
  }

  // Is the account verified?
  if (!Users.apiBoth.isAccountVerified(curUserId)) {
    console.log('User account is not verified at Customers.publications.getAllCustomers');
    return this.ready();
  }

  // Check user role.
  if (!Roles.userIsInRole(curUserId, Constants.CUSTOMERS_PAGE_ROLES)) {
    console.log('Wrong user role at Customers.publications.getAllCustomers');
    return this.ready();
  }

  // Send all customers data
  return CustomersCollection.find({});
});
//------------------------------------------------------------------------------
