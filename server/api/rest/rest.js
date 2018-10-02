import { Restivus } from 'meteor/nimble:restivus';
import { isDebug } from '../../../imports/startup/server/dapp-configuration.js';
import { SEND_APP, CONFIRM_APP, VERIFY_APP, isAppType } from '../../../imports/startup/server/type-configuration.js';

export const DOI_CONFIRMATION_ROUTE = "opt-in/confirm";
export const DOI_CONFIRMATION_NOTIFY_ROUTE = "opt-in";
export const DOI_WALLETNOTIFY_ROUTE = "walletnotify";
export const DOI_FETCH_ROUTE = "doi-mail";
export const DOI_EXPORT_ROUTE = "export";
export const API_PATH = "api/";
export const VERSION = "v1";

export const Api = new Restivus({
  apiPath: API_PATH,
  version: VERSION,
  useDefaultAuth: true,
  prettyJson: true
});

if(isDebug()) require('./imports/debug.js');
if(isAppType(SEND_APP)) require('./imports/send.js');
if(isAppType(CONFIRM_APP)) require('./imports/confirm.js');
if(isAppType(VERIFY_APP)) require('./imports/verify.js');
require('./imports/createUser.js');
