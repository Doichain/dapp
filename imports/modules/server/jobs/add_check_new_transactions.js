import { Meteor } from 'meteor/meteor';
import { BlockchainJobs } from '../../../../server/api/blockchain_jobs.js';

const addCheckNewTransactionsBlockchainJob = () => {
  try {
    const job = new Job(BlockchainJobs, 'checkNewTransaction', {});
    job.retry({retries: 60, wait: 60*1000 }).repeat({repeats: Job.forever, wait: 1*60*1000}).save({cancelRepeats: true});
  } catch (exception) {
    throw new Meteor.Error('jobs.addCheckNewTransactionsBlockchain.exception', exception);
  }
};

export default addCheckNewTransactionsBlockchainJob;
