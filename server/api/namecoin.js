import { Meteor } from 'meteor/meteor';
import namecoin from 'namecoin';

const NAMESPACE = 'e/';

export function nameUpdate(client, id, value) {
  const syncFunc = Meteor.wrapAsync(namecoin_nameUpdate);
  return syncFunc(client, id, value);
}

function namecoin_nameUpdate(client, id, value, callback) {
  const ourId = checkId(id);
  const ourValue = value;
  client.cmd('name_update', ourId, ourValue, function(err, data) {
    callback(err, data);
  });
}

export function getWif(client, address) {
  const syncFunc = Meteor.wrapAsync(namecoin_dumpprivkey);
  return syncFunc(client, address);
}

function namecoin_dumpprivkey(client, address, callback) {
  const ourAddress = address;
  client.cmd('dumpprivkey', ourAddress, function(err, data) {
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
    cons param = [ourAddress,ourMessage]
    client.cmd('signmessage', param, function(err, data) {
        callback(err, data);
    });
}


export function listSinceBlock(client, block) {
  const syncFunc = Meteor.wrapAsync(namecoin_listSinceBlock);
  var ourBlock = block;
  if(ourBlock === undefined) ourBlock = null;
  return syncFunc(client, ourBlock);
}

function namecoin_listSinceBlock(client, block, callback) {
  var ourBlock = block;
  if(ourBlock === null) client.cmd('listsinceblock', function(err, data) {
    callback(err, data);
  });
  else client.cmd('listsinceblock', ourBlock, function(err, data) {
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

export function nameNew(client, id) {
  const syncFunc = Meteor.wrapAsync(namecoin_nameNew);
  return syncFunc(client, id);
}

function namecoin_nameNew(client, id, callback) {
  const ourId = checkId(id);
  client.cmd('name_new', ourId, function(err, data) {
    callback(err, data);
  });
}

export function nameFirstUpdate(client, id, rand, tx, value, to) {
  const syncFunc = Meteor.wrapAsync(namecoin_nameFirstUpdate);
  try {
    return syncFunc(client, id, rand, tx, value, to);
  } catch(error) {
    if(error.message.startsWith('invalid address')) throw "Invalid address ("+to+")";
    throw error;
  }
}

function namecoin_nameFirstUpdate(client, id, rand, tx, value, to, callback) {
  const ourId = checkId(id);
  const ourRand = rand;
  const ourTx = tx;
  const ourValue = value;
  const ourTo = to;
  client.cmd('name_firstupdate', ourId, ourRand, ourTx, ourValue, to, function(err, data) {
    callback(err, data);
  });
}

export function getInfo(client) {
  const syncFunc = Meteor.wrapAsync(namecoin_getInfo);
  return syncFunc(client);
}

function namecoin_getInfo(client, callback) {
  client.cmd('getinfo', function(err, data) {
    callback(err, data);
  });
}

function checkId(id) {
  if(!id.startsWith(NAMESPACE)) return NAMESPACE+id;
  return id;
}
