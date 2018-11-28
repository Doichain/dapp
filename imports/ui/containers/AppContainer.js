import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';

import App from '../layouts/App.js';
import { Meta } from '../../api/meta/meta.js';

export default withTracker(() => {
  const vers = Meta.findOne({});
  return {
    user: Meteor.user(),
    loading: false,
    version: vers ? vers.value : "",
    connected: Meteor.status().connected,
    menuOpen: Session.get('menuOpen')
  };
})(App);
