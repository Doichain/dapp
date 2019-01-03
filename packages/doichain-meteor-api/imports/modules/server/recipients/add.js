import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Recipients } from '../../../api/recipients/recipients.js';
import getKeyPair from '../doichain/get_key-pair.js';

const AddRecipientSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
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
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey
    })
  } catch (exception) {
    throw new Meteor.Error('recipients.add.exception', exception);
  }
};

export default addRecipient;
