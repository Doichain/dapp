import React from 'react';
import { withRouter } from 'react-router';
import { Roles } from 'meteor/alanning:roles';

export default function requireRole(Component, roles) {

  class AuthenticatedComponent extends React.Component {
    componentWillMount() {
      this.checkRole();
    }

    componentWillUpdate() {
      this.checkRole();
    }

    componentWillReceiveProps() {
      this.checkRole();
    }

    checkRole() {
      const redirect = "/";
      if(Meteor.user() !== undefined && !this.hasRole() && this.props.router.getCurrentLocation().pathname !== redirect) {
        this.props.router.push(redirect);
      }
    }

    hasRole() {
      return Meteor.user() !== undefined && Meteor.user() !== null && Roles.userIsInRole(Meteor.user()._id, roles);
    }

    render() {
      return this.hasRole()
        ? <Component { ...this.props } />
        : null;
    }

  }

  return withRouter(AuthenticatedComponent);
}
