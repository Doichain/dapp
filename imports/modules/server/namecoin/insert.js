import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { SEND_CLIENT } from '../../../startup/server/namecoin-configuration.js';
import { nameDoi } from '../../../../server/api/namecoin.js';
import getAddress from "./get_address";
import getOptInProvider from "../dns/get_opt-in-provider";
import encryptMessage from "./encrypt_message";
import {getUrl, isDebug} from "../../../startup/server/dapp-configuration";
import getOptInKey from "../dns/get_opt-in-key";


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
    const from = encryptMessage({publicKey: publicKey, message: getUrl()});
    const nameValue = {
        signature: ourData.signature,
        dataHash: ourData.dataHash,
        from: from
    };
    const nameDoiTx = nameDoi(SEND_CLIENT, ourData.nameId, nameValue, destAddress);
    if(isDebug()) { console.log('tx of name_doi: '+nameDoiTx);}


  } catch(exception) {
    throw new Meteor.Error('namecoin.insert.exception', exception);
  }
};

export default insert;
