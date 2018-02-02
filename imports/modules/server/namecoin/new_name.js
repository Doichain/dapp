import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { nameShow, nameNew, getInfo } from '../../../../server/api/namecoin.js';

const NewNameSchema = new SimpleSchema({
  nameId: {
    type: String
  }
});

const newName = (data) => {
  try {
    const ourData = data;
    const nameData = nameShow(ourData.nameId);
    if(nameData !== undefined) throw "NameId already exists. This should never ever happen! NameId: "+ourData.nameId;
    const nameNewData = nameNew(ourData.nameId);
    const tx = nameNewData[0];
    const rand = nameNewData[1];
    return {
      tx: tx,
      rand: rand
    }
  } catch(exception) {
    throw new Meteor.Error('namecoin.newName.exception', exception);
  }
};

export default newName;
