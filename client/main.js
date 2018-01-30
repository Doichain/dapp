import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '/imports/startup/client';
import { renderRoutes } from '../imports/startup/client/routes.js';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app'));
});
