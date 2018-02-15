import { Api } from '../rest.js';
import verifyOptIn from '../../../../imports/modules/server/opt-ins/verify.js';

Api.addRoute('opt-in/verify', {authRequired: true}, {
  get: {
    roleRequired: ['admin'],
    action: function() {
      const params = this.queryParams;
      try {
        const val = verifyOptIn(params);
        return {status: 'success', data: {val}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});
