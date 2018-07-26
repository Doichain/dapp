import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Link, IndexLink } from 'react-router';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.js';

export default class PageMenu extends BaseComponent {
  constructor(props) {
    super(props);
  }

  hasRole(entry) {
    return entry.roles === undefined || entry.roles.length === 0 || Roles.userIsInRole(this.props.user, entry.roles);
  }

  render() {
    const home = {
      id: "home",
      path: "",
      name: i18n.__('components.userMenu.entries.home.name')
    }

    const entries = [
      {
        id: "key-generator",
        path: "key-generator",
        name: i18n.__('components.userMenu.entries.key-generator.name')
      },
      {
        id: "recipients",
        path: "recipients",
        name: i18n.__('components.userMenu.entries.recipients.name'),
        roles: ["admin"]
      },
      {
        id: "opt-ins",
        path: "opt-ins",
        name: i18n.__('components.userMenu.entries.opt-ins.name'),
        roles: ["admin"]
      }
    ]

    return (
      <div className="page-menu">
        <IndexLink
          to={`/${home.path}`}
          key={home.id}
          title={home.name}
          className="page-menu-entry"
          activeClassName="active"
        >{home.name}</IndexLink>
        {entries.map(entry => (
          this.hasRole(entry) ? <Link
            to={`/${entry.path}`}
            key={entry.id}
            title={entry.name}
            className="page-menu-entry"
            activeClassName="active"
          >
            {entry.name}
          </Link> : null
        ))}
      </div>
    );
  }
}

PageMenu.contextTypes = {
  router: React.PropTypes.object,
};
