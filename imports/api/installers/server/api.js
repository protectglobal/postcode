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
    { postalAreas: AuxFunctions.parsePostalAreas(newInstaller.postalAreas) },
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
    { postalAreas: AuxFunctions.parsePostalAreas(installer.postalAreas) },
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
* @summary Get assignee installer for the given postal code based on postal
* areas. This function must be called from a trusted source (server) since we
* are not validating the user credentials.
* @param {string} - postalCode. Postal code.
* @return {object} - installer. Installer serving the given postal code.
*/
InstallersApiServer.getAssignee = (postalCode) => {
  console.log('Installers.apiServer.getAssignee input:', postalCode);
  check(postalCode, String);

  // TODO: Get installer serving postal code
  // (for now, just return a random document)
  const pipeline = [
    { $sample: { size: 1 } },
  ];
  let installer = InstallersCollection.aggregate(pipeline)[0];

  // TODO: In case postal code doesn't match any postal areas, return default
  // installer
  if (!installer) {
    installer = InstallersCollection.findOne({ isDefaultInstaller: true });

    if (!installer) {
      return {
        err: {
          reason: 'Default installer is not set!',
        },
        installer: null,
      };
    }
  }

  return {
    err: null,
    installer,
  };
};
//------------------------------------------------------------------------------
/**
* @summary Send email (containing customer's data) to assigned installer . This
* function must be called from a trusted source (server) since we are not
* validating the user credentials.
* @param {string} - curUserId. Current user id.
* @param {string} - installerId. Id of the installer we want to delete.
*/
InstallersApiServer.sendEmail = (installerId, customer) => {
  console.log('Installers.apiServer.sendEmail input:', installerId, installerId);
  check(installerId, String);
  check(customer, {
    _id: String,
    createdAt: Date,
    name: String,
    postalCode: String,
    phoneNumber: String,
    email: String,
  });

  // Get installer's data
  const installer = InstallersCollection.findOne({ _id: installerId });

  if (!installer) {
    return {
      deliveryStatus: 'failed',
    };
  }

  // In case we are in testMode, deliver emails to the given testEmail address
  const { isTest, testEmail } = Meteor.settings.testMode;
  console.log(
    'isTest', isTest,
    'testEmail', testEmail,
  );

  // Send email
  try {
    Email.send({
      to: !isTest ? installer.email : testEmail,
      from: `no-reply@${Constants.DOMAIN_NAME}`,
      subject: 'Customer\'s installation request',
      text: `
        Customer's data:\n
        Name: ${customer.name};\n
        Postal code: ${customer.postalCode};\n,
        Phone number: ${customer.phoneNumber};\n,
        Email: ${customer.email};\n
      `,
    });
  } catch (exc) {
    console.log(exc);
    return {
      deliveryStatus: 'failed',
    };
  }

  return {
    deliveryStatus: 'sent',
  };
};
//------------------------------------------------------------------------------

export default InstallersApiServer;
