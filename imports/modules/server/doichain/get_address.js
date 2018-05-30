import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import CryptoJS from 'crypto-js';
import Base58 from 'bs58';
import { isRegtest } from '../../../startup/server/dapp-configuration.js';

const VERSION_BYTE = 0x34;
const VERSION_BYTE_REGTEST = 0x6f;
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
    throw new Meteor.Error('doichain.getAddress.exception', exception);
  }
};

function _getAddress(publicKey) {
  const pubKey = CryptoJS.lib.WordArray.create(Buffer.from(publicKey, 'hex'));
  let key = CryptoJS.SHA256(pubKey);
  key = CryptoJS.RIPEMD160(key);
  let versionByte = VERSION_BYTE;
  if(isRegtest()) versionByte = VERSION_BYTE_REGTEST;
  let address = Buffer.concat([Buffer.from([VERSION_BYTE]), Buffer.from(key.toString(), 'hex')]);
  key = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(address));
  key = CryptoJS.SHA256(key);
  let checksum = key.toString().substring(0, 8);
  address = new Buffer(address.toString('hex')+checksum,'hex');
  address = Base58.encode(address);
  return address;
}

export default getAddress;
