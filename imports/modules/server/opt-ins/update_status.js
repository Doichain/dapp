import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import getOptInProvider from '../dns/get_opt-in-provider.js';
import getOptInKey from '../dns/get_opt-in-key.js';
import verifySignature from '../doichain/verify_signature.js';
import {logSend} from "../../../startup/server/log-configuration";

const UpdateOptInStatusSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  signature: {
    type: String
  }
});


const updateOptInStatus = (data) => {
  try {
    const ourData = data;
    UpdateOptInStatusSchema.validate(ourData);
    const optIn = OptIns.findOne({nameId: ourData.nameId});
    if(optIn === undefined) throw "Opt-In not found";
    logSend('confirm dApp confirms optIn:',ourData.nameId);

    const recipient = Recipients.findOne({_id: optIn.recipient});
    if(recipient === undefined) throw "Recipient not found";
    const parts = recipient.email.split("@");
    const domain = parts[parts.length-1];
    const provider = getOptInProvider({domain: domain});
    const publicKey = getOptInKey({domain: provider});

    logSend('provider is',provider);
    logSend('publicKey is',publicKey);

    if(!verifySignature({publicKey: publicKey, data: ourData.nameId, signature: ourData.signature})) {
      throw "Access denied";
    }
    logSend('signature valid for publicKey', publicKey);

      OptIns.update({_id : optIn._id},{$set:{confirmedAt: new Date()}});
  } catch (exception) {
    throw new Meteor.Error('dapps.updateOptInStatus.exception', exception);
  }
};

export default updateOptInStatus;
