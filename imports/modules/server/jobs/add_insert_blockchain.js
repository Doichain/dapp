import { Meteor } from 'meteor/meteor';
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
    type: String
  },
  soiDate: {
    type: Date
  },
  doiDate: {
    type: Date
  }
});

const addInsertBlockchainJob = (entry) => {
  try {
    const ourEntry = entry;
    AddInsertBlockchainJobSchema.validate(ourEntry);
    const job = new Job(BlockchainJobs, 'insert', ourEntry);
    job.retry({wait: 60*1000 }).save();
  } catch (exception) {
    throw new Meteor.Error('jobs.add_insert_blockchain.exception', exception);
  }
};

export default addInsertBlockchainJob;
