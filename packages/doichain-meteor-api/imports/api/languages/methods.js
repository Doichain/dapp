import { Meteor} from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import getLanguages from '../../modules/server/languages/get.js';

const getAllLanguages = new ValidatedMethod({
  name: 'languages.getAll',
  validate: null,
  run() {
    return getLanguages();
  },
});

// Get list of all method names on languages
const OPTINS_METHODS = _.pluck([
  getAllLanguages
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
