import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import verifySignature from '../doichain/verify_signature.js';
import {logSend} from "../../../startup/server/log-configuration";
import getPublicKeyAndAddress from "../doichain/get_publickey_and_address_by_domain";

const UpdateOptInStatusSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  signature: {
    type: String
  },
  host: {
      type: String,
      optional: true
  }
});


const updateOptInStatus = (data) => {
  try {
    const ourData = data;
    logSend('confirm dApp confirms optIn:',JSON.stringify(data));
    UpdateOptInStatusSchema.validate(ourData);
    const optIn = OptIns.findOne({nameId: ourData.nameId});
    if(optIn === undefined) throw "Opt-In not found";
    logSend('confirm dApp confirms optIn:',ourData.nameId);

    const recipient = Recipients.findOne({_id: optIn.recipient});
    if(recipient === undefined) throw "Recipient not found";
    const parts = recipient.email.split("@");
    const domain = parts[parts.length-1];
    const publicKeyAndAddress = getPublicKeyAndAddress({domain:domain});
    if(!verifySignature({publicKey: publicKeyAndAddress.publicKey, data: ourData.nameId, signature: ourData.signature})) {
      throw "Access denied";
    }
    logSend('signature valid for publicKey', publicKeyAndAddress.publicKey);

    OptIns.update({_id : optIn._id},{$set:{confirmedAt: new Date(), confirmedBy: ourData.host}});
  } catch (exception) {
    throw new Meteor.Error('dapps.send.updateOptInStatus.exception', exception);
  }
};

export default updateOptInStatus;
