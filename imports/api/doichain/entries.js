import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class DoichainEntriesCollection extends Mongo.Collection {
  insert(entry, callback) {
    const result = super.insert(entry, callback);
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

export const DoichainEntries = new DoichainEntriesCollection('doichain-entries');

// Deny all client-side updates since we will be using methods to manage this collection
DoichainEntries.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

DoichainEntries.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
    index: true,
    denyUpdate: true
  },
  value: {
    type: String,
    denyUpdate: false
  },
  address: {
    type: String,
    denyUpdate: false
  },
  masterDoi: {
        type: String,
        index: true,
        denyUpdate: true
  },
  index: {
        type: SimpleSchema.Integer,
        denyUpdate: true
  },
  txId: {
    type: String,
    denyUpdate: false
  }
});

DoichainEntries.attachSchema(DoichainEntries.schema);

// This represents the keys from Entry objects that should be published
// to the client. If we add secret properties to Entry objects, don't list
// them here to keep them private to the server.
DoichainEntries.publicFields = {
  _id: 1,
  name: 1,
  value: 1,
  address: 1,
  masterDoi: 1,
  index: 1,
  txId: 1
};
