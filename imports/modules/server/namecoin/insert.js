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
  soiDate: {
    type: Date
  },
  doiDate: {
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
      soiDate: ourData.soiDate,
      doiDate: ourData.doiDate
    });
  } catch(exception) {
    throw new Meteor.Error('namecoin.insert.exception', exception);
  }
};

export default insert;
