import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import $ from 'jquery';
import 'meteor/lepozepo:cloudinary';

Meteor.startup(() => {
  console.log('[client] startup');

  // Set default language
  moment.locale('en');

  // Initialize cloudinary
  const { cloudName } = Meteor.settings.public.cloudinary;
  $.cloudinary.config({
    cloud_name: cloudName,
  });
});
