import { Meteor } from 'meteor/meteor';


const NAMESPACE = 'e/';


export function getWif(client, address) {
  const syncFunc = Meteor.wrapAsync(namecoin_dumpprivkey);
  return syncFunc(client, address);
}

function namecoin_dumpprivkey(client, address, callback) {
  const ourAddress = address;
  client.cmd('dumpprivkey', ourAddress, function(err, data) {
    if(err) console.log(err);
    callback(err, data);
  });
}

export function signMessage(client, address, message) {
    const syncFunc = Meteor.wrapAsync(namecoin_signMessage);
    return syncFunc(client, address, message);
}

function namecoin_signMessage(client, address, message, callback) {
    const ourAddress = address;
    const ourMessage = message;
    client.cmd('signmessage', ourAddress, ourMessage, function(err, data) {
        callback(err, data);
    });
}

export function nameShow(client, id) {
  const syncFunc = Meteor.wrapAsync(namecoin_nameShow);
  return syncFunc(client, id);
}

function namecoin_nameShow(client, id, callback) {
  const ourId = checkId(id);
  client.cmd('name_show', ourId, function(err, data) {
    if(err !== undefined && err !== null && err.message.startsWith("name not found")) {
      err = undefined,
      data = undefined
    }
    callback(err, data);
  });
}

export function nameDoi(client, name, value, address) {
    const syncFunc = Meteor.wrapAsync(namecoin_nameDoi);
    return syncFunc(client, name, value, address);
}

function namecoin_nameDoi(client, name, value, address, callback) {
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
    };
}

export function getRawTransaction(client, txid) {
    const syncFunc = Meteor.wrapAsync(namecoin_getrawtransaction);
    return syncFunc(client, txid);
}

function namecoin_getrawtransaction(client, txid, callback) {
    console.log('namecoin_getrawtransaction: '+txid)
    client.cmd('getrawtransaction', txid, 1, function(err, data) {
        if(err) console.log(err);
        callback(err, data);
    });
}

function checkId(id) {
  if(!id.startsWith(NAMESPACE)) return NAMESPACE+id;
  return id;
}
