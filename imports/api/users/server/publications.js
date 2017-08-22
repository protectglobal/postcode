/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
// import { check } from 'meteor/check';
// import _ from 'underscore';
import Constants from '../../constants.js';
import UsersCollection from '../collection.js';
import UsersApiBoth from '../api.js';

//------------------------------------------------------------------------------
Meteor.publish('Users.publications.curUser', function () {
  const curUserId = this.userId;

  if (curUserId) {
    const selector = {
      _id: curUserId,
    };
    const options = {
      fields: {
        services: false,
        emails: false,
      },
      limit: 1,
    };
    return UsersCollection.find(selector, options);
  }
  return this.ready();
});
//------------------------------------------------------------------------------
Meteor.publish('Users.publications.getAllUsers', function () {
  // Get current user.
  const curUserId = this.userId;

  // Make sure the user is logged in!
  if (!curUserId) {
    console.log('User is not logged in at Users.publications.getAllUsers');
    return this.ready();
  }

  // Is the account verified?
  if (!UsersApiBoth.isAccountVerified(curUserId)) {
    console.log('User account is not verified at Users.publications.getAllUsers');
    return this.ready();
  }

  // Check user role.
  if (!Roles.userIsInRole(curUserId, Constants.USERS_PAGE_ROLES)) {
    console.log('Wrong user role at Users.publications.getAllUsers');
    return this.ready();
  }

  const selector = {
    $or: [
      {
        accountDeactivated: { $exists: false },
      },
      {
        accountDeactivated: false,
      },
    ],
  };
  const projection = {
    fields: {
      createdAt: true,
      profile: true,
      emails: true,
      roles: true,
    },
  };
  return UsersCollection.find(selector, projection);
});
//------------------------------------------------------------------------------
