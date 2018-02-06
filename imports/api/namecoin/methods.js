import { ValidatedMethod } from 'meteor/mdg:validated-method';
import getKeyPairM from '../../modules/server/namecoin/get_key-pair.js';

const getKeyPair = new ValidatedMethod({
  name: 'namecoin.getKeyPair',
  validate: null,
  run() {
    return getKeyPairM();
  },
});

// Get list of all method names on namecoin
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
