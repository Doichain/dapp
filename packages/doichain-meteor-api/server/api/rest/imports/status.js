import { Api } from '../rest.js';
import {getInfo} from "../../doichain";
import { CONFIRM_CLIENT,SEND_CLIENT} from "../../../../imports/startup/server/doichain-configuration";

Api.addRoute('status', {authRequired: false}, {
  get: {
    action: function() {
      try {
        const data = getInfo(SEND_CLIENT?SEND_CLIENT:CONFIRM_CLIENT);
        return {"status": "success", "data":data};
      }catch(ex){
            return {"status": "failed", "data": ex.toString()};
      }
    }
  }
});
