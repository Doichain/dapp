import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

const SendMailSchema = new SimpleSchema({
  address: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
  }
});

const sendMail = (mail) => {
  try {
    const ourMail = mail;
    SendMailSchema.validate(ourMail);
    Email.send({
      from: "noreply@sendeffect.de",
      to: mail.address,
      subject: mail.subject,
      text: mail.message,
      headers: {
        'Return-Path': "return@email.com",
      }
    });
  } catch (exception) {
    throw new Meteor.Error('emails.send.exception', exception);
  }
};

export default sendMail;
