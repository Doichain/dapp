import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class SendersCollection extends Mongo.Collection {
  insert(sender, callback) {
    const ourSender = sender;
    ourSender.createdAt = ourSender.createdAt || new Date();
    const result = super.insert(ourSender, callback);
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

export const Senders = new SendersCollection('senders');

// Deny all client-side updates since we will be using methods to manage this collection
Senders.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Senders.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  email: {
    type: String,
    //index: true,   //TODO enable this when this package works again see meta
    //denyUpdate: true,
  },
  createdAt: {
    type: Date,
    //denyUpdate: true,
  }
});

Senders.attachSchema(Senders.schema);

// This represents the keys from Sender objects that should be published
// to the client. If we add secret properties to Sender objects, don't list
// them here to keep them private to the server.
Senders.publicFields = {
  email: 1,
  createdAt: 1
};
