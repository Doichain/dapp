import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class NamecoinEntriesCollection extends Mongo.Collection {
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

export const NamecoinEntries = new NamecoinEntriesCollection('namecoin-entries');

// Deny all client-side updates since we will be using methods to manage this collection
NamecoinEntries.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

NamecoinEntries.schema = new SimpleSchema({
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
  txId: {
    type: String,
    denyUpdate: false
  },
  expiresIn: {
    type: Number,
    denyUpdate: false
  },
  expired: {
    type: Boolean,
    denyUpdate: false
  }
});

NamecoinEntries.attachSchema(NamecoinEntries.schema);

// This represents the keys from Entry objects that should be published
// to the client. If we add secret properties to Entry objects, don't list
// them here to keep them private to the server.
NamecoinEntries.publicFields = {
  _id: 1,
  name: 1,
  value: 1,
  address: 1,
  txId: 1,
  expiresIn: 1,
  expired: 1
};
