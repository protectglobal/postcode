// import { Meteor } from 'meteor/meteor';
// import { EJSON } from 'meteor/ejson';
// import _ from 'underscore';
import { check, Match } from 'meteor/check';
import AuxFunctions from '../aux-functions.js';

// Namespace
const CustomersApiBoth = {};

//------------------------------------------------------------------------------
/**
* @summary Verify fields before inserting doc into database.
* @param {object} - newCustomer = { name, postalCode, phoneNumber, email }.
* @return {object} - errors.
*/
CustomersApiBoth.checkNewCustomerFields = (newCustomer) => {
  // console.log('Customers.apiBoth.checkNewCustomerFields input:', newCustomer);
  check(newCustomer, {
    name: String,
    postalCode: String,
    phoneNumber: String,
    email: String,
  });

  // Destructure
  const { name, postalCode, phoneNumber, email } = newCustomer;

  // Initialize errors
  const errors = {
    name: [],
    postalCode: [],
    phoneNumber: [],
    email: [],
  };

  // Checks
  if (!name || name.trim().length === 0) {
    errors.name.push('Name is required');
  } // TODO: letters and spaces only

  if (!postalCode || postalCode.trim().length === 0) {
    errors.postalCode.push('Postal Code is required');
  } // TODO: alphanumeric

  if (!phoneNumber || phoneNumber.trim().length === 0) {
    errors.phoneNumber.push('Phone Number is required');
  } // TODO: numbers () + -

  if (!email || email.trim().length === 0) {
    errors.email.push('Email is required');
  } else if (!AuxFunctions.validateEmail(email)) {
    errors.email.push('Email is invalid');
  }

  return errors;
};
//------------------------------------------------------------------------------

export default CustomersApiBoth;
