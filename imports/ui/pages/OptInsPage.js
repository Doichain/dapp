import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.js';
import Header from '../components/Header.js';
import Message from '../components/Message.js';
import OptInItem from '../components/OptInItem.js';

export default class OptInsPage extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { optIns, loading } = this.props;

    let OptIns;
    if(!optIns || !optIns.length) {
      OptIns = (
        <Message
          title={i18n.__('pages.OptInsPage.noOptIns')}
        />
      );
    } else {
      OptIns = (
        <table>
          <thead>
            <tr className="opt-ins-header">
              <th>{i18n.__('pages.optInsPage.recipient')}</th>
              <th>{i18n.__('pages.optInsPage.sender')}</th>
              <th>{i18n.__('pages.optInsPage.data')}</th>
              <th>{i18n.__('pages.optInsPage.createdAt')}</th>
              <th>{i18n.__('pages.optInsPage.confirmedAt')}</th>
            </tr>
          </thead>
          <tbody>
            {optIns.map(optIn => (
              <OptInItem
                optIn={optIn}
                key={optIn._id}
              />
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <div className="page opt-ins-show">
        <Header title={i18n.__('pages.optInsPage.title')}/>
        <div className="opt-ins-items table-scrollable">
          {loading
            ? <Message title={i18n.__('pages.optInsPage.loading')} />
            : OptIns}
        </div>
      </div>
    );
  }
}

OptInsPage.propTypes = {
  optIns: React.PropTypes.array,
  loading: React.PropTypes.bool
};
