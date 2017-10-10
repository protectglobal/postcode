import { Meteor } from 'meteor/meteor';
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
  try {
    const customerId = CustomersCollection.insert(doc);
    return {
      err: null,
      customer: CustomersCollection.findOne({ _id: customerId }),
    };
  } catch (exc) {
    console.log(exc);
    return {
      err: {
        reason: EJSON.stringify(exc, { indent: true }), // TODO: test this error
      },
      customer: null,
    };
  }
};
//------------------------------------------------------------------------------
/**
* @summary Save assigned installer id into customer doc. This function must be
* called from a trusted source (server) since we are not validating the user
* credentials.
* @param {string} - customerId.
* @return {string} - installerId.
*/
CustomersApiServer.setAssignedInstaller = (customerId, installerId) => {
  console.log('\nCustomers.apiServer.setAssignedInstaller:', customerId, installerId);
  check([customerId, installerId], [String]);

  CustomersCollection.update({ _id: customerId }, { $set: { installerId } });
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
/**
* @summary Remove test coduments from DB. This function must be called from a
* trusted source (server) since we are not validating the user credentials.
*/
CustomersApiServer.clearTestDocs = () => {
  // console.log('Customers.apiServer.clearTestDocs');
  const { testCode } = Meteor.settings;


  if (!testCode || testCode.trim().length === 0) {
    return { err: 'test code is required' };
  }

  try {
    const selector = {
      $or: [
        { name: new RegExp(testCode, 'i') },
        { postalCode: new RegExp(testCode, 'i') },
      ],
    };
    CustomersCollection.remove(selector);
    return { err: null };
  } catch (exc) {
    console.log(exc);
    return {
      err: 'Something went wrong at clearTestBloggerDocs',
    };
  }
};
//------------------------------------------------------------------------------

export default CustomersApiServer;
