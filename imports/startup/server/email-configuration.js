import { Meteor } from 'meteor/meteor';

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
