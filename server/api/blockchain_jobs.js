export const BlockchainJobs = JobCollection('blockchain');

BlockchainJobs.processJobs('insert', function (job, cb) {
  try {
    const entry = job.data;
    //TODO: Process Job
    console.log(entry);
    job.done();
  } catch(exception) {
    job.fail();
    throw new Meteor.Error('jobs.blockchain.insert.exception', exception);
  }
  cb();
});
