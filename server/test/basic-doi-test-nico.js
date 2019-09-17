import {chai} from 'meteor/practicalmeteor:chai';
import { testLog } from "meteor/doichain:doichain-meteor-api";
import {
    deleteOptInsFromAliceAndBob, getBalance, initBlockchain
} from "./test-api/test-api-on-node";
import {login, requestConfirmVerifyBasicDoi} from "./test-api/test-api-on-dapp";

global.inside_docker = false;

const log = true;
const dns = require('dns');

if(Meteor.isAppTest) {
    global.node_url_alice = 'http://172.20.0.6:18332/';
    if(!global.inside_docker) global.node_url_alice = 'http://localhost:18543/';
    global.node_url_bob =   'http://172.20.0.7:18332/';
    if(!global.inside_docker) global.node_url_bob = 'http://localhost:18544/';
    global.rpcAuthAlice = "admin:generated-password";
    global.rpcAuth = "admin:generated-password";

    global.privKeyAlice = "cNEuvnaPVkW7Xp3JS49k9aSqMBe4LSyws3aq1KvCU1utSDLtT9Dj";
    global.privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj";

    global.dappUrlAlice = "http://localhost:3000";
    global.dappUrlBob = global.insde_docker?"http://172.20.0.8:4000":"http://localhost:4000";
    global.dAppLogin = {"username":"admin","password":"password"};

    dns.setServers([
        '127.0.0.1',
    ]); //we use our own dns in order to resolve the ci-doichain.org test domain including its TXT entry
    xdescribe('nico-doi-tests', function () {
        this.timeout(0);

        before(function () {
            testLog("removing OptIns,Recipients,Senders",'');
            deleteOptInsFromAliceAndBob();
        });

        it('should create a RegTest Doichain with alice and bob and some Doi - coins', function () {
            initBlockchain(global.node_url_alice,global.node_url_bob,global.rpcAuth,global.privKeyAlice,global.privKeyBob,true);
            const aliceBalance = getBalance(global.node_url_alice, global.rpcAuth, log);
            chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
        });

        it('should store sender email in confirmation dApp when its not fallback server', function (done) {
           const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
           const sender_mail = "alice@ci-doichain.org";
           const dataLoginAlice = login(global.dappUrlAlice, dAppLogin, false); //log into dApp
           requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, {'city': 'Ekaterinburg'}, "bob@ci-doichain.org", "bob", true);

           //connect to verify rest interface and check if permission given

            //configure bob as fallback node (via dns)
           //request a doi over fall back node,
           //connect to fallback node sender email should not be saved.

           done();
        });

    });
}


// import {chai} from 'meteor/practicalmeteor:chai';
// import {
//     testLog as logBlockchain
// } from "meteor/doichain:doichain-meteor-api";
//
// import {deleteOptInsFromAliceAndBob, getBalance, initBlockchain} from "./test-api/test-api-on-node";
// import {login, requestConfirmVerifyBasicDoi} from "./test-api/test-api-on-dapp";
// const node_url_alice = 'http://172.20.0.6:18332/';
// const node_url_bob =   'http://172.20.0.7:18332/';
// const rpcAuth = "admin:generated-password";
// const privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj";
// const log = true;
//
//
// const rpcAuthAlice = "admin:generated-password";
// const dappUrlAlice = "http://localhost:3000";
// const dappUrlBob = "http://172.20.0.8:4000";
// const dAppLogin = {"username":"admin","password":"password"};
//
//
// if(Meteor.isTest || Meteor.isAppTest) {
//
//     xdescribe('basic-doi-test-nico', function () {
//         this.timeout(600000);
//
//         before(function () {
//             logBlockchain("removing OptIns,Recipients,Senders");
//             deleteOptInsFromAliceAndBob();
//         });
//
//         xit('should create a RegTest Doichain with alice and bob and some Doi - coins', function () {
//             initBlockchain(node_url_alice,node_url_bob,rpcAuth,privKeyBob,true);
//             const aliceBalance = getBalance(node_url_alice, rpcAuth, log);
//             chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
//         });
//
//         xit('should test if basic Doichain workflow is working with optional data', function (done) {
//             const recipient_mail = "bob+1@ci-doichain.org"; //please use this as standard to not confuse people!
//             const sender_mail = "alice@ci-doichain.org";
//             const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp
//             requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, {'city': 'Ekaterinburg'}, "bob@ci-doichain.org", "bob", true);
//             done();
//         });
//     });
//
//     xdescribe('basic-doi-test-nico', function () {
//
//
//         /**
//          * Information regarding to event loop node.js
//          * - https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
//          *
//          * Promises:
//          * - https://developers.google.com/web/fundamentals/primers/promises
//          *
//          * Promise loops and async wait
//          * - https://stackoverflow.com/questions/40328932/javascript-es6-promise-for-loop
//          *
//          * Asynchronous loops with mocha:
//          * - https://whitfin.io/asynchronous-test-loops-with-mocha/
//          */
//         /*  it('should test a timeout with a promise', function (done) {
//               logBlockchain("truying a promise");
//               for (let i = 0; i < 10; i++) {
//                   const promise = new Promise((resolve, reject) => {
//                       const timeout = Math.random() * 1000;
//                       setTimeout(() => {
//                           console.log('promise:'+i);
//                       }, timeout);
//                   });
//                   // TODO: Chain this promise to the previous one (maybe without having it running?)
//               }
//               done();
//           });
//
//           it('should run a loop with async wait', function (done) {
//               logBlockchain("trying asycn wait");
//               (async function loop() {
//                   for (let i = 0; i < 10; i++) {
//                       await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
//                       console.log('async wait'+i);
//                   }
//                   done()
//               })();
//           });
//
//           xit('should safely stop and start bobs doichain node container', function (done) {
//               var containerId = stopDockerBob();
//
//               logBlockchain("stopped bob's node with containerId",containerId);
//               chai.expect(containerId).to.not.be.null;
//
//               var startedContainerId = startDockerBob(containerId);
//               logBlockchain("started bob's node with containerId",startedContainerId);
//               chai.expect(startedContainerId).to.not.be.null;
//
//               let running = true;
//               while(running){
//                   runAndWait(function () {
//                       try{
//                           const statusDocker = JSON.parse(getDockerStatus(containerId));
//                           logBlockchain("getinfo",statusDocker);
//                           logBlockchain("version:"+statusDocker.version);
//                           logBlockchain("balance:"+statusDocker.balance);
//                           logBlockchain("balance:"+statusDocker.connections);
//                           if(statusDocker.connections===0){
//                               doichainAddNode(containerId);
//                           }
//                           running = false;
//                       }
//                       catch(error){
//                           logBlockchain("statusDocker problem:",error);
//                       }
//                   },2);
//               }
//
//               done();
//           });*/
//     });
// }
