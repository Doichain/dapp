import { Meteor } from 'meteor/meteor';
import { _i18n as i18n } from 'meteor/universe:i18n';
import Recipients from '../../api/recipients/recipients';

const addOptIn = (optIn) => {
  try {
    const ourOptIn = optIn;
    throw "ssssss";
  } catch (exception) {
    throw new Meteor.Error('opt-ins.add.exception', exception);
  }
};

export default addOptIn;
