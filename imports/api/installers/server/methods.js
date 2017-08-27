import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import Constants from '../../constants.js';
import Users from '../../users/namespace.js';
import InstallersApiServer from './api.js';

//------------------------------------------------------------------------------
/**
* @summary Insert new installer into Installers collection.
*/
Meteor.methods({ 'Installers.methods.addInstaller'(newInstaller) {
  // console.log('Installers.methods.addInstaller', newInstaller);
  check(newInstaller, {
    companyName: String,
    logo: Object,
    addressOne: String,
    addressTwo: Match.Maybe(String),
    postalCode: String,
    city: String,
    phoneNumber: String,
    email: String,
    postalAreas: [String],
  });

  // Get current user.
  const curUserId = this.userId;

  // Verify current user is logged in.
  if (!curUserId) {
    throw new Error(403, 'User is not logged in at Installers.methods.addInstaller');
  }

  // Is the account verified?
  if (!Users.apiBoth.isAccountVerified(curUserId)) {
    throw new Error(403, 'User account is not verified at Installers.methods.addInstaller');
  }

  // Check user role
  if (!Roles.userIsInRole(curUserId, Constants.INSTALLERS_PAGE_ROLES)) {
    throw new Error(403, 'Wrong user role at Installers.methods.addInstaller');
  }

  const { err } = InstallersApiServer.insertInstaller(curUserId, newInstaller);
  if (err) {
    // Bubble up error to client view
    throw new Error(500, err.reason);
  }
} });
//------------------------------------------------------------------------------
/**
* @summary Edit existing installer.
*/
Meteor.methods({ 'Installers.methods.editInstaller'(installerId, installer) {
  // console.log('Installers.methods.editInstaller', installerId, installer);
  check(installerId, String);
  check(installer, {
    companyName: String,
    logo: Object,
    addressOne: String,
    addressTwo: Match.Maybe(String),
    postalCode: String,
    city: String,
    phoneNumber: String,
    email: String,
    postalAreas: [String],
  });

  // Get current user.
  const curUserId = this.userId;

  // Verify current user is logged in.
  if (!curUserId) {
    throw new Error(403, 'User is not logged in at Installers.methods.editInstaller');
  }

  // Is the account verified?
  if (!Users.apiBoth.isAccountVerified(curUserId)) {
    throw new Error(403, 'User account is not verified at Installers.methods.editInstaller');
  }

  // Check user role
  if (!Roles.userIsInRole(curUserId, Constants.INSTALLERS_PAGE_ROLES)) {
    throw new Error(403, 'Wrong user role at Installers.methods.editInstaller');
  }

  const { err } = InstallersApiServer.editInstaller(curUserId, installerId, installer);
  if (err) {
    // Bubble up error to client view
    throw new Error(500, err.reason);
  }
} });
//------------------------------------------------------------------------------
