import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import Constants from '../../constants.js';
import Users from '../../users/namespace.js';
import InstallersApiServer from './api.js';
import InstallersCollection from '../collection.js';

//------------------------------------------------------------------------------
/**
* @summary Insert new installer into Installers collection.
*/
Meteor.methods({ 'Installers.methods.addInstaller'(newInstaller) {
  // console.log('Installers.methods.addInstaller', newInstaller);
  check(newInstaller, {
    companyName: String,
    logo: Object,
    // isFallbackInstaller: Boolean,
    addressOne: String,
    addressTwo: Match.Maybe(String),
    postalCode: String,
    city: String,
    phoneNumber: String,
    email: String,
    postalAreas: String,
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
    // isFallbackInstaller: Boolean,
    addressOne: String,
    addressTwo: Match.Maybe(String),
    postalCode: String,
    city: String,
    phoneNumber: String,
    email: String,
    postalAreas: String,
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
/**
* @summary Delete installer from DB.
*/
Meteor.methods({ 'Installers.methods.removeInstaller'(installerId) {
  // console.log('Installers.methods.removeInstaller', installerId);
  check(installerId, String);

  // Get current user.
  const curUserId = this.userId;

  // Verify current user is logged in.
  if (!curUserId) {
    throw new Error(403, 'User is not logged in at Installers.methods.removeInstaller');
  }

  // Is the account verified?
  if (!Users.apiBoth.isAccountVerified(curUserId)) {
    throw new Error(403, 'User account is not verified at Installers.methods.removeInstaller');
  }

  // Check user role
  if (!Roles.userIsInRole(curUserId, Constants.INSTALLERS_PAGE_ROLES)) {
    throw new Error(403, 'Wrong user role at Installers.methods.removeInstaller');
  }

  const { err } = InstallersApiServer.removeInstaller(curUserId, installerId);
  if (err) {
    // Bubble up error to client view
    throw new Error(500, err.reason);
  }
} });
//------------------------------------------------------------------------------
/**
* @summary Set fallback installer value.
*/
Meteor.methods({ 'Installers.methods.setFallbackValue'(installerId, value) {
  // console.log('Installers.methods.setFallbackValue', installerId, value);
  check(installerId, String);
  check(value, Boolean);

  // Get current user.
  const curUserId = this.userId;

  // Verify current user is logged in.
  if (!curUserId) {
    throw new Error(403, 'User is not logged in at Installers.methods.setFallbackValue');
  }

  // Is the account verified?
  if (!Users.apiBoth.isAccountVerified(curUserId)) {
    throw new Error(403, 'User account is not verified at Installers.methods.setFallbackValue');
  }

  // Check user role
  if (!Roles.userIsInRole(curUserId, Constants.INSTALLERS_PAGE_ROLES)) {
    throw new Error(403, 'Wrong user role at Installers.methods.setFallbackValue');
  }

  if (value === false) {
    const { err } = InstallersApiServer.setFallbackValue(curUserId, installerId, value);
    if (err) {
      // Bubble up error to client view
      throw new Error(500, err.reason);
    }
  } else if (value === true) {
    // Firstly, set given installer to be the fallback.
    const { err1 } = InstallersApiServer.setFallbackValue(curUserId, installerId, true);
    if (err1) {
      // Bubble up error to client view
      throw new Error(500, err1.reason);
    }

    // Secondly, set the rest of the installer to NOT be the fallback.
    const errors = [];
    InstallersCollection.find({ _id: { $ne: installerId }, isFallbackInstaller: true }).forEach(({ _id }) => {
      const { err } = InstallersApiServer.setFallbackValue(curUserId, _id, false);
      if (err) {
        errors.push(err);
      }
    });
    if (errors.length > 0) {
      // Bubble up first error to client
      throw new Error(500, errors[0].reason);
    }
  }
} });
//------------------------------------------------------------------------------
