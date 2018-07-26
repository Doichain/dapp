import { JobCollection } from 'meteor/vsivsi:job-collection';
import fetchDoiMailData from '../../imports/modules/server/dapps/fetch_doi-mail-data.js';
import { Meteor } from 'meteor/meteor';

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
