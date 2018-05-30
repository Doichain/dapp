import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import ecies from 'standard-ecies';

const EncryptMessageSchema = new SimpleSchema({
  publicKey: {
    type: String
  },
  message: {
    type: String
  }
});

const encryptMessage = (data) => {
  try {
    const ourData = data;
    EncryptMessageSchema.validate(ourData);
    const publicKey = Buffer.from(ourData.publicKey, 'hex');
    const message = Buffer.from(ourData.message);
    return ecies.encrypt(publicKey, message).toString('hex');
  } catch(exception) {
    throw new Meteor.Error('doichain.encryptMessage.exception', exception);
  }
};

export default encryptMessage;
