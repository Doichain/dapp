import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import crypto from 'crypto';
import ecies from 'standard-ecies';

const DecryptMessageSchema = new SimpleSchema({
  privateKey: {
    type: String
  },
  message: {
    type: String
  }
});

const decryptMessage = (data) => {
  try {
    const ourData = data;
    DecryptMessageSchema.validate(ourData);
    const privateKey = Buffer.from(ourData.privateKey, 'hex');
    const ecdh = crypto.createECDH('secp256k1');
    ecdh.setPrivateKey(privateKey);
    const message = Buffer.from(ourData.message, 'hex');
    return ecies.decrypt(ecdh, message).toString('utf8');
  } catch(exception) {
    throw new Meteor.Error('doichain.decryptMessage.exception', exception);
  }
};

export default decryptMessage;
