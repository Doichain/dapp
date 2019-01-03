import { Meteor } from 'meteor/meteor';
import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.js';

export default class ImageElement extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { open: false });
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.stopPropagation();
    this.setState({
      open: !this.state.open,
    });
  }

    

  render() {
    const { src } = this.props;
    return (
      <div className="imageElement">
        <button onClick={this.toggle}>{i18n.__('components.ImageElement.toggle')}</button>
        <div>
        {!this.state.open?<img width={"30%"} src={src}></img>:null}
        {this.state.open?<img src={src}></img>:null}
        </div>
      </div>
    )
  }
}
