import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { NamecoinEntries } from '../../../api/namecoin/entries.js';

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
    return NamecoinEntries.insert({
      name: ourEntry.name,
      value: ourEntry.value,
      address: ourEntry.address,
      txId: ourEntry.txId,
      expiresIn: ourEntry.expiresIn,
      expired: ourEntry.expired
    })
  } catch (exception) {
    throw new Meteor.Error('namecoin.addEntry.exception', exception);
  }
};

export default addNamecoinEntry;
