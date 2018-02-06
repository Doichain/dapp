import { Meteor } from 'meteor/meteor';
import { SEND_APP, CONFIRM_APP, VERIFY_APP, isAppType } from './type-configuration.js';
import Hashids from 'hashids';

export const HashIds = new Hashids('0xugmLe7Nyee6vk1iF88(6CmwpqoG4hQ*-T74tjYw^O2vOO(Xl-91wA8*nCg_lX$');

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
