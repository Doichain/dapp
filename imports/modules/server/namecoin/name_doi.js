import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { nameShow, nameDoi } from '../../../../server/api/namecoin.js';
import { SEND_CLIENT } from '../../../startup/server/namecoin-configuration.js';

const NameDoiSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  nameValue: {
    type: String
  },
  ourData: {
    type: String
  }
});

const nameDoiNotNeeded = (data) => {
  try {
    const ourData = data;
    const nameData = nameShow(SEND_CLIENT, ourData.nameId);
    if(nameData !== undefined) throw "NameId already exists. This should never ever happen! NameId: "+ourData.nameId;

    const nameNewDOI = nameDoi(SEND_CLIENT, ourData.nameId, ourData.nameValue, ourData.destAddress);
    const tx = nameNewDOI;
    return {
      tx: tx
    }
  } catch(exception) {
    throw new Meteor.Error('namecoin.newName.exception', exception);
  }
};

export default nameDoiNotNeeded
;
