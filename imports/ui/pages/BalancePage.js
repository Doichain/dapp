import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.js';
import Header from '../components/Header.js';
import Balance from '../components/Balance.js';

class BalancePage extends BaseComponent {
  render() {
    return (
      <div className="page balance">
        <Header title={i18n.__('pages.balance.title')}/>
        <div className="content-scrollable">
          <Balance />
        </div>
      </div>
    );
  }
}

export default BalancePage;
