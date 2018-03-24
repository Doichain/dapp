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
    job.retry({retries: 100, wait: 3*60*1000 }).save();
  } catch (exception) {
    throw new Meteor.Error('jobs.addFetchDoiMailData.exception', exception);
  }
};

export default addFetchDoiMailDataJob;
