import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import '../imports/startup/accounts-config.js';
import '../imports/api/sois.js';
import '../imports/api/rest.js';

Meteor.startup(() => {
  if(Meteor.users.find().count() === 0) {
    id = Accounts.createUser({
      username: 'admin',
      email: 'admin@sendeffect.de',
      password: 'password'
    });
    Roles.addUsersToRoles(id, 'admin');
  }
});
