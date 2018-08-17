import { Meteor } from 'meteor/meteor';
import {logBlockchain, logConfirm, logError} from "../../imports/startup/server/log-configuration";


const NAMESPACE = 'e/';


export function getWif(client, address) {
  if(!address){
        address = getAddressesByAccount("")[0];
        logBlockchain('address was not defined so getting the first existing one of the wallet:',address);
  }
  if(!address){
        address = getNewAddress("");
        logBlockchain('address was never defined  at all generated new address for this wallet:',address);
  }
  const syncFunc = Meteor.wrapAsync(doichain_dumpprivkey);
  return syncFunc(client, address);
}

function doichain_dumpprivkey(client, address, callback) {
  const ourAddress = address;
  client.cmd('dumpprivkey', ourAddress, function(err, data) {
    if(err)  logError('doichain_dumpprivkey:',err);
    callback(err, data);
  });
}

export function getAddressesByAccount(client, accout) {
    const syncFunc = Meteor.wrapAsync(doichain_getaddressesbyaccount);
    return syncFunc(client, accout);
}

function doichain_getaddressesbyaccount(client, account, callback) {
    const ourAccount = account;
    client.cmd('getaddressesbyaccount', ourAccount, function(err, data) {
        if(err)  logError('getaddressesbyaccount:',err);
        callback(err, data);
    });
}

export function getNewAddress(client, accout) {
    const syncFunc = Meteor.wrapAsync(doichain_getnewaddress);
    return syncFunc(client, accout);
}
function doichain_getnewaddress(client, account, callback) {
    const ourAccount = account;
    client.cmd('getnewaddresss', ourAccount, function(err, data) {
        if(err)  logError('getnewaddresss:',err);
        callback(err, data);
    });
}


export function signMessage(client, address, message) {
    const syncFunc = Meteor.wrapAsync(doichain_signMessage);
    return syncFunc(client, address, message);
}

function doichain_signMessage(client, address, message, callback) {
    const ourAddress = address;
    const ourMessage = message;
    client.cmd('signmessage', ourAddress, ourMessage, function(err, data) {
        callback(err, data);
    });
}

export function nameShow(client, id) {
  const syncFunc = Meteor.wrapAsync(doichain_nameShow);
  return syncFunc(client, id);
}

function doichain_nameShow(client, id, callback) {
  const ourId = checkId(id);
  logConfirm('doichain-cli name_show :',ourId);
  client.cmd('name_show', ourId, function(err, data) {
    if(err !== undefined && err !== null && err.message.startsWith("name not found")) {
      err = undefined,
      data = undefined
    }
    callback(err, data);
  });
}

export function feeDoi(client, address) {
    const syncFunc = Meteor.wrapAsync(doichain_feeDoi);
    return syncFunc(client, address);
}

function doichain_feeDoi(client, address, callback) {
    const destAddress = address;
    client.cmd('sendtoaddress', destAddress, '0.01', function(err, data) {
        callback(err, data);
    });
}

export function nameDoi(client, name, value, address) {
    const syncFunc = Meteor.wrapAsync(doichain_nameDoi);
    return syncFunc(client, name, value, address);
}

function doichain_nameDoi(client, name, value, address, callback) {
    const ourName = checkId(name);
    const ourValue = value;
    const destAddress = address;
    if(!address) {
        client.cmd('name_doi', ourName, ourValue, function (err, data) {
            callback(err, data);
        });
    }else{
        client.cmd('name_doi', ourName, ourValue, destAddress, function(err, data) {
            callback(err, data);
        });
    }
}

export function listSinceBlock(client, block) {
    const syncFunc = Meteor.wrapAsync(doichain_listSinceBlock);
    var ourBlock = block;
    if(ourBlock === undefined) ourBlock = null;
    return syncFunc(client, ourBlock);
}

function doichain_listSinceBlock(client, block, callback) {
    var ourBlock = block;
    if(ourBlock === null) client.cmd('listsinceblock', function(err, data) {
        callback(err, data);
    });
    else client.cmd('listsinceblock', ourBlock, function(err, data) {
        callback(err, data);
    });
}

export function getRawTransaction(client, txid) {
    const syncFunc = Meteor.wrapAsync(doichain_getrawtransaction);
    return syncFunc(client, txid);
}

function doichain_getrawtransaction(client, txid, callback) {
    logConfirm('doichain_getrawtransaction:',txid);
    client.cmd('getrawtransaction', txid, 1, function(err, data) {
        if(err)  logError('doichain_getrawtransaction:',err);
        callback(err, data);
    });
}
export function getBalance(client) {
    const syncFunc = Meteor.wrapAsync(doichain_getbalance);
    return syncFunc(client);
}

function doichain_getbalance(client, callback) {
    client.cmd('getbalance', function(err, data) {
        if(err) { logError('doichain_getbalance:',err);}
        callback(err, data);
    });
}

function checkId(id) {
    const DOI_PREFIX = "doi: ";
    let ret_val;

    if(!id.startsWith(DOI_PREFIX)) ret_val = id.substring(DOI_PREFIX.length);
    if(!id.startsWith(NAMESPACE)) ret_val = NAMESPACE+id;
  return ret_val;
}
