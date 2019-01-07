import './server/main.js';
export const name = 'doichain-meteor-api';

import {OptIns} from "./imports/api/opt-ins/opt-ins";
import {Recipients} from "./imports/api/recipients/recipients";
import {getHttpGET, getHttpGETdata, getHttpPOST,getHttpPUT} from "./server/api/http";
import {testLogging} from "./imports/startup/server/log-configuration";

export let OptInsCollection = OptIns;
export let RecipientsCollection = Recipients;
export let httpGET = getHttpGET;
export let httpGETdata = getHttpGETdata;
export let httpPOST = getHttpPOST;
export let httpPUT = getHttpPUT;
export let testLog = testLogging;
export let testvar1="i am alive";