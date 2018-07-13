import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import getKeyPair from './get_key-pair.js';
import {logSend} from "../../../startup/server/log-configuration";

const GenerateNameIdSchema = new SimpleSchema({
  id: {
    type: String
  }
});

const generateNameId = (optIn) => {
  try {
      logSend("test",optIn);
    const ourOptIn = optIn;
    GenerateNameIdSchema.validate(ourOptIn);
    let nameId;
    logSend("ourOptIn1:",ourOptIn);
    const optIn = OptIns.findOne({_id: ourOptIn.id});
    logSend("optIn:",optIn);
    if(optIn.masterDoi){
        nameId = ourOptIn.masterDoi+"-"+ourOptIn.index;
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
