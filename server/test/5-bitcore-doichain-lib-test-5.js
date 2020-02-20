import {
    login,
    updateUser,
    deleteAllEmailsFromPop3
} from "./test-api/test-api-on-dapp";
import {
    testLog as logBlockchain
} from "meteor/doichain:doichain-meteor-api";

import {deleteOptInsFromAliceAndBob} from "./test-api/test-api-on-node";

const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";

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
