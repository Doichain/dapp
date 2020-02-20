import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('users.user', function () {

  if(Roles.userIsInRole(this.userId, 'admin')){
    return Meteor.users.find({},  {
      fields: {
        'emails': 1,
        'profile': 1,
        'services': 1
      },
    });
  } else {
    return Meteor.users.find({
      _id: this.userId
    }, {
      fields: {
        'emails': 1,
        'profile': 1,
        'services': 1
      }
    })
  }

})

// Deny all client-side updates to user documents
Meteor.users.deny({
  update() { return true; }
});