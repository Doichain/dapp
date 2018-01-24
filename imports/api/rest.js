var Api = new Restivus({
  apiPath: 'api/',
  useDefaultAuth: true,
  prettyJson: true
});

Api.addRoute('sois', {authRequired: true}, {
    post: {
      authRequired: true,
      roleRequired: ['admin'],
      action: () => {
        var query = this.queryParams;
        console.log(query);
      }
    }
  });
