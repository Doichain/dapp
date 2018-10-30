import {chai} from 'meteor/practicalmeteor:chai';
import {
    generatetoaddress, getBalance, getNewAddress,
    importPrivKey,
    isNodeAlive,
    isNodeAliveAndConnectedToHost
} from "./test-api/test-api-on-node";

const node_url_alice = 'http://172.20.0.6:18332/';
const node_url_bob =   'http://172.20.0.7:18332/';
const rpcAuth = "admin:generated-password";
const privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj";

const log = true;


describe('basic-doi-test-setup', function () {
    this.timeout(300000);

    it('should create a RegTest Doichain with alice and bob and some Doi - coins', function (done) {
        //connect nodes (alice & bob) and generate DOI
        isNodeAlive(node_url_alice,rpcAuth,false);
        isNodeAliveAndConnectedToHost(node_url_bob,rpcAuth,'alice',false);
        importPrivKey(node_url_bob,rpcAuth,privKeyBob,true,false);

        global.aliceAddress = getNewAddress(node_url_alice,rpcAuth,false);
        generatetoaddress(node_url_alice,rpcAuth, global.aliceAddress,110);  //110 blocks to new address! 110 blöcke *25 coins

        const aliceBalance = getBalance(node_url_alice,rpcAuth,log);
        chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
        done();
    });
});