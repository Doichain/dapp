import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import getOptInProvider from '../dns/get_opt-in-provider.js';
import getOptInKey from '../dns/get_opt-in-key.js';
import verifySignature from '../doichain/verify_signature.js';

const UpdateOptInStatusSchema = new SimpleSchema({
  name_id: {
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
    const optIn = OptIns.findOne({nameId: ourData.name_id});
    if(optIn === undefined) throw "Opt-In not found";
    const recipient = Recipients.findOne({_id: optIn.recipient});
    if(recipient === undefined) throw "Recipient not found";
    const parts = recipient.email.split("@");
    const domain = parts[parts.length-1];
    const provider = getOptInProvider({domain: domain});
    const publicKey = getOptInKey({domain: provider});
    if(!verifySignature({publicKey: publicKey, data: ourData.name_id, signature: ourData.signature})) {
      throw "Access denied";
    }
    OptIns.update({_id : optIn._id},{$set:{confirmedAt: new Date()}});
  } catch (exception) {
    throw new Meteor.Error('dapps.updateOptInStatus.exception', exception);
  }
};

export default updateOptInStatus;
