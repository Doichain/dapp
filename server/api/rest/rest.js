import { Meteor } from 'meteor/meteor';
import { SEND_APP, CONFIRM_APP, isAppType } from '../../../imports/startup/server/type-configuration.js';
import fetchDoiMailData from '../../../imports/modules/server/dapps/fetch_doi-mail-data.js';

export const DOI_FETCH_ROUTE = "doi-mail";
export const API_PATH = "api/";
export const VERSION = "v1";
export const Api = new Restivus({
  apiPath: API_PATH,
  version: VERSION,
  useDefaultAuth: true,
  prettyJson: true
});

if(isAppType(SEND_APP)) import './imports/send.js'
if(isAppType(CONFIRM_APP)) import './imports/confirm.js'


Api.addRoute('test', {authRequired: false}, {
  get: {
    action: function() {
      try {
        fetchDoiMailData({name: "2DF015AA97B0DF6B318DA3BA0C6B4FD2442C776B5201AD6911FA843BBE7A85AD", domain: "http://localhost:3000/"});
        return {status: 'success', data: {message: 'Test successful'}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});
