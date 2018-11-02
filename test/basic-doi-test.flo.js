import {chai} from 'meteor/practicalmeteor:chai';

import {
    login,
    requestDOI,
    createUser,
    findUser,
    findOptIn,
    exportOptIns,
    updateUser,
    resetUsers
} from "./test-api/test-api-on-dapp";
const dappUrlAlice = "http://localhost:3000";
const dAppLogin = {"username":"admin","password":"password"};
const templateUrlA="http://templateUrlA.com";
const templateUrlB="http://templateUrlB.com";
const aliceALogin = {"username":"alice-a","password":"password"};

describe('basic-flo-doi-test', function () {
    this.timeout(300000);

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
           //chai.expect(findOptIn(resultDataOptIn._id)).to.not.be.undefined;
           done();
       });

       it('should test if admin can update user profiles',function(){
           resetUsers();
       
       let logAdmin = login(dappUrlAlice,dAppLogin,true);
       const userUp = createUser(dappUrlAlice,logAdmin,"updateUser",templateUrlA,true);
       const changedData = updateUser(dappUrlAlice,logAdmin,userUp,templateUrlB,true);
       chai.expect(changedData).not.undefined;
       
        });

       it('should test if user can update own profile',function(){
        
            resetUsers();
           
           let logAdmin = login(dappUrlAlice,dAppLogin,true);
           const userUp = createUser(dappUrlAlice,logAdmin,"updateUser",templateUrlA,true);
           const logUserUp = login(dappUrlAlice,{"username":"updateUser","password":"password"},true);
           const changedData = updateUser(dappUrlAlice,logUserUp,userUp,templateUrlB,true);
           chai.expect(changedData).not.undefined;
           
       });
    });