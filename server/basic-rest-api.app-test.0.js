import {chai} from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { getHttpPOST} from "./api/http";
import {OptIns} from "../imports/api/opt-ins/opt-ins";
//import {nameShow} from "./api/doichain";
//import {getRawTransaction} from "./api/doichain";
/*
    Circle-Ci: https://circleci.com/docs/2.0/building-docker-images/

    Chaijs: http://www.chaijs.com/guide/styles/#assert
    Jest: (for React) https://www.hammerlab.org/2015/02/14/testing-react-web-apps-with-mocha/
 */
describe('basic-rest-api-app-test', function () {

    beforeEach(function () {

    });

    it('should request a DOI on alice for peter and should be forwarded to bob (genereal fallback server)', function (done) {
        resetDatabase();
        //https://docs.meteor.com/api/http.html
        //curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"password"}' http://localhost:3000/api/v1/login
        const urlLogin = 'http://localhost:3000/api/v1/login';
        const paramsLogin = {"username":"admin","password":"password"};
        const headersLogin = [{'Content-Type':'application/json'}];
        const realDataLogin= { params: paramsLogin, headers: headersLogin };
        //console.log(realDataLogin);
        const result = getHttpPOST(urlLogin, realDataLogin);
        const statusCode = result.statusCode;
        const data = result.data;

        const status = data.status;
        const authToken = data.data.authToken;
        const userId = data.data.userId;

        chai.assert.equal(200, statusCode);
        chai.assert.equal('success', status);

        const urlOptIn = 'http://localhost:3000/api/v1/opt-in';
        const dataOptIn = {"recipient_mail":"nico@le-space.de","sender_mail":"info@doichain.org","data":JSON.stringify({'city':'Ekaterinburg'})};
        const headersOptIn = {
            'Content-Type':'application/json',
            'X-User-Id':userId,
            'X-Auth-Token':authToken
        };

        //https://docs.meteor.com/api/http.html
        //curl -X POST -H 'X-User-Id: a7Rzs7KdNmGwj64Eq' -H 'X-Auth-Token: Y1z8vzJMo1qqLjr1pxZV8m0vKESSUxmRvbEBLAe8FV3' -i 'http://SEND_DAPP_HOST:3000/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org'
        const realDataOptin = { data: dataOptIn, headers: headersOptIn };
        const resultOptIn = getHttpPOST(urlOptIn, realDataOptin);
        //console.log(JSON.stringify(resultOptIn));

        const statusCodeOptIn = result.statusCode;
        const resultDataOptIn = resultOptIn.data;
        const our_optIn = OptIns.findOne({_id: resultDataOptIn.data.id});
        const statusOptIn = resultDataOptIn.status;

        chai.assert.equal(200, statusCodeOptIn);
        chai.assert.equal('success', statusOptIn);
        chai.assert.equal(our_optIn._id,resultDataOptIn.data.id);
        //now check the blockchain with list transactions and find transaction with this

        done();
    })

    it('should generate some coins into this regtest wallet.', function (done) {
        const url = 'http://localhost:18443/';
        const auth = "admin:generated-password";

        //1. getnewaddress
        const dataGetNewAddress = {"jsonrpc": "1.0", "id":"curltest", "method": "getnewaddress" };
        const headersGetNewAddress = { 'Content-Type':'text/plain'  };

        //curl -X POST -H 'X-User-Id: a7Rzs7KdNmGwj64Eq' -H 'X-Auth-Token: Y1z8vzJMo1qqLjr1pxZV8m0vKESSUxmRvbEBLAe8FV3' -i 'http://SEND_DAPP_HOST:3000/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org'
        const realdataGetNewAddress = { auth: auth, data: dataGetNewAddress, headers: headersGetNewAddress };
        const resultGetNewAddress = getHttpPOST(url, realdataGetNewAddress);
        chai.expect(resultGetNewAddress.error).to.be.undefined;
        chai.expect(resultGetNewAddress.result).to.not.be.null;
        //chai.should.not.exist(resultGetNewAddress.error);
        //chai.should.exist(resultGetNewAddress.result);

        //const newAddress = resultGetNewAddress.result;

        //2. generatetoaddress nblocks address
        const dataGenerate = {"jsonrpc": "1.0", "id":"curltest", "method": "generatetoaddress", "params": [11,resultGetNewAddress.result] };
        const headersGenerates = { 'Content-Type':'text/plain'  };
        const realdataGenerate = { auth: auth, data: dataGenerate, headers: headersGenerates };
        const resultGenerate = getHttpPOST(url, realdataGenerate);
        chai.expect(resultGenerate.error).to.be.undefined;
        chai.should.exist(resultGenerate.result);
        done();
    });


    it('should have a balance bigger then 0 in the doichain wallet', function (done) {
        //check funding
        //curl --user admin:generated-password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getbalance", "params": ["*", 6] }' -H 'content-type: text/plain;' http://127.0.0.1:18339
        const urlGetBalance = 'http://localhost:18443/';
        const dataGetBalance = {"jsonrpc": "1.0", "id":"curltest", "method": "getbalance", "params": ["*", 6] };
        const headersGetBalance = { 'Content-Type':'text/plain'  };
        const auth = "admin:generated-password";
        //curl -X POST -H 'X-User-Id: a7Rzs7KdNmGwj64Eq' -H 'X-Auth-Token: Y1z8vzJMo1qqLjr1pxZV8m0vKESSUxmRvbEBLAe8FV3' -i 'http://SEND_DAPP_HOST:3000/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org'
        const realdataGetBalance = { auth: auth, data: dataGetBalance, headers: headersGetBalance };
        const resultGetBalance = getHttpPOST(urlGetBalance, realdataGetBalance);
        //console.log(resultGetBalance.data.result);
        chai.assert.isAbove(resultGetBalance.data.result, 0, 'no funding! ');

        done();
});

})