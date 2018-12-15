import React from 'react';
import MobileMenu from '../components/MobileMenu.js';
import PropTypes from 'prop-types';
const AuthPage = ({ content, link }) => (
  <div className="page auth">
    <nav>
      <MobileMenu />
    </nav>
    <div className="content-scrollable">
      {content}
      {link}
    </div>
  </div>
);

AuthPage.propTypes = {
  content: PropTypes.element,
  link: PropTypes.element,
};

export default AuthPage;
