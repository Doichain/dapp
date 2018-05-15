import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { SEND_CLIENT } from '../../../startup/server/namecoin-configuration.js';
import { nameDoi } from '../../../../server/api/namecoin.js';
import getAddress from "./get_address";
import getOptInProvider from "../dns/get_opt-in-provider";
import encryptMessage from "./encrypt_message";
import {getUrl, isDebug} from "../../../startup/server/dapp-configuration";
import getOptInKey from "../dns/get_opt-in-key";
import {logBlockchain, logSend} from "../../../startup/server/log-configuration";


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
  try {
    const ourData = data;
    InsertSchema.validate(ourData);
    const provider = getOptInProvider({domain: ourData.domain});
    const publicKey = getOptInKey({domain: provider});
    const destAddress =  getAddress({publicKey: publicKey});
    logSend('got provider, publicKey and destAddress ', provider,publicKey,destAddress);

    const from = encryptMessage({publicKey: publicKey, message: getUrl()});
    logSend('encrypted url for use ad from in doichain value:',getUrl(),from);

    const nameValue = JSON.stringify({
        signature: ourData.signature,
        dataHash: ourData.dataHash,
        from: from
    });

    logBlockchain('sending a fee to bob so he can pay the doi storage (destAddress):', destAddress);
    const feeDoiTx = feeDoi(SEND_CLIENT, destAddress);
    logBlockchain('fee send txid to destaddress', feeDoiTx, destAddress);

    logBlockchain('adding data to blockchain via name_doi (nameId,value,destAddress):', ourData.nameId,nameValue,destAddress);
    const nameDoiTx = nameDoi(SEND_CLIENT, ourData.nameId, nameValue, destAddress);
    logBlockchain('name_doi added blockchain. txid:', nameDoiTx);

  } catch(exception) {
    throw new Meteor.Error('namecoin.insert.exception', exception);
  }
};

export default insert;
