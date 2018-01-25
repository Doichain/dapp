import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Sois = new Mongo.Collection('sois');

if(Meteor.isServer) {
  Meteor.publish('sois', function soisPublication() {
    if(this.userId) return Sois.find();
    else this.ready();
  });
}

Meteor.methods({
  'sois.insert'(recipient, sender, data_json) {
    check(recipient, String);
    check(sender, String);
    check(data_json, String);

    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Sois.insert({
      recipient,
      sender,
      data_json,
      soi_timestamp: new Date(),
      doi_timestamp: undefined,
      createdBy: this.userId
    });
  }
});
