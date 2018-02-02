import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { BlockchainJobs } from '../../../../server/api/blockchain_jobs.js';

const AddClaimBlockchainJobSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  tx: {
    type: String
  },
  rand: {
    type: String
  },
  signature: {
    type: String
  },
  dataHash: {
    type: String
  },
  soiDate: {
    type: Date
  },
  doiDate: {
    type: Date
  }
});

const addClaimBlockchainJob = (entry) => {
  try {
    const ourEntry = entry;
    AddClaimBlockchainJobSchema.validate(ourEntry);
    const job = new Job(BlockchainJobs, 'claim', ourEntry);
    job.retry({retries: 10, wait: 60*1000 }).save();
  } catch (exception) {
    throw new Meteor.Error('jobs.addClaimBlockchain.exception', exception);
  }
};

export default addClaimBlockchainJob;
