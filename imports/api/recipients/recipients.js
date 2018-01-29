import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class RecipientsCollection extends Mongo.Collection {
  insert(recipient, callback) {
    const ourRecipient = recipient;
    ourRecipient.createdAt = ourRecipient.createdAt || new Date();
    const result = super.insert(ourRecipient, callback);
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

export const Recipients = new RecipientsCollection('recipients');

// Deny all client-side updates since we will be using methods to manage this collection
Recipients.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Recipients.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  email: {
    type: String,
    denyUpdate: true,
  },
  customerId: {
    type: String,
    denyUpdate: false,
  },
  privateKey: {
    type: String,
    max: 100,
    denyUpdate: true,
  },
  publicKey: {
    type: String,
    max: 100,
    denyUpdate: true,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  }
});

Recipients.attachSchema(Recipients.schema);

// This represents the keys from Recipient objects that should be published
// to the client. If we add secret properties to Recipient objects, don't list
// them here to keep them private to the server.
Recipients.publicFields = {
  email: 1,
  customerId: 1,
  publicKey: 1,
  createdAt: 1
};
