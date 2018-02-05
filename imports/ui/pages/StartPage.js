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
          <div className="start-page-wrapper">
            <div className="info">
              <span>{i18n.__('pages.startPage.infoText')}</span>
              <a target="_blank" href="http://www.sendeffect.de">Sendeffect</a>
            </div>
            <div className="joinNow">
              <span>{i18n.__('pages.startPage.joinNow')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StartPage;
