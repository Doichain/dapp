import { Meteor } from 'meteor/meteor';
import { MailJobs } from '../../../server/api/mail_jobs.js';
import { BlockchainJobs } from '../../../server/api/blockchain_jobs.js';
import { CONFIRM_APP, isAppType } from './type-configuration.js';
import addCheckNewTransactionsBlockchainJob from '../../modules/server/jobs/add_check_new_transactions.js';

Meteor.startup(() => {
  MailJobs.startJobServer();
  BlockchainJobs.startJobServer();
  if(isAppType(CONFIRM_APP)) addCheckNewTransactionsBlockchainJob();
});
