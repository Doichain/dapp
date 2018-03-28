import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
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
    job.retry({retries: 360, wait: 1*10*1000 }).save(); //check every 10 secs for an hour
  } catch (exception) {
    throw new Meteor.Error('jobs.addFetchDoiMailData.exception', exception);
  }
};

export default addFetchDoiMailDataJob;
