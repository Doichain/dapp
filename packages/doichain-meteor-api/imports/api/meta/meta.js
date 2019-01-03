import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class MetaCollection extends Mongo.Collection {
  insert(data, callback) {
    const ourData = data;
    const result = super.insert(ourData, callback);
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

export const Meta = new MetaCollection('meta');

// Deny all client-side updates since we will be using methods to manage this collection
Meta.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meta.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  key: {
    type: String,
  //  index: true, //TODO doesn't work inside a backage aldeed:schema-index@3.0.0
      // TODO see https://github.com/aldeed/meteor-collection2/issues/378
  //  denyUpdate: true //TODO aldeed:schema-deny@2.0.1
  },
  value: {
    type: String
  }
});

Meta.attachSchema(Meta.schema);

// This represents the keys from Meta objects that should be published
// to the client. If we add secret properties to Meta objects, don't list
// them here to keep them private to the server.
Meta.publicFields = {
};
