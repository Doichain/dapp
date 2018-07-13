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
    let nameId;

    if(optIn.masterDoi){
        nameId = optIn.masterDoi+"-"+optIn.index;
        logSend("used master_doi as nameId index "+optIn.index+"storage:",nameId);
    }
    else{
        let nameId = getKeyPair().privateKey;
        logSend("generated nameId for doichain storage:",nameId);
    }
    OptIns.update({_id : ourOptIn.id}, {$set:{nameId: nameId}});
    return nameId;
  } catch(exception) {
    throw new Meteor.Error('doichain.generateNameId.exception', exception);
  }
};

export default generateNameId;
