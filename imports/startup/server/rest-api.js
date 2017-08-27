import { Meteor } from 'meteor/meteor';
import { Restivus } from 'meteor/nimble:restivus';
import { EJSON } from 'meteor/ejson';
// import _ from 'underscore';
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
    if (!hashed || hashed !== true) {
      throw new Error('Please, hash your password');
    }

    // Any returned data will be added to the response body as data.extra
    return {
      role: this.user.roles[0],
    };
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

      const { err: err2, installer } = Installers.apiServer.getAssignee(customer.postalcode);

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
        Customers.apiServer.setAssignedInstaller(customer._id, installer);

        // Send email containing customer data to installer
        const { deliveryStatus } = Installers.apiServer.sendEmail(installer._id, customer);

        // Save email delivery status into customer record
        Customers.apiServer.setEmailDeliveryStatus(customer._id, deliveryStatus);
      });

      // Handle success
      return {
        statusCode: 200,
        body: {
          status: 'success',
          message: `Assignee installer: ${EJSON.stringify(installer, { indent: true })}`,
        },
      };
    },
  },
});
