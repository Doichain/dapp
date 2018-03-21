import React from 'react';
import i18n from 'meteor/universe:i18n';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import BaseComponent from '../components/BaseComponent.js';
import Header from '../components/Header.js';
import Category from '../components/Category.js';

export default class SettingsPage extends BaseComponent {

  constructor(props) {
     super(props);
     this.state = {
       debug: false
     };
  }

  toggleDebug = () => {
    Meteor.call('settings.toggleDebug');
  };

  render() {
    return (
      <div className="page start">
        <Header title={i18n.__('pages.settingsPage.title')}/>
        <div className="content-scrollable">
          <div className="settings-page-wrapper">
            <Category name={i18n.__('pages.settingsPage.categorys.general.name')}>
              <label className="settings-wrapper">
                <Toggle
                  className="settings-toggle"
                  name="debug-mode"
                  icons={false}
                  onChange={this.toggleDebug}
                  checked={this.state.debug}/>
                  <span>{i18n.__('pages.settingsPage.categorys.general.debug')}</span>
              </label>
            </Category>
          </div>
        </div>
      </div>
    );
  }
}
