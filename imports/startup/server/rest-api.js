import { Meteor } from 'meteor/meteor';
import { Restivus } from 'meteor/nimble:restivus';
import { EJSON } from 'meteor/ejson';
import _ from 'underscore';
import Customers from '../../api/customers/namespace.js';
import Installers from '../../api/installers/namespace.js';

//------------------------------------------------------------------------------
// CONFIGURE FIRST VERSION OF THE API:
//------------------------------------------------------------------------------
/**
* @see {@link https://github.com/kahmali/meteor-restivus}
*/
const ApiV1 = new Restivus({
  version: 'v1',
  apiPath: 'api/',
  useDefaultAuth: true,
  prettyJson: true,
  onLoggedIn() {
    console.log('API login this.bodyParams', this.bodyParams);
    const { hashed } = this.bodyParams;

    // Throw error, ie, don't return credentials if user didn't hash password
    if (!hashed || (hashed !== true && hashed !== 'true')) {
      throw new Error('Please, hash your password');
    }
  },
});

//------------------------------------------------------------------------------
// LOGIN:
//------------------------------------------------------------------------------
/**
* @api {post} /login - Authenticate user: the user needs to be registered on the
* app, so first of all go to the app and create an account using your email and
* password! Then, once the success response is back, remember to store the
* authToken and userId values to use them with every further call to the API.
*
* @apiName Login User
* @apiGroup User
*
* @apiExample {curl} Example usage:
* curl http://localhost:3000/api/v1/login/ -d "email=test@example.com&password=sha-256-password&hashed=true" (see apiParam below)
* OR
* curl http://localhost:3000/api/v1/login/ -d "email=test@example.com&password=password"
*
* @apiParam {String} email.
* @apiParam {String} sha-256-password. (you can use https://www.npmjs.com/package/js-sha256)
*
* @apiSuccessExample Success-Response:
* statusCode: 200,
* body: {
*   "status": "success",
*   "data": {
*     "authToken": "GYG4QxtEanyD7xSqac8eJKFKjHO-4PMfsEpF_6eQyof",
*     "userId": "GeN6cS5m7boGzWE9y",
*     "extra": {
*           "role": "admin",
*     }
*   }
* },
*
* @apiError Wrong credentials.
*
* @apiErrorExample Error-Response:
* statusCode: 404,
* body: {
*  "status": "error",
*  "message": "Unauthorized"
* },
*/
//------------------------------------------------------------------------------
// LOGOUT:
//------------------------------------------------------------------------------
/**
* @api {post} /logout - Logout user (user needs to be registered on the app!).
* @apiName Logout User
* @apiGroup User
*
* @apiExample {curl} Example usage:
* curl http://localhost:3000/api/v1/logout -X POST -H "X-Auth-Token: GYG4QxtEanyD7xSqac8eJKFKjHO-4PMfsEpF_6eQyof" -H "X-User-Id: GeN6cS5m7boGzWE9y"
*
* @apiSuccessExample Success-Response:
* statusCode: 200,
* body: {
*   "status": "success",
*   "data": {
*     "message": "You've been logged out!"
*   }
* },
*
* @apiError Not authenticated / Wrong credentials.
*
* @apiErrorExample Error-Response:
* statusCode: 404,
* body: {
*    "status": "error",
*    "message": "You must be logged in to do this."
* },
*/
//------------------------------------------------------------------------------
// LOG USER:
//------------------------------------------------------------------------------
/**
* @api {post} /insert-customer - Insert user data into Customers collection.
* Authentication is required + admin role.
* @apiName Insert Customer
* @apiGroup Customers
*
* @apiExample {curl} Example usage:
* curl -H "Content-Type: application/json" -H "X-Auth-Token: GYG4QxtEanyD7xSqac8eJKFKjHO-4PMfsEpF_6eQyof" -H "X-User-Id: GeN6cS5m7boGzWE9y"
* -X POST -d '{"name":"John Smith","postalCode":"XXXX", "phoneNumber": "5434554", "email": "email@example.com"}'
* http://localhost:3000/api/v1/insert-customer/
*
* @apiPermission admin
*
* @apiParam {String} name (required)
* @apiParam {String} postalCode (required)
* @apiParam {String} phoneNumber (required)
* @apiParam {String} email (required)
*
* @apiSuccess {String} customerId - Id of the recently created customer.
*
* @apiSuccessExample Success-Response:
* statusCode: 200,
* body: {
*   status: 'success',
*   message: `customerId: ${customerId}`,
* },
*
* @apiError Required fields.
*
* @apiErrorExample Error-Response:
* statusCode: 404,
* body: {
*   status: 'fail',
*   message: err.reason,
* },
*/
ApiV1.addRoute('insert-customer', { authRequired: true }, {
  post: {
    roleRequired: ['admin'],
    action() {
      // Console log params
      console.log('API insert-customer this.bodyParams', this.bodyParams);

      // Destructure
      const { name, postalCode, phoneNumber, email } = this.bodyParams;

      // Ensure string
      const newCustomer = {
        name: (name && String(name)) || '',
        postalCode: (postalCode && String(postalCode)) || '',
        phoneNumber: (phoneNumber && String(phoneNumber)) || '',
        email: (email && String(email)) || '',
      };

      // Insert customer
      const { err: err1, customer } = Customers.apiServer.insertCustomer(newCustomer);

      // Handle error
      if (err1) {
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: err1.reason,
          },
        };
      }

      // Get assignee installer from postal code
      const { postalCode: pc } = customer;
      const { err: err2, installer } = Installers.apiServer.getAssignee(pc);

      // Handle error
      if (err2) {
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: err2.reason,
          },
        };
      }

      // Don't wait for the following task to be done before giving the client
      // the green light to move ahead
      Meteor.defer(() => {
        // Save assigned installer into customer record
        const { _id: customerId } = customer;
        const { _id: installerId } = installer;
        Customers.apiServer.setAssignedInstaller(customerId, installerId);

        // Send email containing customer data to installer
        const { deliveryStatus } = Installers.apiServer.sendEmail(installerId, Object.assign({}, customer));

        // Save email delivery status into customer record
        Customers.apiServer.setEmailDeliveryStatus(customerId, deliveryStatus);
      });

      // List of fields to return
      const fields = [
        'companyName',
        'addressOne',
        'addressTwo',
        'postalCode',
        'city',
        'phoneNumber',
        'email',
      ];

      // Handle success
      return {
        statusCode: 200,
        body: {
          status: 'success',
          message: `Assignee installer: ${EJSON.stringify(_.pick(installer, fields), { indent: true })}`,
          // message: EJSON.stringify(_.pick(installer, fields), { indent: true }),
        },
      };
    },
  },
});
//------------------------------------------------------------------------------
// CLEAR TEST DB:
//------------------------------------------------------------------------------
/**
* @api {post} /clear-test-db - Remove test data from DB.
* Authentication is required + admin role.
* @apiName clearTestDB
*
* @apiExample {curl} Example usage:
* curl -H "Content-Type: application/json"
* -H "X-Auth-Token: RvTXFHcFUffkQX3OU47DdSDQJRuGbm0HWEImZolzm1b"
* -H "X-User-Id: qGayZqBt6RCKQPLgL"
* -X POST http://localhost:3000/api/v1/clear-test-db/
*
* @apiPermission admin
*
* @apiSuccessExample Success-Response:
* statusCode: 200,
* body: {
*   status: 'success',
*   message:  'DB test docs cleaned',
* },
*
* @apiErrorExample Error-Response:
* statusCode: 404,
* body: {
*   status: 'fail',
*   message: err.reason,
* },
*/
ApiV1.addRoute('clear-test-db', { authRequired: true }, {
  post: {
    roleRequired: ['admin'],
    action() {
      // Destructure
      console.log('API clear-test-db this.bodyParams', this.bodyParams);

      // Clear docs inserted by the test suit. Handle errors if any in order to
      // be displayed to the API consumer.
      const { err } = Customers.apiServer.clearTestDocs();
      console.log(err);

      // Handle response errors
      if (err) {
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: err,
          },
        };
      }
      return {
        statusCode: 200,
        body: {
          status: 'success',
          message: 'DB test docs cleaned',
        },
      };
    },
  },
});
//------------------------------------------------------------------------------
