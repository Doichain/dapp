import React, { Component } from 'react';

export default class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockCount: undefined
    }
  }

  render() {
    return (
      <div className='block'>
        Basic Infos:
        <ul>
          <li>Blocks: {this.state.blockCount}</li>
        </ul>
        <button onClick={()=>this.updateInfo()}>Update</button>
      </div>
    );
  }

  updateInfo() {
    this.updateBlockCount();
  }

  updateBlockCount() {
    Meteor.call('getBlockCount', (error, count) => {
      if(!error) this.setState({ blockCount: count});
    });
  }
}
