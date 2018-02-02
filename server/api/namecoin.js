import { Meteor } from 'meteor/meteor';
import namecoin from 'namecoin';

const NAMESPACE = 'e/';
const NamecoinClient = new namecoin.Client({
  host: Meteor.settings.namecoin.host,
  port: Meteor.settings.namecoin.port,
  user: Meteor.settings.namecoin.username,
  pass: Meteor.settings.namecoin.password
});

export function nameShow(id) {
  const syncFunc = Meteor.wrapAsync(namecoin_nameShow);
  return syncFunc(id);
}

function namecoin_nameShow(id, callback) {
  const ourId = checkId(id);
  NamecoinClient.cmd('name_show', ourId, function(err, data) {
    if(err !== undefined && err !== null && err.message.startsWith("name not found")) {
      err = undefined,
      data = undefined
    }
    callback(err, data);
  });
}

export function nameNew(id) {
  const syncFunc = Meteor.wrapAsync(namecoin_nameNew);
  return syncFunc(id);
}

function namecoin_nameNew(id, callback) {
  const ourId = checkId(id);
  NamecoinClient.cmd('name_new', ourId, function(err, data) {
    callback(err, data);
  });
}

export function nameFirstUpdate(id, rand, tx, value) {
  const syncFunc = Meteor.wrapAsync(namecoin_nameFirstUpdate);
  return syncFunc(id, rand, tx, value);
}

function namecoin_nameFirstUpdate(id, rand, tx, value, callback) {
  const ourId = checkId(id);
  const ourRand = rand;
  const ourTx = tx;
  const ourValue = value;
  NamecoinClient.cmd('name_firstupdate', ourId, ourRand, ourTx, ourValue, function(err, data) {
    callback(err, data);
  });
}

export function getInfo() {
  const syncFunc = Meteor.wrapAsync(namecoin_getInfo);
  return syncFunc();
}

function namecoin_getInfo(callback) {
  NamecoinClient.cmd('getinfo', function(err, data) {
    callback(err, data);
  });
}

function checkId(id) {
  if(!id.startsWith(NAMESPACE)) return NAMESPACE+id;
  return id;
}
