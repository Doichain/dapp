
import { JobCollection } from 'meteor/vsivsi:job-collection';
export const BlockchainJobs = JobCollection('blockchain');
import { Meteor } from 'meteor/meteor';
import insert from '../../imports/modules/server/doichain/insert.js';
import update from '../../imports/modules/server/doichain/update.js';
/* eslint-disable no-unused-vars */ //TODO re-enable this!
import checkNewTransaction from '../../imports/modules/server/doichain/check_new_transactions.js';
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

BlockchainJobs.processJobs('update', {workTimeout: 30*1000},function (job, cb) {
  try {
    const entry = job.data;
    update(entry);
    job.done();
  } catch(exception) {
    job.fail();
    throw new Meteor.Error('jobs.blockchain.update.exception', exception);
  } finally {
    cb();
  }
});

BlockchainJobs.processJobs('checkNewTransaction', {workTimeout: 30*1000},function (job, cb) {
  try {
    if(!isAppType(CONFIRM_APP)) {
      job.pause();
      job.cancel();
      job.remove();
    } else {
      //checkNewTransaction(null,job); //TODO re-enable this since its very important for downtime of the dApp.
    }
  } catch(exception) {
    job.fail();
    throw new Meteor.Error('jobs.blockchain.checkNewTransactions.exception', exception);
  } finally {
    cb();
  }
});
