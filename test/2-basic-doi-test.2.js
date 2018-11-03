import {Meteor} from "meteor/meteor";
chai.use(require('chai-datetime'));
chai.use(require('chai-date-string'));
import {chai} from 'meteor/practicalmeteor:chai';
import {
    confirmLink,
    fetchConfirmLinkFromPop3Mail,
    getNameIdOfOptInFromRawTx,
    login,
    requestDOI, verifyDOI
} from "./test-api/test-api-on-dapp";

import {logBlockchain} from "../imports/startup/server/log-configuration";
import {
    connectDockerBob,
    doichainAddNode,
    generatetoaddress,
    getDockerStatus, getNewAddress,
    start3rdNode,
    startDockerBob,
    stopDockerBob
} from "./test-api/test-api-on-node";
import {OptIns} from "../imports/api/opt-ins/opt-ins";
import {Recipients} from "../imports/api/recipients/recipients";
import {Senders} from "../imports/api/senders/senders";
const exec = require('child_process').exec;

const node_url_alice = 'http://172.20.0.6:18332/';
const rpcAuth = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {"username":"admin","password":"password"};
const log = true;

describe('basic-doi-test-with-offline-node', function () {
    this.timeout(600000);

    before(function(){
            exec('sudo docker rm 3rd_node', (e, stdout2, stderr2)=> {
                logBlockchain('deleted 3rd_node:',{stdout:stdout2,stderr:stderr2});
            });
            OptIns.remove({});
            Recipients.remove({});
            Senders.remove({});
    });

    after(function(){
        exec('sudo docker stop 3rd_node', (e, stdout, stderr)=> {
            logBlockchain('stopped 3rd_node:',{stdout:stdout,stderr:stderr});
        });
    });

    it('should test if basic Doichain workflow is working when Bobs node is temporarily offline', function(done) {
        global.aliceAddress = getNewAddress(node_url_alice,rpcAuth,false);
        //shutdown Bob
        start3rdNode();
        var containerId = stopDockerBob();
        const recipient_mail = "bob@ci-doichain.org";
        const sender_mail  = "alice-to-offline-node@ci-doichain.org";
        const recipient_pop3username = "bob@ci-doichain.org";
        const recipient_pop3password = "bob";

        //login to dApp & request DOI on alice via bob
        let dataLoginAlice = {};
        let resultDataOptIn = {};
        if(log) logBlockchain('logging in alice and request DOI');
        dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp
        resultDataOptIn = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, false);

        if(log) logBlockchain('waiting seconds before get NameIdOfOptIn',10);
        Meteor.setTimeout(function () {
            generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 2, true); //need to generate at least 1 block because bob is not in the current mempool when offline
            const nameId = getNameIdOfOptInFromRawTx(node_url_alice,rpcAuth,resultDataOptIn.data.id,true);
            var startedContainerId = startDockerBob(containerId);
            logBlockchain("started bob's node with containerId",startedContainerId);
            chai.expect(startedContainerId).to.not.be.null;

            let running = true;
            let counter = 0;

            //here we make sure bob gets started and connected again in probably all possible sitautions
            while(running){
                try{
                    const statusDocker = JSON.parse(getDockerStatus(startedContainerId));
                    logBlockchain("getinfo",statusDocker);
                    logBlockchain("version:"+statusDocker.version);
                    logBlockchain("balance:"+statusDocker.balance);
                    logBlockchain("connections:"+statusDocker.connections);
                    if(statusDocker.connections===0){
                        doichainAddNode(startedContainerId);
                    }
                    running = false;
                }
                catch(error){
                    logBlockchain("statusDocker problem trying to start Bobs node inside docker container:",error);
                    try{
                        connectDockerBob(startedContainerId);
                    }catch(error2){
                        logBlockchain("could not start bob:",error2);
                    }
                    if(counter==50)running=false;
                }
                counter++;
            }
            //generating a block so transaction gets confirmed and delivered to bob.
            generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 10, true);
            if(log) logBlockchain('waiting seconds before fetching email:',20);
            Meteor.setTimeout(function () {
                const link2Confirm = fetchConfirmLinkFromPop3Mail("mail", 110, recipient_pop3username, recipient_pop3password, dappUrlBob, false);
                confirmLink(link2Confirm);
                generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, true);
                if (log) logBlockchain('waiting 10 seconds to update blockchain before generating another block:');
                Meteor.setTimeout(function () {
                    generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, true);
                    if (log) logBlockchain('waiting seconds before verifying DOI on alice:',15);
                    Meteor.setTimeout(function () {
                        generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, true);
                        Meteor.setTimeout(function () {
                            verifyDOI(dappUrlAlice, sender_mail, recipient_mail, nameId, dataLoginAlice, log); //need to generate two blocks to make block visible on alice
                            done();
                        }, 15000);
                    }, 15000); //verify
                }, 15000); //generatetoaddress
            },20000); //connect to pop3
        },10000); //find transaction on bob
    }); //it
});
