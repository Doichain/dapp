import React, { Component } from 'react';

export default class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockCount: undefined,
      isUpdateDisabled: false
    }
  }

  render() {
    return (
      <div className="block-wrapper">
        Information:
        <div className="block">
          <table>
            <tbody>
              <tr>
                <td>Blocks:</td>
                <td>{this.state.blockCount?this.state.blockCount:""}</td>
              </tr>
            </tbody>
          </table>
          <div className="align-right">
            <div className={this.state.isUpdateDisabled?"button disabled":"button"} onClick={()=>this.updateInfo()}>Refresh</div>
          </div>
        </div>
      </div>
    );
  }

  updateInfo() {
    if(this.state.isUpdateDisabled) return;
    this.setState({isUpdateDisabled: true});
    this.updateBlockCount();
  }

  updateBlockCount() {
    Meteor.call('getBlockCount', (error, count) => {
      if(!error) this.setState({ blockCount: count});
      else this.setState({blockCount: error.error});
      this.setState({isUpdateDisabled: false});
    });
  }
}
