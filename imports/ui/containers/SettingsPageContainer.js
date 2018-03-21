import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import SettingsPage from '../pages/SettingsPage.js';

const SettingsPageContainer = withTracker(() => {
  return {};
})(SettingsPage);

export default SettingsPageContainer;
