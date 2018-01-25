import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Recipients } from '../recipients.js';

Meteor.publish('recipients.all', function recipientsAll() {
  if(!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) {
    return this.ready();
  }

  return Recipients.find({}, {
    fields: Recipients.publicFields,
  });
});
