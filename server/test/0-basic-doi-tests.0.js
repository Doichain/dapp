import {chai} from 'meteor/practicalmeteor:chai';
import {
    deleteOptInsFromAliceAndBob, getBalance, initBlockchain
} from "./test-api/test-api-on-node";
import {testLog} from "meteor/doichain:doichain-meteor-api";
import {regtest} from "meteor/doichain:doichain-meteor-api";
global.inside_docker = false;

const log = true;
const dns = require('dns');

if(regtest){
    dns.setServers([
        '127.0.0.1',
    ]); //we use our own dns in order to resolve the ci-doichain.org test domain including its TXT entry
}

if(Meteor.isAppTest) {
    global.node_url_alice = 'http://172.20.0.6:18332/';
    if(!global.inside_docker) global.node_url_alice = 'http://localhost:18543/';
    global.node_url_bob =   'http://172.20.0.7:18332/';
    if(!global.inside_docker) global.node_url_bob = 'http://localhost:18544/';
    global.rpcAuthAlice = "admin:generated-password";
    global.rpcAuth = "admin:generated-password";

    global.privKeyAlice = "cNEuvnaPVkW7Xp3JS49k9aSqMBe4LSyws3aq1KvCU1utSDLtT9Dj";
    global.privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj"; //validator

    global.dappUrlAlice = "http://localhost:3000";
    global.dappUrlBob = global.inside_docker?"http://172.20.0.8:4000":"http://localhost:4000";
    global.dAppLogin = {"username":"admin","password":"password"};

    describe('basic-doi-test-0', function () {
        this.timeout(0);

        before(function () {
            testLog("removing OptIns,Recipients,Senders",'');
            deleteOptInsFromAliceAndBob();
        });

        it.only('should create a RegTest Doichain with alice and bob and some Doi - coins', function () {
            initBlockchain(global.node_url_alice,global.node_url_bob,global.rpcAuth,global.privKeyAlice,global.privKeyBob,true);
            const aliceBalance = getBalance(global.node_url_alice, global.rpcAuth, log);
            chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
        });
    });
}
