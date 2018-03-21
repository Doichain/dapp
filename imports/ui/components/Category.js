import React from 'react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import classnames from 'classnames';
import BaseComponent from './BaseComponent.js';

export default class Category extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="category">
        <div className="category-title">{this.props.name}</div>
        <div className="category-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Category.propTypes = {
  name: PropTypes.string
};
