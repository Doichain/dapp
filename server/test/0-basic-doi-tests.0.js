import {chai} from 'meteor/practicalmeteor:chai';
import {
    deleteOptInsFromAliceAndBob, getBalance, initBlockchain
} from "./test-api/test-api-on-node";

import {logBlockchain} from "../../imports/startup/server/log-configuration";
const node_url_alice = 'http://172.20.0.6:18332/';
const node_url_bob =   'http://172.20.0.7:18332/';
const rpcAuth = "admin:generated-password";
const privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj";
const log = true;

if(Meteor.isAppTest) {
    describe('basic-doi-test-0', function () {
        this.timeout(0);

        before(function () {
            logBlockchain("removing OptIns,Recipients,Senders");
            deleteOptInsFromAliceAndBob();
        });

        it('should create a RegTest Doichain with alice and bob and some Doi - coins', function () {
            initBlockchain(node_url_alice,node_url_bob,rpcAuth,privKeyBob,true);
            const aliceBalance = getBalance(node_url_alice, rpcAuth, log);
            chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
        });
    });
}
