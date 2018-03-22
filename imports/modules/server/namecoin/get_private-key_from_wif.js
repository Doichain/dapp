import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import Base58 from 'bs58';

const GetPrivateKeyFromWifSchema = new SimpleSchema({
  wif: {
    type: String
  }
});

const getPrivateKeyFromWif = (data) => {
  try {
    const ourData = data;
    GetPrivateKeyFromWifSchema.validate(ourData);
    return _getPrivateKeyFromWif(ourData.wif);
  } catch(exception) {
    throw new Meteor.Error('namecoin.getPrivateKeyFromWif.exception', exception);
  }
};

function _getPrivateKeyFromWif(wif) {
  var privateKey = Base58.decode(wif).toString('hex');
  var privateKey = privateKey.substring(2, privateKey.length - 8);
  return privateKey;
}

export default getPrivateKeyFromWif;
