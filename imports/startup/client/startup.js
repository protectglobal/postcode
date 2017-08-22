import { Meteor } from 'meteor/meteor';
import moment from 'moment';

Meteor.startup(() => {
  console.log('[client] startup');

  // Set default language
  moment.locale('en');
});
