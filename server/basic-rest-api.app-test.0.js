import {chai} from 'meteor/practicalmeteor:chai';
//import { resetDatabase } from 'meteor/xolvio:cleaner';
import { getHttpPOST} from "./api/http";
import {OptIns} from "../imports/api/opt-ins/opt-ins";
import {logBlockchain} from "../imports/startup/server/log-configuration";

/*
    Meteor-Testing: http://khaidoan.wikidot.com/meteor-testing
    SinonJS: https://sinonjs.org/releases/v6.1.4/fake-timers/
    Chaijs: http://www.chaijs.com/guide/styles/#assert
    Jest: (for React) https://www.hammerlab.org/2015/02/14/testing-react-web-apps-with-mocha/
    Circle-Ci: https://circleci.com/docs/2.0/building-docker-images/
 */
const node_url_alice = 'http://localhost:18543/';
const node_url_bob = 'http://localhost:18544/';
const dapp_url_alice = 'http://localhost:3000';
//const dapp_url_bob = 'http://localhost:3001';
describe('alice-basic-doi-test', function () {
    this.timeout(20000);

    it('should check if alice is alive', function(done){

        const url = node_url_alice;
        const auth = "admin:generated-password";

        const dataGetNetworkInfo = {"jsonrpc": "1.0", "id":"getnetworkinfo", "method": "getnetworkinfo", "params": [] };
        const headersGetNetworkInfo = { 'Content-Type':'text/plain'  };

        const realdataGetNetworkInfo = { auth: auth, data: dataGetNetworkInfo, headers: headersGetNetworkInfo };
        const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
        const statusGetNetworkInfo = resultGetNetworkInfo.statusCode;
        chai.assert.equal(200, statusGetNetworkInfo);
        logBlockchain('resultGetNetworkInfo:',resultGetNetworkInfo); // getnetworkinfo | jq '.localaddresses[0].address'

        done();
    });

    it('should check if bob is alive and connected to alice', function(done){

        const url = node_url_bob;
        const auth = "admin:generated-password";

        const dataGetNetworkInfo = {"jsonrpc": "1.0", "id":"getnetworkinfo", "method": "getnetworkinfo", "params": [] };
        const headersGetNetworkInfo = { 'Content-Type':'text/plain'  };

        const realdataGetNetworkInfo = { auth: auth, data: dataGetNetworkInfo, headers: headersGetNetworkInfo };
        const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
        const statusGetNetworkInfo = resultGetNetworkInfo.statusCode;
        chai.assert.equal(200, statusGetNetworkInfo);
        logBlockchain('resultGetNetworkInfo:',resultGetNetworkInfo);

        const dataGetPeerInfo = {"jsonrpc": "1.0", "id":"getpeerinfo", "method": "getpeerinfo", "params": [] };
        const headersGetPeerInfo = { 'Content-Type':'text/plain'  };

        const realdataGetPeerInfo = { auth: auth, data: dataGetPeerInfo, headers: headersGetPeerInfo };
        const resultGetPeerInfo = getHttpPOST(url, realdataGetPeerInfo);
        const statusGetPeerInfo = resultGetPeerInfo.statusCode;
        chai.assert.equal(200, statusGetPeerInfo);
        chai.expect(resultGetPeerInfo.data.result).to.have.lengthOf(1);
        logBlockchain('resultGetPeerInfo:',resultGetPeerInfo);

        done();
    });

    it('should generate some coins into this regtest wallet.', function (done) {
        //resetDatabase();

        const url = node_url_alice;
        const auth = "admin:generated-password";

        //1. getnewaddress
        const dataGetNewAddress = {"jsonrpc": "1.0", "id":"getnewaddress", "method": "getnewaddress", "params": [] };
        const headersGetNewAddress = { 'Content-Type':'text/plain'  };

        const realdataGetNewAddress = { auth: auth, data: dataGetNewAddress, headers: headersGetNewAddress };
        const resultGetNewAddress = getHttpPOST(url, realdataGetNewAddress);
        const statusOptInGetNewAddress = resultGetNewAddress.statusCode;
        const newAddress  = resultGetNewAddress.data.result;
        chai.assert.equal(200, statusOptInGetNewAddress);
        chai.expect(resultGetNewAddress.data.error).to.be.null;
        chai.expect(newAddress).to.not.be.null;

        //2. generatetoaddress nblocks address
        logBlockchain('resultGetNewAddress.result:',newAddress);
        const dataGenerate = {"jsonrpc": "1.0", "id":"generatetoaddress", "method": "generatetoaddress", "params": [110,newAddress] };
        const headersGenerates = { 'Content-Type':'text/plain'  };
        const realdataGenerate = { auth: auth, data: dataGenerate, headers: headersGenerates };
        const resultGenerate = getHttpPOST(url, realdataGenerate);
        logBlockchain('resultGenerate:',resultGenerate);
        const statusResultGenerate = resultGenerate.statusCode;
        chai.assert.equal(200, statusResultGenerate);
        chai.expect(resultGenerate.data.error).to.be.null;
        chai.expect(resultGenerate.data.result).to.not.be.null;
        //chai.should.exist(resultGenerate.data.result);
        done();
    });


    it('should have a balance bigger then 0 in the doichain wallet', function (done) {
        //curl --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getbalance", "params": ["*", 6] }' -H 'content-type: text/plain;' http://127.0.0.1:18339
        const urlGetBalance = node_url_alice;
        const dataGetBalance = {"jsonrpc": "1.0", "id":"getbalance", "method": "getbalance", "params": [] };
        const headersGetBalance = { 'Content-Type':'text/plain'  };
        const auth = "admin:generated-password";
        //curl -X POST -H 'X-User-Id: a7Rzs7KdNmGwj64Eq' -H 'X-Auth-Token: Y1z8vzJMo1qqLjr1pxZV8m0vKESSUxmRvbEBLAe8FV3' -i 'http://SEND_DAPP_HOST:3000/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org'
        const realdataGetBalance = { auth: auth, data: dataGetBalance, headers: headersGetBalance };
        const resultGetBalance = getHttpPOST(urlGetBalance, realdataGetBalance);
        //console.log(resultGetBalance.data.result);
        logBlockchain('resultGetBalance:',resultGetBalance);
        chai.assert.isAbove(resultGetBalance.data.result, 0, 'no funding! ');
        done();
    });

    it('should request a DOI on alice for peter and should be forwarded to bob (general fallback server)', function (done) {

        //https://docs.meteor.com/api/http.html
        //curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"password"}' http://localhost:3000/api/v1/login
        const urlLogin = dapp_url_alice+'/api/v1/login';
        const paramsLogin = {"username":"admin","password":"password"};
        const headersLogin = [{'Content-Type':'application/json'}];
        const realDataLogin= { params: paramsLogin, headers: headersLogin };

        const result = getHttpPOST(urlLogin, realDataLogin);
        const statusCode = result.statusCode;
        const data = result.data;

        const status = data.status;
        const authToken = data.data.authToken;
        const userId = data.data.userId;

        chai.assert.equal(200, statusCode);
        chai.assert.equal('success', status);

        const urlOptIn = dapp_url_alice+'/api/v1/opt-in';
        const dataOptIn = {"recipient_mail":"alice@ci-doichain.org","sender_mail":"bob@ci-doichain.org","data":JSON.stringify({'city':'Ekaterinburg'})};
        const headersOptIn = {
            'Content-Type':'application/json',
            'X-User-Id':userId,
            'X-Auth-Token':authToken
        };
        logBlockchain('before timeout:',new Date());

        // ...
        //https://docs.meteor.com/api/http.html
        //curl -X POST -H 'X-User-Id: a7Rzs7KdNmGwj64Eq' -H 'X-Auth-Token: Y1z8vzJMo1qqLjr1pxZV8m0vKESSUxmRvbEBLAe8FV3' -i 'http://SEND_DAPP_HOST:3000/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org'

        const realDataOptin = { data: dataOptIn, headers: headersOptIn };
        const resultOptIn = getHttpPOST(urlOptIn, realDataOptin);

        const statusCodeOptIn = result.statusCode;
        const resultDataOptIn = resultOptIn.data;

        logBlockchain('resultDataOptIn:',resultDataOptIn);
       // setTimeout(done, 300);
        setTimeout(

            Meteor.bindEnvironment(function () {

            logBlockchain('after timeout:',new Date());
            const our_optIn = OptIns.findOne({_id: resultDataOptIn.data.id});
            logBlockchain('foundDataOptIn:',our_optIn);
            const statusOptIn = resultDataOptIn.status;

            chai.assert.equal(200, statusCodeOptIn);
            chai.assert.equal('success', statusOptIn);
            chai.assert.equal(our_optIn._id,resultDataOptIn.data.id);
            //now check the blockchain with list transactions and find transaction with this
            //const nameId = resultDataOptIn.data.id;
            const txId = our_optIn.txId;
            logBlockchain('txId:', our_optIn.txId);
            const urlGetRawTransaction = node_url_alice;
            const dataGetRawTransaction = {"jsonrpc": "1.0", "id":"getrawtransaction", "method": "getrawtransaction", "params": [txId,1] };
            const headersGetRawTransaction = { 'Content-Type':'text/plain'  };
            const auth = "admin:generated-password";

            const realdataGetRawTransaction = { auth: auth, data: dataGetRawTransaction, headers: headersGetRawTransaction };
            const resultGetRawTransaction = getHttpPOST(urlGetRawTransaction, realdataGetRawTransaction);
            logBlockchain('resultGetRawTransaction:',resultGetRawTransaction);
            if(resultGetRawTransaction.data.result.vout[1].scriptPubKey.nameOp!==undefined){
                chai.assert.equal("e/"+our_optIn.nameId, resultGetRawTransaction.data.result.vout[1].scriptPubKey.nameOp.name);
            }
            else{
                chai.assert.equal("e/"+our_optIn.nameId, resultGetRawTransaction.data.result.vout[0].scriptPubKey.nameOp.name);
            }

            //alice is not querying the dns and finds out bobs public key where to send the nameId

            //we assume the name_doi reached bob's node -
            // so we connect to bob's node via rpc an check if this transaction is there too
           /* const urlBobGetRawTransaction = 'http://localhost:18444/';
            const resultBobGetRawTransaction = getHttpPOST(urlBobGetRawTransaction, realdataGetRawTransaction);
            logBlockchain('resultBobGetRawTransaction:',resultBobGetRawTransaction);
            chai.assert.equal(our_optIn.nameId, resultBobGetRawTransaction.data.result.vout[0].scriptPubKey.name);
*/
            done();



            }), 5000); //timeout needed because it takes a moment to store the entry in the blockchain through meteor job collection


    })

});

describe('bob-basic-doi-test', function () {
    this.timeout(20000);


    it('imports bob´s private key in order to see HIS transactions', function (done) {
        const url_importprivkey = node_url_bob;
        const data_importprivkey = {"jsonrpc": "1.0", "id":"importprivkey", "method": "importprivkey", "params": ["cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj", "jenkins testing privkey don't use anywhere", true] };
        const headers_importprivkey = { 'Content-Type':'text/plain'  };
        const auth = "admin:generated-password";
        //curl -X POST -H 'X-User-Id: a7Rzs7KdNmGwj64Eq' -H 'X-Auth-Token: Y1z8vzJMo1qqLjr1pxZV8m0vKESSUxmRvbEBLAe8FV3' -i 'http://SEND_DAPP_HOST:3000/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org'
        const realdata_importprivkey = { auth: auth, data: data_importprivkey, headers: headers_importprivkey };
        const result = getHttpPOST(url_importprivkey, realdata_importprivkey);
        logBlockchain('result:',result);
        done();
    });

    it('should list all transactions and check if our SOI is inside', function (done) {

        const urlListTransactions = node_url_bob;
        const dataListTransactions = {"jsonrpc": "1.0", "id":"listtransactions", "method": "listtransactions", "params": ["",100] };
        const headersListTransaction = { 'Content-Type':'text/plain'  };
        const auth = "admin:generated-password";
        const realdataListTransactions = { auth: auth, data: dataListTransactions, headers: headersListTransaction };
        const result = getHttpPOST(urlListTransactions, realdataListTransactions);
        logBlockchain('result:',result);

     /*   var json = JSON.stringify(eval("(" + resultListTransactions + ")")); //
        var newArray = JSON.parse(json).filter(function (el) {
            return el.name === "doi: e/"+nameId;
        });
        logBlockchain('newArray:',newArray);
        chai.expect(newArray).to.deep.include({name: "doi: e/"+nameId});*/
        done();

    });
});