import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { resolveTxt } from '../../../../server/api/dns.js';
import { FALLBACK_PROVIDER } from '../../../startup/server/dns-configuration.js';

const PROVIDER_KEY = "opt-in-provider";
const GetOptInProviderSchema = new SimpleSchema({
  domain: {
    type: String
  }
});


const getOptInProvider = (data) => {
  try {
    const ourData = data;
    GetOptInProviderSchema.validate(ourData);
    const providers = resolveTxt(PROVIDER_KEY, ourData.domain);
    if(providers === undefined || providers.length === 0) return useFallback();
    const provider = providers[0][0];
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
