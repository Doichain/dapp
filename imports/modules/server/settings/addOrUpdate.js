import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Settings } from '../../../api/settings/settings.js';

const AddOrUpdateSettingSchema = new SimpleSchema({
  key: {
    type: String
  },
  value: {
    type: String
  }
});

const addOrUpdateSetting = (data) => {
  try {
    const ourData = data;
    AddOrUpdateSettingsSchema.validate(ourData);
    const setting = Settings.findOne({key: ourData.key});
    if(setting !== undefined) Settings.update({_id : setting._id}, {$set: {
      value: ourData.value
    }});
    else return Settings.insert({
      key: ourData.key,
      value: ourData.value
    })
  } catch (exception) {
    throw new Meteor.Error('settings.addOrUpdate.exception', exception);
  }
};

export default addOrUpdateSetting;
