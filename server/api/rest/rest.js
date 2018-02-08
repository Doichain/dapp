import { Meteor } from 'meteor/meteor';
import { SEND_APP, CONFIRM_APP, isAppType } from '../../../imports/startup/server/type-configuration.js';
import getWif from '../../../imports/modules/server/namecoin/get_wif.js';
import getAddress from '../../../imports/modules/server/namecoin/get_address.js';

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
        const wif = getWif({privateKey: "892B8AF44E535D646E7B01767579F5C4FBB9B9A09229AB4A15A8D14AB06977CA"})
        const address = getAddress({publicKey: "0217B72C835B1802D4607E6DA9E23A666124783E1E0571EFF7A95B427E7ED4A292"})
        console.log(wif);
        console.log(address);
        return {status: 'success', data: {message: 'Test successfull'}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});
