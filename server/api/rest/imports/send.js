import { Api, DOI_FETCH_ROUTE } from '../rest.js';
import addOptIn from '../../../../imports/modules/server/opt-ins/add_and_write_to_blockchain.js';
import updateOptInStatus from '../../../../imports/modules/server/opt-ins/update_status.js';
import getDoiMailData from '../../../../imports/modules/server/dapps/get_doi-mail-data.js';
import {isDebug} from "../../../../imports/startup/server/dapp-configuration";

Api.addRoute('opt-in', {authRequired: true}, {
  post: {
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
