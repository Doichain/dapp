import {chai} from 'meteor/practicalmeteor:chai';
import {
    login,
    createUser,
    findUser,
    exportOptIns,
    requestConfirmVerifyBasicDoi, resetUsers, updateUser, deleteAllEmailsFromPop3, confirmLink, clickConfirmLink
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
    xdescribe(  'bitcore-doichain-lib-test-5', function () {
        this.timeout(0);

        before(function () {
            logBlockchain("removing OptIns,Recipients,Senders");
            deleteOptInsFromAliceAndBob();
            deleteAllEmailsFromPop3(global.inside_docker?"mail":"localhost", 110, recipient_pop3username, recipient_pop3password, true);
            const adLog = login(global.dappUrlAlice, global.dAppLogin, false);
            updateUser(global.dappUrlAlice, adLog, adLog.userId, {},false);
        });


        it('should test if basic Doichain workflow is working with optional data', function (done) {

            done();
        });


    });
}
