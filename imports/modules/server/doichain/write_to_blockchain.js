import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Senders } from '../../../api/senders/senders.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import generateNameId from './generate_name-id.js';
import getSignature from './get_signature.js';
import getDataHash from './get_data-hash.js';
import addInsertBlockchainJob from '../jobs/add_insert_blockchain.js';
import {logSend} from "../../../startup/server/log-configuration";

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
    logSend("optIn data:",{index:ourData.index, optIn:optIn,recipient:recipient,sender: sender});

    let nameId;
    if(optIn.master_doi){
        nameId = optIn.master_doi+"-"+optIn.index;
        logSend("used master_doi as nameId index "+optIn.index+"storage:",nameId);
    }
    else{
        nameId = generateNameId({id: optIn._id});
        if(optIn.index){
          nameId+="-"+optIn.index;
        }
        logSend("generated nameId for doichain storage:",nameId);
    }


    const signature = getSignature({message: recipient.email+sender.email, privateKey: recipient.privateKey});
    logSend("generated signature from email recipient and sender:",signature);

    const dataHash = getDataHash({data: optIn.data});
    logSend("generated datahash from given data:",dataHash);

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
    throw new Meteor.Error('doichain.writeToBlockchain.exception', exception);
  }
};

export default writeToBlockchain
