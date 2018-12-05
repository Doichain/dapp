import { Api } from '../rest.js';
import {getInfo} from "../../doichain";
import { CONFIRM_CLIENT} from "../../../../imports/startup/server/doichain-configuration";

Api.addRoute('status', {authRequired: false}, {
  get: {
    action: function() {
      const data = getInfo(CONFIRM_CLIENT);
      return {"status": "success", "data": data};
    }
  }
});
