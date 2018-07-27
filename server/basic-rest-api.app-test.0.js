import {chai} from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import {getHttpPOST} from "./api/http";


/*
    Circle-Ci: https://circleci.com/docs/2.0/building-docker-images/

    Chaijs: http://www.chaijs.com/guide/styles/#assert
    Jest: (for React) https://www.hammerlab.org/2015/02/14/testing-react-web-apps-with-mocha/
 */
describe('basic-rest-api-app-test', function () {

    beforeEach(function () {
       resetDatabase();
    });

    it('should authenticate on the REST-API with the default admin user', function (done) {
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

        //console.log('authToken',authToken);
        //console.log('userId',userId);

        chai.assert.equal(200, statusCode);
        chai.assert.equal('success', status);

        const urlOptIn = 'http://localhost:3000/api/v1/opt-in';
        const dataOptIn = {"recipient_mail":"nico@le-space.de","sender_mail":"info@doichain.org","data":"special-data"};
        const headersOptIn = {
            'Content-Type':'application/json',
            'X-User-Id':userId,
            'X-Auth-Token':authToken
        };

        //curl -X POST -H 'X-User-Id: a7Rzs7KdNmGwj64Eq' -H 'X-Auth-Token: Y1z8vzJMo1qqLjr1pxZV8m0vKESSUxmRvbEBLAe8FV3' -i 'http://SEND_DAPP_HOST:3000/api/v1/opt-in?recipient_mail=<your-customer-email@example.com>&sender_mail=info@doichain.org'
        const realDataOptin = { data: dataOptIn, headers: headersOptIn };
        const resultOptIn = getHttpPOST(urlOptIn, realDataOptin);
        //console.log(JSON.stringify(resultOptIn));

        const statusCodeOptIn = result.statusCode;
        //console.log('statusCode',statusCodeOptIn);
        const resultDataOptIn = resultOptIn.data;
        //console.log('data',resultDataOptIn);
        const statusOptIn = resultDataOptIn.status;
        chai.assert.equal(200, statusCodeOptIn);
        chai.assert.equal('success', statusOptIn);

        done();
    })
})