import { Meteor } from 'meteor/meteor';
import namecoin from 'namecoin';

const NAMESPACE = 'e/';

export function getPrivateKey(client, address) {
  //TODO: Implement real privateKey rpc fetching
  return "892B8AF44E535D646E7B01767579F5C4FBB9B9A09229AB4A15A8D14AB06977CA";
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
  return syncFunc(client, id, rand, tx, value, to);
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
