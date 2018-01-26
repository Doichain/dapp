import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Roles } from 'meteor/alanning:roles';

import { OptIns } from './recipients.js';

export const insert = new ValidatedMethod({
  name: 'opt-ins.insert',
  validate: OptIns.simpleSchema().pick(['data']).validator({ clean: true, filter: false }),
  run({ recipient, sender, data }) {
    if(!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) {
      throw new Meteor.Error('opt-ins.insert.accessDenied',
        'Cannot add opt-ins without permissions');
    }

    const optIn = {
      recipient,
      sender,
      data,
      createdAt: new Date()
    };

    OptIns.insert(todo);
  },
});

// Get list of all method names on OptIns
const OPTINS_METHODS = _.pluck([
  insert
], 'name');

if (Meteor.isServer) {
  // Only allow 5 recipient operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(OPTINS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
