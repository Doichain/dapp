import {Meteor} from "meteor/meteor";
import {chai} from 'meteor/practicalmeteor:chai';
import {quotedPrintableDecode} from "emailjs-mime-codec";

import {testLogging} from "../../imports/startup/server/log-configuration";
import {getHttpGET, getHttpGETdata, getHttpPOST} from "../../server/api/http";
import {OptIns} from "../../imports/api/opt-ins/opt-ins";
import {Recipients} from "../../imports/api/recipients/recipients";

import {generatetoaddress} from "./test-api-on-node";
import { AssertionError } from "assert";
const headers = { 'Content-Type':'text/plain'  };
var POP3Client = require("poplib");

export function login(url, paramsLogin, log) {
    if(log) testLogging('dApp login.');

    const urlLogin = url+'/api/v1/login';
    const headersLogin = [{'Content-Type':'application/json'}];
    const realDataLogin= { params: paramsLogin, headers: headersLogin };

    const result = getHttpPOST(urlLogin, realDataLogin);

    if(log) testLogging('result login:',result);
    const statusCode = result.statusCode;
    const dataLogin = result.data;

    const statusLogin = dataLogin.status;
    chai.assert.equal(200, statusCode);
    chai.assert.equal('success', statusLogin);
    return dataLogin.data;
}

export function requestDOI(url, auth, recipient_mail, sender_mail, data,  log) {
    if(log) testLogging('step 1 - requestDOI called via REST');

    const urlOptIn = url+'/api/v1/opt-in';
    let dataOptIn = {};

    if(data){
        dataOptIn = {
            "recipient_mail":recipient_mail,
            "sender_mail":sender_mail,
            "data":JSON.stringify(data)
        }
    }else{
        dataOptIn = {
            "recipient_mail":recipient_mail,
            "sender_mail":sender_mail
        }
    }

    const headersOptIn = {
        'Content-Type':'application/json',
        'X-User-Id':auth.userId,
        'X-Auth-Token':auth.authToken
    };

    const realDataOptIn = { data: dataOptIn, headers: headersOptIn};
    const resultOptIn = getHttpPOST(urlOptIn, realDataOptIn);

    //logBlockchain("resultOptIn",resultOptIn);
    chai.assert.equal(200, resultOptIn.statusCode);
    testLogging("RETURNED VALUES: ",resultOptIn);
    if(Array.isArray(resultOptIn.data)){
        testLogging('adding coDOIs');
        resultOptIn.data.forEach(element => {
            chai.assert.equal('success', element.status);
        });
    }

    else{
        testLogging('adding DOI');
    chai.assert.equal('success',  resultOptIn.data.status);
    }
    return resultOptIn.data;
}

export function getNameIdOfRawTransaction(url, auth, txId) {
    testLogging('pre-start of getNameIdOfRawTransaction',txId);
    const syncFunc = Meteor.wrapAsync(get_nameid_of_raw_transaction);
    return syncFunc(url, auth, txId);
}

function get_nameid_of_raw_transaction(url, auth, txId, callback){

    let nameId = '';
    let running = true;
    let counter = 0;
    testLogging('start getNameIdOfRawTransaction',txId);
    (async function loop() {
        while(running && ++counter<1500){ //trying 50x to get email from bobs mailbox
            try{
                    testLogging('trying to get transaction',txId);
                    const dataGetRawTransaction = {"jsonrpc": "1.0", "id":"getrawtransaction", "method": "getrawtransaction", "params": [txId,1] };
                    const realdataGetRawTransaction = { auth: auth, data: dataGetRawTransaction, headers: headers };
                    const resultGetRawTransaction = getHttpPOST(url, realdataGetRawTransaction);

                    if(resultGetRawTransaction.data.result.vout[1].scriptPubKey.nameOp!==undefined){
                        nameId = resultGetRawTransaction.data.result.vout[1].scriptPubKey.nameOp.name;
                    }
                    else{
                        nameId = resultGetRawTransaction.data.result.vout[0].scriptPubKey.nameOp.name;
                    }

                    if(resultGetRawTransaction.data.result.txid!==undefined){
                        testLogging('confirmed txid:'+resultGetRawTransaction.data.result.txid);
                        running=false;
                    }
                    //chai.assert.equal(txId, resultGetRawTransaction.data.result.txid);
            }catch(ex){
                testLogging('trying to get email - so far no success:',counter);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        testLogging('end of getNameIdOfRawTransaction returning nameId',nameId);
        callback(null,nameId);
    })();
}

export function getNameIdOfOptInFromRawTx(url, auth, optInId,log) {
    const syncFunc = Meteor.wrapAsync(get_nameid_of_optin_from_rawtx);
    return syncFunc(url, auth, optInId,log);
}


async function get_nameid_of_optin_from_rawtx(url, auth, optInId, log, callback){
    testLogging('step 2 - getting nameId of raw transaction from blockchain');
    if(log) testLogging('the txId will be added a bit later as soon as the schedule picks up the job and inserts it into the blockchain. it does not happen immediately. waiting...');
    let running = true;
    let counter = 0;
    let our_optIn = null;
    let nameId = null;
    await (async function loop() {
        while(running && ++counter<50){ //trying 50x to get opt-in

            testLogging('find opt-In',optInId);
            our_optIn = OptIns.findOne({_id: optInId});
            if(our_optIn.txId!==undefined){
                testLogging('found txId of opt-In',our_optIn.txId);
                running = false;
            }
            else{
                testLogging('did not find txId yet for opt-In-Id',our_optIn._id);
            }

            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    })();
       
    try{

        if(our_optIn._id != optInId) throw new Error("OptInId wrong",our_optIn._id,optInId);
        if(log) testLogging('optIn:',our_optIn);
        nameId = getNameIdOfRawTransaction(url,auth,our_optIn.txId);
        if("e/"+our_optIn.nameId != nameId) throw new AssertionError("NameId wrong","e/"+our_optIn.nameId,nameId);

        if(log) testLogging('nameId:',nameId);
        if(nameId == null) throw new Error("NameId null");
        if(counter >= 50) throw new Error("OptIn not found after retries");
        callback(null,nameId);
    }
    catch(error){
        callback(error,nameId);
    }
}

export function fetchConfirmLinkFromPop3Mail(hostname,port,username,password,alicedapp_url,log) {
    const syncFunc = Meteor.wrapAsync(fetch_confirm_link_from_pop3_mail);
    return syncFunc(hostname,port,username,password,alicedapp_url,log);
}

function fetch_confirm_link_from_pop3_mail(hostname,port,username,password,alicedapp_url,log,callback) {

    testLogging("step 3 - getting email from bobs inbox");
    //https://github.com/ditesh/node-poplib/blob/master/demos/retrieve-all.js
    var client = new POP3Client(port, hostname, {
        tlserrs: false,
        enabletls: false,
        debug: false
    });

    client.on("connect", function() {
        testLogging("CONNECT success");
        client.login(username, password);
        client.on("login", function(status, rawdata) {
            if (status) {
                testLogging("LOGIN/PASS success");
                client.list();

                client.on("list", function(status, msgcount, msgnumber, data, rawdata) {

                    if (status === false) {
                        const err = "LIST failed"+ msgnumber;
                        client.rset();
                        callback(err, null);
                        return;
                    } else {
                        if(log) testLogging("LIST success with " + msgcount + " element(s)",'');

                        //chai.expect(msgcount).to.be.above(0, 'no email in bobs inbox');
                        if (msgcount > 0){
                            client.retr(1);
                            client.on("retr", function(status, msgnumber, maildata, rawdata) {

                                if (status === true) {
                                    if(log) testLogging("RETR success " + msgnumber);

                                    //https://github.com/emailjs/emailjs-mime-codec
                                    const html  = quotedPrintableDecode(maildata);
                                    chai.expect(html.indexOf(alicedapp_url)).to.not.equal(-1);
                                    const linkdata =  html.substring(html.indexOf(alicedapp_url),html.indexOf("'",html.indexOf(alicedapp_url)));

                                    chai.expect(linkdata).to.not.be.null;
                                    if(log && !(log===true))chai.expect(html.indexOf(log)).to.not.equal(-1);
                                    const requestData = {"linkdata":linkdata,"html":html}

                                    client.dele(msgnumber);
                                    client.on("dele", function(status, msgnumber, data, rawdata) {
                                        client.quit();

                                        client.end();
                                        client = null;
                                        callback(null,linkdata);
                                    });

                                } else {
                                    const err = "RETR failed for msgnumber "+ msgnumber;
                                    client.rset();
                                    client.end();
                                    client = null;
                                    callback(err, null);
                                    return;
                                }
                            });
                        }
                        else{
                            const err = "empty mailbox";
                            callback(err, null);
                            client.quit();
                            client.end();
                            client = null;
                            return;
                        }
                    }
                });

            } else {
                const err = "LOGIN/PASS failed";
                callback(err, null);
                client.quit();
                client.end();
                client = null;
                return;
            }
        });
    });
}

export function deleteAllEmailsFromPop3(hostname,port,username,password,log) {
    const syncFunc = Meteor.wrapAsync(delete_all_emails_from_pop3);
    return syncFunc(hostname,port,username,password,log);
}

function delete_all_emails_from_pop3(hostname,port,username,password,log,callback) {

    testLogging("deleting all emails from bobs inbox");
    //https://github.com/ditesh/node-poplib/blob/master/demos/retrieve-all.js
    var client = new POP3Client(port, hostname, {
        tlserrs: false,
        enabletls: false,
        debug: false
    });

    client.on("connect", function() {
        testLogging("CONNECT success");
        client.login(username, password);
        client.on("login", function(status, rawdata) {
            if (status) {
                testLogging("LOGIN/PASS success");
                client.list();

                client.on("list", function(status, msgcount, msgnumber, data, rawdata) {

                    if (status === false) {
                        const err = "LIST failed"+ msgnumber;
                        client.rset();
                        callback(err, null);
                        return;
                    } else {
                        if(log) testLogging("LIST success with " + msgcount + " element(s)",'');

                        //chai.expect(msgcount).to.be.above(0, 'no email in bobs inbox');
                        if (msgcount > 0){
                            for(let i = 0;i<=msgcount;i++){
                                client.dele(i+1);
                                client.on("dele", function(status, msgnumber, data, rawdata) {
                                    testLogging("deleted email"+(i+1)+" status:"+status);
                                   if(i==msgcount-1){
                                       client.quit();

                                       client.end();
                                       client = null;
                                       if(log) testLogging("all emails deleted");
                                       callback(null,'all emails deleted');
                                   }
                                });
                            }
                        }
                        else{
                            const err = "empty mailbox";
                            callback(null, err); //we do not send an error here when inbox is empty
                            client.quit();
                            client.end();
                            client = null;
                            return;
                        }
                    }
                });

            } else {
                const err = "LOGIN/PASS failed";
                callback(err, null);
                client.quit();
                client.end();
                client = null;
                return;
            }
        });
    });
}

export function confirmLink(confirmLink){
    testLogging("clickable link:",confirmLink);
    const doiConfirmlinkResult = getHttpGET(confirmLink,'');

    chai.expect(doiConfirmlinkResult.content).to.have.string('ANMELDUNG ERFOLGREICH');
    chai.expect(doiConfirmlinkResult.content).to.have.string('Vielen Dank für Ihre Anmeldung');
    chai.expect(doiConfirmlinkResult.content).to.have.string('Ihre Anmeldung war erfolgreich.');
    chai.assert.equal(200, doiConfirmlinkResult.statusCode);
    return true;
}

export function verifyDOI(dAppUrl, dAppUrlAuth, node_url_alice, rpcAuthAlice, sender_mail, recipient_mail,nameId, log ){
    const syncFunc = Meteor.wrapAsync(verify_doi);
    return syncFunc(dAppUrl, dAppUrlAuth, node_url_alice, rpcAuthAlice, sender_mail, recipient_mail,nameId, log );
}


async function verify_doi(dAppUrl, dAppUrlAuth, node_url_alice, rpcAuthAlice, sender_mail, recipient_mail,nameId, log, callback){
    let our_recipient_mail =recipient_mail;
    if(Array.isArray(recipient_mail)){
        our_recipient_mail=recipient_mail[0];
    }
    const urlVerify = dAppUrl+'/api/v1/opt-in/verify';
    const recipient_public_key = Recipients.findOne({email: our_recipient_mail}).publicKey;
    let resultVerify ={};
    let statusVerify ={};

    const dataVerify = {
        recipient_mail: our_recipient_mail,
        sender_mail: sender_mail,
        name_id: nameId,
        recipient_public_key: recipient_public_key
    };

    const headersVerify = {
        'Content-Type':'application/json',
        'X-User-Id':dAppUrlAuth.userId,
        'X-Auth-Token':dAppUrlAuth.authToken
    };
    let running = true;
    let counter = 0;

    await (async function loop() {
        while(running && ++counter<50){ //trying 50x to get email from bobs mailbox
            try{
                testLogging('Step 5: verifying opt-in:', {data:dataVerify});
                const realdataVerify = { data: dataVerify, headers: headersVerify };
                resultVerify = getHttpGETdata(urlVerify, realdataVerify);
                testLogging('result /opt-in/verify:',{status:resultVerify.data.status,val:resultVerify.data.data.val} );
                statusVerify = resultVerify.statusCode;
                if(resultVerify.data.data.val===true) running = false;

            }catch(ex) {
                testLogging('trying to verify opt-in - so far no success:');
                generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
    })();
    try{
        if(statusVerify!=200) throw new AssertionError("Bad verify response",statusVerify,200);
        if(resultVerify.data.data.val != true) throw new Error("Verification did not return true");
        if(counter >= 50) throw new Error("could not verify DOI after retries");
        callback(null,true);
    }
    catch(error){
        callback(error,false);
    }
}

export function createUser(url,auth,username,templateURL,log){
    const headersUser = {
        'Content-Type':'application/json',
        'X-User-Id':auth.userId,
        'X-Auth-Token':auth.authToken
    }
    const mailTemplate = {
        "subject": "Hello i am "+username,
        "redirect": "https://www.doichain.org/vielen-dank/",
        "returnPath":  username+"-test@doichain.org",
        "templateURL": templateURL
    }
    const urlUsers = url+'/api/v1/users';
    const dataUser = {"username":username,"email":username+"-test@doichain.org","password":"password","mailTemplate":mailTemplate}

    const realDataUser= { data: dataUser, headers: headersUser};
    if(log) testLogging('createUser:', realDataUser);
    let res = getHttpPOST(urlUsers,realDataUser);
    if(log) testLogging("response",res);
    chai.assert.equal(200, res.statusCode);
    chai.assert.equal(res.data.status,"success");
    return res.data.data.userid;
}

export function findUser(userId){
    const res = Accounts.users.findOne({_id:userId});
    chai.expect(res).to.not.be.undefined;
    return res;
}

export function findOptIn(optInId,log){
    const res = OptIns.findOne({_id:optInId});
    if(log)testLogging(res,optInId);
    chai.expect(res).to.not.be.undefined;
    return res;
}

export function exportOptIns(url,auth,log){
    const headersUser = {
        'Content-Type':'application/json',
        'X-User-Id':auth.userId,
        'X-Auth-Token':auth.authToken
    };

    const urlExport = url+'/api/v1/export';
    const realDataUser= {headers: headersUser};
    let res = getHttpGETdata(urlExport,realDataUser);
    if(log) testLogging(res,log);
    chai.assert.equal(200, res.statusCode);
    chai.assert.equal(res.data.status,"success");
    return res.data.data;
}


export function requestConfirmVerifyBasicDoi(node_url_alice,rpcAuthAlice, dappUrlAlice,dataLoginAlice,dappUrlBob,recipient_mail,sender_mail,optionalData,recipient_pop3username, recipient_pop3password, log) {
    const syncFunc = Meteor.wrapAsync(request_confirm_verify_basic_doi);
    return syncFunc(node_url_alice,rpcAuthAlice, dappUrlAlice,dataLoginAlice,dappUrlBob, recipient_mail,sender_mail,optionalData,recipient_pop3username, recipient_pop3password, log);
}


async function request_confirm_verify_basic_doi(node_url_alice,rpcAuthAlice, dappUrlAlice,dataLoginAlice, dappUrlBob, recipient_mail,sender_mail_in,optionalData,recipient_pop3username, recipient_pop3password, log, callback) {
    let sender_mail = sender_mail_in;
    if(log) testLogging('log into alice and request DOI');
    let resultDataOptInTmp = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
    let resultDataOptIn = resultDataOptInTmp;

    if(Array.isArray(sender_mail_in)){              //Select master doi from senders and result
        if(log) testLogging('MASTER DOI: ',resultDataOptInTmp[0]);
        resultDataOptIn = resultDataOptInTmp[0];
        sender_mail = sender_mail_in[0];
    }


    //generating a block so transaction gets confirmed and delivered to bob.
    generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
    let running = true;
    let counter = 0;
    await (async function loop() {
        while(running && ++counter<50){ //trying 50x to get email from bobs mailbox
            try{
                testLogging('step 3: getting email!');
                const link2Confirm = fetchConfirmLinkFromPop3Mail("mail", 110, recipient_pop3username, recipient_pop3password, dappUrlBob, false);
                testLogging('step 4: confirming link',link2Confirm);
                if(link2Confirm!=null) running=false;
                confirmLink(link2Confirm);
                testLogging('confirmed')
            }catch(ex){
                testLogging('trying to get email - so far no success:');
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    })();
    let nameId=null;
    try{
        const nameId = getNameIdOfOptInFromRawTx(node_url_alice,rpcAuthAlice,resultDataOptIn.data.id,true);
        if(log) testLogging('got nameId',nameId);
    if(counter >= 50){
        throw new Error("email not found after retries");
    }
        generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
        testLogging('before verification');
        
        if(Array.isArray(sender_mail_in)){
            for (let index = 0; index < sender_mail_in.length; index++) {
                let tmpId = index==0 ? nameId : nameId+"-"+(index); //get nameid of coDOIs based on master
                testLogging("NameId of coDoi: ",tmpId);
            verifyDOI(dappUrlAlice, dataLoginAlice, node_url_alice, rpcAuthAlice, sender_mail_in[index], recipient_mail, tmpId, true);
            }
        }
        else{
            verifyDOI(dappUrlAlice, dataLoginAlice, node_url_alice, rpcAuthAlice, sender_mail, recipient_mail, nameId, true); //need to generate two blocks to make block visible on alice
        }
        testLogging('after verification');
        callback(null, {optIn: resultDataOptIn, nameId: nameId});
    }
    catch(error){
        callback(error, {optIn: resultDataOptIn, nameId: nameId});
    }

}

//export function updateUser(url,auth,updateId,templateURL,log){
export function updateUser(url,auth,updateId,mailTemplate,log){    
    const headersUser = {
        'Content-Type':'application/json',
        'X-User-Id':auth.userId,
        'X-Auth-Token':auth.authToken
    }

    const dataUser = {"mailTemplate":mailTemplate};
    if(log) testLogging('url:', url);
    const urlUsers = url+'/api/v1/users/'+updateId;
    const realDataUser= { data: dataUser, headers: headersUser};
    if(log) testLogging('updateUser:', realDataUser);
    let res = HTTP.put(urlUsers,realDataUser);
    if(log) testLogging("response",res);
    chai.assert.equal(200, res.statusCode);
    chai.assert.equal(res.data.status,"success");
    const usDat = Accounts.users.findOne({_id:updateId}).profile.mailTemplate;
    if(log) testLogging("InputTemplate",dataUser.mailTemplate);
    if(log) testLogging("ResultTemplate",usDat);
    chai.expect(usDat).to.not.be.undefined;
    chai.assert.equal(dataUser.mailTemplate.templateURL,usDat.templateURL);
    return usDat;
}

export function resetUsers(){
    Accounts.users.remove(
        {"username":
        {"$ne":"admin"}
        }
    );
}
