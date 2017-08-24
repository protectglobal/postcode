import { EJSON } from 'meteor/ejson';
import { check, Match } from 'meteor/check';
import AuxFunctions from '../../aux-functions.js';
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
* @param {object} - newInstaller = { logo, companyName, addressOne, addressTwo,
* postalCode, city, phoneNumber, email, postalAreas }.
* @return {string} - installerId.
*/
InstallersApiServer.insertInstaller = (curUserId, newInstaller) => {
  // console.log('Installers.apiServer.insertInstaller input:', curUserId, newInstaller);
  check(curUserId, String);
  check(newInstaller, {
    logo: String,
    companyName: String,
    addressOne: String,
    addressTwo: Match.Maybe(String),
    postalCode: String,
    city: String,
    phoneNumber: String,
    email: String,
    postalAreas: [String],
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
* @param {object} - installer = { logo, companyName, addressOne, addressTwo,
* postalCode, city, phoneNumber, email, postalAreas }.
* @return {string} - installerId.
*/
InstallersApiServer.editInstaller = (curUserId, installerId, installer) => {
  // console.log('Installers.apiServer.editInstaller input:', curUserId, installerId, installer);
  check(curUserId, String);
  check(installerId, String);
  check(installer, {
    logo: String,
    companyName: String,
    addressOne: String,
    addressTwo: Match.Maybe(String),
    postalCode: String,
    city: String,
    phoneNumber: String,
    email: String,
    postalAreas: [String],
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

export default InstallersApiServer;
