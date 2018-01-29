import addOptIn from '../../imports/modules/server/opt-ins/add.js'

var Api = new Restivus({
  apiPath: 'api/',
  version: 'v1',
  useDefaultAuth: true,
  prettyJson: true
});

Api.addRoute('opt-in', {authRequired: true}, {
  post: {
    authRequired: true,
    roleRequired: ['admin'],
    action: function() {
      let params = this.queryParams;
      try {
        const val = addOptIn(params);
        return {status: 'success', data: {message: 'Opt-In added. ID: '+val}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});
