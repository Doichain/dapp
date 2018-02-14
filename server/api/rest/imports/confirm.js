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
        const redirect = confirmOptIn({ip: ip, hash: hash})
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
