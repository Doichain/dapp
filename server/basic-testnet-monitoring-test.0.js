import {chai} from 'meteor/practicalmeteor:chai';
chai.use(require('chai-datetime'));
chai.use(require('chai-date-string'));



describe('testnet-monitoring-test', function () {
    this.timeout(600000);

    it('should check if alice is alive', function(done){
/*
        const url = node_url_alice;
        const dataGetNetworkInfo = {"jsonrpc": "1.0", "id":"getnetworkinfo", "method": "getnetworkinfo", "params": [] };
        const realdataGetNetworkInfo = { auth: auth, data: dataGetNetworkInfo, headers: headers };
        const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
        const statusGetNetworkInfo = resultGetNetworkInfo.statusCode;
        chai.assert.equal(200, statusGetNetworkInfo);
        //logBlockchain('resultGetNetworkInfo:',resultGetNetworkInfo); // getnetworkinfo | jq '.localaddresses[0].address' */
        done();
    });

});
