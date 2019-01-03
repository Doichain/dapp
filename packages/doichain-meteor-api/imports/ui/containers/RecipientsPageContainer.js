import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import RecipientsPage from '../pages/RecipientsPage.js';
import Recipients from '../../api/recipients/recipients.js';

const RecipientsPageContainer = withTracker(() => {
  const recipientsHandle = Meteor.subscribe('recipients.all');
  const loading = !recipientsHandle.ready();
  return {
    loading,
    recipients: !loading ? Recipients.Recipients.find().fetch() : [],
  };
})(RecipientsPage);

export default RecipientsPageContainer;
