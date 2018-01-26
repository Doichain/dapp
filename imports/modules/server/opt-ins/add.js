import { Meteor } from 'meteor/meteor';
import { _i18n as i18n } from 'meteor/universe:i18n';
import Recipients from '../../../api/recipients/recipients.js';
import getKeyPair from '../namecoin/get-key-pair.js';

const addOptIn = (optIn) => {
  try {
    const ourOptIn = optIn;
    const keyPair = getKeyPair();
    console.log(keyPair);
    //TODO: Go on
  } catch (exception) {
    throw new Meteor.Error('opt-ins.add.exception', exception);
  }
};

export default addOptIn;
