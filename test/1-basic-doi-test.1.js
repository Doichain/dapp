import {chai} from 'meteor/practicalmeteor:chai';
import {
    login,
    createUser,
    findUser,
    findOptIn,
    exportOptIns,
    requestConfirmVerifyBasicDoi, resetUsers, requestDOI, updateUser
} from "./test-api/test-api-on-dapp";
import {logBlockchain} from "../imports/startup/server/log-configuration";

const node_url_alice = 'http://172.20.0.6:18332/';
const rpcAuthAlice = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {"username":"admin","password":"password"};

const templateUrlA="http://templateUrlB.com";
const templateUrlB="http://templateUrlB.com";
const aliceALogin = {"username":"alice-a","password":"password"};

xdescribe('basic-doi-test', function () {
    this.timeout(0);

    before(function(){
        logBlockchain("removing OptIns,Recipients,Senders");
    });

    it('should test if basic Doichain workflow is working with optional data', function (done) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
        const sender_mail  = "alice@ci-doichain.org";
        const dataLoginAlice = login(dappUrlAlice,dAppLogin,false); //log into dApp
        requestConfirmVerifyBasicDoi(node_url_alice,rpcAuthAlice,dappUrlAlice,dataLoginAlice,dappUrlBob,recipient_mail,sender_mail,{'city':'Ekaterinburg'},"bob@ci-doichain.org","bob",true);
        done();
    });

    it('should test if basic Doichain workflow is working without optional data', function (done) {
        const recipient_mail = "alice@ci-doichain.org"; //please use this as an alernative when above standard is not possible
        const sender_mail  = "bob@ci-doichain.org";
        //login to dApp & request DOI on alice via bob
        const dataLoginAlice = login(dappUrlAlice,dAppLogin,false); //log into dApp
        requestConfirmVerifyBasicDoi(node_url_alice,rpcAuthAlice,dappUrlAlice,dataLoginAlice,dappUrlBob,recipient_mail,sender_mail,null,"alice@ci-doichain.org","alice",true);
        done();
    });

    it('should test if Doichain workflow is using different templates for different users', function (done) {
        resetUsers();
        const recipient_mail = "bob@ci-doichain.org"; //
        const sender_mail_alice_a  = "alice-a@ci-doichain.org";
        const logAdmin = login(dappUrlAlice,dAppLogin,false);
        let userA = createUser(dappUrlAlice,logAdmin,"alice-a",templateUrlA,true);
        chai.expect(findUser(userA)).to.not.be.undefined;
        let userB = createUser(dappUrlAlice,logAdmin,"alice-b",templateUrlB,true);
        chai.expect(findUser(userB)).to.not.be.undefined;

        const logUserA = login(dappUrlAlice,aliceALogin,true);
        const resultDataOptIn = requestDOI(dappUrlAlice,logUserA,recipient_mail,sender_mail_alice_a,null,true);
        chai.expect(findOptIn(resultDataOptIn.data.id,true)).to.not.be.undefined;
        done();
    });

    it('should test if users can export OptIns ', function (done) {
        const logAdmin = login(dappUrlAlice,dAppLogin,true);
        const logUserA = login(dappUrlAlice,aliceALogin,true);
        const exportedOptIns = exportOptIns(dappUrlAlice,logAdmin,true);
        chai.expect(exportedOptIns).to.not.be.undefined;
        //chai.expect(exportedOptIns[0]).to.not.be.undefined;
        const exportedOptInsA = exportOptIns(dappUrlAlice,logUserA,true);
        for(let optIn in exportedOptInsA){
            chai.expect(optIn.ownerId).to.be.equal(logUserA.userId);
        }
        done();
    });

    it('should test if admin can update user profiles',function(){
        resetUsers();
        let logAdmin = login(dappUrlAlice,dAppLogin,true);
        const userUp = createUser(dappUrlAlice,logAdmin,"updateUser",templateUrlA,true);
        const changedData = updateUser(dappUrlAlice,logAdmin,userUp,{"templateURL":templateUrlB},true);
        chai.expect(changedData).not.undefined;
    });

    it('should test if user can update own profile',function(){
        resetUsers();
        let logAdmin = login(dappUrlAlice,dAppLogin,true);
        const userUp = createUser(dappUrlAlice,logAdmin,"updateUser",templateUrlA,true);
        const logUserUp = login(dappUrlAlice,{"username":"updateUser","password":"password"},true);
        const changedData = updateUser(dappUrlAlice,logUserUp,userUp,{"templateURL":templateUrlB},true);
        chai.expect(changedData).not.undefined;
    });
});