import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import getOptInProvider from '../dns/get_opt-in-provider.js';
import getOptInKey from '../dns/get_opt-in-key.js';
import verifySignature from '../namecoin/verify_signature.js';

const GetDoiMailDataSchema = new SimpleSchema({
  name: {
    type: String
  },
  signature: {
    type: String
  }
});


const getDoiMailData = (data) => {
  try {
    const ourData = data;
    GetDoiMailDataSchema.validate(ourData);
    const optIn = OptIns.findOne({nameId: ourData.name});
    if(optIn === undefined) throw "Opt-In not found";
    const recipient = Recipients.findOne({_id: optIn.recipient});
    if(recipient === undefined) throw "Recipient not found";
    const parts = recipient.email.split("@");
    const domain = parts[parts.length-1];
    const provider = getOptInProvider({domain: domain});
    const publicKey = getOptInKey({domain: provider});
    //TODO: Only allow access one time
    if(!verifySignature({publicKey: publicKey, data: ourData.name, signature: ourData.signature})) {
      throw "Access denied";
    }
    //TODO: Implement customization
    const content = "Blablabla ${confirmation_link}";
    const redirect = "http://localhost:3000";
    return {
      recipient: recipient.email,
      content: content,
      redirect: redirect
    }
  } catch (exception) {
    throw new Meteor.Error('dapps.getDoiMailData.exception', exception);
  }
};

export default getDoiMailData;
