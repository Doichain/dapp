import { Meteor } from 'meteor/meteor';

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
