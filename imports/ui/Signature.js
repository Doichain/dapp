import React, { Component } from 'react';

export default class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generatePrivateKey: undefined,
      generateEmail: undefined,
      signature: '',
      verifyPublicKey: undefined,
      verifyEmail: undefined,
      verifySignature: undefined,
      signatureVerification: undefined
    }
  }

  render() {
    return (
      <div>
        <div className="page-title">Signature</div>
        <div className="block-wrapper">
          Generate:
          <div className="block">
            <table>
              <tbody>
                <tr>
                  <td>Private Key:</td>
                  <td><input onChange={(evt) => {this.setState({generatePrivateKey: evt.target.value})}}/></td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td><input onChange={(evt) => {this.setState({generateEmail: evt.target.value})}}/></td>
                </tr>
              </tbody>
            </table>
            <div style={{marginTop: '10px'}}>
              <span>Signature:</span>
              <button title="Copy to clipboard" className="clipboard-button" onClick={()=>{this.copyToClipboard("signature")}}>
                <i className="material-icons">content_copy</i>
              </button>
              <input ref={"signature"} style={{width: '100%', margin: '5px 0px'}} value={this.state.signature} readOnly/>
            </div>
            <div className="align-right">
              <div className="button" onClick={()=>this.generateSignature()}>Generate</div>
            </div>
          </div>
        </div>
        <div className="block-wrapper">
          Verify:
          <div className="block">
            <table>
              <tbody>
                <tr>
                  <td>Public Key:</td>
                  <td><input onChange={(evt) => {this.setState({verifyPublicKey: evt.target.value})}}/></td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td><input onChange={(evt) => {this.setState({verifyEmail: evt.target.value})}}/></td>
                </tr>
                <tr>
                  <td>Signature:</td>
                  <td><input onChange={(evt) => {this.setState({verifySignature: evt.target.value})}}/></td>
                </tr>
              </tbody>
            </table>
            <div style={{marginTop: '10px', paddingLeft: '2px'}}>
              <span>Valid: </span>{this.getVerificationText()}
            </div>
            <div className="align-right">
              <div className="button" onClick={()=>this.verifySignature()}>Check</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getVerificationText() {
    let result = this.state.signatureVerification
    if(result !== undefined) {
      if(typeof result === "boolean") {
        if(result === true) return 'true';
        else return 'false'
      } else return result;
    }
  }

  copyToClipboard(type) {
    let object = this.refs[type];
    object.select();
    document.execCommand("Copy");
  }

  generateSignature() {
    let privateKey = this.state.generatePrivateKey;
    let message = this.state.generateEmail;
    if(!privateKey || !message) return;
    Meteor.call('signMessage', privateKey, message, (error, result) => {
      if(!error) {
        this.setState({
           signature: result
        });
      }
    });
  }

  verifySignature() {
    let publicKey = this.state.verifyPublicKey;
    let message = this.state.verifyEmail;
    let signature = this.state.verifySignature;
    if(!publicKey || !message || !signature) return;
    Meteor.call('verifySignature', publicKey, message, signature, (error, result) => {
      if(!error) {
        this.setState({
           signatureVerification: result
        });
      }
    });
  }
}
