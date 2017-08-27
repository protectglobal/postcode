// import { Meteor } from 'meteor/meteor';
// import { EJSON } from 'meteor/ejson';
import _ from 'underscore';
import { check, Match } from 'meteor/check';
import AuxFunctions from '../aux-functions.js';

// Namespace
const ImagesApiBoth = {};

//------------------------------------------------------------------------------
/**
* @summary Verify image size and format before inserting doc into database.
* @param {[file]} - images. Array of image files.
* @param {string} - fieldName. Field name associated to the error check.
* @param {number} - limit. Maximum number of images.
* @return {object} - errors.
*/
ImagesApiBoth.checkImages = (images, fieldName, limit) => {
  console.log('Images.apiBoth.checkImages input:', images, fieldName);
  check(fieldName, String);
  check(limit, Number);

  // Initialize errors
  const errors = {
    [fieldName]: [],
  };

  // Checks
  if (images.length > limit) {
    errors[fieldName].push(`You can upload up to ${limit}`);
  }

  _.each(images, (file) => {
    if (!file) {
      errors[fieldName].push('Field is required');
    }

    if (!AuxFunctions.checkImageSize(file)) {
      errors[fieldName].push('Image is too big');
    }

    if (!AuxFunctions.checkImageFormat(file)) {
      errors[fieldName].push('Image has wrong format');
    }
  });

  return errors;
};
//------------------------------------------------------------------------------

export default ImagesApiBoth;
