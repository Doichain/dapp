import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import i18n from 'meteor/universe:i18n';

// route components
import AppContainer from '../../ui/containers/AppContainer.js';
import StartPage from '../../ui/pages/StartPage.js';
import NotFoundPage from '../../ui/pages/NotFoundPage.js';

i18n.setLocale('en');

export const renderRoutes = () => (
  <Router history={ browserHistory }>
    <Route path="/" component={ AppContainer }>
      <IndexRoute component={ StartPage } />
      <Route path="*" component={ NotFoundPage } />
    </Route>
  </Router>
);
