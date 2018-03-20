import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import SettingsPage from '../pages/SettingsPage.js';

const SettingsPageContainer = withTracker(() => {
  const loading = true; 
  return {
    loading
  };
})(SettingsPage);

export default SettingsPageContainer;
