import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { VERIFY_CLIENT } from '../../../startup/server/doichain-configuration.js';
import { nameShow } from '../../../../server/api/doichain.js';
import getOptInProvider from '../dns/get_opt-in-provider.js';
import getOptInKey from '../dns/get_opt-in-key.js';
import verifySignature from '../doichain/verify_signature.js';
import {logVerify} from "../../../startup/server/log-configuration";
import getPublicKeyAndAddress from "../doichain/get_publickey_and_address_by_domain";

const VerifyOptInSchema = new SimpleSchema({
  recipient_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  sender_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  name_id: {
    type: String
  },
  recipient_public_key: {
    type: String
  }
});

const verifyOptIn = (data) => {
  try {
    const ourData = data;
    VerifyOptInSchema.validate(ourData);
    const entry = nameShow(VERIFY_CLIENT, ourData.name_id);
    if(entry === undefined) return {nameIdFound: "failed"};
    const entryData = JSON.parse(entry.value);
    const firstCheck = verifySignature({
      data: ourData.recipient_mail+ourData.sender_mail,
      signature: entryData.signature,
      publicKey: ourData.recipient_public_key
    });

    if(!firstCheck) return {soiSignatureStatus: "failed"};
    const parts = ourData.recipient_mail.split("@"); //TODO put this into getPublicKeyAndAddress
    const domain = parts[parts.length-1];
    const publicKeyAndAddress = getPublicKeyAndAddress({domain: domain});

    if(!entryData.signature||!entryData.doiSignature)return {doiSignatureStatus: "missing"};
    const secondCheck = verifySignature({
      data: entryData.signature,
      signature: entryData.doiSignature,
      publicKey: publicKeyAndAddress.publicKey
    })

    if(!secondCheck) return {doiSignatureStatus: "failed"};
    return true;
  } catch (exception) {
    throw new Meteor.Error('opt-ins.verify.exception', exception);
  }
};

export default verifyOptIn
