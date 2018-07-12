import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class OptInsCollection extends Mongo.Collection {
  insert(optIn, callback) {
    const ourOptIn = optIn;
    ourOptIn.recipient_sender = ourOptIn.recipient+ourOptIn.sender;
    ourOptIn.createdAt = ourOptIn.createdAt || new Date();
    const result = super.insert(ourOptIn, callback);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }
  remove(selector) {
    const result = super.remove(selector);
    return result;
  }
}

export const OptIns = new OptInsCollection('opt-ins');

// Deny all client-side updates since we will be using methods to manage this collection
OptIns.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

OptIns.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  recipient: {
    type: String,
    optional: true,
    denyUpdate: true,
  },
  sender: {
    type: String,
    optional: true,
    denyUpdate: true,
  },
  data: {
    type: String,
    optional: true,
    denyUpdate: false,
  },
  index: {
    type: String,
    optional: true,
    denyUpdate: false,
  },
  nameId: {
    type: String,
    optional: true,
    denyUpdate: false,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
  confirmedAt: {
    type: Date,
    optional: true,
    denyUpdate: false,
  },
  confirmedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.IP,
    optional: true,
    denyUpdate: false,
  },
  confirmationToken: {
    type: String,
    optional: true,
    denyUpdate: false,
  }
});

OptIns.attachSchema(OptIns.schema);

// This represents the keys from Opt-In objects that should be published
// to the client. If we add secret properties to Opt-In objects, don't list
// them here to keep them private to the server.
OptIns.publicFields = {
  _id: 1,
  recipient: 1,
  sender: 1,
  data: 1,
  index: 1,
  nameId: 1,
  createdAt: 1,
  confirmedAt: 1,
  confirmedBy: 1
};
