import {chai} from 'meteor/practicalmeteor:chai';
import {
    deleteAllEmailsFromPop3,
    fetchConfirmLinkFromPop3Mail,
    getNameIdOfOptInFromRawTx,
    login,
    requestDOI, clickConfirmLink
} from "./test-api/test-api-on-dapp";
import {
    testLog as testLogging
} from "meteor/doichain:doichain-meteor-api";
import {
    deleteOptInsFromAliceAndBob,
    generatetoaddress,
    getNewAddress,
    triggerNewBlock,
    startDockerBob,
    stopDockerBob, waitToStartContainer
} from "./test-api/test-api-on-node";
const exec = require('child_process').exec;
const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";

const rpcAuth = "admin:generated-password";
const dAppLogin = {"username":"admin","password":"password"};
const log = true;

if(Meteor.isAppTest) {
    describe('02-basic-doi-test-with-offline-node-02', function () {
        before(function () {
            deleteOptInsFromAliceAndBob();
            deleteAllEmailsFromPop3(global.inside_docker?"mail":"localhost", 110, recipient_pop3username, recipient_pop3password, true);
            exec((global.inside_docker?'sudo':'')+' docker rm 3rd_node', (e, stdout2, stderr2) => {
                testLogging('deleted 3rd_node:', {stdout: stdout2, stderr: stderr2});
            });

            try {
                exec((global.inside_docker?'sudo':'')+' docker stop 3rd_node', (e, stdout, stderr) => {
                    testLogging('stopped 3rd_node:', {stdout: stdout, stderr: stderr});
                    exec((global.inside_docker?'sudo':'')+' docker rm 3rd_node', (e, stdout, stderr) => {
                        testLogging('removed 3rd_node:', {stdout: stdout, stderr: stderr});
                    });
                });
            } catch (ex) {
                testLogging('could not stop 3rd_node',);
            }
        });

        it('should test if basic Doichain workflow is working when Bobs node is temporarily offline', function (done) {
            this.timeout(180000);
            global.aliceAddress = getNewAddress(global.node_url_alice, rpcAuth, false);
            //start another 3rd node before shutdown Bob
            //triggerNewBlock();
            var containerId = stopDockerBob();
            const recipient_mail = "bob@ci-doichain.org";
            const sender_mail = "alice-to-offline-node@ci-doichain.org";
            //login to dApp & request DOI on alice via bob
            if (log) testLogging('log into alice and request DOI');
            let dataLoginAlice = login(global.dappUrlAlice, dAppLogin, false); //log into dApp
            let resultDataOptIn = requestDOI(global.dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);

            const nameId = getNameIdOfOptInFromRawTx(global.node_url_alice, rpcAuth, resultDataOptIn.data.id, true);
            if (log) testLogging('got nameId', nameId);
            //generating a block so transaction gets confirmed and delivered to bob.
            generatetoaddress(global.node_url_alice, rpcAuth, global.aliceAddress, 10, true);

            var startedContainerId = startDockerBob(containerId);
            testLogging("started bob's node with containerId", startedContainerId);
            chai.expect(startedContainerId).to.not.be.null;


            waitToStartContainer(startedContainerId); //start, reconnect and reindex
            triggerNewBlock('http://localhost:4000/api/v1/blocknotify') //send blocknotify to bob
            //onnect_docker_bob(startedContainerId)
            let running = true;
            let counter = 0;
            (async function loop() {
                while (running && ++counter < 50) { //trying 50x to get email from bobs mailbox
                    try {
                        testLogging('step 3: getting email!');
                        const link2Confirm = fetchConfirmLinkFromPop3Mail(global.inside_docker?"mail":"localhost", 110, recipient_pop3username, recipient_pop3password, null, false);
                        testLogging('step 4: confirming link', link2Confirm);
                        if (link2Confirm != null) running = false;
                        clickConfirmLink(link2Confirm);
                        testLogging('confirmed');
                    } catch (ex) {
                        testLogging('trying to get email - so far no success:', counter);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
                done();
            })();
        }); //it
    });
}
