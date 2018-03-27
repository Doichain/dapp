import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Senders } from '../../../api/senders/senders.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import generateNameId from './generate_name-id.js';
import getSignature from './get_signature.js';
import getDataHash from './get_data-hash.js';
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
    const sender = Senders.findOne({_id: optIn.sender});
    const nameId = generateNameId({id: optIn._id});
    const signature = getSignature({message: recipient.email+sender.email, privateKey: recipient.privateKey});
    const dataHash = getDataHash({data: optIn.data});
    const parts = recipient.email.split("@");
    const domain = parts[parts.length-1];
    addInsertBlockchainJob({
      nameId: nameId,
      signature: signature,
      dataHash: dataHash,
      domain: domain,
      soiDate: optIn.createdAt
    })
  } catch (exception) {
    throw new Meteor.Error('namecoin.writeToBlockchain.exception', exception);
  }
};

export default writeToBlockchain
