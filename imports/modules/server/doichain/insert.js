import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { SEND_CLIENT } from '../../../startup/server/doichain-configuration.js';
import encryptMessage from "./encrypt_message";
import {getUrl} from "../../../startup/server/dapp-configuration";
import {logBlockchain, logSend} from "../../../startup/server/log-configuration";
import {feeDoi,nameDoi} from "../../../../server/api/doichain";
import {OptIns} from "../../../api/opt-ins/opt-ins";
import getPublicKeyAndAddress from "./get_publickey_and_address_by_domain";


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

    const publicKeyAndAddress = getPublicKeyAndAddress({domain:ourData.domain});
    const from = encryptMessage({publicKey: publicKeyAndAddress.publicKey, message: getUrl()});
    logSend('encrypted url for use ad from in doichain value:',getUrl(),from);

    const nameValue = JSON.stringify({
        signature: ourData.signature,
        dataHash: ourData.dataHash,
        from: from
    });

    //TODO (!) this must be replaced in future by "atomic name trading example" https://wiki.namecoin.info/?title=Atomic_Name-Trading
    logBlockchain('sending a fee to bob so he can pay the doi storage (destAddress):', publicKeyAndAddress.destAddress);
    const feeDoiTx = feeDoi(SEND_CLIENT, publicKeyAndAddress.destAddress);
    logBlockchain('fee send txid to destaddress', feeDoiTx, publicKeyAndAddress.destAddress);

    logBlockchain('adding data to blockchain via name_doi (nameId,value,destAddress):', ourData.nameId,nameValue,publicKeyAndAddress.destAddress);
    const nameDoiTx = nameDoi(SEND_CLIENT, ourData.nameId, nameValue, publicKeyAndAddress.destAddress);
    logBlockchain('name_doi added blockchain. txid:', nameDoiTx);

    OptIns.update({nameId: ourData.nameId}, {$set: {txId:nameDoiTx}});
    logBlockchain('updating OptIn locally with:', {nameId: ourData.nameId, txId: nameDoiTx});

  } catch(exception) {
      OptIns.update({nameId: ourData.nameId}, {$set: {error:JSON.stringify(exception.message)}});
    throw new Meteor.Error('doichain.insert.exception', exception); //TODO update opt-in in local db to inform user about the error! e.g. Insufficient funds etc.
  }
};

export default insert;
