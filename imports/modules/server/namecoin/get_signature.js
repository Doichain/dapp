import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import bitcore from 'bitcore-lib';
import Message from 'bitcore-message';

const GetSignatureSchema = new SimpleSchema({
  message: {
    type: String
  },
  privateKey: {
    type: String
  }
});

const getSignature = (data) => {
  try {
    const ourData = data;
    GetSignatureSchema.validate(ourData);
    const signature = Message(ourData.message).sign(new bitcore.PrivateKey(ourData.privateKey));
    return signature;
  } catch(exception) {
    throw new Meteor.Error('namecoin.getSignature.exception', exception);
  }
};

export default getSignature;
