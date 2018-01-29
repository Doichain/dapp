import { Meteor } from 'meteor/meteor';
import { MailJobs } from '../../../server/api/mail_jobs.js';

Meteor.startup(() => {
  MailJobs.startJobServer();
});
