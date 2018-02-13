import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { DOI_FETCH_ROUTE, API_PATH, VERSION } from '../../../../server/api/rest/rest.js';
import { CONFIRM_CLIENT, CONFIRM_ADDRESS } from '../../../startup/server/namecoin-configuration.js';
import { getHttp } from '../../../../server/api/http.js';
import { getPrivateKey } from '../../../../server/api/namecoin.js';
import getSignature from '../namecoin/get_signature.js';

export const SIGNATURE_MESSAGE = "doi-mail-data";
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
    const privateKey = getPrivateKey(CONFIRM_CLIENT, CONFIRM_ADDRESS);
    if(privateKey === undefined) throw "Private key not found";
    const signature = getSignature({privateKey: privateKey, message: SIGNATURE_MESSAGE});
    const query = "name="+encodeURIComponent(ourData.name)+"&signature="+encodeURIComponent(signature);
    const response = getHttp(url, query);
  } catch (exception) {
    throw new Meteor.Error('dapps.fetchDoiMailData.exception', exception);
  }
};

export default fetchDoiMailData;
