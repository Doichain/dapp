import {chai} from 'meteor/practicalmeteor:chai';
import {
    deleteOptInsFromAliceAndBob,
    generatetoaddress, getBalance, getContainerIdOfName, getDockerStatus, getNewAddress,
    importPrivKey,
    isNodeAlive,
    isNodeAliveAndConnectedToHost
} from "./test-api/test-api-on-node";
import {logBlockchain} from "../imports/startup/server/log-configuration";

const node_url_alice = 'http://172.20.0.6:18332/';
const node_url_bob =   'http://172.20.0.7:18332/';
const rpcAuth = "admin:generated-password";
const privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj";

const log = true;

describe('basic-doi-test-0', function () {
    this.timeout(0);
    before(function(){
        logBlockchain("removing OptIns,Recipients,Senders");
        deleteOptInsFromAliceAndBob();
    });

    it('should create a RegTest Doichain with alice and bob and some Doi - coins', function (done) {
        //connect nodes (alice & bob) and generate DOI (only if not connected)
        importPrivKey(node_url_bob, rpcAuth, privKeyBob, true, false);
        try{
            const aliceContainerId = getContainerIdOfName('alice');
            const statusDocker = JSON.parse(getDockerStatus(aliceContainerId));
            logBlockchain("real balance :"+statusDocker.balance,(Number(statusDocker.balance)>0));
            logBlockchain("connections:"+statusDocker.connections);
            if(Number(statusDocker.balance)>0){
                    logBlockchain("enough founding for alice - blockchain already connected");
                    global.aliceAddress = getNewAddress(node_url_alice, rpcAuth, false);
                    done();
                    return;
            }
        }catch(exception) {
            logBlockchain("connecting blockchain and mining some coins");
        }
        isNodeAlive(node_url_alice, rpcAuth, false);
        isNodeAliveAndConnectedToHost(node_url_bob, rpcAuth, 'alice', false);
        global.aliceAddress = getNewAddress(node_url_alice, rpcAuth, false);
        generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 210);  //110 blocks to new address! 110 blöcke *25 coins
        const aliceBalance = getBalance(node_url_alice, rpcAuth, log);
        chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
        done();
    });
});