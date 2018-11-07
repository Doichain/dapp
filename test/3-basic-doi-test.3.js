import {
    login,
    requestConfirmVerifyBasicDoi
} from "./test-api/test-api-on-dapp";
import {logBlockchain} from "../imports/startup/server/log-configuration";
import {deleteOptInsFromAliceAndBob, getNewAddress} from "./test-api/test-api-on-node";

const node_url_alice = 'http://172.20.0.6:18332/';
const rpcAuthAlice = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {"username":"admin","password":"password"};


xdescribe('basic-doi-test', function () {

    before(function(){
        logBlockchain("removing OptIns,Recipients,Senders");
        deleteOptInsFromAliceAndBob();
    });

    it('should test if basic Doichain workflow running 100 times', function (done) {
        this.timeout(0);
        const dataLoginAlice = login(dappUrlAlice,dAppLogin,false); //log into dApp
        global.aliceAddress = getNewAddress(node_url_alice, rpcAuthAlice, false);
        for(let i=0;i<=100;i++){
            const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
            const sender_mail  = "alice_"+i+"@ci-doichain.org";
            requestConfirmVerifyBasicDoi(node_url_alice,rpcAuthAlice,dappUrlAlice,dataLoginAlice,dappUrlBob,recipient_mail,sender_mail,{'city':'Ekaterinburg_'+i},"bob@ci-doichain.org","bob",true);
        }
        done();
    });

});