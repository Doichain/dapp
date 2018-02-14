import { Api, DOI_CONFIRMATION_ROUTE } from '../rest.js';
import confirmOptIn from '../../../../imports/modules/server/opt-ins/confirm.js'

Api.addRoute(DOI_CONFIRMATION_ROUTE+'/:hash', {authRequired: false}, {
  get: {
    action: function() {
      const hash = this.urlParams.hash;
      try {
        const ip = this.request.headers['x-forwarded-for'] ||
          this.request.connection.remoteAddress ||
          this.request.socket.remoteAddress ||
          (this.request.connection.socket ? this.request.connection.socket.remoteAddress: null);
        confirmOptIn({ip: ip, hash: hash})
        return {status: 'success', data: {message: 'Confirmation successful'}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});
