import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import newName from './new_name.js';
import addClaimBlockchainJob from '../jobs/add_claim_blockchain.js';

const InsertSchema = new SimpleSchema({
  nameId: {
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

const insert = (data) => {
  try {
    const ourData = data;
    InsertSchema.validate(ourData);
    const newNameData = newName({nameId: ourData.nameId});
    addClaimBlockchainJob({
      nameId: ourData.nameId,
      tx: newNameData.tx,
      rand: newNameData.rand,
      signature: ourData.signature,
      dataHash: ourData.dataHash,
      domain: ourData.domain,
      soiDate: ourData.soiDate
    });
  } catch(exception) {
    throw new Meteor.Error('namecoin.insert.exception', exception);
  }
};

export default insert;
