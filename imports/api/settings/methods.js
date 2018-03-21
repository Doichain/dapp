import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { isDebug } from '../../startup/server/dapp-configuration.js';
import toggleDebug from '../../modules/server/settings/toggle_debug.js';

const _toggleDebug = new ValidatedMethod({
  name: 'settings.toggleDebug',
  validate: null,
  run() {
    if(!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) {
      const error = "api.settings.set.accessDenied";
      throw new Meteor.Error(error, i18n.__(error));
    }
    const debug = isDebug();
    toggleDebug({debug: debug});
  },
});

// Get list of all method names on settings
const OPTINS_METHODS = _.pluck([
  isDebugEnabled,
  _toggleDebug
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
