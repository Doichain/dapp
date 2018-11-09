
import { JobCollection,Job } from 'meteor/vsivsi:job-collection';
export const BlockchainJobs = JobCollection('blockchain');
import { Meteor } from 'meteor/meteor';
import insert from '../../imports/modules/server/doichain/insert.js';
import update from '../../imports/modules/server/doichain/update.js';
/* eslint-disable no-unused-vars */ //TODO re-enable this!
import checkNewTransaction from '../../imports/modules/server/doichain/check_new_transactions.js';
import { CONFIRM_APP, isAppType } from '../../imports/startup/server/type-configuration.js';
import {logMain} from "../../imports/startup/server/log-configuration";

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
    update(entry,job);
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
      //checkNewTransaction(null,job);
    }
  } catch(exception) {
    job.fail();
    throw new Meteor.Error('jobs.blockchain.checkNewTransactions.exception', exception);
  } finally {
    cb();
  }
});

new Job(BlockchainJobs, 'cleanup', {})
    .repeat({ schedule: BlockchainJobs.later.parse.text("every 5 minutes") })
    .save({cancelRepeats: true});

let q = BlockchainJobs.processJobs('cleanup',{ pollInterval: false, workTimeout: 60*1000 } ,function (job, cb) {
  const current = new Date()
    current.setMinutes(current.getMinutes() - 5);

  const ids = BlockchainJobs.find({
          status: {$in: Job.jobStatusRemovable},
          updated: {$lt: current}},
          {fields: { _id: 1 }});

    logMain('found  removable blockchain jobs:',ids);
    BlockchainJobs.removeJobs(ids);
    if(ids.length > 0){
      job.done("Removed #{ids.length} old jobs");
    }
    cb();
});

BlockchainJobs.find({ type: 'jobType', status: 'ready' })
    .observe({
        added: function () { q.trigger(); }
    });
