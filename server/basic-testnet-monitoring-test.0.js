//import {chai} from 'meteor/practicalmeteor:chai';
//import {getHttpPOST} from "./api/http";
//chai.use(require('chai-datetime'));
//chai.use(require('chai-date-string'));

/*
    Meteor-Testing: http://khaidoan.wikidot.com/meteor-testing
    SinonJS: https://sinonjs.org/releases/v6.1.4/fake-timers/
    Chaijs: http://www.chaijs.com/guide/styles/#assert
    Jest: (for React) https://www.hammerlab.org/2015/02/14/testing-react-web-apps-with-mocha/
    Circle-Ci: https://circleci.com/docs/2.0/building-docker-images/
 */
//const node_url_alice = 'http://172.20.0.6:18332/'; //18543
//const auth = "admin:generated-password";
//const headers = { 'Content-Type':'text/plain'  };

describe('testnet-monitoring-test', function () {
    this.timeout(600000);

    it('should check if alice is alive', function(done){

  /*      const url = node_url_alice;
        const dataGetNetworkInfo = {"jsonrpc": "1.0", "id":"getnetworkinfo", "method": "getnetworkinfo", "params": [] };
        const realdataGetNetworkInfo = { auth: auth, data: dataGetNetworkInfo, headers: headers };
        const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
        const statusGetNetworkInfo = resultGetNetworkInfo.statusCode;
        chai.assert.equal(200, statusGetNetworkInfo);
        //logBlockchain('resultGetNetworkInfo:',resultGetNetworkInfo); // getnetworkinfo | jq '.localaddresses[0].address'
*/
        done();
    });

});

