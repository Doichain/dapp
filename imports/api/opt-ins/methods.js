import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Roles } from 'meteor/alanning:roles';
import { _i18n as i18n } from 'meteor/universe:i18n';
import { OptIns } from './opt-ins.js';
import addOptIn from '../../modules/server/opt-ins/add_and_write_to_blockchain.js';

const add = new ValidatedMethod({
  name: 'opt-ins.add',
  validate: null,
  run({ recipientMail, senderMail, data }) {
    if(!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) {
      const error = "api.opt-ins.add.accessDenied";
      throw new Meteor.Error(error, i18n.__(error));
    }

    const optIn = {
      "recipient_mail": recipientMail,
      "sender_mail": senderMail,
      data
    }

    addOptIn(optIn)
  },
});

// Get list of all method names on opt-ins
const OPTIONS_METHODS = _.pluck([
  add
], 'name');

if (Meteor.isServer) {
  // Only allow 5 opt-in operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(OPTIONS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
