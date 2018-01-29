import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Senders } from '../senders.js';

Meteor.publish('senders.all', function sendersAll() {
  if(!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) {
    return this.ready();
  }

  return Senders.find({}, {
    fields: Senders.publicFields,
  });
});
