import {chai} from 'meteor/practicalmeteor:chai';
import {
    deleteAllEmailsFromPop3, findOptIn,
    login,
    requestConfirmVerifyBasicDoi, requestDOI
} from "./test-api/test-api-on-dapp";
import {
    testLog as logBlockchain
} from "meteor/doichain:doichain-meteor-api";
import {deleteOptInsFromAliceAndBob, generatetoaddress, getNewAddress} from "./test-api/test-api-on-node";

const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";

if(Meteor.isAppTest) {
    xdescribe('03-basic-doi-test-03', function () {
        this.timeout(0);

        before(function () {
            logBlockchain("removing OptIns,Recipients,Senders");
            //deleteOptInsFromAliceAndBob();
            //deleteAllEmailsFromPop3(global.inside_docker?"mail":"localhost", 110, recipient_pop3username, recipient_pop3password, true);
        });

        it('should test if basic Doichain workflow running 5 times', function (done) {
            this.timeout(0);

            const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp
            global.aliceAddress = getNewAddress(global.node_url_alice, global.rpcAuthAlice, false);
            for (let i = 0; i < 5; i++) {
                const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
                const sender_mail = "alice_" + i + "@ci-doichain.org";
                requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice,global.dappUrlAlice,
                    dataLoginAlice,global.dappUrlBob,recipient_mail, sender_mail, {'city': 'Ekaterinburg_' + i}, "bob@ci-doichain.org", "bob", true);
            }
            done();
        });

        it('should test if basic Doichain workflow runs 20 times without confirmation, verification and new block', function (done) {
            this.timeout(0);
            deleteAllEmailsFromPop3(global.inside_docker?"mail":"localhost", 110, recipient_pop3username, recipient_pop3password, true);
            const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp
            global.aliceAddress = getNewAddress(global.node_url_alice, global.rpcAuthAlice, false);
            for (let i = 0; i < 20; i++) {
                const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
                const sender_mail = "alice_" + i + "@ci-doichain.org";
                const resultDataOptIn = requestDOI(global.dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
                chai.expect(findOptIn(resultDataOptIn.data.id, true)).to.not.be.undefined;
            }
            done();
        });

        it('should test if basic Doichain workflow runs 100 times without confirmation and verification', function (done) {
            this.timeout(0);
            deleteAllEmailsFromPop3(global.inside_docker?"mail":"localhost", 110, recipient_pop3username, recipient_pop3password, true);
            const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp
            global.aliceAddress = getNewAddress(global.node_url_alice, global.rpcAuthAlice, false);
            for (let i = 0; i < 100; i++) {
                const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
                const sender_mail = "alice_" + i + "@ci-doichain.org";
                const resultDataOptIn = requestDOI(global.dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
                chai.expect(findOptIn(resultDataOptIn.data.id, true)).to.not.be.undefined;
                if (i % 100 === 0) generatetoaddress(global.node_url_alice, global.rpcAuthAlice, global.aliceAddress, 1, true);
            }
            done();
        });
    });
}
