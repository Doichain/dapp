import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { isDebug } from '../../../startup/server/dapp-configuration.js';
import { CONFIRM_CLIENT, CONFIRM_ADDRESS } from '../../../startup/server/doichain-configuration.js';
import { getWif } from '../../../../server/api/doichain.js';
import { DoichainEntries } from '../../../api/doichain/entries.js';
import addFetchDoiMailDataJob from '../jobs/add_fetch-doi-mail-data.js';
import getPrivateKeyFromWif from './get_private-key_from_wif.js';
import decryptMessage from './decrypt_message.js';
import {logConfirm, logSend} from "../../../startup/server/log-configuration";

const AddDoichainEntrySchema = new SimpleSchema({
  name: {
    type: String
  },
  value: {
    type: String
  },
  address: {
    type: String
  },
  txId: {
    type: String
  }
});

/**
 * Inserts
 *
 * @param entry
 * @returns {*}
 */
const addDoichainEntry = (entry) => {
  try {

    const ourEntry = entry;
    logSend('adding DoichainEntry locally...',ourEntry.name);
    AddDoichainEntrySchema.validate(ourEntry);

    const ety = DoichainEntries.findOne({name: ourEntry.name})
    if(ety !== undefined){
        logSend('returning locally saved entry with _id:'+ety._id);
        return ety._id;
    }

    const value = JSON.parse(ourEntry.value);
    logSend("value:",value);
    if(value.from === undefined) throw "Wrong blockchain entry"; //TODO if from is missing but value is there, it is probably allready handeled correctly anyways this is not so cool as it seems.
    const wif = getWif(CONFIRM_CLIENT, CONFIRM_ADDRESS);
    const privateKey = getPrivateKeyFromWif({wif: wif});
    logSend('got private key (will not show it here)');

    const domain = decryptMessage({privateKey: privateKey, message: value.from});
    logSend('decrypted message from domain: ',domain);

    const namePos = ourEntry.name.indexOf('-'); //if this is not a co-registration fetch mail.
    logSend('namePos:',namePos);
    const masterDoi = (namePos!=-1)?ourEntry.name.substring(0,namePos):undefined;
    logSend('masterDoi:',masterDoi);
    const index = masterDoi?ourEntry.name.substring(namePos+1):undefined;
    logSend('index:',index);

    const id = DoichainEntries.insert({
        name: ourEntry.name,
        value: ourEntry.value,
        address: ourEntry.address,
        masterDoi: masterDoi,
        index: index,
        txId: ourEntry.txId,
        expiresIn: ourEntry.expiresIn,
        expired: ourEntry.expired
    });

    logSend('DoichainEntries added:', {id:id,name:name,masterDoi:masterDoi,index:index});

    if(namePos==-1 && masterDoi){
        addFetchDoiMailDataJob({
            name: ourEntry.name,
            domain: domain
        });

        logSend('New entry added: \n'+
            'NameId='+ourEntry.name+"\n"+
            'Address='+ourEntry.address+"\n"+
            'TxId='+ourEntry.txId+"\n"+
            'Value='+ourEntry.value);

    }else{
        logSend('This transaction belongs to co-registration', masterDoi);
    }

    return id;
  } catch (exception) {
    throw new Meteor.Error('doichain.addEntryAndFetchData.exception', exception);
  }
};

export default addDoichainEntry;
