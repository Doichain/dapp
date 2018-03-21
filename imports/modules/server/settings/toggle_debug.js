import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

const ToggleDebugSchema = new SimpleSchema({
  debug: {
    type: Boolean
  }
});

const toggleDebug = (data) => {
  try {
    const ourData = data;
    ToggleDebugSchema.validate(ourData);
    console.log(ourtData.debug);
  } catch (exception) {
    throw new Meteor.Error('settings.toggle_debug.exception', exception);
  }
};

export default toggleDebug;
