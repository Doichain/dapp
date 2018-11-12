chai.use(require('chai-datetime'));
chai.use(require('chai-date-string'));
import {chai} from 'meteor/practicalmeteor:chai';
import {
    confirmLink, deleteAllEmailsFromPop3,
    fetchConfirmLinkFromPop3Mail,
    getNameIdOfOptInFromRawTx,
    login,
    requestDOI, verifyDOI
} from "./test-api/test-api-on-dapp";

import {testLogging} from "../imports/startup/server/log-configuration";
import {
    generatetoaddress,
    getNewAddress,
    start3rdNode,
    startDockerBob,
    stopDockerBob, waitToStartContainer
} from "./test-api/test-api-on-node";
const exec = require('child_process').exec;

const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";
const node_url_alice = 'http://172.20.0.6:18332/';
const rpcAuth = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {"username":"admin","password":"password"};
const log = true;

describe('basic-doi-test-with-offline-node', function () {

    before(function(){
        deleteAllEmailsFromPop3("mail", 110, recipient_pop3username, recipient_pop3password,true);
            exec('sudo docker rm 3rd_node', (e, stdout2, stderr2)=> {
                testLogging('deleted 3rd_node:',{stdout:stdout2,stderr:stderr2});
            });
    });

    after(function(){
        exec('sudo docker stop 3rd_node', (e, stdout, stderr)=> {
            testLogging('stopped 3rd_node:',{stdout:stdout,stderr:stderr});
        });
    });

    it('should test if basic Doichain workflow is working when Bobs node is temporarily offline', function(done) {
        this.timeout(0);
        global.aliceAddress = getNewAddress(node_url_alice,rpcAuth,false);
        //start another 3rd node before shutdown Bob
        start3rdNode();
        var containerId = stopDockerBob();
        const recipient_mail = "bob@ci-doichain.org";
        const sender_mail  = "alice-to-offline-node@ci-doichain.org";

        //login to dApp & request DOI on alice via bob
        if(log) testLogging('log into alice and request DOI');
        let dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp
        let resultDataOptIn = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);

        const nameId = getNameIdOfOptInFromRawTx(node_url_alice,rpcAuth,resultDataOptIn.data.id,true);
        if(log) testLogging('got nameId',nameId);
        var startedContainerId = startDockerBob(containerId);
        testLogging("started bob's node with containerId",startedContainerId);
        chai.expect(startedContainerId).to.not.be.null;
        waitToStartContainer(startedContainerId);

        //generating a block so transaction gets confirmed and delivered to bob.
        generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, true);
        let running = true;
        let counter = 0;
        while(running && ++counter<50){ //trying 50x to get email from bobs mailbox
            try{
                testLogging('step 3: getting email!');
                const link2Confirm = fetchConfirmLinkFromPop3Mail("mail", 110, recipient_pop3username, recipient_pop3password, dappUrlBob, false);
                testLogging('step 4: confirming link',link2Confirm);
                if(link2Confirm!=null) running=false;
                confirmLink(link2Confirm);
                testLogging('confirmed');
            }catch(ex){
                testLogging('trying to get email - so far no success:',ex);
                var end = Date.now() + 5000;
                while (Date.now() < end) ;
            }
        }
        generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, true);
        verifyDOI(dappUrlAlice, dataLoginAlice, sender_mail, recipient_mail, nameId, log); //need to generate two blocks to make block visible on alice

        done();
    }); //it
});
