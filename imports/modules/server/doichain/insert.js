import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { SEND_CLIENT } from '../../../startup/server/doichain-configuration.js';
import getAddress from "./get_address";
import getOptInProvider from "../dns/get_opt-in-provider";
import encryptMessage from "./encrypt_message";
import {getUrl} from "../../../startup/server/dapp-configuration";
import getOptInKey from "../dns/get_opt-in-key";
import {logBlockchain, logSend} from "../../../startup/server/log-configuration";
import {feeDoi,nameDoi} from "../../../../server/api/doichain";
import {OptIns} from "../../../api/opt-ins/opt-ins";


const InsertSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  signature: {
    type: String
  },
  dataHash: {
    type: String
  },
  domain: {
    type: String
  },
  soiDate: {
    type: Date
  }
});

const insert = (data) => {
  const ourData = data;
  try {
    InsertSchema.validate(ourData);
    logSend("domain:",ourData.domain);
    let publicKey = getOptInKey({domain: ourData.domain});


    if(!publicKey){
        const provider = getOptInProvider({domain: ourData.domain});
        logSend("using doichain provider instead of directly configured publicKey:",{provider:provider});
        publicKey = getOptInKey({domain: provider}); //get public key from provider or fallback if publickey was not set in dns
    }

    logSend('got provider, publicKey and destAddress ', {publicKey:publicKey,destAddress:destAddress});

      const destAddress =  getAddress({publicKey: publicKey});

    const from = encryptMessage({publicKey: publicKey, message: getUrl()});
    logSend('encrypted url for use ad from in doichain value:',getUrl(),from);

    const nameValue = JSON.stringify({
        signature: ourData.signature,
        dataHash: ourData.dataHash,
        from: from
    });

    //TODO (!) this must be replaced in future by "atomic name trading example" https://wiki.namecoin.info/?title=Atomic_Name-Trading
    logBlockchain('sending a fee to bob so he can pay the doi storage (destAddress):', destAddress);
    const feeDoiTx = feeDoi(SEND_CLIENT, destAddress);
    logBlockchain('fee send txid to destaddress', feeDoiTx, destAddress);

    logBlockchain('adding data to blockchain via name_doi (nameId,value,destAddress):', ourData.nameId,nameValue,destAddress);
    const nameDoiTx = nameDoi(SEND_CLIENT, ourData.nameId, nameValue, destAddress);
    logBlockchain('name_doi added blockchain. txid:', nameDoiTx);

    OptIns.update({nameId: ourData.nameId}, {$set: {txId:nameDoiTx}});
    logBlockchain('updating OptIn locally with:', {nameId: ourData.nameId, txId: nameDoiTx});

  } catch(exception) {
      //logBlockchain("Error:",OptIns.findOne({nameId:ourData.nameId}).error);
      OptIns.update({nameId: ourData.nameId}, {$set: {error:JSON.stringify(exception.message)}});
    throw new Meteor.Error('doichain.insert.exception', exception); //TODO update opt-in in local db to inform user about the error! e.g. Insufficient funds etc.
  }
};

export default insert;
