import { Meteor } from 'meteor/meteor';
import { randomBytes } from 'crypto';
import secp256k1 from 'secp256k1';

const getKeyPair = () => {
  try {
    let privKey
    do {privKey = randomBytes(32)} while(!secp256k1.privateKeyVerify(privKey))
    const privateKey = privKey;
    const publicKey = secp256k1.publicKeyCreate(privateKey);
    return {
      privateKey: privateKey.toString('hex').toUpperCase(),
      publicKey: publicKey.toString('hex').toUpperCase()
    }
  } catch(exception) {
    throw new Meteor.Error('namecoin.getKeyPair.exception', exception);
  }
};

export default getKeyPair;
