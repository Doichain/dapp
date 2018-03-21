import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { resolveTxt } from '../../../../server/api/dns.js';
import { FALLBACK_PROVIDER } from '../../../startup/server/dns-configuration.js';

const PROVIDER_KEY = "doichain-opt-in-provider";
const GetOptInProviderSchema = new SimpleSchema({
  domain: {
    type: String
  }
});


const getOptInProvider = (data) => {
  try {
    const ourData = data;
    GetOptInProviderSchema.validate(ourData);
    const provider = resolveTxt(PROVIDER_KEY, ourData.domain);
    if(provider === undefined) return useFallback();
    return provider;
  } catch (exception) {
    throw new Meteor.Error('dns.getOptInProvider.exception', exception);
  }
};

const useFallback = () => {
  console.log("Provider not defined. Fallback '"+FALLBACK_PROVIDER+"' is used");
  return FALLBACK_PROVIDER;
}

export default getOptInProvider;
