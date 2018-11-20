import { Meteor } from 'meteor/meteor';
import { Job } from 'meteor/vsivsi:job-collection';
import SimpleSchema from 'simpl-schema';
import { BlockchainJobs } from '../../../../server/api/blockchain_jobs.js';

const AddInsertBlockchainJobSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  signature: {
    type: String
  },
  dataHash: {
    type: String,
    optional:true
  },
  domain: {
    type: String
  },
  soiDate: {
    type: Date
  }
});

const addInsertBlockchainJob = (entry) => {
  try {
    const ourEntry = entry;
    AddInsertBlockchainJobSchema.validate(ourEntry);
    const job = new Job(BlockchainJobs, 'insert', ourEntry);
    job.retry({retries: 10, wait: 3*60*1000 }).save(); //check every 10sec for 1h
  } catch (exception) {
    throw new Meteor.Error('jobs.addInsertBlockchain.exception', exception);
  }
};

export default addInsertBlockchainJob;
