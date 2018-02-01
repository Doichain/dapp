import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import generateNameId from './namecoin/generate_name-id.js';
import getSignature from './namecoin/get_signature.js';
import getDataHash from './namecoin/get_data-hash.js';
import addInsertBlockchainJob from '../jobs/add_insert_blockchain.js';

const WriteToBlockchainSchema = new SimpleSchema({
  id: {
    type: String
  }
});

const writeToBlockchain = (data) => {
  try {
    const ourData = data;
    WriteToBlockchainSchema.validate(ourData);
    const optIn = OptIns.findOne({_id: data.id});
    const recipient = Recipients.findOne({_id: optIn.recipient});
    const nameId = generateNameId({id: optIn._id});
    const signature = getSignature({email: recipient.email, privateKey: recipient.privateKey});
    const dataHash = getDataHash({data: optIn.data});
    addInsertBlockchainJob({
      nameId: nameId,
      signature: signature,
      dataHash: dataHash,
      soiDate: optIn.createdAt,
      doiDate: confirmedAt
    })
  } catch (exception) {
    throw new Meteor.Error('namecoin.write_to_blockchain.exception', exception);
  }
};

export default writeToBlockchain
