import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import addRecipient from '../recipients/add.js';

const AddOptInSchema = new SimpleSchema({
  recipient_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  sender_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  customer_id: {
    type: String
  },
  data: {
    type: String,
    optional: true
  }
});

const addOptIn = (optIn) => {
  try {
    const ourOptIn = optIn;
    AddOptInSchema.validate(ourOptIn);
    const recipient = {
      email: ourOptIn.recipient_mail,
      customer_id: ourOptIn.customer_id
    }
    const recipientId = addRecipient(recipient);
    //TODO: Go on
  } catch (exception) {
    throw new Meteor.Error('opt-ins.add.exception', exception);
  }
};

export default addOptIn;
