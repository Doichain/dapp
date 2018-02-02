import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import firstUpdate from './first_update.js';

const ClaimSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  tx: {
    type: String
  },
  rand: {
    type: String
  },
  signature: {
    type: String
  },
  dataHash: {
    type: String
  },
  soiDate: {
    type: Date
  },
  doiDate: {
    type: Date
  }
});

const claim = (data) => {
  try {
    const ourData = data;
    ClaimSchema.validate(ourData);
    const value = JSON.stringify({
      signature: ourData.signature,
      soiTimestamp: ourData.soiDate.toISOString(),
      doiTimestamp: ourData.doiDate.toISOString()
    })
    const firstUpdateData = firstUpdate({
      nameId: ourData.nameId,
      tx: ourData.tx,
      rand: ourData.rand,
      value: value
    })
    console.log(firstUpdateData);
  } catch(exception) {
    throw new Meteor.Error('namecoin.claim.exception', exception);
  }
};

export default claim;
