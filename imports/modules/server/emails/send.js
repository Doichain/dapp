import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

const SendMailSchema = new SimpleSchema({
  from: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  to: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
  returnPath: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
});

const sendMail = (mail) => {
  try {
    const ourMail = mail;
    SendMailSchema.validate(ourMail);
    //TODO: Text fallback
    Email.send({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      html: mail.message,
      headers: {
        'Return-Path': mail.returnPath,
      }
    });
  } catch (exception) {
    throw new Meteor.Error('emails.send.exception', exception);
  }
};

export default sendMail;
