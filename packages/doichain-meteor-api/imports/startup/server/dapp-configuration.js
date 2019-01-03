import { Meteor } from 'meteor/meteor';

export function isDebug() {
  if(Meteor.settings !== undefined &&
     Meteor.settings.app !== undefined &&
     Meteor.settings.app.debug !== undefined) return Meteor.settings.app.debug
  return false;
}

export function isRegtest() {
  if(Meteor.settings !== undefined &&
     Meteor.settings.app !== undefined &&
     Meteor.settings.app.regtest !== undefined) return Meteor.settings.app.regtest
  return false;
}

export function isTestnet() {
    if(Meteor.settings !== undefined &&
        Meteor.settings.app !== undefined &&
        Meteor.settings.app.testnet !== undefined) return Meteor.settings.app.testnet
    return false;
}

export function getUrl() {
  if(Meteor.settings !== undefined &&
     Meteor.settings.app !== undefined &&
     Meteor.settings.app.host !== undefined) {
       let port = 3000;
       if(Meteor.settings.app.port !== undefined) port = Meteor.settings.app.port
       return "http://"+Meteor.settings.app.host+":"+port+"/";
  }
  return Meteor.absoluteUrl();
}
