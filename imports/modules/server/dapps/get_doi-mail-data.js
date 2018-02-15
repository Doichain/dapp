import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import getOptInProvider from '../dns/get_opt-in-provider.js';
import getOptInKey from '../dns/get_opt-in-key.js';
import verifySignature from '../namecoin/verify_signature.js';

const GetDoiMailDataSchema = new SimpleSchema({
  name_id: {
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
    const optIn = OptIns.findOne({nameId: ourData.name_id});
    if(optIn === undefined) throw "Opt-In not found";
    const recipient = Recipients.findOne({_id: optIn.recipient});
    if(recipient === undefined) throw "Recipient not found";
    const parts = recipient.email.split("@");
    const domain = parts[parts.length-1];
    const provider = getOptInProvider({domain: domain});
    const publicKey = getOptInKey({domain: provider});
    //TODO: Only allow access one time
    // Possible solution:
    // 1. Provider (confirm dApp) request the data
    // 2. Provider receive the data
    // 3. Provider sends confirmation "I got the data"
    // 4. Send dApp lock the data for this opt in
    if(!verifySignature({publicKey: publicKey, data: ourData.name_id, signature: ourData.signature})) {
      throw "Access denied";
    }
    //TODO: Implement customization
    const from = "segelboote@newsletter.de";
    const subject = "Newsletter bestätigung";
    const content = "Newsletter bestätigen: ${confirmation_url}";
    const redirect = "http://localhost:3000";
    const returnPath = "noreply@newsletter.de";
    return {
      recipient: recipient.email,
      content: content,
      redirect: redirect,
      subject: subject,
      from: from,
      returnPath: returnPath
    }
  } catch (exception) {
    throw new Meteor.Error('dapps.getDoiMailData.exception', exception);
  }
};

export default getDoiMailData;
