import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { resolveTxt } from '../../../../server/api/dns.js';

const PROVIDER_KEY = "opt-in-provider";
const FALLBACK_PROVIDER = "sendeffect.de";
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
    if(providers === undefined || providers.length === 0) return FALLBACK_PROVIDER;
    const provider = providers[0][0];
    if(provider === undefined) return FALLBACK_PROVIDER;
    return provider;
  } catch (exception) {
    throw new Meteor.Error('dns.getOptInProvider.exception', exception);
  }
};

export default getOptInProvider;
