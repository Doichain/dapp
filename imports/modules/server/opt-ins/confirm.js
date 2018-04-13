import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { CONFIRM_CLIENT, CONFIRM_ADDRESS } from '../../../startup/server/namecoin-configuration.js';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import { NamecoinEntries } from '../../../api/namecoin/entries.js';
import decodeDoiHash from '../emails/decode_doi-hash.js';
import { signMessage } from '../../../../server/api/namecoin.js';
import addUpdateBlockchainJob from '../jobs/add_update_blockchain.js';
import {isDebug} from "../../../startup/server/dapp-configuration";

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

    //TODO rename to DoichainEntries!
    const entry = NamecoinEntries.findOne({name: optIn.nameId});
    if(entry === undefined) throw "Doichain entry not found";
    if(isDebug()) {console.log('found DoiChainEntry:'+JSON.stringify(entry));}
    const value = JSON.parse(entry.value);
    if(isDebug()) {console.log('getSignature (only of value!)'+JSON.stringify(value));} //TODO who else needs to read this?
    const doiSignature = signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, value.signature);
    if(isDebug()) {console.log('got doiSignature:'+JSON.stringify(doiSignature));}

    delete value.from;
    value.doiTimestamp = confirmedAt.toISOString();
    value.doiSignature = doiSignature;
    const jsonValue = JSON.stringify(value);
    if(isDebug()) {console.log('updating Doichain nameId:'+optIn.nameId+' with value:'+value);}

    addUpdateBlockchainJob({
      nameId: optIn.nameId,
      value: jsonValue
    });

    return decoded.redirect;

    if(isDebug()) {console.log('redirecting user to::'+decoded.redirect);}
  } catch (exception) {
    throw new Meteor.Error('opt-ins.confirm.exception', exception);
  }
};

export default confirmOptIn
