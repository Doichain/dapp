import React, { Component } from 'react';

import { withTracker } from 'meteor/react-meteor-data';
import { Sois } from '../api/sois.js';
import Login from './Login.js';
import Soi from './Soi.js';

class App extends Component {

  renderSois() {
    return (
      <ul>
        {this.props.sois.map((soi) => (
          <Soi key={soi._id} soi={soi} />
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>MailId</h1>
        </header>

        {this.props.currentUser?this.renderSois():<Login/>}
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    sois: Sois.find({}).fetch(),
    currentUser: Meteor.user(),
  };
})(App);
