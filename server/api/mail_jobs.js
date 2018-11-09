import { Meteor } from 'meteor/meteor';
import { JobCollection, Job } from 'meteor/vsivsi:job-collection';
export const MailJobs = JobCollection('emails');
import sendMail from '../../imports/modules/server/emails/send.js';
import {logMain} from "../../imports/startup/server/log-configuration";
import {BlockchainJobs} from "./blockchain_jobs";



MailJobs.processJobs('send', function (job, cb) {
  try {
    const email = job.data;
    sendMail(email);
    job.done();
  } catch(exception) {
    job.fail();
    throw new Meteor.Error('jobs.mail.send.exception', exception);
  } finally {
    cb();
  }
});


new Job(MailJobs, 'cleanup', {})
    .repeat({ schedule: MailJobs.later.parse.text("every 5 minutes") })
    .save({cancelRepeats: true})

let q = MailJobs.processJobs('cleanup',{ pollInterval: false, workTimeout: 60*1000 } ,function (job, cb) {
    const current = new Date()
    current.setMinutes(current.getMinutes() - 5);

    const ids = MailJobs.find({
            status: {$in: Job.jobStatusRemovable},
            updated: {$lt: current}},
        {fields: { _id: 1 }});

    logMain('found  removable blockchain jobs:',ids);
    MailJobs.removeJobs(ids);
    if(ids.length > 0){
        job.done("Removed #{ids.length} old jobs");
    }
    cb();
});

MailJobs.find({ type: 'jobType', status: 'ready' })
    .observe({
        added: function () { q.trigger(); }
    });

