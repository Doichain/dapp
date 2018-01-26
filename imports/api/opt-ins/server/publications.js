import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { OptIns } from '../opt-ins.js';

Meteor.publish('opt-ins.all', function OptInsAll() {
  if(!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) {
    return this.ready();
  }

  return OptIns.find({}, {
    fields: OptIns.publicFields,
  });
});
