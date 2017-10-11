// import { Meteor } from 'meteor/meteor';
// import { EJSON } from 'meteor/ejson';
import { check, Match } from 'meteor/check';
import { Email } from 'meteor/email';
// import AuxFunctions from '../../aux-functions.js';
import Constants from '../../constants.js';

// Namespace
const EmailSystemApiServer = {};

//------------------------------------------------------------------------------
/**
* @summary Send email (containing customer's data) to destination . This
* function must be called from a trusted source (server) since we are not
* validating the user credentials.
* @param {string} - to. Email destination.
* @param {object} - Customer. Customer data.
*/
EmailSystemApiServer.sendCustomerData = (to, customer) => {
  console.log('EmailSystem.apiServer.sendCustomerData input:', to, customer);
  check(to, String);
  check(customer, {
    _id: String,
    createdAt: Date,
    name: String,
    postalCode: String,
    phoneNumber: String,
    email: String,
  });

  // Send email
  try {
    Email.send({
      to,
      from: `no-reply@${Constants.DOMAIN_NAME}`,
      subject: 'Customer\'s installation request',
      text: `
        A user has requested more info and/or a demo of a PROTECT fog cannon.\n
        Please contact the below-mentioned person.\n\n
        Name: ${customer.name};\n
        Postal code: ${customer.postalCode};\n
        Phone number: ${customer.phoneNumber};\n
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

export default EmailSystemApiServer;
