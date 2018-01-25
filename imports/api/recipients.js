import { Meteor } from 'meteor/meteor';
import { Accounts } from "meteor/accounts-base"
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Recipients = new Mongo.Collection('recipients');

Recipients.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.methods({
  'recipients.insert'(email) {
    check(email, String);

    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }


    /*Recipients.insert({
      email,
      createdAt: new Date(),
    });*/
  }
});
