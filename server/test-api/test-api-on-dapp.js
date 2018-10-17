import {logBlockchain} from "../../imports/startup/server/log-configuration";
import {getHttpGETdata, getHttpPOST} from "../api/http";
import {chai} from 'meteor/practicalmeteor:chai';
import {OptIns} from "../../imports/api/opt-ins/opt-ins";
const headers = { 'Content-Type':'text/plain'  };
import {quotedPrintableDecode} from "emailjs-mime-codec";
import {Meteor} from "meteor/meteor";
import {Recipients} from "../../imports/api/recipients/recipients";
var POP3Client = require("poplib");

export function login(url, paramsLogin, log) {
    if(log) logBlockchain('dApp login.');

    const urlLogin = url+'/api/v1/login';
    const headersLogin = [{'Content-Type':'application/json'}];
    const realDataLogin= { params: paramsLogin, headers: headersLogin };

    const result = getHttpPOST(urlLogin, realDataLogin);

    if(log) logBlockchain('result login:',result);
    const statusCode = result.statusCode;
    const dataLogin = result.data;

    const statusLogin = dataLogin.status;
    chai.assert.equal(200, statusCode);
    chai.assert.equal('success', statusLogin);
    return dataLogin.data;
}

export function requestDOI(url, auth, recipient_mail, sender_mail, data,  log) {
    if(log) logBlockchain('requestDOI called.');

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

    if(log) logBlockchain("resultOptIn",resultOptIn);
    chai.assert.equal(200, resultOptIn.statusCode);
    chai.assert.equal('success',  resultOptIn.data.status);
    return resultOptIn.data;
}

export function getNameIdOfRawTransaction(url, auth, txId){

    const dataGetRawTransaction = {"jsonrpc": "1.0", "id":"getrawtransaction", "method": "getrawtransaction", "params": [txId,1] };
    const realdataGetRawTransaction = { auth: auth, data: dataGetRawTransaction, headers: headers };
    const resultGetRawTransaction = getHttpPOST(url, realdataGetRawTransaction);
    let nameId;
    if(resultGetRawTransaction.data.result.vout[1].scriptPubKey.nameOp!==undefined){
        nameId = resultGetRawTransaction.data.result.vout[1].scriptPubKey.nameOp.name;
    }
    else{
        nameId = resultGetRawTransaction.data.result.vout[0].scriptPubKey.nameOp.name;
    }
    chai.assert.equal(txId, resultGetRawTransaction.data.result.txid);
    return nameId;
}

export function getNameIdOfOptIn(url, auth, optInId, log){

        const our_optIn = OptIns.findOne({_id: optInId});
        chai.assert.equal(our_optIn._id,optInId);

        if(log) logBlockchain('optIn:',our_optIn);
        const nameId = getNameIdOfRawTransaction(url,auth,our_optIn.txId);
        chai.assert.equal("e/"+our_optIn.nameId, nameId);

        if(log) logBlockchain('nameId:',nameId);
        return nameId;
}

export function fetchConfirmLinkFromPop3Mail(hostname,port,username,password,alicedapp_url,log) {
    const syncFunc = Meteor.wrapAsync(fetch_confirm_link_from_pop3_mail);
    return syncFunc(hostname,port,username,password,alicedapp_url,log);
}

function fetch_confirm_link_from_pop3_mail(hostname,port,username,password,alicedapp_url,log,callback) {

    if(log)logBlockchain("logging bob into pop3 server");
    //https://github.com/ditesh/node-poplib/blob/master/demos/retrieve-all.js
    var client = new POP3Client(port, hostname, {
        tlserrs: false,
        enabletls: false,
        debug: true
    });

    //TODO refactor this into a separate function
    client.on("connect", function() {
        if(log) logBlockchain("CONNECT success",'');
        client.login(username, password);
        client.on("login", function(status, rawdata) {
            if (status) {
                if(log) logBlockchain("LOGIN/PASS success",'');
                client.list();

                client.on("list", function(status, msgcount, msgnumber, data, rawdata) {

                    if (status === false) {
                        const err = "LIST failed"+ msgnumber;
                        client.rset();
                        callback(err, null);
                        return;
                    } else {
                        if(log) logBlockchain("LIST success with " + msgcount + " element(s)",'');

                        chai.expect(msgcount).to.be.above(0, 'no email in bobs inbox');
                        if (msgcount > 0){
                            client.retr(1);
                            client.on("retr", function(status, msgnumber, maildata, rawdata) {

                                if (status === true) {
                                    if(log) logBlockchain("RETR success " + msgnumber);

                                    //https://github.com/emailjs/emailjs-mime-codec
                                    const html  = quotedPrintableDecode(maildata);
                                    const data =  html.substring(html.indexOf(alicedapp_url),html.indexOf("'",html.indexOf(alicedapp_url)));
                                    callback(null,data);
                                } else {
                                    const err = "RETR failed for msgnumber "+ msgnumber;
                                    client.rset();
                                    callback(err, null);
                                    return;
                                }
                            });
                        }
                        else{
                            const err = "empty mailbox";
                            callback(err, null);
                            client.quit();
                            return;
                        }
                    }
                });

            } else {
                const err = "LOGIN/PASS failed";
                callback(err, null);
                client.quit();
                return;
            }
        });
    });
}

export function verifyDOI(dAppUrl, sender_mail, recipient_mail,nameId, auth, log ){
    const urlVerify = dAppUrl+'/api/v1/opt-in/verify';
    const recipient_public_key = Recipients.findOne({email: recipient_mail}).publicKey;

    const dataVerify = {
        recipient_mail: recipient_mail,
        sender_mail: sender_mail,
        name_id: nameId,
        recipient_public_key: recipient_public_key
    };

    const headersVerify = {
        'Content-Type':'application/json',
        'X-User-Id':auth.userId,
        'X-Auth-Token':auth.authToken
    };

    if(log) logBlockchain('verifying opt-in:', {auth:auth, data:dataVerify,url:urlVerify});
    const realdataVerify = { data: dataVerify, headers: headersVerify };
    const resultVerify = getHttpGETdata(urlVerify, realdataVerify);

    if(log) logBlockchain('result /opt-in/verify:', resultVerify);
    const statusVerify = resultVerify.statusCode;
    chai.assert.equal(200, statusVerify);
    chai.assert.equal(true, resultVerify.data.data.val);
}