import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import Constants from '../../constants.js';
import Users from '../../users/namespace.js';
import ImagesApiServer from './api.js';

//------------------------------------------------------------------------------
/**
* @summary Insert new image into Images collection.
* @param {object} - newImage. newImage = { url, secureUrl, width, height, publicId }
* @return {string} - imageId. Image id of the recently created doc.
*/
Meteor.methods({ 'Images.methodsServer.saveImage'(newImage) {
  // console.log('Images.methodsServer.saveImage', newImage);
  check(newImage, {
    publicId: String,
    url: String,
    secureUrl: String,
    width: String,
    height: String,
  });

  // Get current user.
  const curUserId = this.userId;

  // Verify current user is logged in.
  if (!curUserId) {
    throw new Error(403, 'User is not logged in at Images.methodsServer.saveImage');
  }

  // Is the account verified?
  if (!Users.apiBoth.isAccountVerified(curUserId)) {
    throw new Error(403, 'User account is not verified at Images.methodsServer.saveImage');
  }

  // Check user role
  if (!Roles.userIsInRole(curUserId, Constants.INSTALLERS_PAGE_ROLES)) {
    throw new Error(403, 'Wrong user role at Images.methodsServer.saveImage');
  }

  const { err, imageId } = ImagesApiServer.insertImage(curUserId, newImage);
  if (err) {
    // Bubble up error to client view
    throw new Error(500, err.reason);
  }

  return imageId;
} });
//------------------------------------------------------------------------------
