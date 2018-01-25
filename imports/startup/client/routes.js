import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import i18n from 'meteor/universe:i18n';

// route components
import AppContainer from '../../ui/containers/AppContainer.js';
import NotFoundPage from '../../ui/pages/NotFoundPage.js';

i18n.setLocale('en');

export const renderRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={AppContainer}/>
      <Route path="*" component={NotFoundPage} />
    </Switch>
  </BrowserRouter>
);
