import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { nameFirstUpdate } from '../../../../server/api/namecoin.js';

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
  }
});

const firstUpdate = (data) => {
  try {
    const ourData = data;
    nameFirstUpdate(ourData.nameId, ourData.rand, ourData.tx, ourData.value);
  } catch(exception) {
    throw new Meteor.Error('namecoin.firstUpdate.exception', exception);
  }
};

export default firstUpdate;
