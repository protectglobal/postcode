import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';
import { check, Match } from 'meteor/check';
import { Email } from 'meteor/email';
import AuxFunctions from '../../aux-functions.js';
import Constants from '../../constants.js';
import InstallersCollection from '../collection.js';
import InstallersApiBoth from '../api.js';

// Namespace
const InstallersApiServer = {};

//------------------------------------------------------------------------------
/**
* @summary Insert a new installer record into the Installers collection. This
* function must be called from a trusted source (server) since we are not
* validating the user credentials.
* @param {string} - curUserId. Current user id.
* @param {object} - newInstaller = { companyName, logo, addressOne, addressTwo,
* postalCode, city, phoneNumber, email, postalAreas }.
* @return {string} - installerId.
*/
InstallersApiServer.insertInstaller = (curUserId, newInstaller) => {
  // console.log('Installers.apiServer.insertInstaller input:', curUserId, newInstaller);
  check(curUserId, String);
  check(newInstaller, {
    companyName: String,
    logo: Object,
    addressOne: String,
    addressTwo: Match.Maybe(String),
    postalCode: String,
    city: String,
    phoneNumber: String,
    email: String,
    postalAreas: String,
  });

  // Check for errors
  const errors = InstallersApiBoth.checkInstallerFields(newInstaller);
  if (AuxFunctions.hasErrors(errors)) {
    return {
      err: {
        reason: AuxFunctions.getFirstError(errors).value,
      },
      installerId: null,
    };
  }

  // Attach createdAt and createdBy fields to doc before insertion
  const doc = Object.assign(
    {},
    newInstaller,
    { postalAreas: AuxFunctions.formatPostalAreas(newInstaller.postalAreas) },
    { createdAt: new Date(), createdBy: curUserId },
  );

  // Insert document
  let installerId = '';
  try {
    installerId = InstallersCollection.insert(doc);
  } catch (exc) {
    console.log(exc);
    return {
      err: {
        reason: EJSON.stringify(exc, { indent: true }), // TODO: test this error
      },
      installerId: null,
    };
  }

  return {
    err: null,
    installerId,
  };
};
//------------------------------------------------------------------------------
/**
* @summary Edit existing installer. This function must be called from a trusted
* source (server) since we are not validating the user credentials.
* @param {string} - curUserId. Current user id.
* @param {string} - installerId. Id of the installer we want to update.
* @param {object} - installer = { companyName, logo, addressOne, addressTwo,
* postalCode, city, phoneNumber, email, postalAreas }.
* @return {string} - installerId.
*/
InstallersApiServer.editInstaller = (curUserId, installerId, installer) => {
  // console.log('Installers.apiServer.editInstaller input:', curUserId, installerId, installer);
  check(curUserId, String);
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
    postalAreas: String,
  });

  // Check for errors
  const errors = InstallersApiBoth.checkInstallerFields(installer);
  if (AuxFunctions.hasErrors(errors)) {
    return {
      err: {
        reason: AuxFunctions.getFirstError(errors).value,
      },
      installerId: null,
    };
  }

  // Attach createdAt and createdBy fields to doc before insertion
  const doc = Object.assign(
    {},
    installer,
    { postalAreas: AuxFunctions.formatPostalAreas(installer.postalAreas) },
    { updatedAt: new Date(), updatedBy: curUserId },
  );

  // Update document
  try {
    InstallersCollection.update({ _id: installerId }, { $set: doc });
  } catch (exc) {
    console.log(exc);
    return {
      err: {
        reason: EJSON.stringify(exc, { indent: true }), // TODO: test this error
      },
      installerId: null,
    };
  }

  return {
    err: null,
    installerId,
  };
};
//------------------------------------------------------------------------------
/**
* @summary Delete installer. This function must be called from a trusted source
* (server) since we are not validating the user credentials.
* @param {string} - curUserId. Current user id.
* @param {string} - installerId. Id of the installer we want to delete.
*/
InstallersApiServer.removeInstaller = (curUserId, installerId) => {
  // console.log('Installers.apiServer.removeInstaller input:', curUserId, installerId);
  check(curUserId, String);
  check(installerId, String);

  // Delete document
  try {
    InstallersCollection.remove({ _id: installerId });
  } catch (exc) {
    console.log(exc);
    return {
      err: {
        reason: EJSON.stringify(exc, { indent: true }), // TODO: test this error
      },
    };
  }

  return { err: null };
};
//------------------------------------------------------------------------------
/**
* @summary Set assignee installer value. This function must be called from a
* trusted source (server) since we are not validating the user credentials.
* @param {string} - curUserId. Current user id.
* @param {string} - installerId. Id of the installer we want to change assignee
* value.
* @param {bool} - value. Assignee value (true or false).
*/
InstallersApiServer.setFallbackValue = (curUserId, installerId, value) => {
  // console.log('Installers.apiServer.setFallbackValue input:', curUserId, installerId, value);
  check(curUserId, String);
  check(installerId, String);
  check(value, Boolean);

  // Delete document
  try {
    InstallersCollection.update({ _id: installerId }, { $set: { isFallbackInstaller: value } });
  } catch (exc) {
    console.log(exc);
    return {
      err: {
        reason: EJSON.stringify(exc, { indent: true }), // TODO: test this error
      },
    };
  }

  return { err: null };
};
//------------------------------------------------------------------------------
/**
* @summary Get assignee installer for the given postal code based on postal
* areas. This function must be called from a trusted source (server) since we
* are not validating the user credentials.
* @param {string} - postalCode. Postal code.
* @return {object} - installer. Installer serving the given postal code.
*/
InstallersApiServer.getAssignee = (postalCode) => {
  console.log('\nInstallers.apiServer.getAssignee:', postalCode);
  check(postalCode, String);

  // Process postal code to remove all spaces.
  const cleanPC = postalCode.trim().replace(' ', '').toUpperCase();
  console.log('cleanPC', cleanPC);

  const MAX_CHARS = 6;
  let stopCond = false;

  // Look for installers matching the first MAX_CHARS or less chars of the
  // given postal code
  for (let numChars = MAX_CHARS; numChars > 0 && !stopCond; numChars -= 1) {
    if (cleanPC.length >= numChars) {
      const selector = {
        // Match the first numChars (exact match)
        postalAreas: cleanPC.slice(0, numChars),
      };
      const installer = InstallersCollection.findOne(selector);
      console.log('installer: ', installer);
      if (installer) {
        stopCond = true;
        return {
          err: null,
          installer,
        };
      }
    }
  }

  // In case no installer was found, return fallback.
  const installer = InstallersCollection.findOne({ isFallbackInstaller: true });

  if (!installer) {
    return {
      err: {
        reason: 'Default installer is not set!',
      },
      installer: null,
    };
  }

  return {
    err: null,
    installer,
  };
};
//------------------------------------------------------------------------------

export default InstallersApiServer;
