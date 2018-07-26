import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Job } from 'meteor/vsivsi:job-collection';
import { DAppJobs } from '../../../../server/api/dapp_jobs.js';

const AddFetchDoiMailDataJobSchema = new SimpleSchema({
  name: {
    type: String
  },
  domain: {
    type: String
  }
});

const addFetchDoiMailDataJob = (data) => {
  try {
    const ourData = data;
    AddFetchDoiMailDataJobSchema.validate(ourData);
    const job = new Job(DAppJobs, 'fetchDoiMailData', ourData);
    job.retry({retries: 5, wait: 1*10*1000 }).save(); //check every 10 secs 5 times
  } catch (exception) {
    throw new Meteor.Error('jobs.addFetchDoiMailData.exception', exception);
  }
};

export default addFetchDoiMailDataJob;
