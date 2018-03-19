import { Meteor } from 'meteor/meteor';
export function isDebug() {
  if(Meteor.settings !== undefined &&
     Meteor.settings.app !== undefined &&
     Meteor.settings.app.debug !== undefined) return Meteor.settings.app.debug
  return false;
}
