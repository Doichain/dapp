import { Api, DOI_CONFIRMATION_ROUTE } from '../rest.js';
import confirmOptIn from '../../../../imports/modules/server/opt-ins/confirm.js'
import checkNewTransaction from "../../../../imports/modules/server/doichain/check_new_transactions";
import {logConfirm, logSend} from "../../../../imports/startup/server/log-configuration";

Api.addRoute(DOI_CONFIRMATION_ROUTE+'/:hash', {authRequired: false}, {
  get: {
    action: function() {
      const hash = this.urlParams.hash;
      try {
        const ip = this.request.headers['x-forwarded-for'] ||
          this.request.connection.remoteAddress ||
          this.request.socket.remoteAddress ||
          (this.request.connection.socket ? this.request.connection.socket.remoteAddress: null);

          logConfirm('confirm called for hash:',hash);
          const redirect = confirmOptIn({host: ip, hash: hash});

        return {
          statusCode: 303,
          headers: {'Content-Type': 'text/plain', 'Location': redirect},
          body: 'Location: '+redirect
        };
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});

Api.addRoute('walletnotify', {
    get: {
        authRequired: false,
        action: function() {
            const params = this.queryParams;
            const txid = params.tx;

            try {
                checkNewTransaction(txid);
                return {status: 'success',  data:'txid:'+txid+' is about to get read from blockchain now.'};
            } catch(error) {
                return {status: 'fail', error: error.message};
            }
        }
    }
});
