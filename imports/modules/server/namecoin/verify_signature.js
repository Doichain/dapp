import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import bitcore from 'bitcore-lib';
import Message from 'bitcore-message';
const NETWORK = bitcore.Networks.add({
  name: 'namecoin',
  alias: 'namecoin',
  pubkeyhash: 0x34,
  privatekey: 0xB4,
  scripthash: 13,
  networkMagic: 0xf9beb4fe,
});

const VerifySignatureSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  publicKey: {
    type: String
  },
  signature: {
    type: String
  }
});

const verifySignature = (data) => {
  try {
    const ourData = data;
    VerifySignatureSchema.validate(ourData);
    const address = bitcore.Address.fromPublicKey(new bitcore.PublicKey(ourData.publicKey), NETWORK);
    const valdidation = Message(ourData.email).verify(address, ourData.signature);
    return valdidation;
  } catch(exception) {
    throw new Meteor.Error('namecoin.verifySignature.exception', exception);
  }
};

export default verifySignature;
