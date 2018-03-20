import { Meteor } from 'meteor/meteor';
export function isDebug() {
  if(Meteor.settings !== undefined &&
     Meteor.settings.app !== undefined &&
     Meteor.settings.app.debug !== undefined) return Meteor.settings.app.debug
  return false;
}
export funciont getUrl() {
  if(Meteor.settings !== undefined &&
     Meteor.settings.app !== undefined &&
     Meteor.settings.app.host !== undefined) {
       let port = 3000;
       if(Meteor.settings.app.port !== undefined) port = Meteor.settings.app.port
       return "http://"+Meteor.settings.app.host+":"+port+"/";
  }
  return Meteor.absoluteUrl();
}
