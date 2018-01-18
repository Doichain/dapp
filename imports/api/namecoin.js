import { Meteor } from 'meteor/meteor';
import namecoin from "namecoin";
import { check } from 'meteor/check';
import { randomBytes } from 'crypto';
import secp256k1 from 'secp256k1';
import CryptoJS from 'crypto-js';
import Base58 from 'bs58';
import bitcore from 'bitcore-lib';
import Message from 'bitcore-message';

const VERSION_BYTE = '34';
var network = bitcore.Networks.add({
  name: 'namecoin',
  alias: 'namecoin',
  pubkeyhash: 0x34,
  privatekey: 0xB4,
  scripthash: 13,
  networkMagic: 0xf9beb4fe,
});
var client = new namecoin.Client({
  host: '192.168.99.100',
  port: 18332,
  user: 'test',
  pass: 'test'
});

Meteor.methods({
  'getName'(id) {
    check(id, String);
    let syncFunc = Meteor.wrapAsync(nameShow);
    return syncFunc(id);
  },
  'getBlockCount'() {
    let syncFunc = Meteor.wrapAsync(getBlockCount);
    return syncFunc();
  },
  'getKeys'() {
    let privateKey
    do {privateKey = randomBytes(32)} while(!secp256k1.privateKeyVerify(privateKey))
    let publicKey = secp256k1.publicKeyCreate(privateKey);
    let address = getAddress(publicKey);
    return {
      privateKey: privateKey.toString('hex').toUpperCase(),
      publicKey: publicKey.toString('hex').toUpperCase(),
      address: address
    }
  },
  'signMessage'(privateKey, message) {
    check(privateKey, String);
    check(message, String);
    return Message(message).sign(new bitcore.PrivateKey(privateKey));
  },
  'verifySignature'(publicKey, message, signature) {
    check(publicKey, String);
    check(message, String);
    check(signature, String);
    let address = bitcore.Address.fromPublicKey(new bitcore.PublicKey(publicKey), network);
    return Message(message).verify(address, signature);
  },
});

function getAddress(publicKey) {
  let key = CryptoJS.SHA256(byteArrayToWordArray(publicKey));
  key = CryptoJS.RIPEMD160(key);
  let address = new Buffer((VERSION_BYTE+key.toString()), 'hex');
  key = CryptoJS.SHA256(byteArrayToWordArray(address));
  key = CryptoJS.SHA256(key);
  let checksum = key.toString().substring(0, 8);
  address = new Buffer(address.toString('hex')+checksum,'hex');
  address = Base58.encode(address);
  return address;
}

function nameShow(id, callback) {
  client.cmd('name_show', id, function(err, balance) {
    callback(err, balance);
  });
}

function getBlockCount(callback) {
  client.cmd('getblockcount', function(err, count) {
    callback(err, count);
  });
}

function byteArrayToWordArray(ba) {
	let wa = [], i;
	for(i = 0; i < ba.length; i++) {
		wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
	}
	return CryptoJS.lib.WordArray.create(wa, ba.length);
}
