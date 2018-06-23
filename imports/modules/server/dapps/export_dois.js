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

const ExportDoisDataSchema = new SimpleSchema({
  type: {
    type: String
  },
  status: {
    type: String
  }
});


const exportDois = (data) => {
  try {
    const ourData = data;
    ExportDoisDataSchema.validate(ourData);
    const optIns = OptIns.find({});

    if(optIns === undefined) throw "Opt-In not found";
    logSend('Opt-Ins found',optIns);


    let exportDoiData;
    try {
        exportDoiData = optIns;

      /*let returnData = {
          "recipient": recipient.email,
          "content": doiMailData.data.content,
          "redirect": doiMailData.data.redirect,
          "subject": doiMailData.data.subject,
          "from": doiMailData.data.from,
          "returnPath": doiMailData.data.returnPath
      } */
      logSend('doiMailData and url:',DOI_MAIL_FETCH_URL,returnData);

      return exportDoiData

    } catch(error) {
      throw "Error while exporting dois: "+error;
    }

  } catch (exception) {
    throw new Meteor.Error('dapps.getDoiMailData.exception', exception);
  }
};

export default exportDois;
