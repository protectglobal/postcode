import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import _ from 'underscore';
import Users from '../../users/namespace.js';

//------------------------------------------------------------------------------
/**
* @summary This method should be called right after the user signs up, in order
* to provide a welcome message + a verification email link.
* @see {@link https://themeteorchef.com/snippets/using-the-email-package/}
* @see {@link https://meteorhacks.com/server-side-rendering}
* @see {@link http://docs.meteor.com/#/full/accounts_sendverificationemail}
*/
Meteor.methods({ 'EmailSystem.methodsServer.sendVerificationLink'() {
  console.log('about to send verification email...');
  const curUserId = this.userId;

  // User should be logged in at this stage!
  if (!curUserId) {
    throw new Meteor.Error(403, 'user should be logged in at sendVerificationLink');
  }

  const user = Users.collection.findOne({ _id: curUserId });

  if (!user) {
    throw new Meteor.Error('user-not-found', 'The user is not registered in our database');
  }

  if (user.emails[0].verified === true) {
    throw new Meteor.Error(400, 'Email already verified!');
  }

  try {
    Accounts.sendVerificationEmail(curUserId);
  } catch (exc) {
    console.log(exc);
    throw new Meteor.Error(500, `Verification email couldn't be delivered. Reason: ${exc.response}`);
  }

  console.log('verification email sent!');
} });
//------------------------------------------------------------------------------
/**
* @summary Send email with a reset password link.
* @see {@link https://themeteorchef.com/snippets/using-the-email-package/}
* @see {@link http://docs.meteor.com/#/full/accounts_sendresetpasswordemail}
* @see {@link https://meteorhacks.com/server-side-rendering}
* @see {@link http://docs.meteor.com/#/full/accounts_sendresetpasswordemail}
* @see server/accounts/emailTemplates.js
*/
Meteor.methods({ 'EmailSystem.methodsServer.sendResetPasswordLink'(email) {
  console.log('about to send recover password email...');
  check(email, String);

  const curUserId = this.userId; // should be undefined!

  // User shouldn't be logged in at this stage!
  if (curUserId) {
    throw new Meteor.Error(403,
      'Mmm, user should not be logged in at sendResetPasswordLink');
  }

  // Make sure the user exists
  const targetUser = Accounts.findUserByEmail(email);
  if (!targetUser) {
    throw new Meteor.Error(403, 'User not found');
  }

  const { _id: targetUserId, accountDeactivated } = targetUser;

  if (!_.isUndefined(accountDeactivated) && accountDeactivated === true) {
    throw new Meteor.Error(403, 'Account has been Deactivated');
  }

  try {
    Accounts.sendResetPasswordEmail(targetUserId, email);
  } catch (exc) {
    console.log(exc);
    throw new Meteor.Error(500, `Reset password email couldn't be delivered. Reason: ${exc.response}`);
  }
  console.log('recover password email sent!');
} });
//------------------------------------------------------------------------------
