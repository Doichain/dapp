import { Meteor } from 'meteor/meteor';
import Recipients from '../../api/recipients/recipients';

const addRecipient = (email) => {
  try {

  } catch (exception) {
    throw new Meteor.Error('recipients.add.exception',
      `Exception while adding recipient: ${exception}`);
  }
};

export default addRecipient;
