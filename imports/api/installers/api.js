// import { Meteor } from 'meteor/meteor';
// import { EJSON } from 'meteor/ejson';
import _ from 'underscore';
import { check, Match } from 'meteor/check';
import AuxFunctions from '../aux-functions.js';

// Namespace
const InstallersApiBoth = {};

//------------------------------------------------------------------------------
/**
* @summary Verify fields before inserting doc into database.
* @param {object} - installer = { logo, companyName, addressOne, addressTwo,
* postalCode, city, phoneNumber, email, postalAreas }.
* @return {object} - errors.
*/
InstallersApiBoth.checkInstallerFields = (installer) => {
  // console.log('Installers.apiBoth.checkInstallerFields input:', installer);
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

  // Destructure
  const {
    logo,
    companyName,
    addressOne,
    addressTwo,
    postalCode,
    city,
    phoneNumber,
    email,
    postalAreas,
  } = installer;

  // Initialize errors
  const errors = {
    logo: [],
    companyName: [],
    addressOne: [],
    addressTwo: [],
    postalCode: [],
    city: [],
    phoneNumber: [],
    email: [],
    postalAreas: [],
  };

  // Checks
  if (!logo || logo.trim().length === 0) {
    errors.logo.push('Logo is required');
  }

  if (!companyName || companyName.trim().length === 0) {
    errors.companyName.push('Company Name is required');
  }

  if (!addressOne || addressOne.trim().length === 0) {
    errors.addressOne.push('Address is required');
  } // TODO: alphanumeric

  if (!postalCode || postalCode.trim().length === 0) {
    errors.postalCode.push('Postal Code is required');
  } // TODO: alphanumeric

  if (!city || city.trim().length === 0) {
    errors.city.push('City is required');
  } // TODO: city should be one from the cityList

  if (!phoneNumber || phoneNumber.trim().length === 0) {
    errors.phoneNumber.push('Phone Number is required');
  } // TODO: numbers () + -

  if (!email || email.trim().length === 0) {
    errors.email.push('Email is required');
  } else if (!AuxFunctions.validateEmail(email)) {
    errors.email.push('Email is invalid');
  }

  if (!postalAreas || postalAreas.length === 0) {
    errors.postalAreas.push('Postal Areas is required');
  } else {
    _.each(postalAreas, (pc) => {
      if (!pc || pc.trim().length === 0) {
        errors.postalAreas.push('At least one of the Postal Codes is invalid');
      } // TODO: alphanumeric
    });
  }

  return errors;
};
//------------------------------------------------------------------------------
/**
* @summary Handle errors from Installers.methods.addInstaller callback.
*/
/* InstallersApiBoth.api.handleAddEditBloggerErrors = (err) => {
  // check(err, Object);

  // Destructure
  const { error, reason } = err;

  // Initialize errors
  const errors = {
    siteUrl: [],
  };

  // Handle known errors firts
  if (error === 403) {
    if (reason === 'Duplicated site URL') {
      // XXX i18n
      errors.siteUrl.push('A blogger with the same site URL already exists');
    }
  // Handle unexpected error
  } else {
    // XXX i18n
    errors.siteUrl.push('Unexpected error');
  }

  return errors;
}; */
//------------------------------------------------------------------------------

export default InstallersApiBoth;
