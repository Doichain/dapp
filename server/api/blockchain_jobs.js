export const BlockchainJobs = JobCollection('blockchain');
import insert from '../../imports/modules/server/namecoin/insert.js';
import claim from '../../imports/modules/server/namecoin/claim.js';

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
