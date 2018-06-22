import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { CONFIRM_CLIENT, CONFIRM_ADDRESS } from '../../../startup/server/doichain-configuration.js';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import { DoichainEntries } from '../../../api/doichain/entries.js';
import decodeDoiHash from '../emails/decode_doi-hash.js';
import { signMessage } from '../../../../server/api/doichain.js';
import addUpdateBlockchainJob from '../jobs/add_update_blockchain.js';
import {logConfirm} from "../../../startup/server/log-configuration";

const ConfirmOptInSchema = new SimpleSchema({
  host: {
    type: String
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

    const entry = DoichainEntries.findOne({name: optIn.nameId});
    if(entry === undefined) throw "Doichain entry not found";
    logConfirm('found DoiChainEntry:',entry);

    const value = JSON.parse(entry.value);
    logConfirm('getSignature (only of value!)', value);

    const doiSignature = signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, value.signature);
    logConfirm('got doiSignature:',doiSignature);

    delete value.from;
    value.doiTimestamp = confirmedAt.toISOString();
    value.doiSignature = doiSignature;
    const jsonValue = JSON.stringify(value);
    logConfirm('updating Doichain nameId:'+optIn.nameId+' with value:',jsonValue);

    addUpdateBlockchainJob({
      nameId: optIn.nameId,
      value: jsonValue
    });

    return decoded.redirect;

    logConfirm('redirecting user to:',decoded.redirect);

  } catch (exception) {
    throw new Meteor.Error('opt-ins.confirm.exception', exception);
  }
};

export default confirmOptIn
