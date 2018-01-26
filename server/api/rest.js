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
      if(true) {
        console.log('test');
        return {status: 'success', data: {message: 'Opt-In added'}};
      } else return {
        statusCode: 422,
        body: {status: 'fail', message: 'Wrong parameters. Parameters: recipient, sender [, data_json]'}
      };
    }
  }
});
