import { Api } from '../rest.js';
Api.addRoute('status', {authRequired: false}, {
  get: {
    action: function() {
      const data = { }


      return {"status": "success", "data": data};
    }
  }
});
