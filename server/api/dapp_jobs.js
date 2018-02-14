export const DAppJobs = JobCollection('dapp');
import fetchDoiMailData from '../../imports/modules/server/dapps/fetch_doi-mail-data.js';

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
