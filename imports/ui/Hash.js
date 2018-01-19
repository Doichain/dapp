import React, { Component } from 'react';

export default class Hash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signatureSender: undefined,
      signatureRecipient: undefined,
      ip: undefined,
      timestamp: undefined,
      signatureHash: undefined,
      data: undefined,
      dataHash: undefined
    }
  }

  render() {
    return (
      <div className="block">
        Hash:
        <div style={{paddingLeft: "20px"}}>
          <div style={{paddingTop: "10px"}}>
            Signature Hash:
            <div style={{paddingLeft: "20px"}}>
              <div>
                <span>Signature(Sender): </span>
                <input onChange={(evt) => {this.setState({signatureSender: evt.target.value})}}/>
              </div>
              <div>
                <span>Signature(Recipient): </span>
                <input onChange={(evt) => {this.setState({signatureRecipient: evt.target.value})}}/>
              </div>
              <div>
                <span>IP(#.#.#.#): </span>
                <input onChange={(evt) => {this.setState({ip: evt.target.value})}}/>
              </div>
              <div>
                <span>Timestamp(yyyy-mm-ddThh:mm:ss+timezone[hh:mm]): </span>
                <input onChange={(evt) => {this.setState({timestamp: evt.target.value})}}/>
              </div>
              <div>
                <span>Hash: </span>{this.state.signatureHash!==undefined?this.state.signatureHash:""}
              </div>
              <button onClick={()=>this.generateSignatureHash()}>Generieren</button>
            </div>
          </div>
          <div style={{paddingTop: "10px"}}>
            Data Hash:
            <div style={{paddingLeft: "20px"}}>
              <div>
                <span>Data: </span>
                <input onChange={(evt) => {this.setState({data: evt.target.value})}}/>
              </div>
              <div>
                <span>Hash: </span>{this.state.dataHash!==undefined?this.state.dataHash:""}
              </div>
              <button onClick={()=>this.generateDataHash()}>Generieren</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  generateSignatureHash() {
    let signatureSender = this.state.signatureSender;
    let signatureRecipient = this.state.signatureRecipient;
    let ip = this.state.ip;
    let timestamp = this.state.timestamp;
    if(!signatureSender || !signatureRecipient || !ip || !timestamp) return;
    let params = [signatureSender, signatureRecipient, ip, timestamp];
    Meteor.call('getHash', params, (error, result) => {
      if(!error) {
        this.setState({
           signatureHash: result
        });
      }
    });
  }

  generateDataHash() {
    let data = this.state.data;
    if(!data) return;
    let params = [data];
    Meteor.call('getHash', params, (error, result) => {
      if(!error) {
        this.setState({
           dataHash: result
        });
      }
    });
  }
}
