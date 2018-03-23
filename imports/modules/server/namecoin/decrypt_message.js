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
    let uncompressedKey = ourData.privateKey;
    if(uncompressedKey.length === 66 && uncompressedKey.endsWith("01")) {
      uncompressedKey = uncompressedKey.substring(0, uncompressedKey.length - 2);
    }
    const privateKey = Buffer.from(uncompressedKey, 'hex');
    const ecdh = crypto.createECDH('secp256k1');
    ecdh.setPrivateKey(privateKey);
    const message = Buffer.from(ourData.message, 'hex');
    return ecies.decrypt(ecdh, message).toString('utf8');
  } catch(exception) {
    throw new Meteor.Error('namecoin.decryptMessage.exception', exception);
  }
};

export default decryptMessage;
