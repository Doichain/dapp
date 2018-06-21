import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { resolveTxt } from '../../../../server/api/dns.js';
import { FALLBACK_PROVIDER } from '../../../startup/server/dns-configuration.js';
import {logSend} from "../../../startup/server/log-configuration";
import {isRegtest, isTestnet} from "../../../startup/server/dapp-configuration";

const PROVIDER_KEY = "doichain-opt-in-provider";
const PROVIDER_KEY_TESTNET = "doichain-testnet-opt-in-provider";

const GetOptInProviderSchema = new SimpleSchema({
  domain: {
    type: String
  }
});


const getOptInProvider = (data) => {
  try {
    const ourData = data;
    GetOptInProviderSchema.validate(ourData);

    let ourPROVIDER_KEY=PROVIDER_KEY;
    if(isRegtest() || isTestnet()){
        ourPROVIDER_KEY = PROVIDER_KEY_TESTNET;
        logSend('Using RegTest:'+isRegtest()+" : Testnet:"+isTestnet()+" PROVIDER_KEY",ourPROVIDER_KEY);
    }

    const provider = resolveTxt(ourPROVIDER_KEY, ourData.domain);
    if(provider === undefined) return useFallback();

    logSend('opt-in-provider from dns - server of mail recipient: (TXT):'+provider);
    return provider;
  } catch (exception) {
    throw new Meteor.Error('dns.getOptInProvider.exception', exception);
  }
};

const useFallback = () => {
  logSend('Provider not defined. Fallback '+FALLBACK_PROVIDER+' is used');
  return FALLBACK_PROVIDER;
}

export default getOptInProvider;
