import React from 'react';
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';
import i18n from 'meteor/universe:i18n';
import PrivateRoute from 'react-router-private-route';

import AppContainer from '../../ui/containers/AppContainer.js';
import SettingsPageContainer from '../../ui/containers/SettingsPageContainer.js';
import RecipientsPageContainer from '../../ui/containers/RecipientsPageContainer.js';
import OptInsPageContainer from '../../ui/containers/OptInsPageContainer.js';
import StartPage from '../../ui/pages/StartPage.js';
import KeyGeneratorPage from '../../ui/pages/KeyGeneratorPage.js';
import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.js';
import NotFoundPage from '../../ui/pages/NotFoundPage.js';

import requireRole from './require_role.js';

i18n.setLocale('en');

export const renderRoutes = () => (
  <Router history={ browserHistory }>
    <Route path="/" component={ AppContainer }>
      <IndexRoute component={ StartPage } />
      <Route path="key-generator" component={KeyGeneratorPage} />
      <Route path="signin" component={AuthPageSignIn} />
      <Route component={requireRole(SettingsPageContainer, ['admin'])} path="settings"/>
      <Route component={requireRole(RecipientsPageContainer, ['admin'])} path="recipients"/>
      <Route component={requireRole(OptInsPageContainer, ['admin'])} path="opt-ins"/>
      <Route path="*" component={ NotFoundPage } />
    </Route>
  </Router>
);
