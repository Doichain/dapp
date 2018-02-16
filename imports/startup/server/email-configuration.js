import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import { SEND_APP, CONFIRM_APP, isAppType } from './type-configuration.js';
import Hashids from 'hashids';

export const HashIds = new Hashids('0xugmLe7Nyee6vk1iF88(6CmwpqoG4hQ*-T74tjYw^O2vOO(Xl-91wA8*nCg_lX$');

var sendSettings = Meteor.settings.send;
var doiMailFrom = undefined;
var doiMailSubject = undefined;
var doiMailRedirect = undefined;
var doiMailReturnPath = undefined;
var doiMailHtml = undefined;
if(isAppType(SEND_APP)) {
  if(!sendSettings || !sendSettings.mailData)
    throw new Meteor.Error("config.send.email", "Settings not found");
  doiMailFrom = sendSettings.mailData.from;
  doiMailSubject = sendSettings.mailData.subject;
  doiMailRedirect = sendSettings.mailData.redirect;
  doiMailReturnPath = sendSettings.mailData.returnPath;
  var html = sendSettings.mailData.html;
  try {
    doiMailHtml = fs.readFileSync("assets/app/"+html, {encoding: "utf8"});
  } catch(error) {
    throw new Meteor.Error("config.send.email", "Couldn't read html");
  }
}
export const DOI_MAIL_FROM = doiMailFrom;
export const DOI_MAIL_SUBJECT = doiMailSubject;
export const DOI_MAIL_REDIRECT = doiMailRedirect;
export const DOI_MAIL_RETURN_PATH = doiMailReturnPath;
export const DOI_MAIL_HTML = doiMailHtml;

if(isAppType(CONFIRM_APP)) {
  var confirmSettings = Meteor.settings.confirm;
  if(!confirmSettings || !confirmSettings.smtp)
    throw new Meteor.Error("config.confirm.email.smtp", "Confirm app email smtp settings not found")
  Meteor.startup(() => {
   process.env.MAIL_URL = 'smtp://' +
     encodeURIComponent(confirmSettings.smtp.username) +
     ':' + encodeURIComponent(confirmSettings.smtp.password) +
     '@' + encodeURIComponent(confirmSettings.smtp.server) +
     ':' +
     confirmSettings.smtp.port;
  });
}
