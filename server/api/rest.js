import addOptIn from '../../imports/modules/server/opt-ins/add.js'
import confirmOptIn from '../../imports/modules/server/opt-ins/confirm.js'

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
      const params = this.queryParams;
      try {
        const val = addOptIn(params);
        return {status: 'success', data: {message: 'Opt-In added. ID: '+val}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});

Api.addRoute('opt-in/confirm/:hash', {authRequired: false}, {
  get: {
    action: function() {
      const hash = this.urlParams.hash;
      try {
        const ip = this.request.headers['x-forwarded-for'] ||
          this.request.connection.remoteAddress ||
          this.request.socket.remoteAddress ||
          (this.request.connection.socket ? this.request.connection.socket.remoteAddress: null);
        confirmOptIn({ip: ip, hash: hash})
        return {status: 'success', data: {message: 'Confirmation successful'}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});

/*
import getSignature from "../../imports/modules/server/namecoin/get_signature.js"
import verifySignature from "../../imports/modules/server/namecoin/verify_signature.js"
import addInsertBlockchainJob from "../../imports/modules/server/jobs/add_insert_blockchain.js"
Api.addRoute('test', {authRequired: false}, {
  get: {
    action: function() {
      try {
        const sig = getSignature({
          email: "dustin.hoffmann@icloud.com",
          privateKey: "5C995E7AD48AC5CD57D0DD3219AD1DE644A83CEA5E43E92AEC0A67D8FF239F60"
        });
        const validation = verifySignature({
          email: "dustin.hoffmann@icloud.com",
          publicKey: "0217415385243465E21C7BBEB1DEFF922171A841EDCF070CB1C772AFB6C7517A86",
          signature: sig
        });
        const validation2 = verifySignature({
          email: "dustin.hoffmann@icloud.coms",
          publicKey: "0217415385243465E21C7BBEB1DEFF922171A841EDCF070CB1C772AFB6C7517A86",
          signature: sig
        });
        console.log(sig, validation, validation2);
        return {status: 'success', data: {message: 'Test successful'}};
      } catch(error) {
        return {statusCode: 500, body: {status: 'fail', message: error.message}};
      }
    }
  }
});
*/
