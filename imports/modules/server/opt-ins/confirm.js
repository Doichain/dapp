import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { CONFIRM_CLIENT, CONFIRM_ADDRESS } from '../../../startup/server/namecoin-configuration.js';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import { NamecoinEntries } from '../../../api/namecoin/entries.js';
import decodeDoiHash from '../emails/decode_doi-hash.js';
import { getWif } from '../../../../server/api/namecoin.js';
import getPrivateKeyFromWif from '../namecoin/get_private-key_from_wif.js';
import getSignature from '../namecoin/get_signature.js';
import addUpdateBlockchainJob from '../jobs/add_update_blockchain.js';

const ConfirmOptInSchema = new SimpleSchema({
  ip: {
    type: String,
    regEx: SimpleSchema.RegEx.IP
  },
  hash: {
    type: String
  }
});

const confirmOptIn = (request) => {
  try {
    const ourRequest = request;
    ConfirmOptInSchema.validate(ourRequest);
    const decoded = decodeDoiHash({hash: request.hash});
    const optIn = OptIns.findOne({_id: decoded.id});
    if(optIn === undefined || optIn.confirmationToken !== decoded.token) throw "Invalid hash";
    const confirmedAt = new Date();
    OptIns.update({_id : optIn._id},{$set:{confirmedAt: confirmedAt, confirmedBy: ourRequest.ip}, $unset: {confirmationToken: ""}});
    const entry = NamecoinEntries.findOne({name: optIn.nameId});
    if(entry === undefined) throw "Namecoin entry not found";
    const value = JSON.parse(entry.value);
    const wif = getWif(CONFIRM_CLIENT, CONFIRM_ADDRESS);
    const privateKey = getPrivateKeyFromWif({wif: wif});
    const doiSignature = getSignature({privateKey: privateKey, message: value.signature});
    delete value.from;
    value.doiTimestamp = confirmedAt.toISOString();
    value.doiSignature = doiSignature;
    const jsonValue = JSON.stringify(value);
    addUpdateBlockchainJob({
      nameId: optIn.nameId,
      value: jsonValue
    })
    return decoded.redirect;
  } catch (exception) {
    throw new Meteor.Error('opt-ins.confirm.exception', exception);
  }
};

export default confirmOptIn
