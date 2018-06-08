import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import {logConfirm} from "../../../startup/server/log-configuration";
import { SEND_APP, CONFIRM_APP, isAppType } from './type-configuration.js';
import Hashids from 'hashids';

export const HashIds = new Hashids('0xugmLe7Nyee6vk1iF88(6CmwpqoG4hQ*-T74tjYw^O2vOO(Xl-91wA8*nCg_lX$');

var sendSettings = Meteor.settings.send;
var doiMailFetchUrl = undefined;

if(isAppType(SEND_APP)) {
  if(!sendSettings || !sendSettings.doiMailFetchUrl)
    throw new Meteor.Error("config.send.email", "Settings not found");
  doiMailFetchUrl = sendSettings.doiMailFetchUrl;
}
export const DOI_MAIL_FETCH_URL = doiMailFetchUrl;

var defaultFrom = undefined;
if(isAppType(CONFIRM_APP)) {
  var confirmSettings = Meteor.settings.confirm;

  if(!confirmSettings || !confirmSettings.smtp)
        throw new Meteor.Error("config.confirm.smtp", "Confirm app email smtp settings not found")

  if(!confirmSettings.smtp.defaultFrom)
        throw new Meteor.Error("config.confirm.defaultFrom", "Confirm app email defaultFrom not found")

  defaultFrom  =  confirmSettings.defaultFrom;

  logConfirm('sending with defaultFrom:',defaultFrom);

  Meteor.startup(() => {
   process.env.MAIL_URL = 'smtp://' +
     encodeURIComponent(confirmSettings.smtp.username) +
     ':' + encodeURIComponent(confirmSettings.smtp.password) +
     '@' + encodeURIComponent(confirmSettings.smtp.server) +
     ':' +
     confirmSettings.smtp.port;

     process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; //enable this only in settings.json
  });
}
export const DOI_MAIL_DEFAULT_EMAIL_FROM = defaultFrom;
