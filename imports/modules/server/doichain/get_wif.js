import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import CryptoJS from 'crypto-js';
import Base58 from 'bs58';
import { isRegtest } from '../../../startup/server/dapp-configuration.js';

const VERSION_BYTE = 0xb4;
const VERSION_BYTE_REGTEST = 0xef; //TODO IS THIS STILL the correct version byte?! I was thinking having it changed in core?
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
    throw new Meteor.Error('doichain.getWif.exception', exception);
  }
};

function _getWif(privateKey) {
  var key = privateKey;
  let versionByte = VERSION_BYTE;
  if(isRegtest()) versionByte = VERSION_BYTE_REGTEST
  const buf = Buffer.concat([Buffer.from([versionByte]), new Buffer(key, 'hex')]);
  let wif = CryptoJS.lib.WordArray.create(buf);
  key = CryptoJS.SHA256(wif);
  key = CryptoJS.SHA256(key);
  let checksum = key.toString().substring(0, 8);
  wif = new Buffer(wif.toString()+checksum,'hex');
  wif = Base58.encode(wif);
  return wif;
}

export default getWif;
