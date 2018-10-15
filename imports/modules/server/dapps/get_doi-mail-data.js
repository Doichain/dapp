import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import getOptInProvider from '../dns/get_opt-in-provider.js';
import getOptInKey from '../dns/get_opt-in-key.js';
import verifySignature from '../doichain/verify_signature.js';
import { getHttpGET } from '../../../../server/api/http.js';
import { DOI_MAIL_FETCH_URL } from '../../../startup/server/email-configuration.js';
import { logSend } from "../../../startup/server/log-configuration";
import { Accounts } from 'meteor/accounts-base'

const GetDoiMailDataSchema = new SimpleSchema({
  name_id: {
    type: String
  },
  signature: {
    type: String
  }
});

const userProfileSchema = new SimpleSchema({
  from: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  subject: {
    type: String
  },
  redirect: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
  returnPath: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  templateURL: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  }
});

const getDoiMailData = (data) => {
  try {
    const ourData = data;
    GetDoiMailDataSchema.validate(ourData);
    const optIn = OptIns.findOne({nameId: ourData.name_id});
    if(optIn === undefined) throw "Opt-In with name_id: "+ourData.name_id+" not found";
    logSend('Opt-In found',optIn);

    const recipient = Recipients.findOne({_id: optIn.recipient});
    if(recipient === undefined) throw "Recipient not found";
    logSend('Recipient found', recipient);

    const parts = recipient.email.split("@");
    const domain = parts[parts.length-1];

    let publicKey = getOptInKey({ domain: domain});

    if(!publicKey){
      const provider = getOptInProvider({domain: ourData.domain });
      logSend("using doichain provider instead of directly configured publicKey:", { provider: provider });
      publicKey = getOptInKey({ domain: provider}); //get public key from provider or fallback if publickey was not set in dns
    }

    logSend('queried data: (parts, domain, provider, publicKey)', '('+parts+','+domain+','+publicKey+')');

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

      let templateURL = DOI_MAIL_FETCH_URL;
      let owner = Accounts.findOne({_id: optIn.ownerID});
      let tmpURL = owner.profile.templateURL;
      let returnData = {
        "recipient": recipient.email,
        "content": doiMailData.data.content,
        "redirect": doiMailData.data.redirect,
        "subject": doiMailData.data.subject,
        "from": doiMailData.data.from,
        "returnPath": doiMailData.data.returnPath
      }
      try {
        if(tmpURL != undefined){
          templateURL = tmpURL;
          userProfileSchema.validate(owner.profile);
          returnData = {
            "recipient": recipient.email,
            "content": doiMailData.data,
            "redirect": owner.profile.redirect,
            "subject": owner.profile.subject,
            "from": owner.profile.from,
            "returnPath": owner.profile.returnPath
          }
        }
      }
      catch(error) {
        logSend('Owner profile is wrong: '+error+" , using default Template");
      }

      doiMailData = getHttpGET(templateURL, "").data;

      logSend('doiMailData and url:', DOI_MAIL_FETCH_URL, returnData);

      return returnData

    } catch(error) {
      throw "Error while fetching mail content: "+error;
    }

  } catch(exception) {
    throw new Meteor.Error('dapps.getDoiMailData.exception', exception);
  }
};

export default getDoiMailData;
