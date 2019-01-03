import { JobCollection, Job } from 'meteor/vsivsi:job-collection';
import fetchDoiMailData from '../../imports/modules/server/dapps/fetch_doi-mail-data.js';
import { Meteor } from 'meteor/meteor';
import {logMain} from "../../imports/startup/server/log-configuration";
export const DAppJobs = JobCollection('dapp');

DAppJobs.processJobs('fetchDoiMailData', function (job, cb) {
  try {
    const data = job.data;
    fetchDoiMailData(data);
    job.done();
  } catch(exception) {
    job.fail();
    throw new Meteor.Error('jobs.dapp.fetchDoiMailData.exception', exception);
  } finally {
    cb();
  }
});


new Job(DAppJobs, 'cleanup', {})
    .repeat({ schedule: DAppJobs.later.parse.text("every 5 minutes") })
    .save({cancelRepeats: true});

let q = DAppJobs.processJobs('cleanup',{ pollInterval: false, workTimeout: 60*1000 } ,function (job, cb) {
    const current = new Date()
    current.setMinutes(current.getMinutes() - 5);

    const ids = DAppJobs.find({
            status: {$in: Job.jobStatusRemovable},
            updated: {$lt: current}},
        {fields: { _id: 1 }});

    logMain('found  removable blockchain jobs:',ids);
    DAppJobs.removeJobs(ids);
    if(ids.length > 0){
        job.done("Removed #{ids.length} old jobs");
    }
    cb();
});

DAppJobs.find({ type: 'jobType', status: 'ready' })
    .observe({
        added: function () { q.trigger(); }
    });
