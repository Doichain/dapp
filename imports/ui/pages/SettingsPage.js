import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.js';
import Header from '../components/Header.js';

class SettingsPage extends BaseComponent {
  render() {
    return (
      <div className="page start">
        <Header title={i18n.__('pages.settingsPage.title')}/>
        <div className="content-scrollable">
          <div className="settings-page-wrapper">
            Test
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsPage;
