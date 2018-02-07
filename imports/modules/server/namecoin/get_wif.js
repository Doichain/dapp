import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import CryptoJS from 'crypto-js';
import Base58 from 'bs58';

const VERSION_BYTE = 0xef;
const GetWifSchema = new SimpleSchema({
  privateKey: {
    type: String
  }
});

const getWif = (data) => {
  try {
    const ourData = data;
    GetWifSchema.validate(ourData);
    return _getWif(ourData.privateKey);
  } catch(exception) {
    throw new Meteor.Error('namecoin.getAddress.exception', exception);
  }
};

function _getWif(privateKey) {
  var key = privateKey;
  let wif = Buffer.concat([Buffer.from([VERSION_BYTE]), new Buffer(key.toString(), 'hex')]);
  key = CryptoJS.SHA256(byteArrayToWordArray(wif));
  key = CryptoJS.SHA256(key);
  let checksum = key.toString().substring(0, 8);
  wif = new Buffer(wif.toString('hex')+checksum,'hex');
  wif = Base58.encode(wif);
  return wif;
}

function byteArrayToWordArray(ba) {
	let wa = [], i;
	for(i = 0; i < ba.length; i++) {
		wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
	}
	return CryptoJS.lib.WordArray.create(wa, ba.length);
}

export default getWif;
