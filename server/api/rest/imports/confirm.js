import { Api, DOI_CONFIRMATION_ROUTE } from '../rest.js';
import confirmOptIn from '../../../../imports/modules/server/opt-ins/confirm.js'
import {isDebug} from "../../../../imports/startup/server/dapp-configuration";
import {BlockchainJobs} from "../../blockchain_jobs";
import checkNewTransaction from "../../../../imports/modules/server/namecoin/check_new_transactions";
import {CONFIRM_APP, isAppType} from "../../../../imports/startup/server/type-configuration";

Api.addRoute(DOI_CONFIRMATION_ROUTE+'/:hash', {authRequired: false}, {
  get: {
    action: function() {
      const hash = this.urlParams.hash;
      try {
        const ip = this.request.headers['x-forwarded-for'] ||
          this.request.connection.remoteAddress ||
          this.request.socket.remoteAddress ||
          (this.request.connection.socket ? this.request.connection.socket.remoteAddress: null);

          if(isDebug()) {console.log('confirm called for hash:'+hash);}

        const redirect = confirmOptIn({host: ip, hash: hash})
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
                /*
                TODO put checkNewTransaction into a job - in case something fails it can
                const queue  = BlockchainJobs.processJobs('checkNewTransaction',{pollInterval: 1000000000},
                    function (job, cb) {
                        try {
                            console.log('test4');
                            if(!isAppType(CONFIRM_APP)) {
                                job.pause();
                                job.cancel();
                                job.remove();
                            } else {

                                job.done();
                            }

                        } catch(exception) {
                            job.fail();
                            throw new Meteor.Error('obs.blockchain.checkNewTransaction.exception', exception);
                        } finally {
                            cb();
                        }
                    });

                    BlockchainJobs.find({ type: 'checkNewTransaction', status: 'ready' })
                    .observe({
                        added: function () {
                            console.log('test3');
                            if(isDebug()) { console.log('triggered checkNewTransaction claim via walletnotify for tx:'+txid);}
                            queue.trigger();
                        }
                    });
                    console.log('test2');*/
                return {status: 'success',  data:'txid:'+txid+' is about to get read from blockchain now.'};
            } catch(error) {
                return {status: 'fail', error: error.message};
            }
        }
    }
});
