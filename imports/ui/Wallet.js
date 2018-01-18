import React, { Component } from 'react';

export default class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: undefined
    }
  }

  render() {
    return (
      <div className="block">
        Wallet:
        <ul>
          <li>Private Key Hexadecimal Format (64 characters [0-9A-F]): {this.state.wallet !== undefined?this.state.wallet.privateKey:""}</li>
          <li>Public Key (compressed, 66 characters [0-9A-F]): {this.state.wallet !== undefined?this.state.wallet.publicKey:""}</li>
          <li>Namecoin Address (compressed): {this.state.wallet !== undefined?this.state.wallet.address:""}</li>
        </ul>
        <button onClick={()=>this.generateWallet()}>Generieren</button>
      </div>
    );
  }

  generateWallet() {
    Meteor.call('getKeys', (error, result) => {
      if(!error) {
        this.setState({
           wallet: {
             privateKey: result.privateKey,
             publicKey: result.publicKey,
             address: result.address
           }
        });
      }
    });
  }
}
