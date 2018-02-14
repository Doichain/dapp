import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { nameFirstUpdate } from '../../../../server/api/namecoin.js';
import { SEND_CLIENT } from '../../../startup/server/namecoin-configuration.js';

const FirstUpdateSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  tx: {
    type: String
  },
  rand: {
    type: String
  },
  value: {
    type: String
  },
  address: {
    type: String
  }
});

const firstUpdate = (data) => {
  try {
    const ourData = data;
    FirstUpdateSchema.validate(ourData);
    nameFirstUpdate(SEND_CLIENT, ourData.nameId, ourData.rand, ourData.tx, ourData.value, ourData.address);
  } catch(exception) {
    throw new Meteor.Error('namecoin.firstUpdate.exception', exception);
  }
};

export default firstUpdate;
