import React, { Component } from 'react';

import { withTracker } from 'meteor/react-meteor-data';
import { Sois } from '../api/sois.js';
import Soi from './Soi.js';

class App extends Component {

  renderSois() {
    console.log(this.props.sois);
    return this.props.sois.map((soi) => (
      <Soi key={soi._id} soi={soi} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>MailId</h1>
        </header>

        <ul>
          {this.renderSois()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    sois: Sois.find({}).fetch(),
  };
})(App);
