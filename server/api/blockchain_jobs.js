export const BlockchainJobs = JobCollection('blockchain');
import insert from '../../imports/modules/server/namecoin/insert.js';
import claim from '../../imports/modules/server/namecoin/claim_and_transfer.js';
import checkNewTransactions from '../../imports/modules/server/namecoin/check_new_transactions.js';
import { CONFIRM_APP, isAppType } from '../../imports/startup/server/type-configuration.js';

BlockchainJobs.processJobs('insert', {workTimeout: 30*1000},function (job, cb) {
  try {
    const entry = job.data;
    insert(entry);
    job.done();
  } catch(exception) {
    job.fail();
    throw new Meteor.Error('jobs.blockchain.insert.exception', exception);
  } finally {
    cb();
  }
});

BlockchainJobs.processJobs('claim', {workTimeout: 30*1000},function (job, cb) {
  try {
    const entry = job.data;
    claim(entry);
    job.done();
  } catch(exception) {
    job.fail();
    throw new Meteor.Error('jobs.blockchain.claim.exception', exception);
  } finally {
    cb();
  }
});

BlockchainJobs.processJobs('checkNewTransactions', {workTimeout: 5*60*1000},function (job, cb) {
  try {
    if(!isAppType(CONFIRM_APP)) {
      job.pause();
      job.cancel();
      job.remove();
    } else {
      checkNewTransactions();
      job.done();
    }
  } catch(exception) {
    job.fail();
    throw new Meteor.Error('jobs.blockchain.checkNewTransactions.exception', exception);
  } finally {
    cb();
  }
});
