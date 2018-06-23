import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import CircularJSON from 'circular-json';
import { OptIns } from '../../../api/opt-ins/opt-ins.js';
import { DOI_MAIL_FETCH_URL } from '../../../startup/server/email-configuration.js';
import {logSend} from "../../../startup/server/log-configuration";

const ExportDoisDataSchema = new SimpleSchema({
  status: {
    type: String
  }
});

//TODO add sender and recipient email address to export

const exportDois = (data) => {
  try {
    const ourData = data;
    ExportDoisDataSchema.validate(ourData);

    let pipeline = [{ $match: {"confirmedAt":{ $exists: true, $ne: null }} },
        { $lookup: { from: "recipients", localField: "recipient", foreignField: "_id", as: "RecipientEmail" } },
        { $lookup: { from: "senders", localField: "sender", foreignField: "_id", as: "SenderEmail" } },
        { $unwind: "$SenderEmail"},
        { $unwind: "$RecipientEmail"},
        { $project: {"_id":1,"createdAt:":1, "confirmedAt":1,"nameId":1, "SenderEmail.email":1,"RecipientEmail.email":1}}];

    //if(ourData.status==1) query = {"confirmedAt": { $exists: true, $ne: null }}

    const optIns = CircularJSON.stringify(OptIns.aggregate(pipeline, {cursor: {}}));

    if(optIns === undefined) throw "Opt-In not found";
    logSend('Opt-Ins found',optIns);


    let exportDoiData;
    try {
        exportDoiData = optIns;

      /*let returnData = {
          "recipient": recipient.email,
          "content": doiMailData.data.content,
          "redirect": doiMailData.data.redirect,
          "subject": doiMailData.data.subject,
          "from": doiMailData.data.from,
          "returnPath": doiMailData.data.returnPath
      } */
      logSend('doiMailData and url:',DOI_MAIL_FETCH_URL,JSON.stringify(exportDoiData));

      return exportDoiData

    } catch(error) {
      throw "Error while exporting dois: "+error;
    }

  } catch (exception) {
    throw new Meteor.Error('dapps.getDoiMailData.exception', exception);
  }
};

export default exportDois;
