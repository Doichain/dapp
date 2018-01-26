import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from './BaseComponent.js';
import MobileMenu from './MobileMenu.js';

class Header extends BaseComponent {
  render() {
    return (
      <nav className="header">
        <MobileMenu />
        <div className="title-wrapper">
          {this.props.title ? <span className="title">{this.props.title}</span> : null}
          {this.props.subtitle ? <span className="subtitle">{this.props.subtitle}</span> : null}
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default Header;
