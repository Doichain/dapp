import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import CryptoJS from 'crypto-js';
import Base58 from 'bs58';

const VERSION_BYTE = 0xef;
const COMPRESS_BYTE = 0x01;
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
    throw new Meteor.Error('namecoin.getWif.exception', exception);
  }
};

function _getWif(privateKey) {
  var key = privateKey;
  const buf = Buffer.concat([Buffer.from([VERSION_BYTE]), new Buffer(key, 'hex'), Buffer.from([COMPRESS_BYTE])]);
  let wif = CryptoJS.lib.WordArray.create(buf);
  key = CryptoJS.SHA256(wif);
  key = CryptoJS.SHA256(key);
  let checksum = key.toString().substring(0, 8);
  wif = new Buffer(wif.toString()+checksum,'hex');
  wif = Base58.encode(wif);
  return wif;
}

export default getWif;
