import { Api, DOI_WALLETNOTIFY_ROUTE, DOI_CONFIRMATION_ROUTE } from '../rest.js';
import confirmOptIn from '../../../../imports/modules/server/opt-ins/confirm.js'
import checkNewTransaction from "../../../../imports/modules/server/doichain/check_new_transactions";
import {logConfirm, logSend} from "../../../../imports/startup/server/log-configuration";
//doku of meteor-restivus https://github.com/kahmali/meteor-restivus
Api.addRoute(DOI_CONFIRMATION_ROUTE+'/:hash', {authRequired: false}, {
  get: {
    action: function() {
      const hash = this.urlParams.hash;
      try {
        let ip = this.request.headers['x-forwarded-for'] ||
          this.request.connection.remoteAddress ||
          this.request.socket.remoteAddress ||
          (this.request.connection.socket ? this.request.connection.socket.remoteAddress: null);

          if(ip.indexOf(',')!=-1)ip=ip.substring(0,ip.indexOf(','));

          logConfirm('REST opt-in/confirm :',{hash:hash, host:ip});
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

Api.addRoute(DOI_WALLETNOTIFY_ROUTE, {
    get: {
        authRequired: false,
        action: function() {
            const params = this.queryParams;
            const txid = params.tx;

            try {
                checkNewTransaction(txid);
                return {status: 'success',  data:'txid:'+txid+' was read from blockchain'};
            } catch(error) {
                return {status: 'fail', error: error.message};
            }
        }
    }
});
