import { Meteor } from 'meteor/meteor';
import CryptoJS from 'crypto-js';
import SimpleSchema from 'simpl-schema';

const GetDataHashSchema = new SimpleSchema({
  data: {
    type: String
  }
});

const getDataHash = (data) => {
  try {
    const ourData = data;
      GetDataHashSchema.validate(ourData);
    const hash = CryptoJS.SHA256(ourData).toString();
    return hash;
  } catch(exception) {
    throw new Meteor.Error('doichain.getDataHash.exception', exception);
  }
};

export default getDataHash;
