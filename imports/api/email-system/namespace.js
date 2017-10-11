import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

/**
* @namespace EmailSystem
*/
const EmailSystem = {
  // both methods and publications live in the Meteor namespace
};

// Load server-only utilities
if (Meteor.isServer) {
  import EmailSystemApiServer from './server/api.js';
  _.extend(EmailSystem, { apiServer: EmailSystemApiServer });
}

export default EmailSystem;
