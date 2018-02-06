import namecoin from 'namecoin';
import { SEND_APP, CONFIRM_APP, VERIFY_APP, isAppType } from './type-configuration.js';

var sendSettings = Meteor.settings.send;
var sendClient = undefined;
if(isAppType(SEND_APP)) {
  if(!sendSettings || !sendSettings.namecoin)
    throw new Meteor.Error("config.send.namecoin", "Send app namecoin settings not found")
  sendClient = createClient(sendSettings.namecoin);
}
export const SEND_CLIENT = sendClient;

var confirmSettings = Meteor.settings.confirm;
var confirmClient = undefined;
if(isAppType(CONFIRM_APP)) {
  if(!confirmSettings || !confirmSettings.namecoin)
    throw new Meteor.Error("config.confirm.namecoin", "Confirm app namecoin settings not found")
  confirmClient = createClient(confirmSettings.namecoin);
}
export const CONFIRM_CLIENT = confirmClient;

var verifySettings = Meteor.settings.verify;
var verifyClient = undefined;
if(isAppType(VERIFY_APP)) {
  if(!verifySettings || !verifySettings.namecoin)
    throw new Meteor.Error("config.verify.namecoin", "Verify app namecoin settings not found")
  verifyClient = createClient(verifySettings.namecoin);
}
export const VERIFY_CLIENT = verifyClient;

function createClient(settings) {
  return new namecoin.Client({
    host: settings.host,
    port: settings.port,
    user: settings.username,
    pass: settings.password
  });
}
