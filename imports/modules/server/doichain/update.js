import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { nameDoi } from '../../../../server/api/doichain.js';
import { CONFIRM_CLIENT } from '../../../startup/server/doichain-configuration.js';
import {signMessage} from "../../../../server/api/doichain";
import {API_PATH, DOI_FETCH_ROUTE, VERSION} from "../../../../server/api/rest/rest";
import {CONFIRM_ADDRESS} from "../../../startup/server/doichain-configuration";
import {getHttpGET, getHttpPUT} from "../../../../server/api/http";
import {logConfirm} from "../../../startup/server/log-configuration";

const UpdateSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  value: {
    type: String
  }
});

const update = (data) => {
  try {
    const ourData = data;
    UpdateSchema.validate(ourData);
    const txid = nameDoi(CONFIRM_CLIENT, ourData.nameId, ourData.value, null);
    logConfirm('update transaction txid:',txid);

    const url = ourData.domain+API_PATH+VERSION+"/"+DOI_FETCH_ROUTE;
    const signature = signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, ourData.name);

    const updateData = {
        name_id: ourData.name,
        signature: signature
    }

    const response = getHttpPUT(url, updateData);
    logConfirm('informed send dApp about confirmed doi on url:'+url+' with updateData'+JSON.stringify(updateData)+" response:",response);

  } catch(exception) {
    throw new Meteor.Error('doichain.update.exception', exception);
  }
};

export default update;
