import React, { Component } from 'react';

export default class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generatePrivateKey: undefined,
      generateEmail: undefined,
      signature: undefined,
      verifyPublicKey: undefined,
      verifyEmail: undefined,
      verifySignature: undefined,
      signatureVerification: undefined
    }
  }

  render() {
    return (
      <div className="block">
        Signature:
        <div style={{paddingLeft: "20px"}}>
          <div style={{paddingTop: "10px"}}>
            Generate:
            <div style={{paddingLeft: "20px"}}>
              <div>
                <span>Private Key: </span>
                <input onChange={(evt) => {this.setState({generatePrivateKey: evt.target.value})}}/>
              </div>
              <div>
                <span>Email: </span>
                <input onChange={(evt) => {this.setState({generateEmail: evt.target.value})}}/>
              </div>
              <div>
                <span>Signature:</span>{this.state.signature!==undefined?this.state.signature:""}
              </div>
              <button onClick={()=>this.generateSignature()}>Generieren</button>
            </div>
          </div>
          <div style={{paddingTop: "10px"}}>
            Verify:
            <div style={{paddingLeft: "20px"}}>
              <div>
                <span>Public Key: </span>
                <input onChange={(evt) => {this.setState({verifyPublicKey: evt.target.value})}}/>
              </div>
              <div>
                <span>Email: </span>
                <input onChange={(evt) => {this.setState({verifyEmail: evt.target.value})}}/>
              </div>
              <div>
                <span>Signature: </span>
                <input onChange={(evt) => {this.setState({verifySignature: evt.target.value})}}/>
              </div>
              <div>
                <span>Verification:</span><span>{this.state.signatureVerification!==undefined?
                  this.state.signatureVerification === true?"true":"false"
                :""}</span>
              </div>
              <button onClick={()=>this.verifySignature()}>Verify</button>
            </div>
          </div>
        </div>
      </div>
    );
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
