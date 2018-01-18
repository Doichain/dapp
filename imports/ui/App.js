import React, { Component } from 'react';
import BasicInfo from './BasicInfo'
import Wallet from './Wallet';
import Signature from './Signature';

export default class App extends Component {

  render() {
    return (
      <div className="app">
        <header>
          <h1>Meteor (React) - Namecoin</h1>
        </header>
        <BasicInfo/>
        <Wallet/>
        <Signature/>
      </div>
    );
  }
}
