import { Meteor } from 'meteor/meteor';
import React from 'react';
import BaseComponent from './BaseComponent.js';
import Item from "./Item";

export default class Version extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (<h1>test 1</h1>)
  }
}
