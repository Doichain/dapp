import React, { Component } from 'react';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  render() {
    return (
      <div>
        <div className="page-title">Main Page</div>
        This is a prototype for the MailId functions.<br/>
        <br/>
        Github: <a href='https://github.com/inspiraluna/mailId'>https://github.com/inspiraluna/mailId</a>
      </div>
    );
  }
}
