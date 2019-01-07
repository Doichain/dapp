import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { CONFIRM_CLIENT } from '../../../startup/server/doichain-configuration.js';
import {getWif, signMessage, getTransaction, nameDoi, nameShow} from "../../../../server/api/doichain";
import {API_PATH, DOI_CONFIRMATION_NOTIFY_ROUTE, VERSION} from "../../../../server/api/rest/rest";
import {CONFIRM_ADDRESS} from "../../../startup/server/doichain-configuration";
import {getHttpPUT} from "../../../../server/api/http";
import {logConfirm} from "../../../startup/server/log-configuration";
import getPrivateKeyFromWif from "./get_private-key_from_wif";
import decryptMessage from "./decrypt_message";
import {OptIns} from "../../../api/opt-ins/opt-ins";

const UpdateSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  value: {
    type: String
  },
  host : {
      type: String,
      optional: true,
  },
  fromHostUrl : {
      type: String
  }
});

const update = (data, job) => {
  try {
    const ourData = data;

    UpdateSchema.validate(ourData);

    //stop this update until this name as at least 1 confirmation
    const name_data = nameShow(CONFIRM_CLIENT,ourData.nameId);
    if(name_data === undefined){
        rerun(job);
        logConfirm('name not visible - delaying name update',ourData.nameId);
        return;
    }
    const our_transaction = getTransaction(CONFIRM_CLIENT,name_data.txid);
    if(our_transaction.confirmations===0){
        rerun(job);
        logConfirm('transaction has 0 confirmations - delaying name update',JSON.parse(ourData.value));
        return;
    }
    logConfirm('updating blockchain with doiSignature:',JSON.parse(ourData.value));
    const wif = getWif(CONFIRM_CLIENT, CONFIRM_ADDRESS);
    const privateKey = getPrivateKeyFromWif({wif: wif});
    logConfirm('got private key (will not show it here) in order to decrypt Send-dApp host url from value:',ourData.fromHostUrl);
    const ourfromHostUrl = decryptMessage({privateKey: privateKey, message: ourData.fromHostUrl});
    logConfirm('decrypted fromHostUrl',ourfromHostUrl);
    const url = ourfromHostUrl+API_PATH+VERSION+"/"+DOI_CONFIRMATION_NOTIFY_ROUTE;

    logConfirm('creating signature with ADDRESS'+CONFIRM_ADDRESS+" nameId:",ourData.value);
    const signature = signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, ourData.nameId); //TODO why here over nameID?
    logConfirm('signature created:',signature);

    const updateData = {
        nameId: ourData.nameId,
        signature: signature,
        host: ourData.host
    };

    try {
        const txid = nameDoi(CONFIRM_CLIENT, ourData.nameId, ourData.value, null);
        logConfirm('update transaction txid:',txid);
    }catch(exception){
        //
        logConfirm('this nameDOI doesn´t have a block yet and will be updated with the next block and with the next queue start:',ourData.nameId);
        if(exception.toString().indexOf("there is already a registration for this doi name")==-1) {
            OptIns.update({nameId: ourData.nameId}, {$set: {error: JSON.stringify(exception.message)}});
        }
        throw new Meteor.Error('doichain.update.exception', exception);
        //}else{
        //    logConfirm('this nameDOI doesn´t have a block yet and will be updated with the next block and with the next queue start:',ourData.nameId);
        //}
    }

    const response = getHttpPUT(url, updateData);
    logConfirm('informed send dApp about confirmed doi on url:'+url+' with updateData'+JSON.stringify(updateData)+" response:",response.data);
    job.done();
  } catch(exception) {
    throw new Meteor.Error('doichain.update.exception', exception);
  }
};

function rerun(job){
    logConfirm('rerunning txid in 10sec - canceling old job','');
    job.cancel();
    logConfirm('restart blockchain doi update','');
    job.restart(
        {
            //repeats: 600,   // Only repeat this once
            // This is the default
           // wait: 1000   // Wait 10 sec between repeats
                          // Default is previous setting
        },
        function (err, result) {
            if (result) {
                logConfirm('rerunning txid in 10sec:',result);
            }
        }
    );
}

export default update;
