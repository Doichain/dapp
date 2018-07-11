import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { nameDoi } from '../../../../server/api/doichain.js';
import { CONFIRM_CLIENT } from '../../../startup/server/doichain-configuration.js';
import {getWif, signMessage} from "../../../../server/api/doichain";
import {API_PATH, DOI_CONFIRMATION_NOTIFY_ROUTE, VERSION} from "../../../../server/api/rest/rest";
import {CONFIRM_ADDRESS} from "../../../startup/server/doichain-configuration";
import {getHttpPUT} from "../../../../server/api/http";
import {logConfirm} from "../../../startup/server/log-configuration";
import getPrivateKeyFromWif from "./get_private-key_from_wif";
import decryptMessage from "./decrypt_message";

const UpdateSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  value: {
    type: String
  },
  fromHostUrl : {
      type: String
  }
});

const update = (data) => {
  try {
    const ourData = data;
    UpdateSchema.validate(ourData);

    //TODO
    // Inform senddApp about DOI-confirmation
    // (this actually is coming too early (!) and should be called after the name_doi command)
    // but  for now we have to do it like this since name_doi throws an error in case
    // the DOI get's confirmed by the user before this first block confirmation


    const wif = getWif(CONFIRM_CLIENT, CONFIRM_ADDRESS);
    const privateKey = getPrivateKeyFromWif({wif: wif});
    logConfirm('got private key (will not show it here) in order to decrypt Send-dApp host url from value:',ourData.fromHostUrl);
    const ourfromHostUrl = decryptMessage({privateKey: privateKey, message: ourData.fromHostUrl});
    logConfirm('decrypted fromHostUrl',ourfromHostUrl)
    const url = ourfromHostUrl+API_PATH+VERSION+"/"+DOI_CONFIRMATION_NOTIFY_ROUTE;


    logConfirm('creating signature with ADDRESS'+CONFIRM_ADDRESS+" nameId:",ourData.nameId);
    const signature = signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, ourData.nameId);

    logConfirm('signature created:',signature);

    const updateData = {
        nameId: ourData.nameId,
        signature: signature,
        host: ourData.ip
    }

    try {
        const txid = nameDoi(CONFIRM_CLIENT, ourData.nameId, ourData.value, null); //TODO maybe send this DOI to peter (the user which wants to receive a doi)
        logConfirm('update transaction txid:',txid);
    }catch(exception){
        if(exception.toString().indexOf("there is already a registration for this doi name")==-1){
            throw new Meteor.Error('doichain.update.exception', exception);
        }
    }

    const response = getHttpPUT(url, updateData);
    logConfirm('informed send dApp about confirmed doi on url:'+url+' with updateData'+JSON.stringify(updateData)+" response:",response)


  } catch(exception) {
    throw new Meteor.Error('doichain.update.exception', exception);
  }
};

export default update;
