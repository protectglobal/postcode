import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import _ from 'underscore';
// const parseDomain = require('parse-domain');

/**
* @namespace AuxFunctions
*/
const AuxFunctions = {};

//------------------------------------------------------------------------------
/**
* @summary Format cloudinary raw data.
* @param {object} - data. Data retrieved by Cloudinary.
*/
AuxFunctions.formatCloudinaryData = (data) => {
  check(data, {
    public_id: String,
    resource_type: String,
    format: String,
    bytes: Number,
    height: Number,
    width: Number,
    url: String,
    secure_url: String,
    created_at: String,
    etag: String,
    tags: [String],
    type: String,
    signature: String,
    version: Number,
  });

  // Destructure
  const {
    public_id,
    resource_type,
    format,
    bytes,
    height,
    width,
    url,
    secure_url,
  } = data;

  // Filter and format data into camelCase
  return {
    publicId: public_id,
    resourceType: resource_type,
    format,
    bytes,
    height,
    width,
    url,
    secureUrl: secure_url,
  };
};
//------------------------------------------------------------------------------
/**
* @summary Check that file size is less or equal than the provided one.
* @param {file} - file. File for which we want to check format.
* @param {number} - size. Size in bytes.
*/
AuxFunctions.checkFileSize = (file, size) => {
  check(size, Number);

  // console.log('AuxFunctions.checkFileSize', file);
  return file && file.size && file.size <= size;
};
//------------------------------------------------------------------------------
/**
* @summary Check that file has one of the given formats.
* @param {file} - file. File for which we want to check format.
* @param {[string]} - formats. Array containg the allowed formats.
*/
AuxFunctions.checkFileFormat = (file, formats) => {
  check(formats, [String]);

  // console.log('AuxFunctions.checkFileFormat', file);
  // Checks
  if (!file || !file.type) {
    return false;
  }

  const tokens = file.type.split('/');
  return formats.indexOf(tokens[0]) !== -1;
};
//------------------------------------------------------------------------------
/**
* @summary Validate if a given string is a feasible dollar amount.
*
* Regex breakdown:
* ^\$? start of string with $ a single dollar sign (opional)
* ([1-9]\d{0,2}(,\d{3})*) 1-3 digits where the first digit is not a 0, followed
* by 0 or more occurrences of a comma with 3 digits
* or
* (([1-9]\d*)?\d) 1 or more digits where the first digit can be 0 only if it's
* the only digit
* (\.\d{1,4})?$ with a period and up to 4 digits optionally at the end of the string
*/
AuxFunctions.validateAmount = (amount) => {
  const re = /^\$?(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d{1,4})?$/;
  return re.test(amount);
};
/* const tests = ['$50.32', '50.32$', '89.95', '$1,230.00', '€34.55', '$52.5', '54.0090999'];
for (let i = 0; i < tests.length; i++) {
  console.log(tests[i]);
  console.log(AuxFunctions.validateAmount(tests[i]));
} */
//------------------------------------------------------------------------------
/**
* @summary Given the string '$1,230.65' return the float 1230.65
* In case there is a symbol different than dollar, return undefined
*/
AuxFunctions.getFloatFromAmount = (amount) => {
  // Check expected format, otherwise return undefined.
  if (!AuxFunctions.validateAmount(amount)) {
    return undefined;
  }
  // Remove dollar sign and commas and transform the remaining string to float.
  return parseFloat(amount.replace(/\$/g, '').replace(/\,/g, ''), 10);
};
/* const tests = ['$50.32', '50.32$', '89.95', '$1,230.00', '€34.55'];
for (let i = 0; i < tests.length; i++) {
  console.log(tests[i]);
  console.log(AuxFunctions.getFloatFromAmount(tests[i]));
} */
//------------------------------------------------------------------------------
AuxFunctions.validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return re.test(email);
};
//------------------------------------------------------------------------------
AuxFunctions.validateUrl = (url) => {
  const re = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  return re.test(url);
};
//------------------------------------------------------------------------------
/**
* @summary Trim and remove backslashes from url.
*/
/* AuxFunctions.formatUrl = (url) => (
  url.trim().toLowerCase().replace(/\/+$/, '')
); */
//------------------------------------------------------------------------------
/**
* @summary Trim the given url.
*/
AuxFunctions.simpleFormatUrl = url => (
  url.trim()
);
//------------------------------------------------------------------------------
/**
* @summary Trim, lowercase, remove backslashes, http:// and https:// protocols
* as well as www-prefix if any from url.
*/
AuxFunctions.fullFormatUrl = url => (
  url.trim().toLowerCase().replace(/\/+$/, '')
  .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
);
//------------------------------------------------------------------------------
/**
* @summary Extract domain name from a given url, ie, remove protocols and www.
* subdomin.
* @example Given http://www.abc.com returns abc.com
* parsedDomain = {
*    subdomain: string
*    domain: string,
*    tld: string,
* }
*/
AuxFunctions.getDomainName = url => (
  url.trim().toLowerCase().replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
  .split('/')[0]
);
//------------------------------------------------------------------------------
/**
* @summary Extract domain name from a given url, ie, remove protocols and all
* subdomains.
* @example Given http://www.abc.com returns abc.com
* parsedDomain = {
*    subdomain: string
*    domain: string,
*    tld: string,
* }
*/
/* AuxFunctions.getDomainName = (url) => {
  const { domain, tld } = parseDomain(url);
  return `${domain}.${tld}`;
}; */
/*
const tests = [
  'http://abc.com',
  'https://abc.com',
  'abc.com',
  'http://www.abc.com',
  'https://www.abc.com',
  'www.abc.com',
  'http://blog.abc.com',
  'https://blog.abc.com',
  'blog.abc.com',
  'http://abc.com/',
  'https://abc.com/',
  'abc.com/',
];
const exp = 'abc.com';
for (let i = 0; i < tests.length; i++) {
  console.log(tests[i]);
  console.log(AuxFunctions.getDomainName(tests[i]));
  console.log(`${AuxFunctions.getDomainName(tests[i]) === exp ? 'PASSED' : 'FAILED'}`);
  console.log('---');
} */
//------------------------------------------------------------------------------
/**
* @summary Get site url including protocol and www-prefix if present
* @example Given http://www.abc.com/something returns http://www.abc.com
*/
AuxFunctions.getSiteUrl = (url) => {
  const trimmedUrl = url.trim();
  const domainName = trimmedUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
  // Find domain name position (index of first char)
  const index = trimmedUrl.indexOf(domainName);
  // Remove everything after domain name
  return trimmedUrl.slice(0, index + domainName.length);
};
//------------------------------------------------------------------------------
/**
* @summary Get url protocol from url.
*/
AuxFunctions.getUrlProtocol = url => (
  url.slice(0, 5).toLowerCase() === 'https' ? 'https' : 'http'
);
//------------------------------------------------------------------------------
/**
* @summary Extract domain name from a given url.
* @example Given http://www.abc.com returns abc.com
* (?:https?:\/\/)? ---> is there an http or https part? don't capture them.
* (?:w{3}.)? ---> are there 3 w? don't capture them
* ([a-z\d.-]+). ---> the domain name part. Capture it.
* (?:[a-z.]{2,10})(?:[/\w.-]) ---> the directories and folders part. don't capture them.
*/
/* AuxFunctions.getSiteUrl = (url) => {
  const urlWithProtocol = url.slice(0, 4).toLowerCase() === 'http' ? url : `http://${url}`;
  const match = urlWithProtocol.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
  }
  return null;
}; */
//------------------------------------------------------------------------------
AuxFunctions.validateAlphanumeric = (expression) => {
  const re = /^[a-z0-9]+$/i;
  return re.test(expression);
};
//------------------------------------------------------------------------------
AuxFunctions.validateName = (expression) => {
  const re = /^[a-z][a-z\s]*$/;
  return re.test(expression);
};
//------------------------------------------------------------------------------
/**
* @summary Get start of current date (today at 00:00:00).
*/
AuxFunctions.getStartCurDate = () => {
  const actualDate = new Date(); // 2013-07-30 17:11:00
  const startOfDayDate = new Date(actualDate.getFullYear()
                             , actualDate.getMonth()
                             , actualDate.getDate()
                             , 0, 0, 0); // 2013-07-30 00:00:00
  return startOfDayDate;
};
//------------------------------------------------------------------------------
/**
* @summary Get current year.
*/
AuxFunctions.getCurYear = () => {
  const now = new Date();
  const curYear = now.getFullYear(); // integer
  return curYear;
};
//------------------------------------------------------------------------------
/**
* @summary Get current month.
*/
AuxFunctions.getCurMonth = () => {
  const now = new Date();
  const curMonth = now.getMonth() + 1; // integer; now.getMonth() in [0, 11]
  return curMonth;
};
//------------------------------------------------------------------------------
/**
* @summary Is there any errors?
* @param {array} errors - Errors array.
*/
AuxFunctions.hasErrors = (errors) => {
  check(errors, Object);
  let response = false;

  // Go over all errors to see if at least one of them is not empty
  _.each(errors, (err) => {
    if (err.length > 0) {
      response = true;
    }
  });

  return response;
};
//------------------------------------------------------------------------------
/**
* @summary Return fieldName associated errors
* @param {array} errors - Errors array.
* @param {string} fieldName - Field name.
*/
AuxFunctions.getFieldNameErrors = (errors, fieldName) => {
  check(errors, Object);
  check(fieldName, String);

  return errors && errors[fieldName] && errors[fieldName].length > 0 && errors[fieldName].toString();
};
//------------------------------------------------------------------------------
/**
* @summary Clean error messages for the given field name (array of field names)
* leaving the remaining errors untached.
*/
AuxFunctions.clearErrors = (errors, fieldName) => {
  check(errors, Object);
  check(fieldName, Match.OneOf(String, [String]));

  const errorKeys = _.keys(errors);
  const clearedErrors = {};

  // Remove errors for the given field name
  _.each(errorKeys, (key) => {
    if ((_.isString(fieldName) && key === fieldName)
      || (_.isArray(fieldName) && _.indexOf(fieldName, key) !== -1)) {
      clearedErrors[key] = [];
    } else {
      clearedErrors[key] = errors[key];
    }
  });

  return clearedErrors;
};
//------------------------------------------------------------------------------
/**
* @summary Returns the first (not empty) error message.
*/
AuxFunctions.getFirstError = (errors) => {
  check(errors, Object);

  const errorKeys = _.keys(errors);
  const indexes = [];

  // Get the indexes of those keys that contain non-empty errors
  _.each(errorKeys, (key, index) => {
    if (errors[key].length > 0) {
      indexes.push(index);
    }
  });

  // No errors
  if (indexes.length === 0) {
    return '';
  }

  // Has errors
  const firstIndex = indexes[0];
  const keyFirstError = errorKeys[firstIndex]; // key associated to the first non-empty error
  return {
    key: keyFirstError,
    value: errors[keyFirstError][0],
  };
};
//------------------------------------------------------------------------------
/**
* @summary Returns the average value of the array.
*/
AuxFunctions.getAverage = (array) => {
  check(array, [Number]);

  const sum = array.reduce((total, value) => (
    total + value
  ), 0);

  return sum / array.length;
};
//------------------------------------------------------------------------------
/**
* @summary Returns the index of the maximum value of an array.
*/
AuxFunctions.getMaxValueIndex = (array) => {
  check(array, [Number]);

  let maxIndex = -1;
  let maxValue;
  _.each(array, (value, index) => {
    if (!maxValue || value >= maxValue) {
      maxValue = value;
      maxIndex = index;
    }
  });
  return maxIndex;
};
//------------------------------------------------------------------------------
/**
* @summary Checks whether the given option has some relevant data or is 'empty'
*/
AuxFunctions.optionIsEmpty = (selectedOption) => {
  check(selectedOption, Object);

  const values = _.values(selectedOption);
  let isEmpty = true;

  _.each(values, (value) => {
    if (value.length > 0) { // works for both string and array values
      isEmpty = false;
    }
  });
  return isEmpty;
};
//------------------------------------------------------------------------------
AuxFunctions.ensureString = input => (
  !input || !_.isString(input) ? '' : input
);
//------------------------------------------------------------------------------
/**
* @summary replace dash with space.
* @example AuxFunctions.replaceDashWithSpace('edit-pages') = 'edit pages'
*/
AuxFunctions.replaceDashWithSpace = str => (
  str.replace(/-/g, ' ')
);
//------------------------------------------------------------------------------
/**
* @summary replace spaces with dashes.
* @example AuxFunctions.replaceSpaceWithDash('edit pages') = 'edit-pages'
*/
AuxFunctions.replaceSpaceWithDash = str => (
  str.replace(/\s+/g, '-')
);
//------------------------------------------------------------------------------
/**
* @summary transform space to low dash and all letter to upper case.
* @example AuxFunctions.toUpperCaseLowDash('Edit Pages') = 'EDIT_PAGES'
*/
AuxFunctions.toUpperCaseLowDash = str => (
  str.replace(/\s+/g, '_').toUpperCase()
);
//------------------------------------------------------------------------------
/**
* @summary transform string to camelCase.
* @example AuxFunctions.toUpperCaseLowDash('Edit Pages') = 'editPages'
*/
AuxFunctions.toCamelCase = str => (
  str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  })
);
//------------------------------------------------------------------------------
/**
* @summary transform string to Title Case.
* @example AuxFunctions.toTitleCase('edit pages') = 'Edit Pages'
*/
AuxFunctions.toTitleCase = str => (
  str.replace(/\w\S*/g, txt => (
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  ))
);
//------------------------------------------------------------------------------
AuxFunctions.spliceSplit = (str, index, count, add) => {
  const ar = str.split('');
  ar.splice(index, count, add);
  return ar.join('');
};
//------------------------------------------------------------------------------

export default AuxFunctions;
