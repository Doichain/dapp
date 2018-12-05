import { Api } from '../rest.js';
import {getInfo} from "../../doichain";
Api.addRoute('status', {authRequired: false}, {
  get: {
    action: function() {
      const data = getInfo();
      return {"status": "success", "data": data};
    }
  }
});
