import { check, Match } from 'meteor/check';
import AuxFunctions from '../aux-functions.js';
import UsersCollection from './collection.js';

// Namespace
const UsersApiBoth = {};

//------------------------------------------------------------------------------
/**
* @summary Check whether the given user has verified his/her email address.
*/
UsersApiBoth.isAccountVerified = (userId) => {
  check(userId, Match.Maybe(String));

  const user = UsersCollection.findOne({ _id: userId }, { fields: { emails: true } });
  if (!userId || !user || !user.emails || !user.emails[0] || !user.emails[0].verified) {
    return false;
  }
  return true;
};
//------------------------------------------------------------------------------
/**
* @summary Verify new user fields before inserting doc into database.
*/
UsersApiBoth.checkSignupFields = (newUser) => {
  check(newUser, {
    email: String,
    name: String,
    password: String,
  });

  // Destructure
  const { name, email, password } = newUser;

  // Initialize errors
  const errors = {
    email: [],
    name: [],
    password: [],
  };

  // Checks
  if (!name) {
    errors.name.push('Name is required');
  } else {
    if (name.trim().length === 0) {
      errors.name.push('Name is required');
    }
    if (name.length > 20) {
      errors.name.push('Name cannot be longer than 20 characters');
    }
    if (AuxFunctions.validateEmail(name)) {
      errors.name.push('Name cannot be an email address');
    }
    if (AuxFunctions.validateUrl(name)) {
      errors.name.push('Name cannot be an url');
    }
  }
  if (!email) {
    errors.email.push('Email is required');
  } else if (!AuxFunctions.validateEmail(email)) {
    errors.email.push('Use a valid email');
  }
  if (!password) {
    errors.password.push('Password is required');
  } else {
    if (password.trim().length === 0) {
      errors.password.push('Password is required');
    }
    if (password.length < 6) {
      errors.password.push('Password must be at least 6 characters long');
    }
    if (password === email) {
      errors.password.push('Password can\'t be your email');
    }
  }

  return errors;
};
//------------------------------------------------------------------------------
/**
* @summary Handle errors from createUser callback.
*/
UsersApiBoth.handleCreateUserErrors = (err) => {
  // check(err, Object);

  // Destructure
  const { error, reason } = err;

  // Initialize errors
  const errors = {
    email: [],
    name: [],
    password: [],
  };

  // Handle known errors firts
  if (error === 403) {
    if (reason === 'Email already exists.') {
      // XXX i18n
      errors.email.push('Email already exists');
    }
  // Handle unexpected error
  } else {
    // XXX i18n
    errors.name.push('Unexpected error');
    errors.email.push('Unexpected error');
    errors.password.push('Unexpected error');
  }

  return errors;
};
//------------------------------------------------------------------------------
/**
* @summary Verify user fields before inserting doc into database.
*/
UsersApiBoth.checkLoginFields = (credentials) => {
  check(credentials, {
    email: String,
    password: String,
  });

  // Destructure
  const { email, password } = credentials;

  // Initialize errors
  const errors = {
    email: [],
    password: [],
  };

  // Checks
  if (!email) {
    errors.email.push('Email is required');
  } else if (!AuxFunctions.validateEmail(email)) {
    errors.email.push('Use a valid email');
  }
  if (!password) {
    errors.password.push('Password is required');
  }

  return errors;
};
//------------------------------------------------------------------------------
/**
* @summary Handle errors from loginWithPassword callback.
*/
UsersApiBoth.handleLoginWithPasswordErrors = (err) => {
  // check(err, Object);

  // Destructure
  const { error, reason } = err;

  // Initialize errors
  const errors = {
    email: [],
    password: [],
  };

  // Handle known errors firts
  if (error === 403) {
    switch (reason) {
      case 'Incorrect password':
        // XXX i18n
        errors.password.push(reason);
        break;
      case 'User not found':
        // XXX i18n
        errors.email.push(reason);
        break;
      case 'Account has been Deactivated':
        // XXX i18n
        errors.password.push(reason);
        errors.email.push(reason);
        break;
      default:
        // XXX i18n
        errors.password.push('Unknown error');
        errors.email.push('Unknown error');
        break;
    }
  // Handle unexpected error
  } else {
    // XXX i18n
    errors.password.push('Unexpected error');
    errors.email.push('Unexpected error');
  }

  return errors;
};
//------------------------------------------------------------------------------
/**
* @summary Verify email before sending recover password link.
*/
UsersApiBoth.checkForgotPasswordFields = (email) => {
  check(email, String);

  // Initialize errors
  const errors = {
    email: [],
  };

  // Checks
  if (!email) {
    errors.email.push('Email is required');
  } else if (!AuxFunctions.validateEmail(email)) {
    errors.email.push('Use a valid email');
  }

  return errors;
};
//------------------------------------------------------------------------------
/**
* @summary Handle errors from loginWithPassword callback.
*/
UsersApiBoth.handleForgotPasswordErrors = (err) => {
  // check(err, Object);

  // Destructure
  const { error, reason } = err;

  // Initialize errors
  const errors = {
    email: [],
  };

  // Handle known errors firts
  if (error === 403) {
    // XXX i18n
    errors.email.push(reason || 'Unexpected error');
  // Handle unexpected error
  } else {
    // XXX i18n
    errors.email.push('Unexpected error');
  }

  return errors;
};
//------------------------------------------------------------------------------
/**
* @summary Verify password before setting new password.
*/
UsersApiBoth.checkResetPasswordFields = (password, password2) => {
  check([password, password2], [String]);

  // Initialize errors
  const errors = {
    password: [],
    password2: [],
  };

  // Checks
  if (!password || !password2) {
    if (!password) {
      errors.password.push('Password is required');
    }
    if (!password2) {
      errors.password2.push('Password is required');
    }
  } else {
    if (password !== password2) {
      errors.password.push('Password doesn\'t match');
      errors.password2.push('Password doesn\'t match');
    }
    if (password.trim().length === 0) {
      errors.password.push('Password is required');
    }
    if (password.length < 6) {
      errors.password.push('Password must be at least 6 characters long');
    }
  }

  return errors;
};

//------------------------------------------------------------------------------
/**
* @summary Verify password before setting new password.
*/
UsersApiBoth.checkChangePasswordFields = (oldPassword, newPassword) => {
  check([oldPassword, newPassword], [String]);

  // Initialize errors
  const errors = {
    oldPassword: [],
    newPassword: [],
  };

  // Checks
  if (!oldPassword) {
    errors.oldPassword.push('Old password is required');
  }
  if (!newPassword || newPassword.trim().length === 0) {
    errors.newPassword.push('New password is required');
  } else if (newPassword.length < 8) {
    errors.newPassword.push('New password must be at least 8 characters long');
  }

  return errors;
};
//------------------------------------------------------------------------------

export default UsersApiBoth;
