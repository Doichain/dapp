import { Meteor} from 'meteor/meteor';
import { Meta } from '../meta/meta';

Meteor.publish('version', function version() {
  return Meta.find({});
});
