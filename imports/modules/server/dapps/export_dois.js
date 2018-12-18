import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { DOI_MAIL_FETCH_URL } from '../../../startup/server/email-configuration.js';
import {logSend} from "../../../startup/server/log-configuration";
import {OptIns} from "../../../api/opt-ins/opt-ins";

const ExportDoisDataSchema = new SimpleSchema({
  status: {
    type: String,
    optional: true,
  },
  role:{
    type:String
  },
  userid:{
    type: String,
    regEx: SimpleSchema.RegEx.id,
    optional:true 
  }
});

//TODO add sender and recipient email address to export

const exportDois = (data) => {
  try {
    const ourData = data;
    ExportDoisDataSchema.validate(ourData);
    let pipeline=[{ $match: {"confirmedAt":{ $exists: true, $ne: null }} }];
    
    if(ourData.role!='admin'||ourData.userid!=undefined){
      pipeline.push({ $redact:{
        $cond: {
          if: { $cmp: [ "$ownerId", ourData.userid ] },
          then: "$$PRUNE",
          else: "$$KEEP" }}});
    }
    pipeline=[...pipeline,
        { $lookup: { from: "recipients", localField: "recipient", foreignField: "_id", as: "RecipientEmail" } },
        { $lookup: { from: "senders", localField: "sender", foreignField: "_id", as: "SenderEmail" } },
        { $unwind: "$SenderEmail"},
        { $unwind: "$RecipientEmail"},
        { $project: {_id:1,createdAt:1, confirmedAt:1,nameId:1, 'SenderEmail.email':1,'RecipientEmail.email':1}
      }
    ];
    //if(ourData.status==1) query = {"confirmedAt": { $exists: true, $ne: null }}

    let optIns =  OptIns.aggregate(pipeline);
    let exportDoiData;
    try {
        exportDoiData = optIns;
        logSend('exportDoi url:',DOI_MAIL_FETCH_URL,JSON.stringify(exportDoiData));
      return exportDoiData

    } catch(error) {
      throw "Error while exporting dois: "+error;
    }

  } catch (exception) {
    throw new Meteor.Error('dapps.exportDoi.exception', exception);
  }
};

export default exportDois;
