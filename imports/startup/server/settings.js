import { Meteor } from 'meteor/meteor';
import { Settings } from '../../api/settings/settings.js';
import addOrUpdate from '../../modules/server/settings/addOrUpdate.js';

Meteor.startup(() => {
  const settings = Meteor.settings;
  if(settings !== undefined) {
    Object.keys(settings).forEach(key => {
      const setting = Settings.findOne({key: key});
      if(setting === undefined) addOrUpdate({key: key, value: settings[key]});
    })
  }
});
