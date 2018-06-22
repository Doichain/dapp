import { Api, DOI_FETCH_ROUTE, DOI_CONFIRMATION_NOTIFY_ROUTE } from '../rest.js';
import addOptIn from '../../../../imports/modules/server/opt-ins/add_and_write_to_blockchain.js';
import updateOptInStatus from '../../../../imports/modules/server/opt-ins/update_status.js';
import getDoiMailData from '../../../../imports/modules/server/dapps/get_doi-mail-data.js';
import {logError, logSend} from "../../../../imports/startup/server/log-configuration";

//doku of meteor-restivus https://github.com/kahmali/meteor-restivus

Api.addRoute(DOI_CONFIRMATION_NOTIFY_ROUTE, {
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
        logSend('opt-In added ID:',val);
        return {status: 'success', data: {message: 'Opt-In added. ID: '+val}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  },
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
        logSend('opt-In status updated',val);
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
          logSend('rest api - DOI_FETCH_ROUTE called',JSON.stringify(params));
          const data = getDoiMailData(params);
          logSend('got doi mail data',data);
        return {status: 'success', data};
      } catch(error) {
        logError('error while getting DoiMailData',error);
        return {status: 'fail', error: error.message};
      }
    }
  }
});
