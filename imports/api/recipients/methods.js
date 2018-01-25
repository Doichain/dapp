import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Roles } from 'meteor/alanning:roles';

import { Recipients } from './recipients.js';

export const insert = new ValidatedMethod({
  name: 'recipients.insert',
  validate: Recipients.simpleSchema().pick(['email', 'customerId']).validator({ clean: true, filter: false }),
  run({ email, customerId }) {
    if(!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) {
      throw new Meteor.Error('recipients.insert.accessDenied',
        'Cannot add recipients without permissions');
    }
    // TODO: Private+PublicKey
    const recipient = {
      email,
      customerId,
      createdAt: new Date(),
    };

    Recipients.insert(todo);
  },
});

// Get list of all method names on Recipients
const RECIPIENTS_METHODS = _.pluck([
  insert
], 'name');

if (Meteor.isServer) {
  // Only allow 5 recipient operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(RECIPIENTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
