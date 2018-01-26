import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.js';
import Header from '../components/Header.js';

class StartPage extends BaseComponent {
  render() {
    return (
      <div className="page start">
        <Header title={i18n.__('pages.startPage.title')}/>
        <div className="content-scrollable">
          test
        </div>
      </div>
    );
  }
}

export default StartPage;
