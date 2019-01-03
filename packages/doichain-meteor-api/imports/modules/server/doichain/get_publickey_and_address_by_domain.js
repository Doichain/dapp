import SimpleSchema from 'simpl-schema';
import {logSend} from "../../../startup/server/log-configuration";

import getOptInKey from "../dns/get_opt-in-key";
import getOptInProvider from "../dns/get_opt-in-provider";
import getAddress from "./get_address";

const GetPublicKeySchema = new SimpleSchema({
    domain: {
        type: String
    }
});

const getPublicKeyAndAddress = (data) => {

    const ourData = data;
    GetPublicKeySchema.validate(ourData);

    let publicKey = getOptInKey({domain: ourData.domain});
    if(!publicKey){
        const provider = getOptInProvider({domain: ourData.domain});
        logSend("using doichain provider instead of directly configured publicKey:",{provider:provider});
        publicKey = getOptInKey({domain: provider}); //get public key from provider or fallback if publickey was not set in dns
    }
    const destAddress =  getAddress({publicKey: publicKey});
    logSend('publicKey and destAddress ', {publicKey:publicKey,destAddress:destAddress});
    return {publicKey:publicKey,destAddress:destAddress};
};

export default getPublicKeyAndAddress;