import { Meteor } from 'meteor/meteor';
import { SEND_APP, CONFIRM_APP, isAppType } from '../../../imports/startup/server/type-configuration.js';

export const Api = new Restivus({
  apiPath: 'api/',
  version: 'v1',
  useDefaultAuth: true,
  prettyJson: true
});

if(isAppType(SEND_APP)) import './imports/send.js'
if(isAppType(CONFIRM_APP)) import './imports/confirm.js'
