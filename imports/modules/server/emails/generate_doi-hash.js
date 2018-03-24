import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { randomBytes } from 'crypto';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { HashIds } from '../../../startup/server/email-configuration.js';

//TODO why we need here responseData.redirect inside the DoiHash responseData doesn't have an attribute redirect so it crashes here!
//TODO removing it for testing reasons

const GenerateDoiHashSchema = new SimpleSchema({
  id: {
    type: String
  },
  token: {
    type: String
  },
  redirect: {
    type: String,
    optional: true,
  }
});

const generateDoiHash = (optIn) => {
  try {
    const ourOptIn = optIn;
    GenerateDoiHashSchema.validate(ourOptIn);

    const json = JSON.stringify({
      id: ourOptIn.id,
      token: ourOptIn.token,
      redirect: ourOptIn.redirect
    });

    const hex = Buffer(json).toString('hex');
    const hash = HashIds.encodeHex(hex);
    return hash;
  } catch (exception) {
    throw new Meteor.Error('emails.generate_doi-hash.exception', exception);
  }
};

export default generateDoiHash;
