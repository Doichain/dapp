import { Meteor } from 'meteor/meteor';
import { MailJobs } from '../../../server/api/mail_jobs.js';
import { BlockchainJobs } from '../../../server/api/blockchain_jobs.js';

Meteor.startup(() => {
  MailJobs.startJobServer();
  BlockchainJobs.startJobServer();
});
