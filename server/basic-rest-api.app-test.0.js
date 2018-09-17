import {chai} from 'meteor/practicalmeteor:chai';
import {getHttpPOST, getHttpGET, getHttpGETdata} from "./api/http";
import {OptIns} from "../imports/api/opt-ins/opt-ins";
import { Recipients } from '../imports/api/recipients/recipients.js';
import {logBlockchain} from "../imports/startup/server/log-configuration";
import { quotedPrintableDecode} from 'emailjs-mime-codec'
var POP3Client = require("poplib");
chai.use(require('chai-datetime'));
chai.use(require('chai-date-string'));

/*
    Meteor-Testing: http://khaidoan.wikidot.com/meteor-testing
    SinonJS: https://sinonjs.org/releases/v6.1.4/fake-timers/
    Chaijs: http://www.chaijs.com/guide/styles/#assert
    Jest: (for React) https://www.hammerlab.org/2015/02/14/testing-react-web-apps-with-mocha/
    Circle-Ci: https://circleci.com/docs/2.0/building-docker-images/
 */

const node_url_alice = 'http://172.20.0.6:18332/'; //18543
const node_url_bob =   'http://172.20.0.7:18332/'; //18544
const dapp_url_alice = 'http://localhost:3000';
const auth = "admin:generated-password";
const headers = { 'Content-Type':'text/plain'  };

let aliceAddress, doiConfirmlink, txid, nameId,authToken,userId = "";
const sender_mail = "alice@ci-doichain.org";
const recipient_mail = "bob@ci-doichain.org";


describe('alice-basic-doi-test', function () {
    this.timeout(600000);

    it('should check if alice is alive', function(done){

        const url = node_url_alice;
        const dataGetNetworkInfo = {"jsonrpc": "1.0", "id":"getnetworkinfo", "method": "getnetworkinfo", "params": [] };
        const realdataGetNetworkInfo = { auth: auth, data: dataGetNetworkInfo, headers: headers };
        const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
        const statusGetNetworkInfo = resultGetNetworkInfo.statusCode;
        chai.assert.equal(200, statusGetNetworkInfo);
        //logBlockchain('resultGetNetworkInfo:',resultGetNetworkInfo); // getnetworkinfo | jq '.localaddresses[0].address'

        done();
    });

    it('should check if bob is alive and connected to alice', function(done){

        const url = node_url_bob;
        const dataGetNetworkInfo = {"jsonrpc": "1.0", "id":"addnode", "method": "addnode", "params": ['alice','onetry'] };
        const realdataGetNetworkInfo = { auth: auth, data: dataGetNetworkInfo, headers: headers };
        const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
        const statusGetNetworkInfo = resultGetNetworkInfo.statusCode;
        chai.assert.equal(200, statusGetNetworkInfo);
        //logBlockchain('resultGetNetworkInfo:',resultGetNetworkInfo);

        const dataGetPeerInfo = {"jsonrpc": "1.0", "id":"getpeerinfo", "method": "getpeerinfo", "params": [] };
        const realdataGetPeerInfo = { auth: auth, data: dataGetPeerInfo, headers: headers };
        const resultGetPeerInfo = getHttpPOST(url, realdataGetPeerInfo);
        const statusGetPeerInfo = resultGetPeerInfo.statusCode;
        chai.assert.equal(200, statusGetPeerInfo);
        chai.expect(resultGetPeerInfo.data.result).to.have.lengthOf(1);
        //logBlockchain('resultGetPeerInfo:',resultGetPeerInfo);

        setTimeout(
            Meteor.bindEnvironment(function () {
                const url_importprivkey = node_url_bob;
                const data_importprivkey = {"jsonrpc": "1.0", "id":"importprivkey", "method": "importprivkey", "params": ["cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj"] };
                const realdata_importprivkey = { auth: auth, data: data_importprivkey, headers: headers };
                getHttpPOST(url_importprivkey, realdata_importprivkey);
                // logBlockchain('result:',result);
                done();
            }), 10000);
    });

    it('should generate some coins into this regtest wallet.', function (done) {
        //resetDatabase();

        const url = node_url_alice;

        //1. getnewaddress
        const dataGetNewAddress = {"jsonrpc": "1.0", "id":"getnewaddress", "method": "getnewaddress", "params": [] };
        const realdataGetNewAddress = { auth: auth, data: dataGetNewAddress, headers: headers };
        const resultGetNewAddress = getHttpPOST(url, realdataGetNewAddress);
        const statusOptInGetNewAddress = resultGetNewAddress.statusCode;
        aliceAddress  = resultGetNewAddress.data.result;
        chai.assert.equal(200, statusOptInGetNewAddress);
        chai.expect(resultGetNewAddress.data.error).to.be.null;
        chai.expect(aliceAddress).to.not.be.null;

        generatetoaddress(node_url_alice,aliceAddress,110);  //110 blocke new address! 110 blöcke *25 coins
        //chai.should.exist(resultGenerate.data.result);
        done();
    });

    it('should have a balance bigger then 0 in the doichain wallet', function (done) {
        //curl --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getbalance", "params": ["*", 6] }' -H 'content-type: text/plain;' http://127.0.0.1:18339
        const urlGetBalance = node_url_alice;
        const dataGetBalance = {"jsonrpc": "1.0", "id":"getbalance", "method": "getbalance", "params": [] };
        //curl -X POST -H 'X-User-Id: a7Rzs7KdNmGwj64Eq' -H 'X-Auth-Token: Y1z8vzJMo1qqLjr1pxZV8m0vKESSUxmRvbEBLAe8FV3' -i 'http://SEND_DAPP_HOST:3000/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org'
        const realdataGetBalance = { auth: auth, data: dataGetBalance, headers: headers };
        const resultGetBalance = getHttpPOST(urlGetBalance, realdataGetBalance);
        //console.log(resultGetBalance.data.result);
        //logBlockchain('resultGetBalance:',resultGetBalance);
        chai.assert.isAbove(resultGetBalance.data.result, 0, 'no funding! ');
        done();
    });

    it('should request a DOI on alice for peter and should be forwarded to bob', function (done) {

        //https://docs.meteor.com/api/http.html
        //curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"password"}' http://localhost:3000/api/v1/login
        const urlLogin = dapp_url_alice+'/api/v1/login';
        const paramsLogin = {"username":"admin","password":"password"};
        const headersLogin = [{'Content-Type':'application/json'}];
        const realDataLogin= { params: paramsLogin, headers: headersLogin };

        const result = getHttpPOST(urlLogin, realDataLogin);
        //logBlockchain('result login:',result);
        const statusCode = result.statusCode;
        const data = result.data;

        const status = data.status;
        authToken = data.data.authToken;
        userId = data.data.userId;

        chai.assert.equal(200, statusCode);
        chai.assert.equal('success', status);

        const urlOptIn = dapp_url_alice+'/api/v1/opt-in';
        const dataOptIn = {"recipient_mail":"bob@ci-doichain.org","sender_mail":"alice@ci-doichain.org","data":JSON.stringify({'city':'Ekaterinburg'})};
        const headersOptIn = {
            'Content-Type':'application/json',
            'X-User-Id':userId,
            'X-Auth-Token':authToken
        };

        const realDataOptin = { data: dataOptIn, headers: headersOptIn };
        const resultOptIn = getHttpPOST(urlOptIn, realDataOptin);

        const statusCodeOptIn = result.statusCode;
        const resultDataOptIn = resultOptIn.data;

        //logBlockchain('resultDataOptIn:',resultDataOptIn);

        setTimeout(
            Meteor.bindEnvironment(function () {
            //logBlockchain('after timeout:',new Date());
            const our_optIn = OptIns.findOne({_id: resultDataOptIn.data.id});
            //logBlockchain('foundDataOptIn:',our_optIn);
            const statusOptIn = resultDataOptIn.status;

            chai.assert.equal(200, statusCodeOptIn);
            chai.assert.equal('success', statusOptIn);
            chai.assert.equal(our_optIn._id,resultDataOptIn.data.id);
            //now check the blockchain with list transactions and find transaction with this
            const txId = our_optIn.txId;
            //logBlockchain('txId:', our_optIn.txId);
            const urlGetRawTransaction = node_url_alice;
            const dataGetRawTransaction = {"jsonrpc": "1.0", "id":"getrawtransaction", "method": "getrawtransaction", "params": [txId,1] };
            const realdataGetRawTransaction = { auth: auth, data: dataGetRawTransaction, headers: headers };
            const resultGetRawTransaction = getHttpPOST(urlGetRawTransaction, realdataGetRawTransaction);
            //TODO use the txid of this rawTransaction for the next test since listtransactions doesn't show any unconfirmed transactions.
            logBlockchain('resultGetRawTransaction:',resultGetRawTransaction);

            if(resultGetRawTransaction.data.result.vout[1].scriptPubKey.nameOp!==undefined){
                nameId = resultGetRawTransaction.data.result.vout[1].scriptPubKey.nameOp.name;
                chai.assert.equal("e/"+our_optIn.nameId, nameId);
            }
            else{
                nameId = resultGetRawTransaction.data.result.vout[0].scriptPubKey.nameOp.name;
                chai.assert.equal("e/"+our_optIn.nameId, nameId);
            }

            txid = resultGetRawTransaction.data.result.txid;
            done();
            }), 45000); //timeout needed because it takes a moment to store the entry in the blockchain through meteor job collection
    });

    it('should return raw transactions from alice on bobs node ', function (done) {
        const url = node_url_bob;
        const data = {"jsonrpc": "1.0", "id":"getrawtransaction", "method": "getrawtransaction", "params": [txid,true] };
        const auth = "admin:generated-password";
        const realdata = { auth: auth, data: data, headers: headers };
        const result = getHttpPOST(url, realdata);
        logBlockchain('result:',result); //TODO assert missing! please add!
        done();
    });

   it('should check if a server connects to pop3', function(done){

       logBlockchain("logging bob into pop3 server",'');
       //https://github.com/ditesh/node-poplib/blob/master/demos/retrieve-all.js
       var client = new POP3Client(110, "mail", {
           tlserrs: false,
           enabletls: false,
           debug: true
       });

       //TODO refactor this into a separate function
       client.on("connect", function() {
           logBlockchain("CONNECT success");
           client.login("bob@ci-doichain.org", "bob");
           client.on("login", function(status, rawdata) {
               if (status) {
                   logBlockchain("LOGIN/PASS success");
                   client.list();

                   client.on("list", function(status, msgcount, msgnumber, data, rawdata) {

                       if (status === false) {
                           logBlockchain("LIST failed",'');
                           client.quit();
                           done();

                       } else {
                           logBlockchain("LIST success with " + msgcount + " element(s)",'');

                           chai.expect(msgcount).to.be.above(0, 'no email in bobs inbox');
                           if (msgcount > 0){
                               client.retr(1);
                               client.on("retr", function(status, msgnumber, data, rawdata) {

                                   if (status === true) {
                                       logBlockchain("RETR success " + msgnumber);

                                       //https://github.com/emailjs/emailjs-mime-codec
                                       const alicedapp_url = 'http://172.20.0.8:4000';
                                       const html  = quotedPrintableDecode(data);
                                       doiConfirmlink = html.substring(html.indexOf(alicedapp_url),html.indexOf("'",html.indexOf(alicedapp_url)));
                                       done();

                                   } else {
                                       logBlockchain("RETR failed for msgnumber " + msgnumber);
                                       client.rset();
                                       done();
                                   }
                               });
                           }
                           else{
                               client.quit();
                               done();
                           }
                       }
                   });

               } else {
                   logBlockchain("LOGIN/PASS failed");
                   client.quit();
                   done();
               }
           });
       });
    });

    it('should confirm the link of the doi-request-email on bobs dapp', function(done){

        logBlockchain("clickable link:",doiConfirmlink);
        const doiConfirmlinkResult = getHttpGET(doiConfirmlink,'');
        chai.expect(doiConfirmlinkResult.content).to.have.string('ANMELDUNG ERFOLGREICH');
        chai.expect(doiConfirmlinkResult.content).to.have.string('Vielen Dank für Ihre Anmeldung');
        chai.expect(doiConfirmlinkResult.content).to.have.string('Ihre Anmeldung war erfolgreich.');
        chai.assert.equal(200, doiConfirmlinkResult.statusCode);


        setTimeout(
            Meteor.bindEnvironment(function () {
                logBlockchain('we are waiting a little for the queue doi request to get saved in the blockchain','');
                generatetoaddress(node_url_alice,aliceAddress,1);  //confirms the SOI not the DOI

                setTimeout(
                    Meteor.bindEnvironment(function () {
                        generatetoaddress(node_url_alice,aliceAddress,6); //generate a block so doi signature becomes visible in blockchain
                        done();
                    }), 30000);
            }), 10000);
    });

    it('should check if alice local db has information about a confirmed doi already.', function(done){
        logBlockchain('looking for nameId:',nameId.substring(2));
        const our_optIn = OptIns.findOne({nameId: nameId.substring(2)});
        logBlockchain('optIn:',our_optIn);
        chai.expect(our_optIn.confirmedAt).to.not.be.null;
        chai.expect(our_optIn.confirmedBy).to.not.be.null;
        chai.assert.equal("172.20.0.8", our_optIn.confirmedBy);
       // chai.expect(our_optIn.confirmedAt).withinDate(new Date());
        chai.expect(our_optIn.confirmedAt).to.be.a.dateString();
        done();
    });

    it('should check if bobs node has a new name', function(done){
        const data = {"jsonrpc": "1.0", "id":"name_show", "method": "name_show", "params": [nameId] };
        const headers = { 'Content-Type':'text/plain'  };
        const realdata = { auth: auth, data: data, headers: headers };
        const result = getHttpPOST(node_url_bob, realdata);
        logBlockchain('resultGenerate:',result);
        const status = result.statusCode;
        chai.assert.equal(200, status);
        chai.expect(result.data.error).to.be.null;
        chai.expect(result.data.result).to.not.be.null;
        chai.assert.equal(nameId, result.data.result.name);
        chai.expect(result.data.result.signature).to.not.be.null;
        chai.expect(result.data.result.doiSignature).to.not.be.null;
        done();
    });

    it('should validate the doi verify function of a dApp', function(done){
        generatetoaddress(node_url_alice,aliceAddress,1); //generate a second block so updated nameId (confirmed doi) becomes visible on blockchain

        const url = dapp_url_alice+'/api/v1/opt-in/verify';
        const recipient_public_key = Recipients.findOne({email: recipient_mail}).publicKey;

        const data = {
            recipient_mail: recipient_mail,
            sender_mail: sender_mail,
            name_id: nameId,
            recipient_public_key: recipient_public_key
        };

        const headers = {
            'Content-Type':'application/json',
            'X-User-Id':userId,
            'X-Auth-Token':authToken
        };

        logBlockchain('verifying opt-in:', data);
        const realdata = { data: data, headers: headers };
        const result = getHttpGETdata(url, realdata);

        logBlockchain('result /opt-in/verify:', result);
        const status = result.statusCode;
        chai.assert.equal(200, status);
        chai.assert.equal(true, result.data.data.val);
        done();
    });
});

function generatetoaddress(url,toaddress,amount){
    const dataGenerate = {"jsonrpc": "1.0", "id":"generatetoaddress", "method": "generatetoaddress", "params": [amount,toaddress] };
    const headersGenerates = { 'Content-Type':'text/plain'  };
    const realdataGenerate = { auth: auth, data: dataGenerate, headers: headersGenerates };
    const resultGenerate = getHttpPOST(url, realdataGenerate);
    const statusResultGenerate = resultGenerate.statusCode;
    chai.assert.equal(200, statusResultGenerate);
    chai.expect(resultGenerate.data.error).to.be.null;
    chai.expect(resultGenerate.data.result).to.not.be.null;
}