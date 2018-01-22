import React, { Component } from 'react';
import Menu from './Menu';
import BasicInfo from './BasicInfo'
import Wallet from './Wallet';
import Signature from './Signature';
import Hash from './Hash';
import Blockchain from './Blockchain';

export default class App extends Component {

  render() {
    let menuEntries = [
      {name: 'Home', value: 'home'},
      {name: 'Basic Information', value: 'basic_info'}
    ]

    return (
      <div id="app">
        <Menu entries={menuEntries}/>
        <BasicInfo/>
        <Wallet/>
        <Signature/>
        <Hash/>
        <Blockchain/>
      </div>
    );
  }
}
