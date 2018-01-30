import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { Recipients } from '../../../api/recipients/recipients.js';
import generateDoiToken from '../opt-ins/generate_doi-token.js';
import generateDoiHash from './generate_doi-hash.js';
import addSendMailJob from '../jobs/add_send_mail.js';

const SendDoiMailSchema = new SimpleSchema({
  id: {
    type: String,
  }
});

const sendDoiMail = (optIn) => {
  try {
    const ourOptIn = optIn;
    SendDoiMailSchema.validate(ourOptIn);
    const optIns = OptIns.find({_id: ourOptIn.id}).fetch();
    if(optIns.length === 0) throw 'Opt-In not found: '+ourOptIn.id;
    const recipients = Recipients.find({_id: optIns[0].recipient}).fetch();
    if(recipients.length === 0) throw 'Recipient not found: '+optIns[0].recipient;
    if(optIns[0].confirmationToken !== undefined) return;
    const token = generateDoiToken({id: optIns[0]._id});
    const confirmationHash = generateDoiHash({id: optIns[0]._id, token: token});
    addSendMailJob({
      from: "noreply@sendeffect.de",
      to: recipients[0].email,
      subject: "Confirmation",
      message: confirmationHash
    });
  } catch (exception) {
    throw new Meteor.Error('emails.send_doi.exception', exception);
  }
};

export default sendDoiMail;
