import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import getKeyPair from './get_key-pair.js';

const GenerateNameIdSchema = new SimpleSchema({
  id: {
    type: String
  },
  index: {
    type: String,
    optional:true
  }
});

const generateNameId = (optIn) => {
  try {
    const ourOptIn = optIn;
    GenerateNameIdSchema.validate(ourOptIn);

    const ourIndex = ourOptIn.index?'-'+ourOptIn.index:'';
    const nameId = getKeyPair().privateKey+ourIndex;
    if(ourIndex && ourIndex>1){ //TODO use name of first

    }
    OptIns.update({_id : ourOptIn.id}, {$set:{nameId: nameId}});
    return nameId;
  } catch(exception) {
    throw new Meteor.Error('doichain.generateNameId.exception', exception);
  }
};

export default generateNameId;
