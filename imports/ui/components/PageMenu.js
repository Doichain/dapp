import React from 'react';
import { Link } from 'react-router';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.js';

export default class PageMenu extends BaseComponent {
  constructor(props) {
    super(props);
  }

  hasRole(entry) {
    return entry.roles !== undefined && entry.roles.length > 0 && Roles.userIsInRole(this.props.user, entry.roles);
  }

  render() {
    const { entries } = this.props;
    return (
      <div className="page-menu">
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

PageMenu.propTypes = {
  entries: React.PropTypes.array,
};

PageMenu.contextTypes = {
  router: React.PropTypes.object,
};
