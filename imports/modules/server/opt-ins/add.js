import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import addRecipient from '../recipients/add.js';
import addSender from '../senders/add.js';
import sendDoiMail from '../emails/send_doi.js';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import writeToBlockchain from '../namecoin/write_to_blockchain.js';

const AddOptInSchema = new SimpleSchema({
  recipient_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  sender_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  customer_id: {
    type: String
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
      email: ourOptIn.recipient_mail,
      customer_id: ourOptIn.customer_id
    }
    const recipientId = addRecipient(recipient);
    const sender = {
      email: ourOptIn.sender_mail
    }
    const senderId = addSender(sender);
    const optIns = OptIns.find({recipient: recipientId, sender: senderId}).fetch();
    if(optIns.length > 0) return optIns[0]._id;
    const optInId = OptIns.insert({
      recipient: recipientId,
      sender: senderId,
      data: ourOptIn.data
    });
    writeToBlockchain({id: optInId})
    return optInId;
  } catch (exception) {
    throw new Meteor.Error('opt-ins.add.exception', exception);
  }
};

export default addOptIn;
