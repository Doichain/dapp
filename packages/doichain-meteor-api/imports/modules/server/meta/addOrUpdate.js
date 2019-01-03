import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Meta } from '../../../api/meta/meta.js';

const AddOrUpdateMetaSchema = new SimpleSchema({
  key: {
    type: String
  },
  value: {
    type: String
  }
});

const addOrUpdateMeta = (data) => {
  try {
    const ourData = data;
    AddOrUpdateMetaSchema.validate(ourData);
    const meta = Meta.findOne({key: ourData.key});
    if(meta !== undefined) Meta.update({_id : meta._id}, {$set: {
      value: ourData.value
    }});
    else return Meta.insert({
      key: ourData.key,
      value: ourData.value
    })
  } catch (exception) {
    throw new Meteor.Error('meta.addOrUpdate.exception', exception);
  }
};

export default addOrUpdateMeta;
