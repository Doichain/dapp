import React, { Component } from 'react';

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
      statusNameFirstUpdate: undefined
    }
  }

  render() {
    return (
      <div className="block">
        Blockchain:
        <div style={{paddingLeft: "20px"}}>
          <div style={{paddingTop: "10px"}}>
            New name:
            <div style={{paddingLeft: "20px"}}>
              <div>
                <span>Hash: </span>
                <input onChange={(evt) => {this.setState({hashNameNew: evt.target.value})}}/>
              </div>
              <div>
                <span>Status:</span>{this.state.statusNameNew!==undefined?this.state.statusNameNew:""}
              </div>
              <button onClick={()=>this.nameNew()}>New name</button>
            </div>
          </div>
          <div style={{paddingTop: "10px"}}>
            New first update:
            <div style={{paddingLeft: "20px"}}>
              <div>
                <span>Hash: </span>
                <input onChange={(evt) => {this.setState({hashNameFirstUpdate: evt.target.value})}}/>
              </div>
              <div>
                <span>Signature(Recipient): </span>
                <input onChange={(evt) => {this.setState({signature: evt.target.value})}}/>
              </div>
              <div>
                <span>Hash(Data): </span>
                <input onChange={(evt) => {this.setState({dataHash: evt.target.value})}}/>
              </div>
              <div>
                <span>Rand: </span>
                <input onChange={(evt) => {this.setState({rand: evt.target.value})}}/>
              </div>
              <div>
                <span>Tx: </span>
                <input onChange={(evt) => {this.setState({tx: evt.target.value})}}/>
              </div>
              <div>
                <span>Status:</span>{this.state.statusNameFirstUpdate!==undefined?this.state.statusNameFirstUpdate:""}
              </div>
              <button onClick={()=>this.nameFirstUpdate()}>First update</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  nameFirstUpdate() {
    let hash = this.state.hashNameFirstUpdate;
    let signature = this.state.signature;
    let dataHash = this.state.dataHash;
    let rand = this.state.rand;
    let tx = this.state.tx;
    if(!hash || !signature || !dataHash || !rand || !tx) return;
    Meteor.call('nameFirstUpdate', hash, signature, dataHash, rand, tx, (error, result) => {
      if(!error) {
        this.setState({
           statusNameFirstUpdate: result
        });
      }
    });
  }

  nameNew() {
    let hash = this.state.hashNameNew;
    if(!hash) return;
    Meteor.call('nameNew', hash, (error, result) => {
      if(!error) {
        let status;
        if(Array.isArray(result)) status = "tx: "+result[0]+", rand: "+result[1];
        else status = result;
        this.setState({
           statusNameNew: status
        });
      }
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
