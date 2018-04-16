import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { nameDoi } from '../../../../server/api/namecoin.js';
import { CONFIRM_CLIENT } from '../../../startup/server/namecoin-configuration.js';

const UpdateSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  value: {
    type: String
  }
});

const update = (data) => {
  try {
    const ourData = data;
    UpdateSchema.validate(ourData);
    nameDoi(CONFIRM_CLIENT, ourData.nameId, ourData.value, null);
  } catch(exception) {
    throw new Meteor.Error('namecoin.update.exception', exception);
  }
};

export default update;
