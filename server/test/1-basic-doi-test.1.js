import {chai} from 'meteor/practicalmeteor:chai';
import {
    login,
    createUser,
    findUser,
    exportOptIns,
    requestConfirmVerifyBasicDoi, resetUsers, updateUser, deleteAllEmailsFromPop3, confirmLink
} from "./test-api/test-api-on-dapp";
import {
    testLog as logBlockchain
} from "meteor/doichain:doichain-meteor-api";

import {deleteOptInsFromAliceAndBob} from "./test-api/test-api-on-node";

let templateUrlA="http://172.20.0.8:4000/templates/emails/doichain-anmeldung-final-DE.html";
let templateUrlB="http://172.20.0.8:4000/templates/emails/doichain-anmeldung-final-EN.html";
if(!global.inside_docker){
    templateUrlA="http://localhost:4000/templates/emails/doichain-anmeldung-final-DE.html";
    templateUrlB="http://localhost:4000/templates/emails/doichain-anmeldung-final-EN.html";
}

const aliceALogin = {"username":"alice-a","password":"password"};
const aliceBLogin = {"username":"alice-a","password":"password"};

const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";

const log = true;

if(Meteor.isAppTest) {
    describe('basic-doi-test-01', function () {
        this.timeout(0);

        before(function () {
            logBlockchain("removing OptIns,Recipients,Senders");
            deleteOptInsFromAliceAndBob();
            deleteAllEmailsFromPop3(global.inside_docker?"mail":"localhost", 110, recipient_pop3username, recipient_pop3password, true);
        });

        xit('should test if basic Doichain workflow is working with optional data', function (done) {
            const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
            const sender_mail = "alice@ci-doichain.org";
            const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp
            requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, dataLoginAlice, global.dappUrlBob, recipient_mail, sender_mail, {'city': 'Ekaterinburg'}, "bob@ci-doichain.org", "bob", true);
            done();
        });

        xit('should test if basic Doichain workflow is working without optional data', function (done) {
            const recipient_mail = "alice@ci-doichain.org"; //please use this as an alernative when above standard is not possible
            const sender_mail = "bob@ci-doichain.org";
            //login to dApp & request DOI on alice via bob
            const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp
            requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, dataLoginAlice, global.dappUrlBob, recipient_mail, sender_mail, null, "alice@ci-doichain.org", "alice", true);
            done();
        });

        it('should create two more users', function (done) {
            resetUsers();
            const logAdmin = login(global.dappUrlAlice, global.dAppLogin, false);
            let userA = createUser(global.dappUrlAlice, logAdmin, "alice-a", templateUrlA, true);
            chai.expect(findUser(userA)).to.not.be.undefined;
            let userB = createUser(global.dappUrlAlice, logAdmin, "alice-b", templateUrlB, true);
            chai.expect(findUser(userB)).to.not.be.undefined;

            done();
        });

        it('should test if Doichain workflow is using different templates for different users', function (done) {

            resetUsers();
            const recipient_mail = "bob@ci-doichain.org"; //
            const sender_mail_alice_a = "alice-a@ci-doichain.org";
            const sender_mail_alice_b = "alice-b@ci-doichain.org";
            const logAdmin = login(global.dappUrlAlice, global.dAppLogin, false);

            let userA = createUser(global.dappUrlAlice, logAdmin, "alice-a", templateUrlA, true);
            chai.expect(findUser(userA)).to.not.be.undefined;
            let userB = createUser(global.dappUrlAlice, logAdmin, "alice-b", templateUrlB, true);
            chai.expect(findUser(userB)).to.not.be.undefined;

            const logUserA = login(global.dappUrlAlice, aliceALogin, true);
            const logUserB = login(global.dappUrlAlice, aliceBLogin, true);

            //requestConfirmVerifyBasicDoi checks if the "log" value (if it is a String) is in the mail-text
            requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice,global.dappUrlAlice, logUserA, global.dappUrlBob, recipient_mail, sender_mail_alice_a, {'city': 'Ekaterinburg'}, "bob@ci-doichain.org", "bob", "kostenlose Anmeldung");
            requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, logUserB, global.dappUrlBob, recipient_mail, sender_mail_alice_b, {'city': 'Simbach'}, "bob@ci-doichain.org", "bob", "free registration");

            done();
        });

        it('should test if users can export OptIns ', function (done) {
            resetUsers();

            const logAdmin = login(global.dappUrlAlice, global.dAppLogin, false);
            let userA = createUser(global.dappUrlAlice, logAdmin, "alice-a", templateUrlA, true);
            chai.expect(findUser(userA)).to.not.be.undefined;
            let userB = createUser(global.dappUrlAlice, logAdmin, "alice-b", templateUrlB, true);
            chai.expect(findUser(userB)).to.not.be.undefined;

            const recipient_mail = "bob@ci-doichain.org";
            const sender_mail_alice_a = "alice-export@ci-doichain.org";
            const logUserA = login(global.dappUrlAlice, aliceALogin, log);
            requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, logUserA, global.dappUrlBob, recipient_mail, sender_mail_alice_a, {'city': 'München'}, "bob@ci-doichain.org", "bob", true);
            const exportedOptIns = exportOptIns(global.dappUrlAlice, logAdmin, log);
            if(log) logBlockchain('exportedOptIns:',exportedOptIns);
            chai.expect(exportedOptIns).to.not.be.undefined;
            chai.expect(exportedOptIns[0]).to.not.be.undefined;
            const exportedOptInsA = exportOptIns(global.dappUrlAlice, logUserA, log);
            if(log)logBlockchain('exportedOptInsA:',exportedOptInsA);
            exportedOptInsA.forEach(element => {
                chai.expect(element.ownerId).to.be.equal(logUserA.userId);
            });
            //chai.expect(findOptIn(resultDataOptIn._id)).to.not.be.undefined;
            done();
        });

        xit('should test if admin can update user profiles', function () {
            resetUsers();
            let logAdmin = login(global.dappUrlAlice, global.dAppLogin, true);
            const userUp = createUser(global.dappUrlAlice, logAdmin, "updateUser", templateUrlA, true);
            logBlockchain('createUser:',userUp);
            const changedData = updateUser(global.dappUrlAlice, logAdmin, userUp, {"templateURL": templateUrlB}, true);
            logBlockchain('changedData:',changedData);
            chai.expect(changedData).not.undefined;
        });

        xit('should test if user can update own profile', function () {
            resetUsers();
            let logAdmin = login(global.dappUrlAlice, global.dAppLogin, true);
            const userUp = createUser(global.dappUrlAlice, logAdmin, "updateUser", templateUrlA, true);
            //logBlockchain('should test if user can update own profile:userUp:',userUp);
            const logUserUp = login(global.dappUrlAlice, {"username": "updateUser", "password": "password"}, true);
            //logBlockchain('should test if user can update own profile:logUserUp:',logUserUp);
            const changedData = updateUser(global.dappUrlAlice, logUserUp, userUp, {"templateURL": templateUrlB}, true);
            chai.expect(changedData).not.undefined;
        });

        xit('should test if coDoi works', function () {
            const coDoiList = ["alice1@doichain-ci.com", "alice2@doichain-ci.com", "alice3@doichain-ci.com"];
            const recipient_mail = "bob@ci-doichain.org";
            const sender_mail = coDoiList;
            let logAdmin = login(global.dappUrlAlice, global.dAppLogin, true);
            requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, logAdmin, global.dappUrlBob, recipient_mail, sender_mail, {'city': 'Ekaterinburg'}, "bob@ci-doichain.org", "bob", true);
        });

        xit('should find updated Data in email', function (done) {
            const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
            const sender_mail = "alice-update@ci-doichain.org";
            const adLog = login(global.dappUrlAlice, global.dAppLogin, false);
            updateUser(global.dappUrlAlice, adLog, adLog.userId, {"subject": "updateTest", "templateURL": templateUrlB});
            requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, adLog, global.dappUrlBob, recipient_mail, sender_mail,
                {'city': 'Ekaterinburg'}, "bob@ci-doichain.org", "bob", true);
            done();
        });

        xit('should redirect if confirmation-link is clicked again',function(){
            for (let index = 0; index < 3; index++) {
                const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
                const sender_mail = "alice_"+index+"@ci-doichain.org";
                const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp
                let returnedData = requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, dataLoginAlice, global.dappUrlBob, recipient_mail, sender_mail, {'city': 'Ekaterinburg'}, "bob@ci-doichain.org", "bob", true);
                chai.assert.equal(true,confirmLink(returnedData.confirmLink));
            }
        });
    });
}
