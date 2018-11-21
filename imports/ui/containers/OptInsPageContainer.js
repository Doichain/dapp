import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import OptInsPage from '../pages/OptInsPage.js';
import OptIns from '../../api/opt-ins/opt-ins.js';
import Recipients from '../../api/recipients/recipients.js'
const OptInsPageContainer = withTracker(() => {
  const optInsHandle = Meteor.subscribe('opt-ins.all');
  const recipientsHandle = Meteor.subscribe('recipients.byOwner');
  const loading = !optInsHandle.ready()||!recipientsHandle.ready();
  return {
    loading,
    optIns: !loading ? OptIns.OptIns.find().fetch() : [],
    recipients: recipientsHandle.ready() ? Recipients.Recipients.find().fetch() : []
  };
})(OptInsPage);

export default OptInsPageContainer;
