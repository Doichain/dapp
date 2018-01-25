import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';

import App from '../layouts/App.js';

export default withTracker(() => {
  return {
    user: Meteor.user(),
    loading: false,
    connected: Meteor.status().connected,
    menuOpen: Session.get('menuOpen')
  };
})(App);
