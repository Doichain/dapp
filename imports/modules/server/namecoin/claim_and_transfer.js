import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import firstUpdate from './first_update.js';
import getAddress from './get_address.js';
import getOptInProvider from '../dns/get_opt-in-provider.js';
import getOptInKey from '../dns/get_opt-in-key.js';

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
  domain: {
    type: String
  },
  soiDate: {
    type: Date
  }
});

const claim = (data) => {
  try {
    const ourData = data;
    ClaimSchema.validate(ourData);
    const provider = getOptInProvider({domain: ourData.domain});
    const publicKey = getOptInKey({domain: provider});
    const address = getAddress({publicKey: publicKey});
    const value = JSON.stringify({
      signature: ourData.signature,
      soiTimestamp: ourData.soiDate.toISOString()
    })
    const firstUpdateData = firstUpdate({
      nameId: ourData.nameId,
      tx: ourData.tx,
      rand: ourData.rand,
      value: value,
      address: address
    })
  } catch(exception) {
    throw new Meteor.Error('namecoin.claim.exception', exception);
  }
};

export default claim;
