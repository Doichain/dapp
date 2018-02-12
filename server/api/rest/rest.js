import { Meteor } from 'meteor/meteor';
import { SEND_APP, CONFIRM_APP, isAppType } from '../../../imports/startup/server/type-configuration.js';
import encryptMessage from '../../../imports/modules/server/namecoin/encrypt_message.js';
import decryptMessage from '../../../imports/modules/server/namecoin/decrypt_message.js';

export const Api = new Restivus({
  apiPath: 'api/',
  version: 'v1',
  useDefaultAuth: true,
  prettyJson: true
});

if(isAppType(SEND_APP)) import './imports/send.js'
if(isAppType(CONFIRM_APP)) import './imports/confirm.js'


Api.addRoute('test', {authRequired: false}, {
  get: {
    action: function() {
      try {
        const enc = encryptMessage({publicKey: "0217B72C835B1802D4607E6DA9E23A666124783E1E0571EFF7A95B427E7ED4A292", message: "Test"});
        const dec = decryptMessage({privateKey: "892B8AF44E535D646E7B01767579F5C4FBB9B9A09229AB4A15A8D14AB06977CA", message: enc});
        console.log(dec);
        return {status: 'success', data: {message: 'Test successful'}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});
