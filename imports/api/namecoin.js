import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { randomBytes } from 'crypto';
import namecoin from "namecoin";
import secp256k1 from 'secp256k1';
import CryptoJS from 'crypto-js';
import Base58 from 'bs58';
import bitcore from 'bitcore-lib';
import Message from 'bitcore-message';

const NAMESPACE = 'e/';
const VERSION_BYTE = '34';
const NETWORK = bitcore.Networks.add({
  name: 'namecoin',
  alias: 'namecoin',
  pubkeyhash: 0x34,
  privatekey: 0xB4,
  scripthash: 13,
  networkMagic: 0xf9beb4fe,
});
const CLIENT = new namecoin.Client({
  host: '192.168.99.100',
  port: 18332,
  user: 'test',
  pass: 'test'
});

Meteor.methods({
  'getBlockCount'() {
    let syncFunc = Meteor.wrapAsync(getBlockCount);
    let count;
    try {
      count = syncFunc();
    } catch(error) {
      if(error.message.startsWith('connect ETIMEDOUT')) throw new Meteor.Error("Timeout")
      else throw error;
    }
    return count;
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
    let privKey;
    try {
      privKey = new bitcore.PrivateKey(privateKey);
    } catch(error) {throw new Meteor.Error("Invalid private key")}
    return Message(message).sign(privKey);
  },
  'verifySignature'(publicKey, message, signature) {
    check(publicKey, String);
    check(message, String);
    check(signature, String);
    let pubKey;
    try {
      pubKey = new bitcore.PublicKey(publicKey)
    } catch(error) {throw new Meteor.Error("Invalid public key")}
    let address = bitcore.Address.fromPublicKey(pubKey, NETWORK);
    let valid;
    try {
      valid = Message(message).verify(address, signature);
    } catch(error) {throw new Meteor.Error("Invalid signature")}
    return valid
  },
  'getHash'(params) {
    check(params, Array);
    let string = "";
    params.forEach((e) => {
      string += e;
    })
    return CryptoJS.SHA256(string).toString();
  },
  'nameNew'(hash) {
    check(hash, String);
    let id = NAMESPACE+hash;
    let syncFunc = Meteor.wrapAsync(nameShow);
    let nameFound = true;
    try {
      let result = syncFunc(id);
    } catch(error) {
      if(error.message.startsWith('connect ETIMEDOUT')) throw new Meteor.Error("Timeout")
      if(error.message.startsWith('name not found')) nameFound = false;
      else throw error;
    }
    if(nameFound) throw new Meteor.Error("Already in blockchain")
    syncFunc = Meteor.wrapAsync(nameNew);
    let result
    try {
      result = syncFunc(id);
    } catch(error) {
      if(error.message.startsWith('connect ETIMEDOUT')) throw new Meteor.Error("Timeout")
      else throw error;
    }
    return result;
  },
  'nameFirstUpdate'(hash, signature, dataHash, rand, tx) {
    check(hash, String);
    check(signature, String);
    check(dataHash, String);
    check(rand, String);
    check(tx, String);
    let id = NAMESPACE+hash;
    let value = "{signature: '"+signature+"', data_hash: '"+dataHash+"'}";
    let syncFunc = Meteor.wrapAsync(nameFirstUpdate);
    let result
    try {
      result = syncFunc(id, rand, tx, value);
    } catch(error) {
      if(error.message.startsWith('connect ETIMEDOUT')) throw new Meteor.Error("Timeout")
      else throw error;
    }
    return result;
  }
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

function nameFirstUpdate(id, rand, tx, value, callback) {
  CLIENT.cmd('name_firstupdate', id, rand, tx, value, function(err, result) {
    callback(err, result);
  });
}

function nameNew(id, callback) {
  CLIENT.cmd('name_new', id, function(err, result) {
    callback(err, result);
  });
}

function nameShow(id, callback) {
  CLIENT.cmd('name_show', id, function(err, balance) {
    callback(err, balance);
  });
}

function getBlockCount(callback) {
  CLIENT.cmd('getblockcount', function(err, count) {
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
