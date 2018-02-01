import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Recipients } from '../../../api/recipients/recipients.js';
import getKeyPair from '../namecoin/get_key-pair.js';

const AddRecipientSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  customer_id: {
    type: String
  }
});

const addRecipient = (recipient) => {
  try {
    const ourRecipient = recipient;
    AddRecipientSchema.validate(ourRecipient);
    const recipients = Recipients.find({email: recipient.email}).fetch();
    if(recipients.length > 0) return recipients[0]._id;
    const keyPair = getKeyPair();
    return Recipients.insert({
      email: ourRecipient.email,
      customerId: ourRecipient.customer_id,
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey
    })
  } catch (exception) {
    throw new Meteor.Error('recipients.add.exception', exception);
  }
};

export default addRecipient;
