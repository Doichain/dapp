import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Recipients } from '../recipients.js';
import { OptIns} from '../../opt-ins/opt-ins.js'
Meteor.publish('recipients.byOwner',function recipientGet(){
  let pipeline=[];
  if(!Roles.userIsInRole(this.userId, ['admin'])){
    pipeline.push(
      {$redact:{
      $cond: {
        if: { $cmp: [ "$ownerId", this.userId ] },
        then: "$$PRUNE",
        else: "$$KEEP" }}});
      }
      pipeline.push({ $lookup: { from: "recipients", localField: "recipient", foreignField: "_id", as: "RecipientEmail" } });
      pipeline.push({ $unwind: "$RecipientEmail"});
      pipeline.push({ $project: {"RecipientEmail._id":1}});

      const result = OptIns.aggregate(pipeline);
      let rIds=[];
      result.forEach(element => {
        rIds.push(element.RecipientEmail._id);
      });
  return Recipients.find({"_id":{"$in":rIds}},{fields:Recipients.publicFields});
});
Meteor.publish('recipients.all', function recipientsAll() {
  if(!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) {
    return this.ready();
  }

  return Recipients.find({}, {
    fields: Recipients.publicFields,
  });
});
