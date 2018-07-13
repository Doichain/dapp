import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import addRecipient from '../recipients/add.js';
import addSender from '../senders/add.js';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import writeToBlockchain from '../doichain/write_to_blockchain.js';
import {logSend} from "../../../startup/server/log-configuration";

const AddOptInSchema = new SimpleSchema({
  recipient_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  sender_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  data: {
    type: String,
    optional: true
  }
});

const addOptIn = (optIn) => {
  try {
    const ourOptIn = optIn;
    AddOptInSchema.validate(ourOptIn);
    const recipient = {
      email: ourOptIn.recipient_mail
    }
    const recipientId = addRecipient(recipient);
    const sender = {
      email: ourOptIn.sender_mail
    }
    const master_doi = ourOptIn.masterDoi;
    const senderId = addSender(sender);

    const optIns = OptIns.find({recipient: recipientId, sender: senderId}).fetch();
    if(optIns.length > 0) return optIns[0]._id; //TODO when SOI already exists resend email?

    if(ourOptIn.data !== undefined) {
      try {
        JSON.parse(ourOptIn.data);
      } catch(error) { throw "Invalid data json"; }
    }
    const optInId = OptIns.insert({
      recipient: recipientId,
      sender: senderId,
      index: index,
      masterDoi : master_doi,
      data: ourOptIn.data
    });
    logSend("optIn (index:"+index+" added to local db with optInId",optInId);

    writeToBlockchain({id: optInId});
    return optInId;
  } catch (exception) {
    throw new Meteor.Error('opt-ins.addAndWriteToBlockchain.exception', exception);
  }
};

export default addOptIn;
