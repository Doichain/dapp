import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Senders } from '../../../api/senders/senders.js';

const AddSenderSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
});

const addSender = (sender) => {
  try {
    const ourSender = sender;
    AddSenderSchema.validate(ourSender);
    const senders = Senders.find({email: sender.email}).fetch();
    if(senders.length > 0) return senders[0]._id;
    return Senders.insert({
      email: ourSender.email
    })
  } catch (exception) {
    throw new Meteor.Error('senders.add.exception', exception);
  }
};

export default addSender;
