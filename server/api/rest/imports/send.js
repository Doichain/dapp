import { Api, DOI_FETCH_ROUTE, DOI_CONFIRMATION_NOTIFY_ROUTE } from '../rest.js';
import addOptIn from '../../../../imports/modules/server/opt-ins/add_and_write_to_blockchain.js';
import updateOptInStatus from '../../../../imports/modules/server/opt-ins/update_status.js';
import getDoiMailData from '../../../../imports/modules/server/dapps/get_doi-mail-data.js';
import {logError, logSend} from "../../../../imports/startup/server/log-configuration";
import {DOI_EXPORT_ROUTE} from "../rest";
import exportDois from "../../../../imports/modules/server/dapps/export_dois";
import {OptIns} from "../../../../imports/api/opt-ins/opt-ins";
import {Roles} from "meteor/alanning:roles";

//doku of meteor-restivus https://github.com/kahmali/meteor-restivus

Api.addRoute(DOI_CONFIRMATION_NOTIFY_ROUTE, {
  post: {
    authRequired: true,
    //roleRequired: ['admin'],
    action: function() {
      const qParams = this.queryParams;
      const bParams = this.bodyParams;
      let params = {}
      if(qParams !== undefined) params = {...qParams}
      if(bParams !== undefined) params = {...params, ...bParams}
      const uid = this.userId;
      if(!Roles.userIsInRole(uid, 'admin')){
        params["ownerID"]=uid;
      }
      logSend('params:',params);
      if(params.sender_mail.constructor === Array){ //this is a SOI with co-sponsors first email is main sponsor
          return prepareCoDOI(params);
      }else{
         return prepareAdd(params);
      }
    }
  },
  put: {
    authRequired: false,
    action: function() {
      const qParams = this.queryParams;
      const bParams = this.bodyParams;

      logSend('qParams:',qParams);
      logSend('bParams:',bParams);

      let params = {}
      if(qParams !== undefined) params = {...qParams}
      if(bParams !== undefined) params = {...params, ...bParams}
      try {
        const val = updateOptInStatus(params);
        logSend('opt-In status updated',val);
        return {status: 'success', data: {message: 'Opt-In status updated'}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});

Api.addRoute(DOI_FETCH_ROUTE, {authRequired: false}, {
  get: {
    action: function() {
      const params = this.queryParams;
      try {
          logSend('rest api - DOI_FETCH_ROUTE called',JSON.stringify(params));
          const data = getDoiMailData(params);
          logSend('got doi mail data',data);
        return {status: 'success', data};
      } catch(error) {
        logError('error while getting DoiMailData',error);
        return {status: 'fail', error: error.message};
      }
    }
  }
});

Api.addRoute(DOI_EXPORT_ROUTE, {
    get: {
        authRequired: true,
        //roleRequired: ['admin'],
        action: function() {
            let params = this.queryParams;
            const uid = this.userId;
            if(!Roles.userIsInRole(uid, 'admin')){
                params = {userid:uid,role:'user'};
            }
            else{
                params = {...params,role:'admin'}
            }
            try {
                logSend('rest api - DOI_EXPORT_ROUTE called',JSON.stringify(params));
                const data = exportDois(params);
                logSend('got dois from database',JSON.stringify(data));
                return {status: 'success', data};
            } catch(error) {
                logError('error while exporting confirmed dois',error);
                return {status: 'fail', error: error.message};
            }
        }
    }
});

function prepareCoDOI(params){

    logSend('is array ',params.sender_mail);

    const senders = params.sender_mail;
    const recipient_mail = params.recipient_mail;
    const data = params.data;
    const ownerID = params.ownerID;

    let currentOptInId;
    let retResponse = [];
    let master_doi;
    senders.forEach((sender,index) => {

        const ret_response = prepareAdd({sender_mail:sender,recipient_mail:recipient_mail,data:data, master_doi:master_doi, index: index, ownerID:ownerID});
        logSend('CoDOI:',ret_response);
        if(ret_response.status === undefined || ret_response.status==="failed") throw "could not add co-opt-in";
        retResponse.push(ret_response);
        currentOptInId = ret_response.data.id;

        if(index===0)
        {
            logSend('main sponsor optInId:',currentOptInId);
            const optIn = OptIns.findOne({_id: currentOptInId});
            master_doi = optIn.nameId;
            logSend('main sponsor nameId:',master_doi);
        }

    });

    logSend(retResponse);

    return retResponse;
}
function prepareAdd(params){

    try {
        const val = addOptIn(params);
        logSend('opt-In added ID:',val);
        return {status: 'success', data: {id: val, status: 'success', message: 'Opt-In added.'}};
    } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
    }

}