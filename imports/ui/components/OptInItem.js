import React from 'react';
import { _ } from 'meteor/underscore';
import classnames from 'classnames';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.js';

export default class OptInItem extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { optIn } = this.props;

    return (
      <tr className="opt-in-item">
        <td>{optIn.recipient}</td>
        <td>{optIn.sender}</td>
        <td>{optIn.data}</td>
        <td>{optIn.createdAt.toISOString()}</td>
        <td>{optIn.confirmedAt ? optIn.confirmedAt.toISOString() : null}</td>
      </tr>
    );
  }
}

OptInItem.propTypes = {
  optIn: React.PropTypes.object
};
