import {
    login, requestDOI
} from "../test-api/test-api-on-dapp";
import {
    testLog as logBlockchain
} from "meteor/doichain:doichain-meteor-api";


const dappUrlTestdApp = "http://localhost:4010";
const dAppLogin = {"username":"admin","password":"password"};

const sender_mail = 'testnet@doichain.org';
const log = true;

if(Meteor.isAppTest) {
    describe('testnet-doi-test-01', function () {
        this.timeout(0);

        before(function () {
            logBlockchain("removing OptIns,Recipients,Senders");
            const adLog = login(dappUrlTestdApp, dAppLogin, false);
            logBlockchain("logged into dapp",adLog);
        });

        it('should test if doi gets submitted over delegated provider ', function (done) {
            const recipient_mail = "testnet_"+(new Date().getTime())+"@doi.works";
            const dataLoginAlice = login(dappUrlTestdApp, dAppLogin, false); //log into dApp
            requestDOI(dappUrlTestdApp, dataLoginAlice, recipient_mail, sender_mail, null, true);
            done();
        });

        it('should test if doi gets submitted over fallback', function (done) {
            const recipient_mail = "testnet_"+(new Date().getTime())+"@coworking.yoga"; //please use this as standard to not confuse people!
            const dataLoginAlice = login(dappUrlTestdApp, dAppLogin, false); //log into dApp
            requestDOI(dappUrlTestdApp, dataLoginAlice, recipient_mail, sender_mail, null, true);
            done();
        });
    });
}