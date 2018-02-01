import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import decodeDoiHash from '../emails/decode_doi-hash.js';
import writeToBlockchain from '../namecoin/write_to_blockchain.js';

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
    OptIns.update({_id : optIn._id},{$set:{confirmedAt: new Date(), confirmedBy: ourRequest.ip}, $unset: {confirmationToken: ""}});
    writeToBlockchain({id: optIn._id})
  } catch (exception) {
    throw new Meteor.Error('opt-ins.confirm.exception', exception);
  }
};

export default confirmOptIn
