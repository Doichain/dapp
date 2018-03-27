import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { DOI_FETCH_ROUTE, DOI_CONFIRMATION_ROUTE, API_PATH, VERSION } from '../../../../server/api/rest/rest.js';
import { getUrl, isDebug } from '../../../startup/server/dapp-configuration.js';
import { CONFIRM_CLIENT, CONFIRM_ADDRESS } from '../../../startup/server/namecoin-configuration.js';
import { getHttp } from '../../../../server/api/http.js';
import { signMessage } from '../../../../server/api/namecoin.js';
import { OptIns } from '../../../../imports/api/opt-ins/opt-ins.js';
import parseTemplate from '../emails/parse_template.js';
import generateDoiToken from '../opt-ins/generate_doi-token.js';
import generateDoiHash from '../emails/generate_doi-hash.js';
import addOptIn from '../opt-ins/add.js';
import addSendMailJob from '../jobs/add_send_mail.js';
import {signMessage} from "../../../../server/api/namecoin";

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
    const signature = signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, value.signature);
    const query = "name_id="+encodeURIComponent(ourData.name)+"&signature="+encodeURIComponent(signature);

    if(isDebug()) {console.log('calling for doi-email-template:'+url+' query:'+query);}
    const response = getHttp(url, query);
    if(response === undefined || response.data === undefined) throw "Bad response";
    const responseData = response.data;

    if(isDebug()) { console.log('response data from Send-dApp:'+JSON.stringify(response));}
    if(responseData.status !== "success") {
      if(responseData.error === undefined) throw "Bad response";
      if(responseData.error.includes("Opt-In not found")) {
        //Do nothing and don't throw error so job is done
        console.log(responseData.error);
        return;
      }
      throw responseData.error;
    }

    if(isDebug()) { console.log("DOI Mail data fetched:\n"+JSON.stringify(responseData));}
    const optInId = addOptIn({name: ourData.name});
    const optIn = OptIns.findOne({_id: optInId});
    if(isDebug()) {
      console.log("opt-in found:"+JSON.stringify(optIn));
    }
    if(optIn.confirmationToken !== undefined) return;
    if(isDebug()) { console.log("generating confirmationToken"); }
    const token = generateDoiToken({id: optIn._id});

    const confirmationHash = generateDoiHash({id: optIn._id, token: token, redirect: responseData.data.redirect});

    const confirmationUrl = getUrl()+API_PATH+VERSION+"/"+DOI_CONFIRMATION_ROUTE+"/"+encodeURIComponent(confirmationHash);
    if(isDebug()) { console.log("confirmationUrl:"+confirmationUrl); }


    if(isDebug()) { console.log("we are using this template:"+responseData.data.content); }
    const template = parseTemplate({template: responseData.data.content, data: {
      confirmation_url: confirmationUrl
    }});
    if(isDebug()) {
      console.log("adding email to sendMailJob");
    }
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
