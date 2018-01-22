import React, { Component } from 'react';

export default class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wallets: []
    }
  }

  render() {
    return (
      <div>
        <div className="page-title">Wallets</div>
        {this.state.wallets.map(wallet=>(this.renderWallet(wallet)))}
        <div className="align-right">
          <div className="button" onClick={()=>this.generateWallet()}>Add Wallet</div>
        </div>
      </div>
    );
  }

  renderWallet(wallet) {
    return (
      <div key={wallet.privateKey} className="block-wrapper">
        <div className="block">
          <div style={{padding: '5px'}}>
            <span>Private Key Hexadecimal Format (64 characters [0-9A-F])</span>
            <button title="Copy to clipboard" className="clipboard-button" onClick={()=>{this.copyToClipboard(wallet, "privateKey")}}>
              <i className="material-icons">content_copy</i>
            </button>
            <input ref={wallet.privateKey+"_privateKey"} style={{width: '100%'}} value={wallet.privateKey} readOnly/>
          </div>
          <div style={{padding: '5px'}}>
            <span>Public Key (compressed, 66 characters [0-9A-F])</span>
            <button title="Copy to clipboard" className="clipboard-button" onClick={()=>{this.copyToClipboard(wallet, "publicKey")}}>
              <i className="material-icons">content_copy</i>
            </button>
            <input ref={wallet.privateKey+"_publicKey"} style={{width: '100%'}} value={wallet.publicKey} readOnly/>
          </div>
          <div style={{padding: '5px'}}>
            <span>Namecoin Address (compressed)</span>
            <button title="Copy to clipboard" className="clipboard-button" onClick={()=>{this.copyToClipboard(wallet, "address")}}>
              <i className="material-icons">content_copy</i>
            </button>
            <input ref={wallet.privateKey+"_address"} style={{width: '100%'}} value={wallet.address} readOnly/>
          </div>
          <div className="wallet-remove-button" onClick={()=>{this.removeWallet(wallet)}}>
            <i className="material-icons">close</i>
          </div>
        </div>
      </div>
    );
  }

  copyToClipboard(wallet, type) {
    let object = this.refs[wallet.privateKey+"_"+type];
    object.select();
    document.execCommand("Copy");
  }

  removeWallet(wallet) {
    let index = this.state.wallets.findIndex((w)=>{if(w.privateKey === wallet.privateKey) return true;})
    let wallets = this.state.wallets;
    wallets.splice(index, 1);
    this.setState({wallets: wallets});
  }

  generateWallet() {
    Meteor.call('getKeys', (error, result) => {
      if(!error) {
        this.setState({
           wallets: [...this.state.wallets, {
             privateKey: result.privateKey,
             publicKey: result.publicKey,
             address: result.address
           }]
        });
      }
    });
  }
}
