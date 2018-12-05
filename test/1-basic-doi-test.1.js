import {chai} from 'meteor/practicalmeteor:chai';
import {
    login,
    createUser,
    findUser,
    exportOptIns,
    requestConfirmVerifyBasicDoi, resetUsers, updateUser, deleteAllEmailsFromPop3
} from "./test-api/test-api-on-dapp";
import {logBlockchain} from "../imports/startup/server/log-configuration";
import {deleteOptInsFromAliceAndBob} from "./test-api/test-api-on-node";

const node_url_alice = 'http://172.20.0.6:18332/';

const rpcAuthAlice = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {"username":"admin","password":"password"};

const templateUrlA="http://172.20.0.8:4000/templates/emails/doichain-anmeldung-final-DE.html";
const templateUrlB="http://172.20.0.8:4000/templates/emails/doichain-anmeldung-final-EN.html";
const aliceALogin = {"username":"alice-a","password":"password"};
const aliceBLogin = {"username":"alice-a","password":"password"};

const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";

describe('basic-doi-test-01', function () {
    this.timeout(0);

    before(function(){
        logBlockchain("removing OptIns,Recipients,Senders");
        deleteOptInsFromAliceAndBob();
        deleteAllEmailsFromPop3("mail", 110, recipient_pop3username, recipient_pop3password,true);
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

    it('should create two more users', function (done) {
        resetUsers();
        const logAdmin = login(dappUrlAlice,dAppLogin,false);
        let userA = createUser(dappUrlAlice,logAdmin,"alice-a",templateUrlA,true);
        chai.expect(findUser(userA)).to.not.be.undefined;
        let userB = createUser(dappUrlAlice,logAdmin,"alice-b",templateUrlB,true);
        chai.expect(findUser(userB)).to.not.be.undefined;

        done();
    });

    it('should test if Doichain workflow is using different templates for different users', function (done) {

       resetUsers();
       const recipient_mail = "bob@ci-doichain.org"; //
       const sender_mail_alice_a  = "alice-a@ci-doichain.org";
       const sender_mail_alice_b  = "alice-b@ci-doichain.org";
       const logAdmin = login(dappUrlAlice,dAppLogin,false);

       let userA = createUser(dappUrlAlice,logAdmin,"alice-a",templateUrlA,true);
       chai.expect(findUser(userA)).to.not.be.undefined;
       let userB = createUser(dappUrlAlice,logAdmin,"alice-b",templateUrlB,true);
       chai.expect(findUser(userB)).to.not.be.undefined;

       const logUserA = login(dappUrlAlice,aliceALogin,true);
       const logUserB = login(dappUrlAlice,aliceBLogin,true);

       //requestConfirmVerifyBasicDoi checks if the "log" value (if it is a String) is in the mail-text
       requestConfirmVerifyBasicDoi(node_url_alice,rpcAuthAlice,dappUrlAlice,logUserA,dappUrlBob,recipient_mail,sender_mail_alice_a,{'city':'Ekaterinburg'},"bob@ci-doichain.org","bob","kostenlose Anmeldung");
       requestConfirmVerifyBasicDoi(node_url_alice,rpcAuthAlice,dappUrlAlice,logUserB,dappUrlBob,recipient_mail,sender_mail_alice_b,{'city':'Simbach'},"bob@ci-doichain.org","bob","free registration");

       done();
   });

   it('should test if users can export OptIns ',function (done) {
        const recipient_mail = "bob@ci-doichain.org"; //
        const sender_mail_alice_a  = "alice-export@ci-doichain.org";
       const logAdmin = login(dappUrlAlice,dAppLogin,true);
       const logUserA = login(dappUrlAlice,aliceALogin,true);
       requestConfirmVerifyBasicDoi(node_url_alice,rpcAuthAlice,dappUrlAlice,logUserA,dappUrlBob,recipient_mail,sender_mail_alice_a,{'city':'München'},"bob@ci-doichain.org","bob",true);
       const exportedOptIns = exportOptIns(dappUrlAlice,logAdmin,true);
       chai.expect(exportedOptIns).to.not.be.undefined;
       chai.expect(exportedOptIns[0]).to.not.be.undefined;
       const exportedOptInsA = exportOptIns(dappUrlAlice,logUserA,true);
       exportedOptInsA.forEach(element => {
        chai.expect(element.ownerId).to.be.equal(logUserA.userId);
       });
       //chai.expect(findOptIn(resultDataOptIn._id)).to.not.be.undefined;
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

    it('should test if coDoi works',function(){
        const coDoiList = ["alice1@doichain-ci.com","alice2@doichain-ci.com","alice3@doichain-ci.com"];
        const recipient_mail = "bob@ci-doichain.org";
        const sender_mail = coDoiList;
        let logAdmin = login(dappUrlAlice,dAppLogin,true);
        const coDois = requestConfirmVerifyBasicDoi(node_url_alice,rpcAuthAlice,dappUrlAlice,logAdmin,dappUrlBob,recipient_mail,sender_mail,{'city':'Ekaterinburg'},"bob@ci-doichain.org","bob",true);
    });

    it('should find updated Data in email',function(done){
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
        const sender_mail  = "alice-update@ci-doichain.org";
        const adLog = login(dappUrlAlice,dAppLogin,false);
        updateUser(dappUrlAlice,adLog,adLog.userId,{"subject":"updateTest","templateURL":templateUrlB});
        requestConfirmVerifyBasicDoi(node_url_alice,rpcAuthAlice,dappUrlAlice,adLog,dappUrlBob,recipient_mail,sender_mail,{'city':'Ekaterinburg'},"bob@ci-doichain.org","bob",true);
       done();
    });
});