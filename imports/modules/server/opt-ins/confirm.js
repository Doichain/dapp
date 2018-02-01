import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { randomBytes } from 'crypto';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import decodeDoiHash from '../emails/decode_doi-hash.js';

const ConfirmOptInSchema = new SimpleSchema({
  ip: {
    type: SimpleSchema.RegEx.IP
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
    if(optIns.length === 0 ||
      optIns[0].confirmationToken !== decoded.token) throw "Invalid hash";
    OptIns.update({_id : decoded.id},{$set:{confirmedAt: new Date(), confirmedBy: ourRequest.ip}, $unset: {confirmationToken: ""}});
  } catch (exception) {
    throw new Meteor.Error('opt-ins.confirm.exception', exception);
  }
};

export default confirmOptIn
