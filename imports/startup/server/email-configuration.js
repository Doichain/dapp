import { Meteor } from 'meteor/meteor';
import Hashids from 'hashids';

export const HashIds = new Hashids('0xugmLe7Nyee6vk1iF88(6CmwpqoG4hQ*-T74tjYw^O2vOO(Xl-91wA8*nCg_lX$');

Meteor.startup(() => {
 process.env.MAIL_URL = 'smtp://' +
   encodeURIComponent(Meteor.settings.smtp.username) +
   ':' + encodeURIComponent(Meteor.settings.smtp.password) +
   '@' + encodeURIComponent(Meteor.settings.smtp.server) +
   ':' +
   Meteor.settings.smtp.port;
});
