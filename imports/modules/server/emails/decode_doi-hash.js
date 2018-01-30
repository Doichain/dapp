import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { randomBytes } from 'crypto';
import { HashIds } from '../../../startup/server/email-configuration.js';

const DecodeDoiHashSchema = new SimpleSchema({
    hash: {
    type: String
  }
});

const decodeDoiHash = (hash) => {
  try {
    const ourHash = hash;
    DecodeDoiHashSchema.validate(ourHash);
    const hex = HashIds.decodeHex(ourHash.hash);
    if(!hex || hex === '') throw "Wrong hash";
    try {
      const obj = JSON.parse(Buffer(hex, 'hex').toString('ascii'));
      return obj;
    } catch(exception) {throw "Wrong hash";}
  } catch (exception) {
    throw new Meteor.Error('emails.decode_doi-hash.exception', exception);
  }
};

export default decodeDoiHash;
