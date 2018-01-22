import React, { Component } from 'react';
import BasicInfo from './BasicInfo';

export default class Blockchain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hashNameNew: undefined,
      statusNameNew: undefined,
      hashNameFirstUpdate: undefined,
      dataHash: undefined,
      signature: undefined,
      rand: undefined,
      tx: undefined,
      statusNameFirstUpdate: '',
      isNameNewDisabled: false,
      isNameFirstUpdateDisabled: false
    }
  }

  render() {
    return (
      <div>
        <div className="page-title">Blockchain</div>
        <BasicInfo/>
        <div className="block-wrapper">
          Name new:
          <div className="block">
            <table>
              <tbody>
                <tr>
                  <td>Hash:</td>
                  <td><input onChange={(evt) => {this.setState({hashNameNew: evt.target.value})}}/></td>
                </tr>
              </tbody>
            </table>
            <div style={{marginTop: '10px'}}>
              <span>Status: </span>{this.renderNewNameStatus()}
            </div>
            <div className="align-right">
              <div className={this.state.isNameNewDisabled?"button disabled":"button"} onClick={()=>this.nameNew()}>New name</div>
            </div>
          </div>
        </div>

        <div className="block-wrapper">
          Name first update:
          <div className="block">
            <table>
              <tbody>
                <tr>
                  <td>Hash:</td>
                  <td><input onChange={(evt) => {this.setState({hashNameFirstUpdate: evt.target.value})}}/></td>
                </tr>
                <tr>
                  <td>Signature (Recipient):</td>
                  <td><input onChange={(evt) => {this.setState({signature: evt.target.value})}}/></td>
                </tr>
                <tr>
                  <td>Data-Hash:</td>
                  <td><input onChange={(evt) => {this.setState({dataHash: evt.target.value})}}/></td>
                </tr>
                <tr>
                  <td>Rand</td>
                  <td><input onChange={(evt) => {this.setState({rand: evt.target.value})}}/></td>
                </tr>
                <tr>
                  <td>Tx</td>
                  <td><input onChange={(evt) => {this.setState({tx: evt.target.value})}}/></td>
                </tr>
              </tbody>
            </table>
            <div style={{marginTop: '10px'}}>
              <span>Status:</span>
              <button title="Copy to clipboard" className="clipboard-button" onClick={()=>{this.copyToClipboard("first_update")}}>
                <i className="material-icons">content_copy</i>
              </button>
              <input ref={"first_update"} style={{width: '100%', margin: '5px 0px'}} value={this.state.statusNameFirstUpdate} readOnly/>
            </div>
            <div className="align-right">
              <div className={this.state.isNameFirstUpdateDisabled?"button disabled":"button"} onClick={()=>this.nameFirstUpdate()}>First update</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderNewNameStatus() {
    let status = this.state.statusNameNew;
    if(status !== undefined) {
      if(status.error !== undefined) return status.error;
      else return (
        <div>
          <span>Tx:</span>
          <button title="Copy to clipboard" className="clipboard-button" onClick={()=>{this.copyToClipboard("tx")}}>
            <i className="material-icons">content_copy</i>
          </button>
          <input ref={"tx"} style={{width: '100%', margin: '5px 0px'}} value={status.tx} readOnly/>

          <span>Rand:</span>
          <button title="Copy to clipboard" className="clipboard-button" onClick={()=>{this.copyToClipboard("rand")}}>
            <i className="material-icons">content_copy</i>
          </button>
          <input ref={"rand"} style={{width: '100%', margin: '5px 0px'}} value={status.rand} readOnly/>
        </div>
      )
    }
  }

  copyToClipboard(type) {
    let object = this.refs[type];
    object.select();
    document.execCommand("Copy");
  }

  nameFirstUpdate() {
    let hash = this.state.hashNameFirstUpdate;
    let signature = this.state.signature;
    let dataHash = this.state.dataHash;
    let rand = this.state.rand;
    let tx = this.state.tx;
    if(!hash || !signature || !dataHash || !rand || !tx || this.state.isNameFirstUpdateDisabled) return;
    this.setState({ isNameFirstUpdateDisabled: true })
    Meteor.call('nameFirstUpdate', hash, signature, dataHash, rand, tx, (error, result) => {
      if(!error) {
        this.setState({
           statusNameFirstUpdate: result
        });
      } else this.setState({
         statusNameFirstUpdate: error.error
      });
      this.setState({isNameFirstUpdateDisabled: false })
    });
  }

  nameNew() {
    let hash = this.state.hashNameNew;
    if(!hash || this.state.isNameNewDisabled) return;
    this.setState({ isNameNewDisabled: true })
    Meteor.call('nameNew', hash, (error, result) => {
      if(!error) {
        this.setState({
           statusNameNew: {
             tx: result[0],
             rand: result[1]
           }
        });
      } else this.setState({
         statusNameNew: {
           error: error.error
         }
      });
      this.setState({isNameNewDisabled: false })
    });
  }

  writeInBlockchain() {
    let hash = this.state.hash;
    let signature = this.state.signature;
    let dataHash = this.state.dataHash;
    if(!hash || !signature || !dataHash) return;
    Meteor.call('writeInBlockchain', hash, signature, dataHash, (error, result) => {
      if(!error) {
        this.setState({
           status: result
        });
      }
    });
  }
}
