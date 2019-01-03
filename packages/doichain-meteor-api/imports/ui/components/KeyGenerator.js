import { Meteor } from 'meteor/meteor';
import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.js';

export default class KeyGenerator extends BaseComponent {
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
      <div className="key-generation">
        <div className="private-key">
          <label>{i18n.__('components.keyGenerator.privateKey')}</label>
          <input value={this.state.privateKey} readOnly />
        </div>
        <div className="public-key">
          <label>{i18n.__('components.keyGenerator.publicKey')}</label>
          <input value={this.state.publicKey} readOnly />
        </div>
        <button onClick={event => this.generate(event)}>{i18n.__('components.keyGenerator.generateButton')}</button>
      </div>
    )
  }
}
