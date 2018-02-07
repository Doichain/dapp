import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import CryptoJS from 'crypto-js';
import Base58 from 'bs58';

const VERSION_BYTE = 0x34;
const GetAddressSchema = new SimpleSchema({
  publicKey: {
    type: String
  }
});

const getAddress = (data) => {
  try {
    const ourData = data;
    GetAddressSchema.validate(ourData);
    return _getAddress(ourData.publicKey);
  } catch(exception) {
    throw new Meteor.Error('namecoin.getAddress.exception', exception);
  }
};

function _getAddress(publicKey) {
  let key = CryptoJS.SHA256(publicKey);
  key = CryptoJS.RIPEMD160(key);
  let address = Buffer.concat([Buffer.from([VERSION_BYTE]), new Buffer(key.toString(), 'hex')]);
  key = CryptoJS.SHA256(byteArrayToWordArray(address));
  key = CryptoJS.SHA256(key);
  let checksum = key.toString().substring(0, 8);
  address = new Buffer(address.toString('hex')+checksum,'hex');
  address = Base58.encode(address);
  return address;
}

function byteArrayToWordArray(ba) {
	let wa = [], i;
	for(i = 0; i < ba.length; i++) {
		wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
	}
	return CryptoJS.lib.WordArray.create(wa, ba.length);
}

export default getAddress;
