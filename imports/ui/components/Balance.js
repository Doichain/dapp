import { Meteor } from 'meteor/meteor';
import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.js';

export default class Balance extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, {
      privateKey: "",
      publicKey: ""
    });
    this.generate = this.generate.bind(this);
  }

  generate(e) {
    e.stopPropagation();
    Meteor.call("doichain.getKeyPair", (error, value) => {
      const keyPair = value;
      if(!error) {
        this.setState({
          privateKey: keyPair.privateKey,
          publicKey: keyPair.publicKey
        })
      }
    });
  }

  render() {
    return (
      <div className="balance">
        <label>Hello this is test!</label>
      </div>
    )
  }
}
