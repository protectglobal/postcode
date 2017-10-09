import { EJSON } from 'meteor/ejson';
import { check, Match } from 'meteor/check';
import AuxFunctions from '../../aux-functions.js';
import CustomersCollection from '../collection.js';
import CustomersApiBoth from '../api.js';

// Namespace
const CustomersApiServer = {};

//------------------------------------------------------------------------------
/**
* @summary Insert a new customer record into the Customers collection. This
* function must be called from a trusted source (server) since we are not
* validating the user credentials.
* @param {object} - newCustomer = { name, postalCode, phoneNumber, email }.
* @return {object} - customer.
*/
CustomersApiServer.insertCustomer = (newCustomer) => {
  // console.log('Customers.apiServer.insertCustomer input:', newCustomer);
  check(newCustomer, {
    name: String,
    postalCode: String,
    phoneNumber: String,
    email: String,
  });

  // Check for errors
  const errors = CustomersApiBoth.checkNewCustomerFields(newCustomer);
  if (AuxFunctions.hasErrors(errors)) {
    return {
      err: {
        reason: AuxFunctions.getFirstError(errors).value,
      },
      customer: null,
    };
  }

  // Attach createdAt time stamp to doc before insertion
  const doc = Object.assign({}, newCustomer, { createdAt: new Date() });

  // Insert document
  let customerId = '';
  try {
    customerId = CustomersCollection.insert(doc);
  } catch (exc) {
    console.log(exc);
    return {
      err: {
        reason: EJSON.stringify(exc, { indent: true }), // TODO: test this error
      },
      customer: null,
    };
  }

  // Return the new doc
  return {
    err: null,
    customer: CustomersCollection.findOne({ _id: customerId }),
  };
};
//------------------------------------------------------------------------------
/**
* @summary Save assigned installer id into customer doc. This function must be
* called from a trusted source (server) since we are not validating the user
* credentials.
* @param {string} - customerId.
* @return {object} - installer.
*/
CustomersApiServer.setAssignedInstaller = (customerId, installer) => {
  console.log('\nCustomers.apiServer.setAssignedInstaller:', customerId, installer);
  check(customerId, String);
  check(installer, {
    _id: String,
    createdAt: Date,
    createdBy: String,
    companyName: String,
    logo: Object,
    isFallbackInstaller: Match.Maybe(Boolean),
    addressOne: String,
    addressTwo: Match.Maybe(String),
    postalCode: String,
    city: String,
    phoneNumber: String,
    email: String,
    postalAreas: [String],
    updatedAt: Match.Maybe(Date),
    updatedBy: Match.Maybe(String),
  });

  // Destructure
  const { _id, companyName } = installer;

  // Update document
  const modifier = {
    $set: {
      installer: {
        id: _id,
        companyName,
      },
    },
  };
  CustomersCollection.update({ _id: customerId }, modifier);
};
//------------------------------------------------------------------------------
/**
* @summary Save email delivery status into customer doc. This function must be
* called from a trusted source (server) since we are not validating the user
* credentials.
* @param {string} - customerId.
* @return {string} - deliveryStatus. ['sent', 'failed']
*/
CustomersApiServer.setEmailDeliveryStatus = (customerId, deliveryStatus) => {
  console.log('Customers.apiServer.setEmailDeliveryStatus input:', customerId, deliveryStatus);
  check(customerId, String);
  check(deliveryStatus, Match.OneOf('sent', 'failed'));

  // Update document
  const modifier = { $set: { emailDeliveryStatus: deliveryStatus } };
  CustomersCollection.update({ _id: customerId }, modifier);
};
//------------------------------------------------------------------------------

export default CustomersApiServer;
