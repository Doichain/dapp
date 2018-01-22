import React, { Component } from 'react';

export default class Hash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signatureSender: undefined,
      signatureRecipient: undefined,
      ip: undefined,
      timestamp: undefined,
      signatureHash: '',
      data: undefined,
      dataHash: ''
    }
  }

  render() {
    return (
      <div>
        <div className="page-title">Hashes</div>
        <div className="block-wrapper">
          Signature Hash:
          <div className="block">
            <table>
              <tbody>
                <tr>
                  <td>Signature (Sender):</td>
                  <td><input onChange={(evt) => {this.setState({signatureSender: evt.target.value})}}/></td>
                </tr>
                <tr>
                  <td>Signature (Recipient):</td>
                  <td><input onChange={(evt) => {this.setState({signatureRecipient: evt.target.value})}}/></td>
                </tr>
                <tr>
                  <td>IP (#.#.#.#):</td>
                  <td><input onChange={(evt) => {this.setState({ip: evt.target.value})}}/></td>
                </tr>
                <tr>
                  <td>Timestamp<br/>(yyyy-mm-ddThh:mm:ss+timezone[hh:mm]):</td>
                  <td><input onChange={(evt) => {this.setState({timestamp: evt.target.value})}}/></td>
                </tr>
              </tbody>
            </table>
            <div style={{marginTop: '10px'}}>
              <span>Hash:</span>
              <button title="Copy to clipboard" className="clipboard-button" onClick={()=>{this.copyToClipboard("signature_hash")}}>
                <i className="material-icons">content_copy</i>
              </button>
              <input ref={"signature_hash"} style={{width: '100%', margin: '5px 0px'}} value={this.state.signatureHash} readOnly/>
            </div>
            <div className="align-right">
              <div className="button" onClick={()=>this.generateSignatureHash()}>Generate</div>
            </div>
          </div>
        </div>
        <div className="block-wrapper">
          Data Hash:
          <div className="block">
            <table>
              <tbody>
                <tr>
                  <td>Data (JSON):</td>
                  <td><input onChange={(evt) => {this.setState({data: evt.target.value})}}/></td>
                </tr>
              </tbody>
            </table>
            <div style={{marginTop: '10px'}}>
              <span>Hash:</span>
              <button title="Copy to clipboard" className="clipboard-button" onClick={()=>{this.copyToClipboard("data_hash")}}>
                <i className="material-icons">content_copy</i>
              </button>
              <input ref={"data_hash"} style={{width: '100%', margin: '5px 0px'}} value={this.state.dataHash} readOnly/>
            </div>
            <div className="align-right">
              <div className="button" onClick={()=>this.generateDataHash()}>Generate</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  copyToClipboard(type) {
    let object = this.refs[type];
    object.select();
    document.execCommand("Copy");
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
