import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { CONFIRM_CLIENT, CONFIRM_ADDRESS } from '../../../startup/server/namecoin-configuration.js';
import { getWif } from '../../../../server/api/namecoin.js';
import { NamecoinEntries } from '../../../api/namecoin/entries.js';
import addFetchDoiMailDataJob from '../jobs/add_fetch-doi-mail-data.js';
import getPrivateKeyFromWif from './get_private-key_from_wif.js';
import decryptMessage from './decrypt_message.js';

const AddNamecoinEntrySchema = new SimpleSchema({
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
  },
  expiresIn: {
    type: Number
  },
  expired: {
    type: Boolean
  }
});

const addNamecoinEntry = (entry) => {
  try {
    const ourEntry = entry;
    AddNamecoinEntrySchema.validate(ourEntry);
    const ety = NamecoinEntries.findOne({name: ourEntry.name})
    if(ety !== undefined) return ety._id;
    const value = JSON.parse(ourEntry.value);
    if(value.from === undefined) throw "Wrong blockchain entry";
    const wif = getWif(CONFIRM_CLIENT, CONFIRM_ADDRESS);
    const privateKey = getPrivateKeyFromWif({wif: wif});
    const domain = decryptMessage({privateKey: privateKey, message: value.from});
    const id = NamecoinEntries.insert({
      name: ourEntry.name,
      value: ourEntry.value,
      address: ourEntry.address,
      txId: ourEntry.txId,
      expiresIn: ourEntry.expiresIn,
      expired: ourEntry.expired
    })
    addFetchDoiMailDataJob({
      name: ourEntry.name,
      domain: domain
    })
    return id;
  } catch (exception) {
    throw new Meteor.Error('namecoin.addEntryAndFetchData.exception', exception);
  }
};

export default addNamecoinEntry;
