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
* @return {string} - customerId.
*/
CustomersApiServer.insertCustomer = (newCustomer) => {
  console.log('Customers.apiServer.insertCustomer input:', newCustomer);
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
      customerId: null,
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
        reason: EJSON.stringify(exc, { indent: true }),
      },
      customerId: null,
    };
  }

  return {
    err: null,
    customerId,
  };
};
//------------------------------------------------------------------------------

export default CustomersApiServer;
