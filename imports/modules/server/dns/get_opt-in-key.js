import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { resolveTxt } from '../../../../server/api/dns.js';
import { FALLBACK_PROVIDER } from '../../../startup/server/dns-configuration.js';

const OPT_IN_KEY = "doichain-opt-in-key";
const GetOptInKeySchema = new SimpleSchema({
  domain: {
    type: String
  }
});


const getOptInKey = (data) => {
  try {
    const ourData = data;
    GetOptInKeySchema.validate(ourData);
    const key = resolveTxt(OPT_IN_KEY, ourData.domain);
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
