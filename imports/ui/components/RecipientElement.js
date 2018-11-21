import { Meteor } from 'meteor/meteor';
import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.js';
import Item from '../components/Item.js';

export default class RecipientElement extends BaseComponent {
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
    let {_id,email,publicKey,createdAt} = this.props;
    let RecipientFull = <Item
            keys={[
              {
                key: "id",
                name: i18n.__('pages.recipientsPage.id'),
                value: _id
              },
              {
                key: "email",
                name: i18n.__('pages.recipientsPage.email'),
                value: email
              },
              {
                key: "publicKey",
                name: i18n.__('pages.recipientsPage.publicKey'),
                value: publicKey
              },
              {
                key: "createdAt",
                name: i18n.__('pages.recipientsPage.createdAt'),
                value: createdAt.toISOString()
              }
            ]}
            key={_id}
          /> ;
    return (
      <div onClick={this.toggle} className="recipientElement">

        {this.state.open? RecipientFull:null}
        {!this.state.open? email:null}

      </div>
    )
  }
}
