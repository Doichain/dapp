import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { resolveTxt } from '../../../../server/api/dns.js';

const OPT_IN_KEY = "opt-in-key";
const GetOptInKeySchema = new SimpleSchema({
  domain: {
    type: String
  }
});


const getOptInKey = (data) => {
  try {
    const ourData = data;
    GetOptInKeySchema.validate(ourData);
    const keys = resolveTxt(OPT_IN_KEY, ourData.domain);
    if(keys === undefined || keys.length === 0) throw "Key not found";
    const key = keys[0][0];
    if(key === undefined) throw "Key not found";
    return key;
  } catch (exception) {
    throw new Meteor.Error('dns.getOptInKey.exception', exception);
  }
};

export default getOptInKey;
