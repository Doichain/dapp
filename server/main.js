import { Meteor } from 'meteor/meteor';
import '../imports/api/sois.js';
import '../imports/startup/accounts-config.js';

Meteor.startup(() => {
  if(Meteor.users.find().count() === 0) {
    Accounts.createUser({
      username: 'admin',
      email: 'admin@sendeffect.de',
      password: 'password'
    });
  }
});
