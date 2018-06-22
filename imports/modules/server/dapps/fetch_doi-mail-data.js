import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { DOI_FETCH_ROUTE, DOI_CONFIRMATION_ROUTE, API_PATH, VERSION } from '../../../../server/api/rest/rest.js';
import { getUrl } from '../../../startup/server/dapp-configuration.js';
import { CONFIRM_CLIENT, CONFIRM_ADDRESS } from '../../../startup/server/doichain-configuration.js';
import { getHttpGET } from '../../../../server/api/http.js';
import { signMessage } from '../../../../server/api/doichain.js';
import { OptIns } from '../../../../imports/api/opt-ins/opt-ins.js';
import parseTemplate from '../emails/parse_template.js';
import generateDoiToken from '../opt-ins/generate_doi-token.js';
import generateDoiHash from '../emails/generate_doi-hash.js';
import addOptIn from '../opt-ins/add.js';
import addSendMailJob from '../jobs/add_send_mail.js';
import {logConfirm, logError} from "../../../startup/server/log-configuration";

const FetchDoiMailDataSchema = new SimpleSchema({
  name: {
    type: String
  },
  domain: {
    type: String
  }
});


const fetchDoiMailData = (data) => {
  try {
    const ourData = data;
    FetchDoiMailDataSchema.validate(ourData);
    const url = ourData.domain+API_PATH+VERSION+"/"+DOI_FETCH_ROUTE;
    const signature = signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, ourData.name);
    const query = "name_id="+encodeURIComponent(ourData.name)+"&signature="+encodeURIComponent(signature);
    logConfirm('calling for doi-email-template:'+url+' query:', query);

    const response = getHttpGET(url, query);
    if(response === undefined || response.data === undefined) throw "Bad response";
    const responseData = response.data;
    logConfirm('response data from Send-dApp:',response);

    if(responseData.status !== "success") {
      if(responseData.error === undefined) throw "Bad response";
      if(responseData.error.includes("Opt-In not found")) {
        //Do nothing and don't throw error so job is done
          logError('response data from Send-dApp:',responseData.error);
        return;
      }
      throw responseData.error;
    }
    logConfirm('DOI Mail data fetched:',responseData);

    const optInId = addOptIn({name: ourData.name});
    const optIn = OptIns.findOne({_id: optInId});
    logConfirm('opt-in found:',optIn);
    if(optIn.confirmationToken !== undefined) return;


    const token = generateDoiToken({id: optIn._id});
    logConfirm('generated confirmationToken:',token);
    const confirmationHash = generateDoiHash({id: optIn._id, token: token, redirect: responseData.data.redirect});
    logConfirm('generated confirmationHash:',confirmationHash);
    const confirmationUrl = getUrl()+API_PATH+VERSION+"/"+DOI_CONFIRMATION_ROUTE+"/"+encodeURIComponent(confirmationHash);
    logConfirm('confirmationUrl:'+confirmationUrl);


    const template = parseTemplate({template: responseData.data.content, data: {
      confirmation_url: confirmationUrl
    }});
    logConfirm('we are using this template:',template);

    logConfirm('adding email to endUser for confirmation');
    addSendMailJob({
      from: responseData.data.from,
      to: responseData.data.recipient,
      subject: responseData.data.subject,
      message: template,
      returnPath: responseData.data.returnPath
    });
  } catch (exception) {
    throw new Meteor.Error('dapps.fetchDoiMailData.exception', exception);
  }
};

export default fetchDoiMailData;
