import { Meteor } from 'meteor/meteor';
import Hashids from 'hashids';

export const HashIds = new Hashids('0xugmLe7Nyee6vk1iF88(6CmwpqoG4hQ*-T74tjYw^O2vOO(Xl-91wA8*nCg_lX$');

Meteor.startup(() => {
  smtp = {
   username: 'dustin.hoffmann@adindex.de',
   password: '*****',
   server:   'smtp.gmail.com',
   port: 587
 }

 process.env.MAIL_URL = 'smtp://' +
   encodeURIComponent(smtp.username) +
   ':' + encodeURIComponent(smtp.password) +
   '@' + encodeURIComponent(smtp.server) +
   ':' +
   smtp.port;
});
