import React from 'react';
import { _ } from 'meteor/underscore';
import classnames from 'classnames';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.js';

export default class RecipientItem extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { recipient } = this.props;

    return (
      <div className="recipient-item">
        <span>{recipient.email}</span>
      </div>
    );
  }
}

RecipientItem.propTypes = {
  recipient: React.PropTypes.object
};
