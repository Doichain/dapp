import React, { Component } from 'react';
import Menu from './Menu';
import Home from './Home';
import Wallets from './Wallets';
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
      {name: 'Wallets', value: 'wallets'},
      {name: 'Signature', value: 'signature'},
      {name: 'Hashes', value: 'hashes'},
      {name: 'Blockchain', value: 'blockchain'}
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
      case 'wallets': return (<Wallets/>);
      case 'signature': return (<Signature/>);
      case 'hashes': return (<Hash/>);
      case 'blockchain': return (<Blockchain/>);
      case 'home':
      default: return (<Home/>);
    }
  }

  navigate(entry) {
    if(entry.value !== this.state.activePage) this.setState({activePage: entry.value});
  }
}
