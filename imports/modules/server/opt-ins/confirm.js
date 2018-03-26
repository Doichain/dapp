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
import {isDebug} from "../../../startup/server/dapp-configuration";

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

    //TODO rename to DoichainEntries!
    const entry = NamecoinEntries.findOne({name: optIn.nameId});
    if(entry === undefined) throw "Doichain entry not found";
    if(isDebug()) {console.log('found DoiChainEntry:'+JSON.stringify(entry));}

    const value = JSON.parse(entry.value);
    const wif = getWif(CONFIRM_CLIENT, CONFIRM_ADDRESS);

    /**
     * TODO
     * what is happening in case the DOI is finally owned by the email address user?
     * does this have to be the privKey of the owner (writer) of the DOI? Is access always possible?
     * (e.g. fallback, email provider, email address owner)
     */
    const privateKey = getPrivateKeyFromWif({wif: wif});
    const doiSignature = getSignature({privateKey: privateKey, message: value.signature});
    delete value.from;
    value.doiTimestamp = confirmedAt.toISOString();
    value.doiSignature = doiSignature;
    const jsonValue = JSON.stringify(value);

    if(isDebug()) {console.log('updating Doichain nameId:'+doichain);}

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
