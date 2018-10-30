import {chai} from 'meteor/practicalmeteor:chai';
import {generatetoaddress} from "./test-api/test-api-on-node";
import {
    fetchConfirmLinkFromPop3Mail,
    getNameIdOfOptIn,
    login,
    confirmLink,
    requestDOI,
    verifyDOI,
    createUser,
    findUser,
    findOptIn,
    exportOptIns
} from "./test-api/test-api-on-dapp";
import {logBlockchain} from "../imports/startup/server/log-configuration";

const node_url_alice = 'http://172.20.0.6:18332/';
const rpcAuth = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {"username":"admin","password":"password"};
const log = true;

const templateUrlA="http://templateUrlB.com";
const templateUrlB="http://templateUrlB.com";
const aliceALogin = {"username":"alice-a","password":"password"};

describe('basic-doi-test', function () {
    this.timeout(300000);

    it('should test if basic Doichain workflow is working with optional data', function (done) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
        const sender_mail  = "alice@ci-doichain.org";
        requestConfirmVerifyBasicDoi(recipient_mail,sender_mail,{'city':'Ekaterinburg'},"bob@ci-doichain.org","bob",done);
    });

    it('should test if basic Doichain workflow is working without optional data', function (done) {
        const recipient_mail = "alice@ci-doichain.org"; //please use this as an alernative when above standard is not possible
        const sender_mail  = "bob@ci-doichain.org";
        requestConfirmVerifyBasicDoi(recipient_mail,sender_mail,null,"alice@ci-doichain.org","alice",done);
    });
    /*

         it('should test if basic Doichain workflow is working with co-sponsoring', function (done) {
             const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
             const sender_mail  = "alice-main-sponsor@ci-doichain.org";
             requestDOI(recipient_mail,sender_mail,{'city':'Ekaterinburg'},"bob@ci-doichain.org","bob",done);
         });

*/
       it('should test if Doichain workflow is using different templates for different users', function (done) {
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
           chai.expect(exportedOptIns[0]).to.not.be.undefined;
           const exportedOptInsA = exportOptIns(dappUrlAlice,logUserA,true);
           for(let optIn in exportedOptInsA){
               chai.expect(optIn.ownerId).to.be.equal(logUserA.userId);
           }
           //chai.expect(findOptIn(resultDataOptIn._id)).to.not.be.undefined;
           done();
       });

    function requestConfirmVerifyBasicDoi(recipient_mail,sender_mail,optionalData,recipient_pop3username, recipient_pop3password,done){
        //login to dApp & request DOI on alice via bob
        const dataLoginAlice = login(dappUrlAlice,dAppLogin,false); //log into dApp
        const resultDataOptIn = requestDOI(dappUrlAlice,dataLoginAlice,recipient_mail,sender_mail,optionalData,false);
        //generatetoaddress(node_url_alice,rpcAuth, global.aliceAddress,1,false); //TODO this should be not necessary(!) but with out we have an error when fetching the transaction

        if(log) logBlockchain('waiting seconds before get NameIdOfOptIn',10);
        setTimeout(Meteor.bindEnvironment(function () {

            const nameId = getNameIdOfOptIn(node_url_alice,rpcAuth,resultDataOptIn.data.id,true);

            if(log) logBlockchain('waiting seconds before fetching email:',10);
            setTimeout(Meteor.bindEnvironment(function () {

                const link2Confirm= fetchConfirmLinkFromPop3Mail("mail",110,recipient_pop3username,recipient_pop3password,dappUrlBob,false);
                confirmLink(link2Confirm);
                generatetoaddress(node_url_alice,rpcAuth, global.aliceAddress,1,false);

                if(log) logBlockchain('waiting 10 seconds to update blockchain before generating another block:');
                setTimeout(Meteor.bindEnvironment(function () {
                    generatetoaddress(node_url_alice,rpcAuth, global.aliceAddress,1,false);

                    if(log) logBlockchain('waiting 10 seconds before verifying DOI on alice:');
                    setTimeout(Meteor.bindEnvironment(function () {
                        verifyDOI(dappUrlAlice, sender_mail, recipient_mail,nameId, dataLoginAlice, log ); //need to generate two blocks to make block visible on alice
                        done();
                    }),10000); //verify
                }),10000); //verify
            }),15000); //connect to pop3
        }),10000); //find transaction on bob's node - even the block is not confirmed yet
    }
});