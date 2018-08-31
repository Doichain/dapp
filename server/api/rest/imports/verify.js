import { Api } from '../rest.js';
import verifyOptIn from '../../../../imports/modules/server/opt-ins/verify.js';

Api.addRoute('opt-in/verify', {authRequired: true}, {
  get: {
    roleRequired: [`admin`],
    action: function() {
        const qParams = this.queryParams;
        const bParams = this.bodyParams;
        let params = {}
        if(qParams !== undefined) params = {...qParams}
        if(bParams !== undefined) params = {...params, ...bParams}

      try {
        const val = verifyOptIn(params);
        return {status: "success", data: {val}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});
