import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.js';
import Header from '../components/Header.js';
import Message from '../components/Message.js';
import Item from '../components/Item.js';

export default class RecipientsPage extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { recipients, loading } = this.props;

    let Recipients;
    if(!recipients || !recipients.length) {
      Recipients = (
        <Message
          title={i18n.__('pages.recipientsPage.noRecipients')}
        />
      );
    } else {
      Recipients = (
        recipients.map(recipient => (
          <Item
            keys={[
              {
                key: "id",
                name: i18n.__('pages.recipientsPage.id'),
                value: recipient._id
              },
              {
                key: "email",
                name: i18n.__('pages.recipientsPage.email'),
                value: recipient.email
              },
              {
                key: "customerId",
                name: i18n.__('pages.recipientsPage.customerId'),
                value: recipient.customerId
              },
              {
                key: "publicKey",
                name: i18n.__('pages.recipientsPage.publicKey'),
                value: recipient.publicKey
              },
              {
                key: "createdAt",
                name: i18n.__('pages.recipientsPage.createdAt'),
                value: recipient.createdAt.toISOString()
              }
            ]}
            key={recipient._id}
          />
        ))
      );
    }

    return (
      <div className="page recipients-show">
        <Header title={i18n.__('pages.recipientsPage.title')}/>
        <div className="recipients-items content-scrollable">
          {loading
            ? <Message title={i18n.__('pages.recipientsPage.loading')} />
            : Recipients}
        </div>
      </div>
    );
  }
}

RecipientsPage.propTypes = {
  recipients: React.PropTypes.array,
  loading: React.PropTypes.bool
};
