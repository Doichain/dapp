import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import getKeyPair from './get_key-pair.js';

const GenerateNameIdSchema = new SimpleSchema({
  id: {
    type: String
  }
});

const generateNameId = (optIn) => {
  try {
    const ourOptIn = optIn;
    GenerateNameIdSchema.validate(ourOptIn);

    let nameId = getKeyPair().privateKey;

    OptIns.update({_id : ourOptIn.id}, {$set:{nameId: nameId}});
    return nameId;
  } catch(exception) {
    throw new Meteor.Error('doichain.generateNameId.exception', exception);
  }
};

export default generateNameId;
