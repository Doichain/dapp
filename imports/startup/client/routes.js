import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import i18n from 'meteor/universe:i18n';

// route components
import AppContainer from '../../ui/containers/AppContainer.js';
import NotFoundPage from '../../ui/pages/NotFoundPage.js';

i18n.setLocale('en');

function NestedRoute(props) {
  const component = p => <props.component {...p} children={props.children} />
  return <Route exact={props.exact} path={props.path} render={component} />
}

export const renderRoutes = () => (
  <BrowserRouter>
    <NestedRoute path="/" component={AppContainer}>
      <Route path="*" component={NotFoundPage} />
    </NestedRoute>
  </BrowserRouter>
);
