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
      <div>
        <div className="page-title">Basic Information</div>
        <table>
          <tbody>
            <tr>
              <td>Blocks:</td>
              <td>{this.state.blockCount?this.state.blockCount:"-"}</td>
            </tr>
          </tbody>
        </table>
        <div className="align-right">
          <div className="button" onClick={()=>this.updateInfo()}>Refresh</div>
        </div>
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
