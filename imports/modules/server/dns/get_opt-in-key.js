import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { resolveTxt } from '../../../../server/api/dns.js';
import { FALLBACK_PROVIDER } from '../../../startup/server/dns-configuration.js';

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
    if(keys === undefined || keys.length === 0) return useFallback(ourData.domain);
    const key = keys[0][0];
    if(key === undefined) return useFallback(ourData.domain);
    return key;
  } catch (exception) {
    throw new Meteor.Error('dns.getOptInKey.exception', exception);
  }
};

const useFallback = (domain) => {
  if(domain === FALLBACK_PROVIDER) throw new Meteor.Error("Fallback has no key defined!");
  console.log("Key not defined. Fallback '"+FALLBACK_PROVIDER+"' is used");
  return getOptInKey({domain: FALLBACK_PROVIDER});
}

export default getOptInKey;
