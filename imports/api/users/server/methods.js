import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import Constants from '../../constants.js';
import UsersCollection from '../collection.js';
import UsersApiBoth from '../api.js';

//------------------------------------------------------------------------------
/**
* @summary Set user initial role 'normal', after the user is created.
*/
Meteor.methods({ 'Users.methodsServer.setInitialRole'() {
  // 'unblocks' a Method from needing to finish before other Methods are executed.
  this.unblock();

  // Get current user.
  const curUserId = this.userId;

  // Verify current user is logged in.
  if (!curUserId) {
    throw new Error(403, 'user is not logged in at Users.methodsServer.setInitialRole');
  }

  // If role is already set, return.
  if (Roles.userIsInRole(curUserId, Constants.ALL_ROLES)) {
    return;
  }

  // Determine current user role: in case the current user is the first one to
  // register into the app, set role to 'admin', otherwise set role to 'normal'.
  const isFirstUser = UsersCollection.find({}, { limit: 2 }).count() === 1;
  const roles = isFirstUser ? ['admin'] : ['normal'];

  // Set role.
  Roles.setUserRoles(curUserId, roles);
} });
//------------------------------------------------------------------------------
/**
* @summary Set new role for the target user.
*/
Meteor.methods({ 'Users.methodsServer.setNewRole'({ targetUserId, role }) {
  check([targetUserId, role], [String]);

  // Get current user.
  const curUserId = this.userId;

  // Make sure the user is logged in!
  if (!curUserId) {
    throw new Error(403, 'User is not logged in at Users.methodsServer.setNewRole');
  }

  // Is the account verified?
  if (!UsersApiBoth.isAccountVerified(curUserId)) {
    throw new Error(403, 'User account is not verified at Users.methodsServer.setNewRole');
  }

  // Check user role.
  if (!Roles.userIsInRole(curUserId, Constants.USERS_PAGE_ROLES)) {
    throw new Error(403, 'Wrong user role at Users.methodsServer.setNewRole');
  }

  // Prevent user to alter it's own data.
  if (targetUserId === curUserId) {
    throw new Error(403, 'You can\'t alter your own data at Users.methodsServer.setNewRole');
  }

  // Set new role.
  Roles.setUserRoles(targetUserId, [role]);
} });
//------------------------------------------------------------------------------
/**
* @summary Deactivate user account (set accountDeactivated flag to true into
* user's doc).
*/
Meteor.methods({ 'Users.methodsServer.deactivateAccount'(targetUserId) {
  check(targetUserId, String);

  // Get current user.
  const curUserId = this.userId;

  // Make sure the user is logged in!
  if (!curUserId) {
    throw new Error(403, 'User is not logged in at Users.methodsServer.deactivateAccount');
  }

  // Is the account verified?
  if (!UsersApiBoth.isAccountVerified(curUserId)) {
    throw new Error(403, 'User account is not verified at Users.methodsServer.deactivateAccount');
  }

  // Check user role.
  if (!Roles.userIsInRole(curUserId, Constants.USERS_PAGE_ROLES)) {
    throw new Error(403, 'Wrong user role at Users.methodsServer.deactivateAccount');
  }

  // Prevent user to alter it's own data.
  if (targetUserId === curUserId) {
    throw new Error(403, 'You can\'t alter your own data at Users.methodsServer.deactivateAccount');
  }

  // Set accountDeactivated flag to 'true' for the target user.
  UsersCollection.update({ _id: targetUserId }, { $set: { accountDeactivated: true } });
} });
//------------------------------------------------------------------------------
