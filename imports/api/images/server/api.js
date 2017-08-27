import { EJSON } from 'meteor/ejson';
import { check, Match } from 'meteor/check';
import AuxFunctions from '../../aux-functions.js';
import ImagesCollection from '../collection.js';
import ImagesApiBoth from '../api.js';

// Namespace
const ImagesApiServer = {};

//------------------------------------------------------------------------------
/**
* @summary Insert a new image record into the Images collection. This
* function must be called from a trusted source (server) since we are not
* validating the user credentials.
* @param {string} - curUserId. Current user id.
* @param {object} - newImage. newImage = { url, secureUrl, width, height, publicId }
* @return {string} - imageId. Image id of the recently created doc.
*/
ImagesApiServer.insertImage = (curUserId, newImage) => {
  // console.log('Images.apiServer.insertImage input:', curUserId, newImage);
  check(curUserId, String);
  check(newImage, {
    publicId: String,
    url: String,
    secureUrl: String,
    width: String,
    height: String,
  });

  // Check for errors
  /* const errors = ImagesApiBoth.checkInstallerFields(newImage);
  if (AuxFunctions.hasErrors(errors)) {
    return {
      err: {
        reason: AuxFunctions.getFirstError(errors).value,
      },
      imageId: null,
    };
  } */

  // Attach createdAt and createdBy fields to doc before insertion
  const doc = Object.assign(
    {},
    newImage,
    { createdAt: new Date(), createdBy: curUserId },
  );

  // Insert document
  let imageId = '';
  try {
    imageId = ImagesCollection.insert(doc);
  } catch (exc) {
    console.log(exc);
    return {
      err: {
        reason: EJSON.stringify(exc, { indent: true }), // TODO: test this error
      },
      imageId: null,
    };
  }

  return {
    err: null,
    imageId,
  };
};
//------------------------------------------------------------------------------
