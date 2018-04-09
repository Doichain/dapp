import { Api, DOI_FETCH_ROUTE } from '../rest.js';
import addOptIn from '../../../../imports/modules/server/opt-ins/add_and_write_to_blockchain.js';
import updateOptInStatus from '../../../../imports/modules/server/opt-ins/update_status.js';
import getDoiMailData from '../../../../imports/modules/server/dapps/get_doi-mail-data.js';
import claim from '../../../../imports/modules/server/namecoin/claim_and_transfer.js';
import {isDebug} from "../../../../imports/startup/server/dapp-configuration";
import {BlockchainJobs} from "../../blockchain_jobs";

Api.addRoute('opt-in', {
  post: {
    authRequired: true,
    roleRequired: ['admin'],
    action: function() {
      const qParams = this.queryParams;
      const bParams = this.bodyParams;
      let params = {}
      if(qParams !== undefined) params = {...qParams}
      if(bParams !== undefined) params = {...params, ...bParams}
      try {
        const val = addOptIn(params);
        return {status: 'success', data: {message: 'Opt-In added. ID: '+val}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  },
  //TODO: Test and write usage
  put: {
    authRequired: false,
    action: function() {
      const qParams = this.queryParams;
      const bParams = this.bodyParams;
      let params = {}
      if(qParams !== undefined) params = {...qParams}
      if(bParams !== undefined) params = {...params, ...bParams}
      try {
        const val = updateOptInStatus(params);
        return {status: 'success', data: {message: 'Opt-In status updated'}};
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

           // const params = this.queryParams;
          //  const tx = params.txt;
            try {
                    const queue  = BlockchainJobs.processJobs('claim',{pollInterval: 1000000000},
                        function (job, cb) {
                            try {
                                const entry = job.data;
                                claim(entry);
                                job.done();
                                if(isDebug()) { console.log('BlockchainJobs: claim - done!');}
                            } catch(exception) {
                                job.fail();
                                throw new Meteor.Error('jobs.blockchain.claim.exception', exception);
                            } finally {
                                cb();
                            }
                });

                BlockchainJobs.find({ type: 'claim', status: 'ready' })
                    .observe({
                        added: function () {
                            if(isDebug()) { console.log('triggered blockchainjobs claim via walletnotify');}
                            queue.trigger();
                        }
                    });

                return {status: 'success',  data:'all good'};
            } catch(error) {
                return {status: 'fail', error: error.message};
            }
        }
    }
});

Api.addRoute(DOI_FETCH_ROUTE, {authRequired: false}, {
  get: {
    action: function() {
      const params = this.queryParams;
      try {
          if(isDebug()) { console.log("rest api: "+DOI_FETCH_ROUTE+" called.");}
          const data = getDoiMailData(params);
          if(isDebug()) { console.log("got doi mail data "+JSON.stringify(data));}
        return {status: 'success', data};
      } catch(error) {
        return {status: 'fail', error: error.message};
      }
    }
  }
});
