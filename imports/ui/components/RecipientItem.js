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
      <tr className="recipient-item">
        <td style={{width: "23%"}}>{recipient.email}</td>
        <td style={{width: "12%"}}>{recipient.customerId}</td>
        <td style={{width: "49%"}}>{recipient.publicKey}</td>
        <td style={{width: "16%"}}>{recipient.createdAt.toISOString()}</td>
      </tr>
    );
  }
}

RecipientItem.propTypes = {
  recipient: React.PropTypes.object
};
