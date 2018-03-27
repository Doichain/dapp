import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Senders } from '../../../api/senders/senders.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import generateNameId from './generate_name-id.js';
import { signMessage } from '../../../../server/api/namecoin.js';
import getDataHash from './get_data-hash.js';
import addInsertBlockchainJob from '../jobs/add_insert_blockchain.js';
import {CONFIRM_ADDRESS, CONFIRM_CLIENT} from "../../../startup/server/namecoin-configuration";

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
    if(isDebug()) {console.log('signMessage for:'+recipient.email+sender.email);}
    const signature = signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, recipient.email+sender.email);
    if(isDebug()) {console.log('getDataHash");}
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
