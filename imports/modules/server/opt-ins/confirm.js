import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { randomBytes } from 'crypto';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import decodeDoiHash from '../emails/decode_doi-hash.js';
import generateNameId from '../namecoin/generate_name-id.js';
import getSignature from '../namecoin/get_signature.js';
import getDataHash from '../namecoin/get_data-hash.js';
import addInsertBlockchainJob from '../jobs/add_insert_blockchain.js';

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
    const optIns = OptIns.find({_id: decoded.id}).fetch();
    if(optIns.length === 0 || optIns[0].confirmationToken !== decoded.token) throw "Invalid hash";
    const confirmedAt = new Date();
    OptIns.update({_id : optIns[0]._id},{$set:{confirmedAt: confirmedAt, confirmedBy: ourRequest.ip}, $unset: {confirmationToken: ""}});
    const nameId = generateNameId({id: optIns[0]._id});
    const recipient = Recipients.findOne({_id: optIns[0].recipient});
    const signature = getSignature({email: recipient.email, privateKey: recipient.privateKey});
    const dataHash = getDataHash({data: optIns[0].data});
    addInsertBlockchainJob({
      nameId: nameId,
      signature: signature,
      dataHash: dataHash,
      soiDate: optIns[0].createdAt,
      doiDate: confirmedAt
    })
  } catch (exception) {
    throw new Meteor.Error('opt-ins.confirm.exception', exception);
  }
};

export default confirmOptIn
