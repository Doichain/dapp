import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { OptIns } from '../opt-ins.js';

Meteor.publish('opt-ins.all', function OptInsAll() {
  if(!this.userId) {
    return this.ready();
  }
  if(!Roles.userIsInRole(this.userId, ['admin'])){
    return OptIns.find({ownerId:this.userId}, {
      fields: OptIns.publicFields,
    });
  }
  

  return OptIns.find({}, {
    fields: OptIns.publicFields,
  });
});
