import { Meteor } from 'meteor/meteor';
import { BlockchainJobs } from '../../../../server/api/blockchain_jobs.js';

const addCheckNewTransactionsBlockchainJob = () => {
  try {
    const job = new Job(BlockchainJobs, 'checkNewTransaction', {});
    //disabled every 15 seconds .repeat({repeats: Job.forever, wait: 1*15*1000}) //{cancelRepeats: true}
    job.retry({retries: 50, wait: 60*1000 }).save();
  } catch (exception) {
    throw new Meteor.Error('jobs.addCheckNewTransactionsBlockchain.exception', exception);
  }
};

export default addCheckNewTransactionsBlockchainJob;
