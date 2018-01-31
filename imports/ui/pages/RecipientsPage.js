import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.js';
import Header from '../components/Header.js';
import Message from '../components/Message.js';
import RecipientItem from '../components/RecipientItem.js';

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
        <table>
          <thead>
            <tr className="recipients-header">
              <th style={{width: "23%"}}>{i18n.__('pages.recipientsPage.email')}</th>
              <th style={{width: "12%"}}>{i18n.__('pages.recipientsPage.customerId')}</th>
              <th style={{width: "49%"}}>{i18n.__('pages.recipientsPage.publicKey')}</th>
              <th style={{width: "16%"}}>{i18n.__('pages.recipientsPage.createdAt')}</th>
            </tr>
          </thead>
          <tbody>
            {recipients.map(recipient => (
              <RecipientItem
                recipient={recipient}
                key={recipient._id}
              />
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <div className="page recipients-show">
        <Header title={i18n.__('pages.recipientsPage.title')}/>
        <div className="recipients-items table-scrollable">
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
