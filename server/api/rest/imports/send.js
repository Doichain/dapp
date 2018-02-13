import { Api, DOI_FETCH_ROUTE } from '../rest.js';
import addOptIn from '../../../../imports/modules/server/opt-ins/add.js';
import getDoiMailData from '../../../../imports/modules/server/dapps/get_doi-mail-data.js';

Api.addRoute('opt-in', {authRequired: true}, {
  post: {
    authRequired: true,
    roleRequired: ['admin'],
    action: function() {
      const params = this.queryParams;
      try {
        const val = addOptIn(params);
        return {status: 'success', data: {message: 'Opt-In added. ID: '+val}};
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
        const data = getDoiMailData(params);
        return {status: 'success', data: {data}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});
