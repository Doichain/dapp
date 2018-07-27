import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import getKeyPairM from '../../modules/server/doichain/get_key-pair.js';


const getKeyPair = new ValidatedMethod({
  name: 'doichain.getKeyPair',
  validate: null,
  run() {
    return getKeyPairM();
  },
});

// Get list of all method names on doichain
const OPTINS_METHODS = _.pluck([
  getKeyPair
], 'name');

if (Meteor.isServer) {
  // Only allow 5 opt-in operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(OPTINS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
