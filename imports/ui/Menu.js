import React, { Component } from 'react';
import PropTypes from 'prop-types'

export default class Menu extends Component {
  static propTypes = {
    entries: PropTypes.array.isRequired,
    navigate: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  render() {
    return (
      <div>
        <div id="menu-bar">
          <div className="title">MailId - Prototype</div>
          <a className="menu-button">
            <i className="material-icons" onClick={()=>{this.setState({open: !this.state.open})}}>menu</i>
          </a>
        </div>
        {this.state.open?this.renderCloseDiv():""}
        {this.state.open?this.renderMenu():""}
      </div>
    );
  }

  renderMenu() {
    return (
      <div id="menu">
        {this.props.entries.map(entry => this.renderEntry(entry))}
      </div>
    )
  }

  renderEntry(entry) {
    return (
      <div
        key={entry.value}
        className="menu-entry"
        onClick={()=>{
          this.props.navigate(entry);
          this.setState({open: false});
        }}>
        {entry.name}
      </div>
    );
  }

  renderCloseDiv() {
    return (
      <div className="close-div" onClick={()=>{this.setState({open: false})}}/>
    )
  }
}
