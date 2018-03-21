import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Settings } from '../settings.js';

Meteor.publish('settings.all', function SettingsAll() {
  if(!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) {
    return this.ready();
  }

  return Settings.find({}, {
    fields: Settings.publicFields,
  });
});
