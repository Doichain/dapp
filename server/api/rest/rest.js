import { Meteor } from 'meteor/meteor';
import { SEND_APP, CONFIRM_APP, isAppType } from '../../../imports/startup/server/type-configuration.js';

export const DOI_CONFIRMATION_ROUTE = "opt-in/confirm";
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
