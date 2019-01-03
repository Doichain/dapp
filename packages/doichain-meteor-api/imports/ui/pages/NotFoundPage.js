import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.js';
import Message from '../components/Message.js';

class NotFoundPage extends BaseComponent {
  render() {
    const title = i18n.__('pages.notFoundPage.pageNotFound');
    return (
      <div className="page not-found">
        <div className="content-scrollable">
          <Message title={title} />
        </div>
      </div>
    );
  }
}

export default NotFoundPage;
