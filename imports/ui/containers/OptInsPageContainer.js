import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import OptInsPage from '../pages/OptInsPage.js';
import OptIns from '../../api/opt-ins/opt-ins.js';

const OptInsPageContainer = withTracker(() => {
  const optInsHandle = Meteor.subscribe('opt-ins.all');
  const loading = !optInsHandle.ready();
  return {
    loading,
    optIns: !loading ? OptIns.OptIns.find().fetch() : [],
  };
})(OptInsPage);

export default OptInsPageContainer;
