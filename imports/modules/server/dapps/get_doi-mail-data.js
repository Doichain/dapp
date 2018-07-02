import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import getOptInProvider from '../dns/get_opt-in-provider.js';
import getOptInKey from '../dns/get_opt-in-key.js';
import verifySignature from '../doichain/verify_signature.js';
import { getHttpGET } from '../../../../server/api/http.js';
import { DOI_MAIL_FETCH_URL } from '../../../startup/server/email-configuration.js';
import {logSend} from "../../../startup/server/log-configuration";

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
    logSend('Opt-In found',optIn);

    const recipient = Recipients.findOne({_id: optIn.recipient});
    if(recipient === undefined) throw "Recipient not found";
    logSend('Recipient found', recipient);

    const parts = recipient.email.split("@");
    const domain = parts[parts.length-1];
    const provider = getOptInProvider({domain: domain});
    const publicKey = getOptInKey({domain: provider});

    logSend('queried data: (parts, domain, provider, publicKey)', '('+parts+','+domain+','+provider+','+publicKey+')');

    //TODO: Only allow access one time
    // Possible solution:
    // 1. Provider (confirm dApp) request the data
    // 2. Provider receive the data
    // 3. Provider sends confirmation "I got the data"
    // 4. Send dApp lock the data for this opt in
    logSend('verifying signature...');
    if(!verifySignature({publicKey: publicKey, data: ourData.name_id, signature: ourData.signature})) {
        throw "signature incorrect - access denied";
    }

    logSend('signature verified');

    //TODO: Query for language
    let doiMailData;
    try {
      doiMailData = getHttpGET(DOI_MAIL_FETCH_URL, "").data;

      let returnData = {
          "recipient": recipient.email,
          "content": doiMailData.data.content,
          "redirect": doiMailData.data.redirect,
          "subject": doiMailData.data.subject,
          "from": doiMailData.data.from,
          "returnPath": doiMailData.data.returnPath
      }
      logSend('doiMailData and url:',DOI_MAIL_FETCH_URL,returnData);

      return returnData

    } catch(error) {
      throw "Error while fetching mail content: "+error;
    }

  } catch (exception) {
    throw new Meteor.Error('dapps.getDoiMailData.exception', exception);
  }
};

export default getDoiMailData;
