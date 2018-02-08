import { Meteor } from 'meteor/meteor';
import { SEND_APP, CONFIRM_APP, isAppType } from '../../../imports/startup/server/type-configuration.js';
import checkNewTransactions from '../../../imports/modules/server/namecoin/check_new_transactions.js';

export const Api = new Restivus({
  apiPath: 'api/',
  version: 'v1',
  useDefaultAuth: true,
  prettyJson: true
});

if(isAppType(SEND_APP)) import './send.js'
if(isAppType(CONFIRM_APP)) import './confirm.js'

Api.addRoute('test', {authRequired: false}, {
  get: {
    action: function() {
      try {
        checkNewTransactions();
        return {status: 'success', data: {message: 'Test successfull'}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});
