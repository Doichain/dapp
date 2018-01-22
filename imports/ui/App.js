import React, { Component } from 'react';
import Menu from './Menu';
import Home from './Home';
import BasicInfo from './BasicInfo'
import Wallet from './Wallet';
import Signature from './Signature';
import Hash from './Hash';
import Blockchain from './Blockchain';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 'home'
    }
  }

  render() {
    let menuEntries = [
      {name: 'Main Page', value: 'home'},
      {name: 'Blockchain Information', value: 'basic_info'},
      {name: 'Wallets', value: 'wallets'}
    ]

    return (
      <div id="app">
        <Menu entries={menuEntries} navigate={(entry)=>this.navigate(entry)}/>
        <div id="content">
          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderContent() {
    switch(this.state.activePage) {
      case 'basic_info': return (<BasicInfo/>);
      case 'wallets': return (<Wallet/>);
      case 'home':
      default: return (<Home/>);
    }
  }

  navigate(entry) {
    if(entry.value !== this.state.activePage) this.setState({activePage: entry.value});
  }
}
