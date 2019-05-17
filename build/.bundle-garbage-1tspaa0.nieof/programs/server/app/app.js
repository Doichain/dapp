var require = meteorInstall({"server":{"test":{"test-api":{"test-api-on-dapp.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// server/test/test-api/test-api-on-dapp.js                                                                          //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({
  login: () => login,
  requestDOI: () => requestDOI,
  getNameIdOfRawTransaction: () => getNameIdOfRawTransaction,
  getNameIdOfOptInFromRawTx: () => getNameIdOfOptInFromRawTx,
  fetchConfirmLinkFromPop3Mail: () => fetchConfirmLinkFromPop3Mail,
  deleteAllEmailsFromPop3: () => deleteAllEmailsFromPop3,
  confirmLink: () => confirmLink,
  verifyDOI: () => verifyDOI,
  createUser: () => createUser,
  findUser: () => findUser,
  findOptIn: () => findOptIn,
  exportOptIns: () => exportOptIns,
  requestConfirmVerifyBasicDoi: () => requestConfirmVerifyBasicDoi,
  updateUser: () => updateUser,
  resetUsers: () => resetUsers
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 1);
let quotedPrintableDecode;
module.link("emailjs-mime-codec", {
  quotedPrintableDecode(v) {
    quotedPrintableDecode = v;
  }

}, 2);
let AssertionError;
module.link("assert", {
  AssertionError(v) {
    AssertionError = v;
  }

}, 3);
let OptInsCollection, Recipients, getHttpGET, getHttpGETdata, getHttpPOST, getHttpPUT, testLogging;
module.link("meteor/doichain:doichain-meteor-api", {
  OptInsCollection(v) {
    OptInsCollection = v;
  },

  RecipientsCollection(v) {
    Recipients = v;
  },

  httpGET(v) {
    getHttpGET = v;
  },

  httpGETdata(v) {
    getHttpGETdata = v;
  },

  httpPOST(v) {
    getHttpPOST = v;
  },

  httpPUT(v) {
    getHttpPUT = v;
  },

  testLog(v) {
    testLogging = v;
  }

}, 4);
let generatetoaddress;
module.link("./test-api-on-node", {
  generatetoaddress(v) {
    generatetoaddress = v;
  }

}, 5);
const headers = {
  'Content-Type': 'text/plain'
};

const os = require('os');

var POP3Client = require("poplib");

function login(url, paramsLogin, log) {
  if (log) testLogging('dApp login.');
  const urlLogin = url + '/api/v1/login';
  const headersLogin = [{
    'Content-Type': 'application/json'
  }];
  const realDataLogin = {
    params: paramsLogin,
    headers: headersLogin
  };
  const result = getHttpPOST(urlLogin, realDataLogin);
  if (log) testLogging('result login:', result);
  const statusCode = result.statusCode;
  const dataLogin = result.data;
  const statusLogin = dataLogin.status;
  chai.assert.equal(200, statusCode);
  chai.assert.equal('success', statusLogin);
  return dataLogin.data;
}

function requestDOI(url, auth, recipient_mail, sender_mail, data, log) {
  if (log) testLogging('step 1 - requestDOI called via REST');
  const urlOptIn = url + '/api/v1/opt-in';
  let dataOptIn = {};

  if (data) {
    dataOptIn = {
      "recipient_mail": recipient_mail,
      "sender_mail": sender_mail,
      "data": JSON.stringify(data)
    };
  } else {
    dataOptIn = {
      "recipient_mail": recipient_mail,
      "sender_mail": sender_mail
    };
  }

  const headersOptIn = {
    'Content-Type': 'application/json',
    'X-User-Id': auth.userId,
    'X-Auth-Token': auth.authToken
  };
  const realDataOptIn = {
    data: dataOptIn,
    headers: headersOptIn
  };
  const resultOptIn = getHttpPOST(urlOptIn, realDataOptIn); //logBlockchain("resultOptIn",resultOptIn);

  chai.assert.equal(200, resultOptIn.statusCode);
  testLogging("RETURNED VALUES: ", resultOptIn);

  if (Array.isArray(resultOptIn.data)) {
    testLogging('adding coDOIs');
    resultOptIn.data.forEach(element => {
      chai.assert.equal('success', element.status);
    });
  } else {
    testLogging('adding DOI');
    chai.assert.equal('success', resultOptIn.data.status);
  }

  return resultOptIn.data;
}

function getNameIdOfRawTransaction(url, auth, txId) {
  testLogging('pre-start of getNameIdOfRawTransaction', txId);
  const syncFunc = Meteor.wrapAsync(get_nameid_of_raw_transaction);
  return syncFunc(url, auth, txId);
}

function get_nameid_of_raw_transaction(url, auth, txId, callback) {
  let nameId = '';
  let running = true;
  let counter = 0;
  testLogging('start getNameIdOfRawTransaction', txId);

  (function loop() {
    return Promise.asyncApply(() => {
      while (running && ++counter < 1500) {
        //trying 50x to get email from bobs mailbox
        try {
          testLogging('trying to get transaction', txId);
          const dataGetRawTransaction = {
            "jsonrpc": "1.0",
            "id": "getrawtransaction",
            "method": "getrawtransaction",
            "params": [txId, 1]
          };
          const realdataGetRawTransaction = {
            auth: auth,
            data: dataGetRawTransaction,
            headers: headers
          };
          const resultGetRawTransaction = getHttpPOST(url, realdataGetRawTransaction);

          if (resultGetRawTransaction.data.result.vout[1].scriptPubKey.nameOp !== undefined) {
            nameId = resultGetRawTransaction.data.result.vout[1].scriptPubKey.nameOp.name;
          } else {
            nameId = resultGetRawTransaction.data.result.vout[0].scriptPubKey.nameOp.name;
          }

          if (resultGetRawTransaction.data.result.txid !== undefined) {
            testLogging('confirmed txid:' + resultGetRawTransaction.data.result.txid);
            running = false;
          } //chai.assert.equal(txId, resultGetRawTransaction.data.result.txid);

        } catch (ex) {
          testLogging('trying to get email - so far no success:', counter);
          Promise.await(new Promise(resolve => setTimeout(resolve, 2000)));
        }
      }

      testLogging('end of getNameIdOfRawTransaction returning nameId', nameId);
      callback(null, nameId);
    });
  })();
}

function getNameIdOfOptInFromRawTx(url, auth, optInId, log) {
  const syncFunc = Meteor.wrapAsync(get_nameid_of_optin_from_rawtx);
  return syncFunc(url, auth, optInId, log);
}

function get_nameid_of_optin_from_rawtx(url, auth, optInId, log, callback) {
  return Promise.asyncApply(() => {
    testLogging('step 2 - getting nameId of raw transaction from blockchain');
    if (log) testLogging('the txId will be added a bit later as soon as the schedule picks up the job and inserts it into the blockchain. it does not happen immediately. waiting...');
    let running = true;
    let counter = 0;
    let our_optIn = null;
    let nameId = null;
    Promise.await(function loop() {
      return Promise.asyncApply(() => {
        while (running && ++counter < 50) {
          //trying 50x to get opt-in
          testLogging('find opt-In', optInId);
          our_optIn = OptInsCollection.findOne({
            _id: optInId
          });

          if (our_optIn.txId !== undefined) {
            testLogging('found txId of opt-In', our_optIn.txId);
            running = false;
          } else {
            testLogging('did not find txId yet for opt-In-Id', our_optIn._id);
          }

          Promise.await(new Promise(resolve => setTimeout(resolve, 3000)));
        }
      });
    }());

    try {
      chai.assert.equal(our_optIn._id, optInId);
      if (log) testLogging('optIn:', our_optIn);
      nameId = getNameIdOfRawTransaction(url, auth, our_optIn.txId);
      chai.assert.equal("e/" + our_optIn.nameId, nameId);
      if (log) testLogging('nameId:', nameId);
      chai.assert.notEqual(nameId, null);
      chai.assert.isBelow(counter, 50, "OptIn not found after retries");
      callback(null, nameId);
    } catch (error) {
      callback(error, nameId);
    }
  });
}

function fetchConfirmLinkFromPop3Mail(hostname, port, username, password, alicedapp_url, log) {
  const syncFunc = Meteor.wrapAsync(fetch_confirm_link_from_pop3_mail);
  return syncFunc(hostname, port, username, password, alicedapp_url, log);
}

function fetch_confirm_link_from_pop3_mail(hostname, port, username, password, alicedapp_url, log, callback) {
  testLogging("step 3 - getting email from bobs inbox"); //https://github.com/ditesh/node-poplib/blob/master/demos/retrieve-all.js

  var client = new POP3Client(port, hostname, {
    tlserrs: false,
    enabletls: false,
    debug: false
  });
  client.on("connect", function () {
    testLogging("CONNECT success");
    client.login(username, password);
    client.on("login", function (status, rawdata) {
      if (status) {
        testLogging("LOGIN/PASS success");
        client.list();
        client.on("list", function (status, msgcount, msgnumber, data, rawdata) {
          if (status === false) {
            const err = "LIST failed" + msgnumber;
            client.rset();
            callback(err, null);
            return;
          } else {
            if (log) testLogging("LIST success with " + msgcount + " element(s)", ''); //chai.expect(msgcount).to.be.above(0, 'no email in bobs inbox');

            if (msgcount > 0) {
              client.retr(1);
              client.on("retr", function (status, msgnumber, maildata, rawdata) {
                if (status === true) {
                  if (log) testLogging("RETR success " + msgnumber); //https://github.com/emailjs/emailjs-mime-codec

                  let html = quotedPrintableDecode(maildata);

                  if (os.hostname() !== 'regtest') {
                    //this is probably a selenium test from outside docker  - so replace URL so it can be confirmed
                    html = replaceAll(html, 'http://172.20.0.8', 'http://localhost'); //TODO put this IP inside a config
                  }

                  chai.expect(html.indexOf(alicedapp_url)).to.not.equal(-1);
                  const linkdata = html.substring(html.indexOf(alicedapp_url), html.indexOf("'", html.indexOf(alicedapp_url)));
                  chai.expect(linkdata).to.not.be.null;
                  if (log && !(log === true)) chai.expect(html.indexOf(log)).to.not.equal(-1);
                  const requestData = {
                    "linkdata": linkdata,
                    "html": html
                  };
                  client.dele(msgnumber);
                  client.on("dele", function (status, msgnumber, data, rawdata) {
                    client.quit();
                    client.end();
                    client = null;
                    callback(null, linkdata);
                  });
                } else {
                  const err = "RETR failed for msgnumber " + msgnumber;
                  client.rset();
                  client.end();
                  client = null;
                  callback(err, null);
                  return;
                }
              });
            } else {
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

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function deleteAllEmailsFromPop3(hostname, port, username, password, log) {
  const syncFunc = Meteor.wrapAsync(delete_all_emails_from_pop3);
  return syncFunc(hostname, port, username, password, log);
}

function delete_all_emails_from_pop3(hostname, port, username, password, log, callback) {
  testLogging("deleting all emails from bobs inbox"); //https://github.com/ditesh/node-poplib/blob/master/demos/retrieve-all.js

  var client = new POP3Client(port, hostname, {
    tlserrs: false,
    enabletls: false,
    debug: false
  });
  client.on("connect", function () {
    testLogging("CONNECT success");
    client.login(username, password);
    client.on("login", function (status, rawdata) {
      if (status) {
        testLogging("LOGIN/PASS success");
        client.list();
        client.on("list", function (status, msgcount, msgnumber, data, rawdata) {
          if (status === false) {
            const err = "LIST failed" + msgnumber;
            client.rset();
            callback(err, null);
            return;
          } else {
            if (log) testLogging("LIST success with " + msgcount + " element(s)", ''); //chai.expect(msgcount).to.be.above(0, 'no email in bobs inbox');

            if (msgcount > 0) {
              for (let i = 0; i <= msgcount; i++) {
                client.dele(i + 1);
                client.on("dele", function (status, msgnumber, data, rawdata) {
                  testLogging("deleted email" + (i + 1) + " status:" + status);

                  if (i == msgcount - 1) {
                    client.quit();
                    client.end();
                    client = null;
                    if (log) testLogging("all emails deleted");
                    callback(null, 'all emails deleted');
                  }
                });
              }
            } else {
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

function confirmLink(confirmLink) {
  const syncFunc = Meteor.wrapAsync(confirm_link);
  return syncFunc(confirmLink);
}

function confirm_link(confirmLink, callback) {
  testLogging("clickable link:", confirmLink);
  const doiConfirmlinkResult = getHttpGET(confirmLink, '');

  try {
    chai.expect(doiConfirmlinkResult.content).to.have.string('ANMELDUNG ERFOLGREICH');
    chai.expect(doiConfirmlinkResult.content).to.have.string('Vielen Dank für Ihre Anmeldung');
    chai.expect(doiConfirmlinkResult.content).to.have.string('Ihre Anmeldung war erfolgreich.');
    chai.assert.equal(200, doiConfirmlinkResult.statusCode);
    callback(null, true);
  } catch (e) {
    callback(e, null);
  }
}

function verifyDOI(dAppUrl, dAppUrlAuth, node_url_alice, rpcAuthAlice, sender_mail, recipient_mail, nameId, log) {
  const syncFunc = Meteor.wrapAsync(verify_doi);
  return syncFunc(dAppUrl, dAppUrlAuth, node_url_alice, rpcAuthAlice, sender_mail, recipient_mail, nameId, log);
}

function verify_doi(dAppUrl, dAppUrlAuth, node_url_alice, rpcAuthAlice, sender_mail, recipient_mail, nameId, log, callback) {
  return Promise.asyncApply(() => {
    let our_recipient_mail = recipient_mail;

    if (Array.isArray(recipient_mail)) {
      our_recipient_mail = recipient_mail[0];
    }

    const urlVerify = dAppUrl + '/api/v1/opt-in/verify';
    const recipient_public_key = Recipients.findOne({
      email: our_recipient_mail
    }).publicKey;
    let resultVerify = {};
    let statusVerify = {};
    const dataVerify = {
      recipient_mail: our_recipient_mail,
      sender_mail: sender_mail,
      name_id: nameId,
      recipient_public_key: recipient_public_key
    };
    const headersVerify = {
      'Content-Type': 'application/json',
      'X-User-Id': dAppUrlAuth.userId,
      'X-Auth-Token': dAppUrlAuth.authToken
    };
    let running = true;
    let counter = 0;
    Promise.await(function loop() {
      return Promise.asyncApply(() => {
        while (running && ++counter < 50) {
          //trying 50x to get email from bobs mailbox
          try {
            testLogging('Step 5: verifying opt-in:', {
              data: dataVerify
            });
            const realdataVerify = {
              data: dataVerify,
              headers: headersVerify
            };
            resultVerify = getHttpGETdata(urlVerify, realdataVerify);
            testLogging('result /opt-in/verify:', {
              status: resultVerify.data.status,
              val: resultVerify.data.data.val
            });
            statusVerify = resultVerify.statusCode;
            if (resultVerify.data.data.val === true) running = false;
          } catch (ex) {
            testLogging('trying to verify opt-in - so far no success:', ex); //generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
            //await new Promise(resolve => setTimeout(resolve, 2000));
          } finally {
            generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
            Promise.await(new Promise(resolve => setTimeout(resolve, 2000)));
          }
        }
      });
    }());

    try {
      chai.assert.equal(statusVerify, 200);
      chai.assert.equal(resultVerify.data.data.val, true);
      chai.assert.isBelow(counter, 50);
      callback(null, true);
    } catch (error) {
      callback(error, false);
    }
  });
}

function createUser(url, auth, username, templateURL, log) {
  const headersUser = {
    'Content-Type': 'application/json',
    'X-User-Id': auth.userId,
    'X-Auth-Token': auth.authToken
  };
  const mailTemplate = {
    "subject": "Hello i am " + username,
    "redirect": "https://www.doichain.org/vielen-dank/",
    "returnPath": username + "-test@doichain.org",
    "templateURL": templateURL
  };
  const urlUsers = url + '/api/v1/users';
  const dataUser = {
    "username": username,
    "email": username + "-test@doichain.org",
    "password": "password",
    "mailTemplate": mailTemplate
  };
  const realDataUser = {
    data: dataUser,
    headers: headersUser
  };
  if (log) testLogging('createUser:', realDataUser);
  let res = getHttpPOST(urlUsers, realDataUser);
  if (log) testLogging("response", res);
  chai.assert.equal(200, res.statusCode);
  chai.assert.equal(res.data.status, "success");
  return res.data.data.userid;
}

function findUser(userId) {
  const res = Accounts.users.findOne({
    _id: userId
  });
  chai.expect(res).to.not.be.undefined;
  return res;
}

function findOptIn(optInId, log) {
  const res = OptInsCollection.findOne({
    _id: optInId
  });
  if (log) testLogging(res, optInId);
  chai.expect(res).to.not.be.undefined;
  return res;
}

function exportOptIns(url, auth, log) {
  const headersUser = {
    'Content-Type': 'application/json',
    'X-User-Id': auth.userId,
    'X-Auth-Token': auth.authToken
  };
  const urlExport = url + '/api/v1/export';
  const realDataUser = {
    headers: headersUser
  };
  let res = getHttpGETdata(urlExport, realDataUser);
  if (log) testLogging(res, log);
  chai.assert.equal(200, res.statusCode);
  chai.assert.equal(res.data.status, "success");
  return res.data.data;
}

function requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, optionalData, recipient_pop3username, recipient_pop3password, log) {
  const syncFunc = Meteor.wrapAsync(request_confirm_verify_basic_doi);
  return syncFunc(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, optionalData, recipient_pop3username, recipient_pop3password, log);
}

function request_confirm_verify_basic_doi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail_in, optionalData, recipient_pop3username, recipient_pop3password, log, callback) {
  return Promise.asyncApply(() => {
    if (log) testLogging('node_url_alice', node_url_alice);
    if (log) testLogging('rpcAuthAlice', rpcAuthAlice);
    if (log) testLogging('dappUrlAlice', dappUrlAlice);
    if (log) testLogging('dataLoginAlice', dataLoginAlice);
    if (log) testLogging('dappUrlBob', dappUrlBob);
    if (log) testLogging('recipient_mail', recipient_mail);
    if (log) testLogging('sender_mail_in', sender_mail_in);
    if (log) testLogging('optionalData', optionalData);
    if (log) testLogging('recipient_pop3username', recipient_pop3username);
    if (log) testLogging('recipient_pop3password', recipient_pop3password);
    let sender_mail = sender_mail_in;
    if (log) testLogging('log into alice and request DOI');
    let resultDataOptInTmp = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, optionalData, true);
    let resultDataOptIn = resultDataOptInTmp;

    if (Array.isArray(sender_mail_in)) {
      //Select master doi from senders and result
      if (log) testLogging('MASTER DOI: ', resultDataOptInTmp[0]);
      resultDataOptIn = resultDataOptInTmp[0];
      sender_mail = sender_mail_in[0];
    } //generating a block so transaction gets confirmed and delivered to bob.


    generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
    let running = true;
    let counter = 0;
    let confirmedLink = "";
    confirmedLink = Promise.await(function loop() {
      return Promise.asyncApply(() => {
        while (running && ++counter < 50) {
          //trying 50x to get email from bobs mailbox
          try {
            testLogging('step 3: getting email from hostname!', os.hostname());
            const link2Confirm = fetchConfirmLinkFromPop3Mail(os.hostname() == 'regtest' ? 'mail' : 'localhost', 110, recipient_pop3username, recipient_pop3password, dappUrlBob, false);
            testLogging('step 4: confirming link', link2Confirm);

            if (link2Confirm != null) {
              running = false;
              confirmLink(link2Confirm);
              confirmedLink = link2Confirm;
              testLogging('confirmed');
              return link2Confirm;
            }
          } catch (ex) {
            testLogging('trying to get email - so far no success:', counter);
            Promise.await(new Promise(resolve => setTimeout(resolve, 3000)));
          }
        }
      });
    }());
    /* if(os.hostname()!=='regtest'){ //if this is a selenium test from outside docker - don't verify DOI here for simplicity
             testLogging('returning to test without DOI-verification while doing selenium outside docker');
             callback(null, {status: "DOI confirmed"});
            // return;
     }else{*/

    let nameId = null;

    try {
      chai.assert.isBelow(counter, 50); //confirmLink(confirmedLink);

      const nameId = getNameIdOfOptInFromRawTx(node_url_alice, rpcAuthAlice, resultDataOptIn.data.id, true);
      if (log) testLogging('got nameId', nameId);
      generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
      testLogging('before verification');

      if (Array.isArray(sender_mail_in)) {
        for (let index = 0; index < sender_mail_in.length; index++) {
          let tmpId = index == 0 ? nameId : nameId + "-" + index; //get nameid of coDOIs based on master

          testLogging("NameId of coDoi: ", tmpId);
          verifyDOI(dappUrlAlice, dataLoginAlice, node_url_alice, rpcAuthAlice, sender_mail_in[index], recipient_mail, tmpId, true);
        }
      } else {
        verifyDOI(dappUrlAlice, dataLoginAlice, node_url_alice, rpcAuthAlice, sender_mail, recipient_mail, nameId, true); //need to generate two blocks to make block visible on alice
      }

      testLogging('after verification');
      callback(null, {
        optIn: resultDataOptIn,
        nameId: nameId
      });
    } catch (error) {
      callback(error, {
        optIn: resultDataOptIn,
        nameId: nameId
      });
    } // }

  });
}

function updateUser(url, auth, updateId, mailTemplate, log) {
  const headersUser = {
    'Content-Type': 'application/json',
    'X-User-Id': auth.userId,
    'X-Auth-Token': auth.authToken
  };
  const dataUser = {
    "mailTemplate": mailTemplate
  };
  if (log) testLogging('url:', url);
  const urlUsers = url + '/api/v1/users/' + updateId;
  const realDataUser = {
    data: dataUser,
    headers: headersUser
  };
  if (log) testLogging('updateUser:', realDataUser);
  let res = getHttpPUT(urlUsers, realDataUser);
  if (log) testLogging("response", res);
  chai.assert.equal(200, res.statusCode);
  chai.assert.equal(res.data.status, "success");
  const usDat = Accounts.users.findOne({
    _id: updateId
  }).profile.mailTemplate;
  if (log) testLogging("InputTemplate", dataUser.mailTemplate);
  if (log) testLogging("ResultTemplate", usDat);
  chai.expect(usDat).to.not.be.undefined;
  chai.assert.equal(dataUser.mailTemplate.templateURL, usDat.templateURL);
  return usDat;
}

function resetUsers() {
  Accounts.users.remove({
    "username": {
      "$ne": "admin"
    }
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"test-api-on-node.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// server/test/test-api/test-api-on-node.js                                                                          //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({
  initBlockchain: () => initBlockchain,
  isNodeAlive: () => isNodeAlive,
  isNodeAliveAndConnectedToHost: () => isNodeAliveAndConnectedToHost,
  importPrivKey: () => importPrivKey,
  getNewAddress: () => getNewAddress,
  generatetoaddress: () => generatetoaddress,
  getBalance: () => getBalance,
  waitToStartContainer: () => waitToStartContainer,
  deleteOptInsFromAliceAndBob: () => deleteOptInsFromAliceAndBob,
  start3rdNode: () => start3rdNode,
  stopDockerBob: () => stopDockerBob,
  getContainerIdOfName: () => getContainerIdOfName,
  startDockerBob: () => startDockerBob,
  doichainAddNode: () => doichainAddNode,
  getDockerStatus: () => getDockerStatus,
  connectDockerBob: () => connectDockerBob,
  runAndWait: () => runAndWait
});
let getHttpPOST, testLogging, logBlockchain;
module.link("meteor/doichain:doichain-meteor-api", {
  httpPOST(v) {
    getHttpPOST = v;
  },

  testLog(v) {
    testLogging = logBlockchain = v;
  }

}, 0);
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 1);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 2);

const os = require('os');

let sudo = os.hostname() == 'regtest' ? 'sudo ' : '';
const headers = {
  'Content-Type': 'text/plain'
};

const exec = require('child_process').exec;

function initBlockchain(node_url_alice, node_url_bob, rpcAuth, privKeyBob, log) {
  //connect nodes (alice & bob) and generate DOI (only if not connected)
  testLogging("importing private key:" + privKeyBob);
  importPrivKey(node_url_bob, rpcAuth, privKeyBob, true, log);

  try {
    const aliceContainerId = getContainerIdOfName('alice');
    const statusDocker = JSON.parse(getDockerStatus(aliceContainerId));
    logBlockchain("real balance :" + statusDocker.balance, Number(statusDocker.balance) > 0);
    logBlockchain("connections:" + statusDocker.connections);

    if (Number(statusDocker.connections) == 0) {
      isNodeAlive(node_url_alice, rpcAuth, log);
      isNodeAliveAndConnectedToHost(node_url_bob, rpcAuth, 'alice', log);
    }

    if (Number(statusDocker.balance) > 0) {
      logBlockchain("enough founding for alice - blockchain already connected");
      global.aliceAddress = getNewAddress(node_url_alice, rpcAuth, log);
      return;
    }
  } catch (exception) {
    logBlockchain("connecting blockchain and mining some coins");
  }

  global.aliceAddress = getNewAddress(node_url_alice, rpcAuth, log);
  generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 210); //110 blocks to new address! 110 blöcke *25 coins
}

function wait_to_start_container(startedContainerId, callback) {
  let running = true;
  let counter = 0; //here we make sure bob gets started and connected again in probably all possible sitautions

  while (running) {
    try {
      const statusDocker = JSON.parse(getDockerStatus(startedContainerId));
      testLogging("getinfo", statusDocker);
      testLogging("version:" + statusDocker.version);
      testLogging("balance:" + statusDocker.balance);
      testLogging("connections:" + statusDocker.connections);

      if (statusDocker.connections === 0) {
        doichainAddNode(startedContainerId);
      }

      running = false;
    } catch (error) {
      testLogging("statusDocker problem trying to start Bobs node inside docker container:", error);

      try {
        connectDockerBob(startedContainerId);
      } catch (error2) {
        testLogging("could not start bob:", error2);
      }

      if (counter == 50) running = false;
    }

    counter++;
  }

  callback(null, startedContainerId);
}

function delete_options_from_alice_and_bob(callback) {
  const containerId = getContainerIdOfName('mongo');
  testLogging('containerId of mongo:', containerId);
  exec((global.inside_docker ? 'sudo' : '') + 'docker exec ' + containerId + ' bash -c "mongo < /tmp/delete_collections.sh"', (e, stdout, stderr) => {
    testLogging((global.inside_docker ? 'sudo' : '') + 'docker exec ', {
      stderr: stderr,
      stdout: stdout
    });
    callback(stderr, stdout);
  });
}

function isNodeAlive(url, auth, log) {
  if (log) testLogging('isNodeAlive called to url', url);
  const dataGetNetworkInfo = {
    "jsonrpc": "1.0",
    "id": "getnetworkinfo",
    "method": "getnetworkinfo",
    "params": []
  };
  const realdataGetNetworkInfo = {
    auth: auth,
    data: dataGetNetworkInfo,
    headers: headers
  };
  const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
  const statusGetNetworkInfo = resultGetNetworkInfo.statusCode;
  chai.assert.equal(200, statusGetNetworkInfo);
  if (log) testLogging('resultGetNetworkInfo:', resultGetNetworkInfo); // getnetworkinfo | jq '.localaddresses[0].address'
}

function isNodeAliveAndConnectedToHost(url, auth, host, log) {
  if (log) testLogging('isNodeAliveAndConnectedToHost called');
  isNodeAlive(url, auth, log);
  const dataGetNetworkInfo = {
    "jsonrpc": "1.0",
    "id": "addnode",
    "method": "addnode",
    "params": ['alice', 'onetry']
  };
  const realdataGetNetworkInfo = {
    auth: auth,
    data: dataGetNetworkInfo,
    headers: headers
  };
  const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
  const statusAddNode = resultGetNetworkInfo.statusCode;
  if (log) testLogging('addnode:', statusAddNode);
  chai.assert.equal(200, statusAddNode);
  const dataGetPeerInfo = {
    "jsonrpc": "1.0",
    "id": "getpeerinfo",
    "method": "getpeerinfo",
    "params": []
  };
  const realdataGetPeerInfo = {
    auth: auth,
    data: dataGetPeerInfo,
    headers: headers
  };
  const resultGetPeerInfo = getHttpPOST(url, realdataGetPeerInfo);
  const statusGetPeerInfo = resultGetPeerInfo.statusCode;
  if (log) testLogging('resultGetPeerInfo:', resultGetPeerInfo);
  chai.assert.equal(200, statusGetPeerInfo);
  chai.assert.isAbove(resultGetPeerInfo.data.result.length, 0, 'no connection to other nodes! '); //chai.expect(resultGetPeerInfo.data.result).to.have.lengthOf.at.least(1);
}

function importPrivKey(url, auth, privKey, rescan, log) {
  if (log) testLogging('importPrivKey called', '');
  const data_importprivkey = {
    "jsonrpc": "1.0",
    "id": "importprivkey",
    "method": "importprivkey",
    "params": [privKey]
  };
  const realdata_importprivkey = {
    auth: auth,
    data: data_importprivkey,
    headers: headers
  };
  const result = getHttpPOST(url, realdata_importprivkey);
  if (log) testLogging('result:', result);
}

function getNewAddress(url, auth, log) {
  if (log) testLogging('getNewAddress called');
  const dataGetNewAddress = {
    "jsonrpc": "1.0",
    "id": "getnewaddress",
    "method": "getnewaddress",
    "params": []
  };
  const realdataGetNewAddress = {
    auth: auth,
    data: dataGetNewAddress,
    headers: headers
  };
  const resultGetNewAddress = getHttpPOST(url, realdataGetNewAddress);
  const statusOptInGetNewAddress = resultGetNewAddress.statusCode;
  const newAddress = resultGetNewAddress.data.result;
  chai.assert.equal(200, statusOptInGetNewAddress);
  chai.expect(resultGetNewAddress.data.error).to.be.null;
  chai.expect(newAddress).to.not.be.null;
  if (log) testLogging(newAddress);
  return newAddress;
}

function generatetoaddress(url, auth, toaddress, amount, log) {
  const dataGenerate = {
    "jsonrpc": "1.0",
    "id": "generatetoaddress",
    "method": "generatetoaddress",
    "params": [amount, toaddress]
  };
  const headersGenerates = {
    'Content-Type': 'text/plain'
  };
  const realdataGenerate = {
    auth: auth,
    data: dataGenerate,
    headers: headersGenerates
  };
  const resultGenerate = getHttpPOST(url, realdataGenerate);
  const statusResultGenerate = resultGenerate.statusCode;
  if (log) testLogging('statusResultGenerate:', statusResultGenerate);
  chai.assert.equal(200, statusResultGenerate);
  chai.expect(resultGenerate.data.error).to.be.null;
  chai.expect(resultGenerate.data.result).to.not.be.null;
}

function getBalance(url, auth, log) {
  const dataGetBalance = {
    "jsonrpc": "1.0",
    "id": "getbalance",
    "method": "getbalance",
    "params": []
  };
  const realdataGetBalance = {
    auth: auth,
    data: dataGetBalance,
    headers: headers
  };
  const resultGetBalance = getHttpPOST(url, realdataGetBalance);
  if (log) testLogging('resultGetBalance:', resultGetBalance.data.result);
  return resultGetBalance.data.result;
}

function get_container_id_of_name(name, callback) {
  exec(sudo + 'docker ps --filter "name=' + name + '" | cut -f1 -d" " | sed \'1d\'', (e, stdout, stderr) => {
    if (e != null) {
      testLogging('cannot find ' + name + ' node ' + stdout, stderr);
      return null;
    }

    const bobsContainerId = stdout.toString().trim(); //.substring(0,stdout.toString().length-1); //remove last char since ins a line break

    callback(stderr, bobsContainerId);
  });
}

function stop_docker_bob(callback) {
  const bobsContainerId = getContainerIdOfName('bob');
  testLogging('stopping Bob with container-id: ' + bobsContainerId);

  try {
    exec(sudo + 'docker stop ' + bobsContainerId, (e, stdout, stderr) => {
      testLogging('stopping Bob with container-id: ', {
        stdout: stdout,
        stderr: stderr
      });
      callback(null, bobsContainerId);
    });
  } catch (e) {
    testLogging('couldnt stop bobs node', e);
  }
}

function doichain_add_node(containerId, callback) {
  exec(sudo + 'docker exec ' + containerId + ' doichain-cli addnode alice onetry', (e, stdout, stderr) => {
    testLogging('bob ' + containerId + ' connected? ', {
      stdout: stdout,
      stderr: stderr
    });
    callback(stderr, stdout);
  });
}

function get_docker_status(containerId, callback) {
  logBlockchain('containerId ' + containerId + ' running? ');
  exec(sudo + 'docker exec ' + containerId + ' doichain-cli -getinfo', (e, stdout, stderr) => {
    testLogging('containerId ' + containerId + ' status: ', {
      stdout: stdout,
      stderr: stderr
    });
    callback(stderr, stdout);
  });
}

function start_docker_bob(bobsContainerId, callback) {
  exec(sudo + 'docker start ' + bobsContainerId, (e, stdout, stderr) => {
    testLogging('started bobs node again: ' + bobsContainerId, {
      stdout: stdout,
      stderr: stderr
    });
    callback(stderr, stdout.toString().trim()); //remove line break from the end
  });
}

function connect_docker_bob(bobsContainerId, callback) {
  exec(sudo + 'docker exec ' + bobsContainerId + ' doichaind -regtest -daemon -reindex -addnode=alice', (e, stdout, stderr) => {
    testLogging('restarting doichaind on bobs node and connecting with alice: ', {
      stdout: stdout,
      stderr: stderr
    });
    callback(stderr, stdout);
  });
}

function start_3rd_node(callback) {
  exec(sudo + 'docker start 3rd_node', (e, stdout, stderr) => {
    testLogging('trying to start 3rd_node', {
      stdout: stdout,
      stderr: stderr
    });

    if (stderr) {
      exec(sudo + 'docker network ls |grep doichain | cut -f9 -d" "', (e, stdout, stderr) => {
        const network = stdout.toString().substring(0, stdout.toString().length - 1);
        testLogging('connecting 3rd node to docker network: ' + network);
        exec(sudo + 'docker run --expose=18332 ' + '-e REGTEST=true ' + '-e DOICHAIN_VER=0.16.3.2 ' + '-e RPC_ALLOW_IP=::/0 ' + '-e CONNECTION_NODE=alice ' + '-e RPC_PASSWORD=generated-password ' + '--name=3rd_node ' + '--dns=172.20.0.5  ' + '--dns=8.8.8.8 ' + '--dns-search=ci-doichain.org ' + '--ip=172.20.0.10 ' + '--network=' + network + ' -d doichain/core:0.16.3.2', (e, stdout, stderr) => {
          callback(stderr, stdout);
        });
      });
    } else {
      callback(stderr, stdout);
    }
  });
}

function run_and_wait(runfunction, seconds, callback) {
  Meteor.setTimeout(function () {
    runfunction();
    callback(null, true);
  }, seconds + 1000);
}

function waitToStartContainer(containerId) {
  const syncFunc = Meteor.wrapAsync(wait_to_start_container);
  return syncFunc(containerId);
}

function deleteOptInsFromAliceAndBob() {
  const syncFunc = Meteor.wrapAsync(delete_options_from_alice_and_bob);
  return syncFunc();
}

function start3rdNode() {
  const syncFunc = Meteor.wrapAsync(start_3rd_node);
  return syncFunc();
}

function stopDockerBob() {
  const syncFunc = Meteor.wrapAsync(stop_docker_bob);
  return syncFunc();
}

function getContainerIdOfName(name) {
  const syncFunc = Meteor.wrapAsync(get_container_id_of_name);
  return syncFunc(name);
}

function startDockerBob(containerId) {
  const syncFunc = Meteor.wrapAsync(start_docker_bob);
  return syncFunc(containerId);
}

function doichainAddNode(containerId) {
  const syncFunc = Meteor.wrapAsync(doichain_add_node);
  return syncFunc(containerId);
}

function getDockerStatus(containerId) {
  const syncFunc = Meteor.wrapAsync(get_docker_status);
  return syncFunc(containerId);
}

function connectDockerBob(containerId) {
  const syncFunc = Meteor.wrapAsync(connect_docker_bob);
  return syncFunc(containerId);
}

function runAndWait(runfunction, seconds) {
  const syncFunc = Meteor.wrapAsync(run_and_wait);
  return syncFunc(seconds);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"0-basic-doi-tests.0.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// server/test/0-basic-doi-tests.0.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);
let testLog;
module.link("meteor/doichain:doichain-meteor-api", {
  testLog(v) {
    testLog = v;
  }

}, 1);
let deleteOptInsFromAliceAndBob, getBalance, initBlockchain;
module.link("./test-api/test-api-on-node", {
  deleteOptInsFromAliceAndBob(v) {
    deleteOptInsFromAliceAndBob = v;
  },

  getBalance(v) {
    getBalance = v;
  },

  initBlockchain(v) {
    initBlockchain = v;
  }

}, 2);
global.inside_docker = false;
const log = true;
global.node_url_alice = 'http://172.20.0.6:18332/';
if (!global.inside_docker) global.node_url_alice = 'http://localhost:18543/';
global.node_url_bob = 'http://172.20.0.7:18332/';
if (!global.inside_docker) global.node_url_bob = 'http://localhost:18544/';
global.rpcAuthAlice = "admin:generated-password";
global.rpcAuth = "admin:generated-password";
const privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj";
global.dappUrlAlice = "http://localhost:3000";
global.dappUrlBob = global.insde_docker ? "http://172.20.0.8:4000" : "http://localhost:4000";
global.dAppLogin = {
  "username": "admin",
  "password": "password"
};

if (Meteor.isAppTest) {
  describe('basic-doi-test-0', function () {
    this.timeout(0);
    before(function () {
      testLog("removing OptIns,Recipients,Senders", '');
      deleteOptInsFromAliceAndBob();
    });
    it('should create a RegTest Doichain with alice and bob and some Doi - coins', function () {
      initBlockchain(global.node_url_alice, global.node_url_bob, global.rpcAuth, privKeyBob, true);
      const aliceBalance = getBalance(global.node_url_alice, global.rpcAuth, log);
      chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
    });
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"1-basic-doi-test.1.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// server/test/1-basic-doi-test.1.js                                                                                 //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);
let login, createUser, findUser, exportOptIns, requestConfirmVerifyBasicDoi, resetUsers, updateUser, deleteAllEmailsFromPop3;
module.link("./test-api/test-api-on-dapp", {
  login(v) {
    login = v;
  },

  createUser(v) {
    createUser = v;
  },

  findUser(v) {
    findUser = v;
  },

  exportOptIns(v) {
    exportOptIns = v;
  },

  requestConfirmVerifyBasicDoi(v) {
    requestConfirmVerifyBasicDoi = v;
  },

  resetUsers(v) {
    resetUsers = v;
  },

  updateUser(v) {
    updateUser = v;
  },

  deleteAllEmailsFromPop3(v) {
    deleteAllEmailsFromPop3 = v;
  }

}, 1);
let logBlockchain;
module.link("meteor/doichain:doichain-meteor-api", {
  testLog(v) {
    logBlockchain = v;
  }

}, 2);
let deleteOptInsFromAliceAndBob;
module.link("./test-api/test-api-on-node", {
  deleteOptInsFromAliceAndBob(v) {
    deleteOptInsFromAliceAndBob = v;
  }

}, 3);
let templateUrlA = "http://172.20.0.8:4000/templates/emails/doichain-anmeldung-final-DE.html";
let templateUrlB = "http://172.20.0.8:4000/templates/emails/doichain-anmeldung-final-EN.html";

if (!global.inside_docker) {
  templateUrlA = "http://localhost:4000/templates/emails/doichain-anmeldung-final-DE.html";
  templateUrlB = "http://localhost:4000/templates/emails/doichain-anmeldung-final-EN.html";
}

const aliceALogin = {
  "username": "alice-a",
  "password": "password"
};
const aliceBLogin = {
  "username": "alice-a",
  "password": "password"
};
const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";
const log = true;

if (Meteor.isAppTest) {
  describe('basic-doi-test-01', function () {
    this.timeout(0);
    before(function () {
      logBlockchain("removing OptIns,Recipients,Senders");
      deleteOptInsFromAliceAndBob();
      deleteAllEmailsFromPop3(global.inside_docker ? "mail" : "localhost", 110, recipient_pop3username, recipient_pop3password, true);
    });
    xit('should test if basic Doichain workflow is working with optional data', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail = "alice@ci-doichain.org";
      const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp

      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, dataLoginAlice, global.dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
      done();
    });
    xit('should test if basic Doichain workflow is working without optional data', function (done) {
      const recipient_mail = "alice@ci-doichain.org"; //please use this as an alernative when above standard is not possible

      const sender_mail = "bob@ci-doichain.org"; //login to dApp & request DOI on alice via bob

      const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp

      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, dataLoginAlice, global.dappUrlBob, recipient_mail, sender_mail, null, "alice@ci-doichain.org", "alice", true);
      done();
    });
    xit('should create two more users', function (done) {
      resetUsers();
      const logAdmin = login(global.dappUrlAlice, global.dAppLogin, false);
      let userA = createUser(global.dappUrlAlice, logAdmin, "alice-a", templateUrlA, true);
      chai.expect(findUser(userA)).to.not.be.undefined;
      let userB = createUser(global.dappUrlAlice, logAdmin, "alice-b", templateUrlB, true);
      chai.expect(findUser(userB)).to.not.be.undefined;
      done();
    });
    xit('should test if Doichain workflow is using different templates for different users', function (done) {
      resetUsers();
      const recipient_mail = "bob@ci-doichain.org"; //

      const sender_mail_alice_a = "alice-a@ci-doichain.org";
      const sender_mail_alice_b = "alice-b@ci-doichain.org";
      const logAdmin = login(global.dappUrlAlice, global.dAppLogin, false);
      let userA = createUser(global.dappUrlAlice, logAdmin, "alice-a", templateUrlA, true);
      chai.expect(findUser(userA)).to.not.be.undefined;
      let userB = createUser(global.dappUrlAlice, logAdmin, "alice-b", templateUrlB, true);
      chai.expect(findUser(userB)).to.not.be.undefined;
      const logUserA = login(global.dappUrlAlice, aliceALogin, true);
      const logUserB = login(global.dappUrlAlice, aliceBLogin, true); //requestConfirmVerifyBasicDoi checks if the "log" value (if it is a String) is in the mail-text

      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, logUserA, global.dappUrlBob, recipient_mail, sender_mail_alice_a, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", "kostenlose Anmeldung");
      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, logUserB, global.dappUrlBob, recipient_mail, sender_mail_alice_b, {
        'city': 'Simbach'
      }, "bob@ci-doichain.org", "bob", "free registration");
      done();
    });
    it('should test if users can export OptIns ', function (done) {
      resetUsers();
      const logAdmin = login(global.dappUrlAlice, global.dAppLogin, false);
      let userA = createUser(global.dappUrlAlice, logAdmin, "alice-a", templateUrlA, true);
      chai.expect(findUser(userA)).to.not.be.undefined;
      let userB = createUser(global.dappUrlAlice, logAdmin, "alice-b", templateUrlB, true);
      chai.expect(findUser(userB)).to.not.be.undefined;
      const recipient_mail = "bob@ci-doichain.org"; //

      const sender_mail_alice_a = "alice-export@ci-doichain.org";
      const logUserA = login(global.dappUrlAlice, aliceALogin, log);
      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, logUserA, global.dappUrlBob, recipient_mail, sender_mail_alice_a, {
        'city': 'München'
      }, "bob@ci-doichain.org", "bob", true);
      const exportedOptIns = exportOptIns(global.dappUrlAlice, logAdmin, log);
      if (log) logBlockchain('exportedOptIns:', exportedOptIns);
      chai.expect(exportedOptIns).to.not.be.undefined;
      chai.expect(exportedOptIns[0]).to.not.be.undefined;
      const exportedOptInsA = exportOptIns(global.dappUrlAlice, logUserA, log);
      if (log) logBlockchain('exportedOptInsA:', exportedOptInsA);
      exportedOptInsA.forEach(element => {
        chai.expect(element.ownerId).to.be.equal(logUserA.userId);
      }); //chai.expect(findOptIn(resultDataOptIn._id)).to.not.be.undefined;

      done();
    });
    xit('should test if admin can update user profiles', function () {
      resetUsers();
      let logAdmin = login(global.dappUrlAlice, global.dAppLogin, true);
      const userUp = createUser(global.dappUrlAlice, logAdmin, "updateUser", templateUrlA, true);
      logBlockchain('createUser:', userUp);
      const changedData = updateUser(global.dappUrlAlice, logAdmin, userUp, {
        "templateURL": templateUrlB
      }, true);
      logBlockchain('changedData:', changedData);
      chai.expect(changedData).not.undefined;
    });
    xit('should test if user can update own profile', function () {
      resetUsers();
      let logAdmin = login(global.dappUrlAlice, global.dAppLogin, true);
      const userUp = createUser(global.dappUrlAlice, logAdmin, "updateUser", templateUrlA, true); //logBlockchain('should test if user can update own profile:userUp:',userUp);

      const logUserUp = login(global.dappUrlAlice, {
        "username": "updateUser",
        "password": "password"
      }, true); //logBlockchain('should test if user can update own profile:logUserUp:',logUserUp);

      const changedData = updateUser(global.dappUrlAlice, logUserUp, userUp, {
        "templateURL": templateUrlB
      }, true);
      chai.expect(changedData).not.undefined;
    });
    xit('should test if coDoi works', function () {
      const coDoiList = ["alice1@doichain-ci.com", "alice2@doichain-ci.com", "alice3@doichain-ci.com"];
      const recipient_mail = "bob@ci-doichain.org";
      const sender_mail = coDoiList;
      let logAdmin = login(global.dappUrlAlice, global.dAppLogin, true);
      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, logAdmin, global.dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
    });
    xit('should find updated Data in email', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail = "alice-update@ci-doichain.org";
      const adLog = login(global.dappUrlAlice, global.dAppLogin, false);
      updateUser(global.dappUrlAlice, adLog, adLog.userId, {
        "subject": "updateTest",
        "templateURL": templateUrlB
      });
      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, adLog, global.dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
      done();
    });
    it('should redirect if confirmation-link is clicked again', function () {
      for (let index = 0; index < 3; index++) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

        const sender_mail = "alice_" + index + "@ci-doichain.org";
        const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

        let returnedData = requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, {
          'city': 'Ekaterinburg'
        }, "bob@ci-doichain.org", "bob", true);
        chai.assert.equal(true, confirmLink(returnedData.confirmLink));
      }
    });
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"2-basic-doi-test.2.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// server/test/2-basic-doi-test.2.js                                                                                 //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);
let confirmLink, deleteAllEmailsFromPop3, fetchConfirmLinkFromPop3Mail, getNameIdOfOptInFromRawTx, login, requestDOI, verifyDOI;
module.link("./test-api/test-api-on-dapp", {
  confirmLink(v) {
    confirmLink = v;
  },

  deleteAllEmailsFromPop3(v) {
    deleteAllEmailsFromPop3 = v;
  },

  fetchConfirmLinkFromPop3Mail(v) {
    fetchConfirmLinkFromPop3Mail = v;
  },

  getNameIdOfOptInFromRawTx(v) {
    getNameIdOfOptInFromRawTx = v;
  },

  login(v) {
    login = v;
  },

  requestDOI(v) {
    requestDOI = v;
  },

  verifyDOI(v) {
    verifyDOI = v;
  }

}, 1);
let testLogging;
module.link("meteor/doichain:doichain-meteor-api", {
  testLog(v) {
    testLogging = v;
  }

}, 2);
let deleteOptInsFromAliceAndBob, generatetoaddress, getNewAddress, start3rdNode, startDockerBob, stopDockerBob, waitToStartContainer;
module.link("./test-api/test-api-on-node", {
  deleteOptInsFromAliceAndBob(v) {
    deleteOptInsFromAliceAndBob = v;
  },

  generatetoaddress(v) {
    generatetoaddress = v;
  },

  getNewAddress(v) {
    getNewAddress = v;
  },

  start3rdNode(v) {
    start3rdNode = v;
  },

  startDockerBob(v) {
    startDockerBob = v;
  },

  stopDockerBob(v) {
    stopDockerBob = v;
  },

  waitToStartContainer(v) {
    waitToStartContainer = v;
  }

}, 3);

const exec = require('child_process').exec;

const node_url_alice = 'http://172.20.0.6:18332/';
const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";
const rpcAuth = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {
  "username": "admin",
  "password": "password"
};
const log = true;

if (Meteor.isAppTest) {
  describe('02-basic-doi-test-with-offline-node-02', function () {
    before(function () {
      deleteOptInsFromAliceAndBob();
      deleteAllEmailsFromPop3("mail", 110, recipient_pop3username, recipient_pop3password, true);
      exec('sudo docker rm 3rd_node', (e, stdout2, stderr2) => {
        testLogging('deleted 3rd_node:', {
          stdout: stdout2,
          stderr: stderr2
        });
      });

      try {
        exec('sudo docker stop 3rd_node', (e, stdout, stderr) => {
          testLogging('stopped 3rd_node:', {
            stdout: stdout,
            stderr: stderr
          });
          exec('sudo docker rm 3rd_node', (e, stdout, stderr) => {
            testLogging('removed 3rd_node:', {
              stdout: stdout,
              stderr: stderr
            });
          });
        });
      } catch (ex) {
        testLogging('could not stop 3rd_node');
      } //importPrivKey(node_url_bob, rpcAuth, privKeyBob, true, false);

    });
    before(function () {
      try {
        exec('sudo docker stop 3rd_node', (e, stdout, stderr) => {
          testLogging('stopped 3rd_node:', {
            stdout: stdout,
            stderr: stderr
          });
          exec('sudo docker rm 3rd_node', (e, stdout, stderr) => {
            testLogging('removed 3rd_node:', {
              stdout: stdout,
              stderr: stderr
            });
          });
        });
      } catch (ex) {
        testLogging('could not stop 3rd_node');
      }
    });
    it('should test if basic Doichain workflow is working when Bobs node is temporarily offline', function (done) {
      this.timeout(0);
      global.aliceAddress = getNewAddress(node_url_alice, rpcAuth, false); //start another 3rd node before shutdown Bob

      start3rdNode();
      var containerId = stopDockerBob();
      const recipient_mail = "bob@ci-doichain.org";
      const sender_mail = "alice-to-offline-node@ci-doichain.org"; //login to dApp & request DOI on alice via bob

      if (log) testLogging('log into alice and request DOI');
      let dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      let resultDataOptIn = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
      const nameId = getNameIdOfOptInFromRawTx(node_url_alice, rpcAuth, resultDataOptIn.data.id, true);
      if (log) testLogging('got nameId', nameId);
      var startedContainerId = startDockerBob(containerId);
      testLogging("started bob's node with containerId", startedContainerId);
      chai.expect(startedContainerId).to.not.be.null;
      waitToStartContainer(startedContainerId); //generating a block so transaction gets confirmed and delivered to bob.

      generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, true);
      let running = true;
      let counter = 0;

      (function loop() {
        return Promise.asyncApply(() => {
          while (running && ++counter < 50) {
            //trying 50x to get email from bobs mailbox
            try {
              //  generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, true);
              testLogging('step 3: getting email!');
              const link2Confirm = fetchConfirmLinkFromPop3Mail("mail", 110, recipient_pop3username, recipient_pop3password, dappUrlBob, false);
              testLogging('step 4: confirming link', link2Confirm);
              if (link2Confirm != null) running = false;
              confirmLink(link2Confirm);
              testLogging('confirmed');
            } catch (ex) {
              testLogging('trying to get email - so far no success:', counter);
              Promise.await(new Promise(resolve => setTimeout(resolve, 2000)));
            }
          }
        });
      })();

      generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, true);
      verifyDOI(dappUrlAlice, dataLoginAlice, node_url_alice, rpcAuth, sender_mail, recipient_mail, nameId, log); //need to generate two blocks to make block visible on alice

      testLogging('end of getNameIdOfRawTransaction returning nameId', nameId);

      try {
        exec('sudo docker stop 3rd_node', (e, stdout, stderr) => {
          testLogging('stopped 3rd_node:', {
            stdout: stdout,
            stderr: stderr
          });
          exec('sudo docker rm 3rd_node', (e, stdout, stderr) => {
            testLogging('removed 3rd_node:', {
              stdout: stdout,
              stderr: stderr
            });
          });
        });
      } catch (ex) {
        testLogging('could not stop 3rd_node');
      }

      done(); //done();
    }); //it
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"3-basic-doi-test.3.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// server/test/3-basic-doi-test.3.js                                                                                 //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);
let deleteAllEmailsFromPop3, findOptIn, login, requestConfirmVerifyBasicDoi, requestDOI;
module.link("./test-api/test-api-on-dapp", {
  deleteAllEmailsFromPop3(v) {
    deleteAllEmailsFromPop3 = v;
  },

  findOptIn(v) {
    findOptIn = v;
  },

  login(v) {
    login = v;
  },

  requestConfirmVerifyBasicDoi(v) {
    requestConfirmVerifyBasicDoi = v;
  },

  requestDOI(v) {
    requestDOI = v;
  }

}, 1);
let logBlockchain;
module.link("meteor/doichain:doichain-meteor-api", {
  testLog(v) {
    logBlockchain = v;
  }

}, 2);
let deleteOptInsFromAliceAndBob, generatetoaddress, getNewAddress;
module.link("./test-api/test-api-on-node", {
  deleteOptInsFromAliceAndBob(v) {
    deleteOptInsFromAliceAndBob = v;
  },

  generatetoaddress(v) {
    generatetoaddress = v;
  },

  getNewAddress(v) {
    getNewAddress = v;
  }

}, 3);
const node_url_alice = 'http://172.20.0.6:18332/';
const rpcAuthAlice = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {
  "username": "admin",
  "password": "password"
};
const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";

if (Meteor.isAppTest) {
  describe('03-basic-doi-test-03', function () {
    before(function () {
      logBlockchain("removing OptIns,Recipients,Senders");
      deleteOptInsFromAliceAndBob();
      deleteAllEmailsFromPop3("mail", 110, recipient_pop3username, recipient_pop3password, true);
    });
    it('should test if basic Doichain workflow running 5 times', function (done) {
      this.timeout(0);
      const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      global.aliceAddress = getNewAddress(node_url_alice, rpcAuthAlice, false);

      for (let i = 0; i < 20; i++) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

        const sender_mail = "alice_" + i + "@ci-doichain.org";
        requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, {
          'city': 'Ekaterinburg_' + i
        }, "bob@ci-doichain.org", "bob", true);
      }

      done();
    });
    it('should test if basic Doichain workflow running 20 times without confirmation and verification', function (done) {
      this.timeout(0);
      deleteAllEmailsFromPop3("mail", 110, recipient_pop3username, recipient_pop3password, true);
      const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      global.aliceAddress = getNewAddress(node_url_alice, rpcAuthAlice, false);

      for (let i = 0; i < 20; i++) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

        const sender_mail = "alice_" + i + "@ci-doichain.org";
        const resultDataOptIn = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
        chai.expect(findOptIn(resultDataOptIn.data.id, true)).to.not.be.undefined;
      }

      done();
    });
    it('should test if basic Doichain workflow running 100 times with without confirmation and verification', function (done) {
      this.timeout(0);
      deleteAllEmailsFromPop3("mail", 110, recipient_pop3username, recipient_pop3password, true);
      const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      global.aliceAddress = getNewAddress(node_url_alice, rpcAuthAlice, false);

      for (let i = 0; i < 100; i++) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

        const sender_mail = "alice_" + i + "@ci-doichain.org";
        const resultDataOptIn = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
        chai.expect(findOptIn(resultDataOptIn.data.id, true)).to.not.be.undefined;
        if (i % 100 === 0) generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
      }

      done();
    });
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"5-selenium-test-flo.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// server/test/5-selenium-test-flo.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
if (Meteor.isAppTest || Meteor.isTest) {
  xdescribe('simple-selenium-test', function () {
    this.timeout(10000);
    beforeEach(function () {});
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"basic-doi-test-nico.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// server/test/basic-doi-test-nico.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);
let logBlockchain;
module.link("meteor/doichain:doichain-meteor-api", {
  testLog(v) {
    logBlockchain = v;
  }

}, 1);
let deleteOptInsFromAliceAndBob, getBalance, initBlockchain;
module.link("./test-api/test-api-on-node", {
  deleteOptInsFromAliceAndBob(v) {
    deleteOptInsFromAliceAndBob = v;
  },

  getBalance(v) {
    getBalance = v;
  },

  initBlockchain(v) {
    initBlockchain = v;
  }

}, 2);
let login, requestConfirmVerifyBasicDoi;
module.link("./test-api/test-api-on-dapp", {
  login(v) {
    login = v;
  },

  requestConfirmVerifyBasicDoi(v) {
    requestConfirmVerifyBasicDoi = v;
  }

}, 3);
const node_url_alice = 'http://172.20.0.6:18332/';
const node_url_bob = 'http://172.20.0.7:18332/';
const rpcAuth = "admin:generated-password";
const privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj";
const log = true;
const rpcAuthAlice = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {
  "username": "admin",
  "password": "password"
};

if (Meteor.isTest || Meteor.isAppTest) {
  xdescribe('basic-doi-test-nico', function () {
    this.timeout(600000);
    before(function () {
      logBlockchain("removing OptIns,Recipients,Senders");
      deleteOptInsFromAliceAndBob();
    });
    xit('should create a RegTest Doichain with alice and bob and some Doi - coins', function () {
      initBlockchain(node_url_alice, node_url_bob, rpcAuth, privKeyBob, true);
      const aliceBalance = getBalance(node_url_alice, rpcAuth, log);
      chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
    });
    xit('should test if basic Doichain workflow is working with optional data', function (done) {
      const recipient_mail = "bob+1@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail = "alice@ci-doichain.org";
      const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
      done();
    });
  });
  xdescribe('basic-doi-test-nico', function () {
    /**
     * Information regarding to event loop node.js
     * - https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
     *
     * Promises:
     * - https://developers.google.com/web/fundamentals/primers/promises
     *
     * Promise loops and async wait
     * - https://stackoverflow.com/questions/40328932/javascript-es6-promise-for-loop
     *
     * Asynchronous loops with mocha:
     * - https://whitfin.io/asynchronous-test-loops-with-mocha/
     */

    /*  it('should test a timeout with a promise', function (done) {
          logBlockchain("truying a promise");
          for (let i = 0; i < 10; i++) {
              const promise = new Promise((resolve, reject) => {
                  const timeout = Math.random() * 1000;
                  setTimeout(() => {
                      console.log('promise:'+i);
                  }, timeout);
              });
              // TODO: Chain this promise to the previous one (maybe without having it running?)
          }
          done();
      });
       it('should run a loop with async wait', function (done) {
          logBlockchain("trying asycn wait");
          (async function loop() {
              for (let i = 0; i < 10; i++) {
                  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
                  console.log('async wait'+i);
              }
              done()
          })();
      });
       xit('should safely stop and start bobs doichain node container', function (done) {
          var containerId = stopDockerBob();
           logBlockchain("stopped bob's node with containerId",containerId);
          chai.expect(containerId).to.not.be.null;
           var startedContainerId = startDockerBob(containerId);
          logBlockchain("started bob's node with containerId",startedContainerId);
          chai.expect(startedContainerId).to.not.be.null;
           let running = true;
          while(running){
              runAndWait(function () {
                  try{
                      const statusDocker = JSON.parse(getDockerStatus(containerId));
                      logBlockchain("getinfo",statusDocker);
                      logBlockchain("version:"+statusDocker.version);
                      logBlockchain("balance:"+statusDocker.balance);
                      logBlockchain("balance:"+statusDocker.connections);
                      if(statusDocker.connections===0){
                          doichainAddNode(containerId);
                      }
                      running = false;
                  }
                  catch(error){
                      logBlockchain("statusDocker problem:",error);
                  }
              },2);
          }
           done();
      });*/
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"basic-doi-test.flo.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// server/test/basic-doi-test.flo.js                                                                                 //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);

if (Meteor.isTest) {
  xdescribe('basic-doi-test-flo', function () {});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"publications":{"user.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// server/publications/user.js                                                                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.publish('users.user', function () {
  if (this.userId) {
    return Meteor.users.find({
      _id: this.userId
    }, {
      fields: {
        'emails': 1,
        'profile': 1,
        'services': 1
      }
    });
  } else {
    return this.ready();
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/server/test/test-api/test-api-on-dapp.js");
require("/server/test/test-api/test-api-on-node.js");
require("/server/publications/user.js");
require("/server/test/0-basic-doi-tests.0.js");
require("/server/test/1-basic-doi-test.1.js");
require("/server/test/2-basic-doi-test.2.js");
require("/server/test/3-basic-doi-test.3.js");
require("/server/test/5-selenium-test-flo.js");
require("/server/test/basic-doi-test-nico.js");
require("/server/test/basic-doi-test.flo.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvdGVzdC1hcGkvdGVzdC1hcGktb24tZGFwcC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvdGVzdC1hcGkvdGVzdC1hcGktb24tbm9kZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvMC1iYXNpYy1kb2ktdGVzdHMuMC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvMS1iYXNpYy1kb2ktdGVzdC4xLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvdGVzdC8yLWJhc2ljLWRvaS10ZXN0LjIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci90ZXN0LzMtYmFzaWMtZG9pLXRlc3QuMy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvNS1zZWxlbml1bS10ZXN0LWZsby5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvYmFzaWMtZG9pLXRlc3Qtbmljby5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvYmFzaWMtZG9pLXRlc3QuZmxvLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3VzZXIuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwibG9naW4iLCJyZXF1ZXN0RE9JIiwiZ2V0TmFtZUlkT2ZSYXdUcmFuc2FjdGlvbiIsImdldE5hbWVJZE9mT3B0SW5Gcm9tUmF3VHgiLCJmZXRjaENvbmZpcm1MaW5rRnJvbVBvcDNNYWlsIiwiZGVsZXRlQWxsRW1haWxzRnJvbVBvcDMiLCJjb25maXJtTGluayIsInZlcmlmeURPSSIsImNyZWF0ZVVzZXIiLCJmaW5kVXNlciIsImZpbmRPcHRJbiIsImV4cG9ydE9wdElucyIsInJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kiLCJ1cGRhdGVVc2VyIiwicmVzZXRVc2VycyIsIk1ldGVvciIsImxpbmsiLCJ2IiwiY2hhaSIsInF1b3RlZFByaW50YWJsZURlY29kZSIsIkFzc2VydGlvbkVycm9yIiwiT3B0SW5zQ29sbGVjdGlvbiIsIlJlY2lwaWVudHMiLCJnZXRIdHRwR0VUIiwiZ2V0SHR0cEdFVGRhdGEiLCJnZXRIdHRwUE9TVCIsImdldEh0dHBQVVQiLCJ0ZXN0TG9nZ2luZyIsIlJlY2lwaWVudHNDb2xsZWN0aW9uIiwiaHR0cEdFVCIsImh0dHBHRVRkYXRhIiwiaHR0cFBPU1QiLCJodHRwUFVUIiwidGVzdExvZyIsImdlbmVyYXRldG9hZGRyZXNzIiwiaGVhZGVycyIsIm9zIiwicmVxdWlyZSIsIlBPUDNDbGllbnQiLCJ1cmwiLCJwYXJhbXNMb2dpbiIsImxvZyIsInVybExvZ2luIiwiaGVhZGVyc0xvZ2luIiwicmVhbERhdGFMb2dpbiIsInBhcmFtcyIsInJlc3VsdCIsInN0YXR1c0NvZGUiLCJkYXRhTG9naW4iLCJkYXRhIiwic3RhdHVzTG9naW4iLCJzdGF0dXMiLCJhc3NlcnQiLCJlcXVhbCIsImF1dGgiLCJyZWNpcGllbnRfbWFpbCIsInNlbmRlcl9tYWlsIiwidXJsT3B0SW4iLCJkYXRhT3B0SW4iLCJKU09OIiwic3RyaW5naWZ5IiwiaGVhZGVyc09wdEluIiwidXNlcklkIiwiYXV0aFRva2VuIiwicmVhbERhdGFPcHRJbiIsInJlc3VsdE9wdEluIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsImVsZW1lbnQiLCJ0eElkIiwic3luY0Z1bmMiLCJ3cmFwQXN5bmMiLCJnZXRfbmFtZWlkX29mX3Jhd190cmFuc2FjdGlvbiIsImNhbGxiYWNrIiwibmFtZUlkIiwicnVubmluZyIsImNvdW50ZXIiLCJsb29wIiwiZGF0YUdldFJhd1RyYW5zYWN0aW9uIiwicmVhbGRhdGFHZXRSYXdUcmFuc2FjdGlvbiIsInJlc3VsdEdldFJhd1RyYW5zYWN0aW9uIiwidm91dCIsInNjcmlwdFB1YktleSIsIm5hbWVPcCIsInVuZGVmaW5lZCIsIm5hbWUiLCJ0eGlkIiwiZXgiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiLCJvcHRJbklkIiwiZ2V0X25hbWVpZF9vZl9vcHRpbl9mcm9tX3Jhd3R4Iiwib3VyX29wdEluIiwiZmluZE9uZSIsIl9pZCIsIm5vdEVxdWFsIiwiaXNCZWxvdyIsImVycm9yIiwiaG9zdG5hbWUiLCJwb3J0IiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImFsaWNlZGFwcF91cmwiLCJmZXRjaF9jb25maXJtX2xpbmtfZnJvbV9wb3AzX21haWwiLCJjbGllbnQiLCJ0bHNlcnJzIiwiZW5hYmxldGxzIiwiZGVidWciLCJvbiIsInJhd2RhdGEiLCJsaXN0IiwibXNnY291bnQiLCJtc2dudW1iZXIiLCJlcnIiLCJyc2V0IiwicmV0ciIsIm1haWxkYXRhIiwiaHRtbCIsInJlcGxhY2VBbGwiLCJleHBlY3QiLCJpbmRleE9mIiwidG8iLCJub3QiLCJsaW5rZGF0YSIsInN1YnN0cmluZyIsImJlIiwibnVsbCIsInJlcXVlc3REYXRhIiwiZGVsZSIsInF1aXQiLCJlbmQiLCJzdHIiLCJmaW5kIiwicmVwbGFjZSIsIlJlZ0V4cCIsImRlbGV0ZV9hbGxfZW1haWxzX2Zyb21fcG9wMyIsImkiLCJjb25maXJtX2xpbmsiLCJkb2lDb25maXJtbGlua1Jlc3VsdCIsImNvbnRlbnQiLCJoYXZlIiwic3RyaW5nIiwiZSIsImRBcHBVcmwiLCJkQXBwVXJsQXV0aCIsIm5vZGVfdXJsX2FsaWNlIiwicnBjQXV0aEFsaWNlIiwidmVyaWZ5X2RvaSIsIm91cl9yZWNpcGllbnRfbWFpbCIsInVybFZlcmlmeSIsInJlY2lwaWVudF9wdWJsaWNfa2V5IiwiZW1haWwiLCJwdWJsaWNLZXkiLCJyZXN1bHRWZXJpZnkiLCJzdGF0dXNWZXJpZnkiLCJkYXRhVmVyaWZ5IiwibmFtZV9pZCIsImhlYWRlcnNWZXJpZnkiLCJyZWFsZGF0YVZlcmlmeSIsInZhbCIsImdsb2JhbCIsImFsaWNlQWRkcmVzcyIsInRlbXBsYXRlVVJMIiwiaGVhZGVyc1VzZXIiLCJtYWlsVGVtcGxhdGUiLCJ1cmxVc2VycyIsImRhdGFVc2VyIiwicmVhbERhdGFVc2VyIiwicmVzIiwidXNlcmlkIiwiQWNjb3VudHMiLCJ1c2VycyIsInVybEV4cG9ydCIsImRhcHBVcmxBbGljZSIsImRhdGFMb2dpbkFsaWNlIiwiZGFwcFVybEJvYiIsIm9wdGlvbmFsRGF0YSIsInJlY2lwaWVudF9wb3AzdXNlcm5hbWUiLCJyZWNpcGllbnRfcG9wM3Bhc3N3b3JkIiwicmVxdWVzdF9jb25maXJtX3ZlcmlmeV9iYXNpY19kb2kiLCJzZW5kZXJfbWFpbF9pbiIsInJlc3VsdERhdGFPcHRJblRtcCIsInJlc3VsdERhdGFPcHRJbiIsImNvbmZpcm1lZExpbmsiLCJsaW5rMkNvbmZpcm0iLCJpZCIsImluZGV4IiwibGVuZ3RoIiwidG1wSWQiLCJvcHRJbiIsInVwZGF0ZUlkIiwidXNEYXQiLCJwcm9maWxlIiwicmVtb3ZlIiwiaW5pdEJsb2NrY2hhaW4iLCJpc05vZGVBbGl2ZSIsImlzTm9kZUFsaXZlQW5kQ29ubmVjdGVkVG9Ib3N0IiwiaW1wb3J0UHJpdktleSIsImdldE5ld0FkZHJlc3MiLCJnZXRCYWxhbmNlIiwid2FpdFRvU3RhcnRDb250YWluZXIiLCJkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IiLCJzdGFydDNyZE5vZGUiLCJzdG9wRG9ja2VyQm9iIiwiZ2V0Q29udGFpbmVySWRPZk5hbWUiLCJzdGFydERvY2tlckJvYiIsImRvaWNoYWluQWRkTm9kZSIsImdldERvY2tlclN0YXR1cyIsImNvbm5lY3REb2NrZXJCb2IiLCJydW5BbmRXYWl0IiwibG9nQmxvY2tjaGFpbiIsInN1ZG8iLCJleGVjIiwibm9kZV91cmxfYm9iIiwicnBjQXV0aCIsInByaXZLZXlCb2IiLCJhbGljZUNvbnRhaW5lcklkIiwic3RhdHVzRG9ja2VyIiwicGFyc2UiLCJiYWxhbmNlIiwiTnVtYmVyIiwiY29ubmVjdGlvbnMiLCJleGNlcHRpb24iLCJ3YWl0X3RvX3N0YXJ0X2NvbnRhaW5lciIsInN0YXJ0ZWRDb250YWluZXJJZCIsInZlcnNpb24iLCJlcnJvcjIiLCJkZWxldGVfb3B0aW9uc19mcm9tX2FsaWNlX2FuZF9ib2IiLCJjb250YWluZXJJZCIsImluc2lkZV9kb2NrZXIiLCJzdGRvdXQiLCJzdGRlcnIiLCJkYXRhR2V0TmV0d29ya0luZm8iLCJyZWFsZGF0YUdldE5ldHdvcmtJbmZvIiwicmVzdWx0R2V0TmV0d29ya0luZm8iLCJzdGF0dXNHZXROZXR3b3JrSW5mbyIsImhvc3QiLCJzdGF0dXNBZGROb2RlIiwiZGF0YUdldFBlZXJJbmZvIiwicmVhbGRhdGFHZXRQZWVySW5mbyIsInJlc3VsdEdldFBlZXJJbmZvIiwic3RhdHVzR2V0UGVlckluZm8iLCJpc0Fib3ZlIiwicHJpdktleSIsInJlc2NhbiIsImRhdGFfaW1wb3J0cHJpdmtleSIsInJlYWxkYXRhX2ltcG9ydHByaXZrZXkiLCJkYXRhR2V0TmV3QWRkcmVzcyIsInJlYWxkYXRhR2V0TmV3QWRkcmVzcyIsInJlc3VsdEdldE5ld0FkZHJlc3MiLCJzdGF0dXNPcHRJbkdldE5ld0FkZHJlc3MiLCJuZXdBZGRyZXNzIiwidG9hZGRyZXNzIiwiYW1vdW50IiwiZGF0YUdlbmVyYXRlIiwiaGVhZGVyc0dlbmVyYXRlcyIsInJlYWxkYXRhR2VuZXJhdGUiLCJyZXN1bHRHZW5lcmF0ZSIsInN0YXR1c1Jlc3VsdEdlbmVyYXRlIiwiZGF0YUdldEJhbGFuY2UiLCJyZWFsZGF0YUdldEJhbGFuY2UiLCJyZXN1bHRHZXRCYWxhbmNlIiwiZ2V0X2NvbnRhaW5lcl9pZF9vZl9uYW1lIiwiYm9ic0NvbnRhaW5lcklkIiwidG9TdHJpbmciLCJ0cmltIiwic3RvcF9kb2NrZXJfYm9iIiwiZG9pY2hhaW5fYWRkX25vZGUiLCJnZXRfZG9ja2VyX3N0YXR1cyIsInN0YXJ0X2RvY2tlcl9ib2IiLCJjb25uZWN0X2RvY2tlcl9ib2IiLCJzdGFydF8zcmRfbm9kZSIsIm5ldHdvcmsiLCJydW5fYW5kX3dhaXQiLCJydW5mdW5jdGlvbiIsInNlY29uZHMiLCJpbnNkZV9kb2NrZXIiLCJkQXBwTG9naW4iLCJpc0FwcFRlc3QiLCJkZXNjcmliZSIsInRpbWVvdXQiLCJiZWZvcmUiLCJpdCIsImFsaWNlQmFsYW5jZSIsInRlbXBsYXRlVXJsQSIsInRlbXBsYXRlVXJsQiIsImFsaWNlQUxvZ2luIiwiYWxpY2VCTG9naW4iLCJ4aXQiLCJkb25lIiwibG9nQWRtaW4iLCJ1c2VyQSIsInVzZXJCIiwic2VuZGVyX21haWxfYWxpY2VfYSIsInNlbmRlcl9tYWlsX2FsaWNlX2IiLCJsb2dVc2VyQSIsImxvZ1VzZXJCIiwiZXhwb3J0ZWRPcHRJbnMiLCJleHBvcnRlZE9wdEluc0EiLCJvd25lcklkIiwidXNlclVwIiwiY2hhbmdlZERhdGEiLCJsb2dVc2VyVXAiLCJjb0RvaUxpc3QiLCJhZExvZyIsInJldHVybmVkRGF0YSIsInN0ZG91dDIiLCJzdGRlcnIyIiwiaXNUZXN0IiwieGRlc2NyaWJlIiwiYmVmb3JlRWFjaCIsInB1Ymxpc2giLCJmaWVsZHMiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ0MsT0FBSyxFQUFDLE1BQUlBLEtBQVg7QUFBaUJDLFlBQVUsRUFBQyxNQUFJQSxVQUFoQztBQUEyQ0MsMkJBQXlCLEVBQUMsTUFBSUEseUJBQXpFO0FBQW1HQywyQkFBeUIsRUFBQyxNQUFJQSx5QkFBakk7QUFBMkpDLDhCQUE0QixFQUFDLE1BQUlBLDRCQUE1TDtBQUF5TkMseUJBQXVCLEVBQUMsTUFBSUEsdUJBQXJQO0FBQTZRQyxhQUFXLEVBQUMsTUFBSUEsV0FBN1I7QUFBeVNDLFdBQVMsRUFBQyxNQUFJQSxTQUF2VDtBQUFpVUMsWUFBVSxFQUFDLE1BQUlBLFVBQWhWO0FBQTJWQyxVQUFRLEVBQUMsTUFBSUEsUUFBeFc7QUFBaVhDLFdBQVMsRUFBQyxNQUFJQSxTQUEvWDtBQUF5WUMsY0FBWSxFQUFDLE1BQUlBLFlBQTFaO0FBQXVhQyw4QkFBNEIsRUFBQyxNQUFJQSw0QkFBeGM7QUFBcWVDLFlBQVUsRUFBQyxNQUFJQSxVQUFwZjtBQUErZkMsWUFBVSxFQUFDLE1BQUlBO0FBQTlnQixDQUFkO0FBQXlpQixJQUFJQyxNQUFKO0FBQVdq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QUNFLE1BQUksQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFFBQUksR0FBQ0QsQ0FBTDtBQUFPOztBQUFoQixDQUExQyxFQUE0RCxDQUE1RDs7QUFDVCxJQUFHRixNQUFNLENBQUN1UyxNQUFWLEVBQWtCO0FBRWRDLFdBQVMsQ0FBQyxvQkFBRCxFQUF1QixZQUFZLENBQzNDLENBRFEsQ0FBVDtBQUVILEM7Ozs7Ozs7Ozs7O0FDTER4UyxNQUFNLENBQUMwUyxPQUFQLENBQWUsWUFBZixFQUE2QixZQUFZO0FBQ3ZDLE1BQUksS0FBSzNQLE1BQVQsRUFBaUI7QUFDZixXQUFPL0MsTUFBTSxDQUFDOEosS0FBUCxDQUFhdkMsSUFBYixDQUFrQjtBQUN2QnRDLFNBQUcsRUFBRSxLQUFLbEM7QUFEYSxLQUFsQixFQUVKO0FBQ0Q0UCxZQUFNLEVBQUU7QUFDTixrQkFBVSxDQURKO0FBRU4sbUJBQVcsQ0FGTDtBQUdOLG9CQUFZO0FBSE47QUFEUCxLQUZJLENBQVA7QUFTRCxHQVZELE1BVU87QUFDTCxXQUFPLEtBQUtDLEtBQUwsRUFBUDtBQUNEO0FBQ0YsQ0FkRCxFIiwiZmlsZSI6Ii9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01ldGVvcn0gZnJvbSBcIm1ldGVvci9tZXRlb3JcIjtcbmltcG9ydCB7Y2hhaX0gZnJvbSAnbWV0ZW9yL3ByYWN0aWNhbG1ldGVvcjpjaGFpJztcbmltcG9ydCB7cXVvdGVkUHJpbnRhYmxlRGVjb2RlfSBmcm9tIFwiZW1haWxqcy1taW1lLWNvZGVjXCI7XG5pbXBvcnQgeyBBc3NlcnRpb25FcnJvciB9IGZyb20gXCJhc3NlcnRcIjtcbmltcG9ydCB7XG4gICAgT3B0SW5zQ29sbGVjdGlvbixcbiAgICBSZWNpcGllbnRzQ29sbGVjdGlvbiBhcyBSZWNpcGllbnRzLFxuICAgIGh0dHBHRVQgYXMgZ2V0SHR0cEdFVCxcbiAgICBodHRwR0VUZGF0YSBhcyBnZXRIdHRwR0VUZGF0YSxcbiAgICBodHRwUE9TVCBhcyBnZXRIdHRwUE9TVCxcbiAgICBodHRwUFVUIGFzIGdldEh0dHBQVVQsXG4gICAgdGVzdExvZyBhcyB0ZXN0TG9nZ2luZ1xufSBmcm9tIFwibWV0ZW9yL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGlcIjtcbmltcG9ydCB7Z2VuZXJhdGV0b2FkZHJlc3N9IGZyb20gXCIuL3Rlc3QtYXBpLW9uLW5vZGVcIjtcblxuY29uc3QgaGVhZGVycyA9IHsgJ0NvbnRlbnQtVHlwZSc6J3RleHQvcGxhaW4nICB9O1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xudmFyIFBPUDNDbGllbnQgPSByZXF1aXJlKFwicG9wbGliXCIpO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9naW4odXJsLCBwYXJhbXNMb2dpbiwgbG9nKSB7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnZEFwcCBsb2dpbi4nKTtcblxuICAgIGNvbnN0IHVybExvZ2luID0gdXJsKycvYXBpL3YxL2xvZ2luJztcbiAgICBjb25zdCBoZWFkZXJzTG9naW4gPSBbeydDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJ31dO1xuICAgIGNvbnN0IHJlYWxEYXRhTG9naW49IHsgcGFyYW1zOiBwYXJhbXNMb2dpbiwgaGVhZGVyczogaGVhZGVyc0xvZ2luIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBnZXRIdHRwUE9TVCh1cmxMb2dpbiwgcmVhbERhdGFMb2dpbik7XG5cbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdyZXN1bHQgbG9naW46JyxyZXN1bHQpO1xuICAgIGNvbnN0IHN0YXR1c0NvZGUgPSByZXN1bHQuc3RhdHVzQ29kZTtcbiAgICBjb25zdCBkYXRhTG9naW4gPSByZXN1bHQuZGF0YTtcblxuICAgIGNvbnN0IHN0YXR1c0xvZ2luID0gZGF0YUxvZ2luLnN0YXR1cztcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHN0YXR1c0NvZGUpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKCdzdWNjZXNzJywgc3RhdHVzTG9naW4pO1xuICAgIHJldHVybiBkYXRhTG9naW4uZGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RET0kodXJsLCBhdXRoLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIGRhdGEsICBsb2cpIHtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdzdGVwIDEgLSByZXF1ZXN0RE9JIGNhbGxlZCB2aWEgUkVTVCcpO1xuXG4gICAgY29uc3QgdXJsT3B0SW4gPSB1cmwrJy9hcGkvdjEvb3B0LWluJztcbiAgICBsZXQgZGF0YU9wdEluID0ge307XG5cbiAgICBpZihkYXRhKXtcbiAgICAgICAgZGF0YU9wdEluID0ge1xuICAgICAgICAgICAgXCJyZWNpcGllbnRfbWFpbFwiOnJlY2lwaWVudF9tYWlsLFxuICAgICAgICAgICAgXCJzZW5kZXJfbWFpbFwiOnNlbmRlcl9tYWlsLFxuICAgICAgICAgICAgXCJkYXRhXCI6SlNPTi5zdHJpbmdpZnkoZGF0YSlcbiAgICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgICBkYXRhT3B0SW4gPSB7XG4gICAgICAgICAgICBcInJlY2lwaWVudF9tYWlsXCI6cmVjaXBpZW50X21haWwsXG4gICAgICAgICAgICBcInNlbmRlcl9tYWlsXCI6c2VuZGVyX21haWxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGhlYWRlcnNPcHRJbiA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnWC1Vc2VyLUlkJzphdXRoLnVzZXJJZCxcbiAgICAgICAgJ1gtQXV0aC1Ub2tlbic6YXV0aC5hdXRoVG9rZW5cbiAgICB9O1xuXG4gICAgY29uc3QgcmVhbERhdGFPcHRJbiA9IHsgZGF0YTogZGF0YU9wdEluLCBoZWFkZXJzOiBoZWFkZXJzT3B0SW59O1xuICAgIGNvbnN0IHJlc3VsdE9wdEluID0gZ2V0SHR0cFBPU1QodXJsT3B0SW4sIHJlYWxEYXRhT3B0SW4pO1xuXG4gICAgLy9sb2dCbG9ja2NoYWluKFwicmVzdWx0T3B0SW5cIixyZXN1bHRPcHRJbik7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCByZXN1bHRPcHRJbi5zdGF0dXNDb2RlKTtcbiAgICB0ZXN0TG9nZ2luZyhcIlJFVFVSTkVEIFZBTFVFUzogXCIscmVzdWx0T3B0SW4pO1xuICAgIGlmKEFycmF5LmlzQXJyYXkocmVzdWx0T3B0SW4uZGF0YSkpe1xuICAgICAgICB0ZXN0TG9nZ2luZygnYWRkaW5nIGNvRE9JcycpO1xuICAgICAgICByZXN1bHRPcHRJbi5kYXRhLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBjaGFpLmFzc2VydC5lcXVhbCgnc3VjY2VzcycsIGVsZW1lbnQuc3RhdHVzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZWxzZXtcbiAgICAgICAgdGVzdExvZ2dpbmcoJ2FkZGluZyBET0knKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgnc3VjY2VzcycsICByZXN1bHRPcHRJbi5kYXRhLnN0YXR1cyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRPcHRJbi5kYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZUlkT2ZSYXdUcmFuc2FjdGlvbih1cmwsIGF1dGgsIHR4SWQpIHtcbiAgICB0ZXN0TG9nZ2luZygncHJlLXN0YXJ0IG9mIGdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24nLHR4SWQpO1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhnZXRfbmFtZWlkX29mX3Jhd190cmFuc2FjdGlvbik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHVybCwgYXV0aCwgdHhJZCk7XG59XG5cbmZ1bmN0aW9uIGdldF9uYW1laWRfb2ZfcmF3X3RyYW5zYWN0aW9uKHVybCwgYXV0aCwgdHhJZCwgY2FsbGJhY2spe1xuXG4gICAgbGV0IG5hbWVJZCA9ICcnO1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgY291bnRlciA9IDA7XG4gICAgdGVzdExvZ2dpbmcoJ3N0YXJ0IGdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24nLHR4SWQpO1xuICAgIChhc3luYyBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICB3aGlsZShydW5uaW5nICYmICsrY291bnRlcjwxNTAwKXsgLy90cnlpbmcgNTB4IHRvIGdldCBlbWFpbCBmcm9tIGJvYnMgbWFpbGJveFxuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygndHJ5aW5nIHRvIGdldCB0cmFuc2FjdGlvbicsdHhJZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFHZXRSYXdUcmFuc2FjdGlvbiA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiZ2V0cmF3dHJhbnNhY3Rpb25cIiwgXCJtZXRob2RcIjogXCJnZXRyYXd0cmFuc2FjdGlvblwiLCBcInBhcmFtc1wiOiBbdHhJZCwxXSB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWFsZGF0YUdldFJhd1RyYW5zYWN0aW9uID0geyBhdXRoOiBhdXRoLCBkYXRhOiBkYXRhR2V0UmF3VHJhbnNhY3Rpb24sIGhlYWRlcnM6IGhlYWRlcnMgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0R2V0UmF3VHJhbnNhY3Rpb24gPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhR2V0UmF3VHJhbnNhY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdEdldFJhd1RyYW5zYWN0aW9uLmRhdGEucmVzdWx0LnZvdXRbMV0uc2NyaXB0UHViS2V5Lm5hbWVPcCE9PXVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lSWQgPSByZXN1bHRHZXRSYXdUcmFuc2FjdGlvbi5kYXRhLnJlc3VsdC52b3V0WzFdLnNjcmlwdFB1YktleS5uYW1lT3AubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZUlkID0gcmVzdWx0R2V0UmF3VHJhbnNhY3Rpb24uZGF0YS5yZXN1bHQudm91dFswXS5zY3JpcHRQdWJLZXkubmFtZU9wLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHRHZXRSYXdUcmFuc2FjdGlvbi5kYXRhLnJlc3VsdC50eGlkIT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjb25maXJtZWQgdHhpZDonK3Jlc3VsdEdldFJhd1RyYW5zYWN0aW9uLmRhdGEucmVzdWx0LnR4aWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZz1mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL2NoYWkuYXNzZXJ0LmVxdWFsKHR4SWQsIHJlc3VsdEdldFJhd1RyYW5zYWN0aW9uLmRhdGEucmVzdWx0LnR4aWQpO1xuICAgICAgICAgICAgfWNhdGNoKGV4KXtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygndHJ5aW5nIHRvIGdldCBlbWFpbCAtIHNvIGZhciBubyBzdWNjZXNzOicsY291bnRlcik7XG4gICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZXN0TG9nZ2luZygnZW5kIG9mIGdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24gcmV0dXJuaW5nIG5hbWVJZCcsbmFtZUlkKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCxuYW1lSWQpO1xuICAgIH0pKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lSWRPZk9wdEluRnJvbVJhd1R4KHVybCwgYXV0aCwgb3B0SW5JZCxsb2cpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZ2V0X25hbWVpZF9vZl9vcHRpbl9mcm9tX3Jhd3R4KTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBhdXRoLCBvcHRJbklkLGxvZyk7XG59XG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0X25hbWVpZF9vZl9vcHRpbl9mcm9tX3Jhd3R4KHVybCwgYXV0aCwgb3B0SW5JZCwgbG9nLCBjYWxsYmFjayl7XG4gICAgdGVzdExvZ2dpbmcoJ3N0ZXAgMiAtIGdldHRpbmcgbmFtZUlkIG9mIHJhdyB0cmFuc2FjdGlvbiBmcm9tIGJsb2NrY2hhaW4nKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCd0aGUgdHhJZCB3aWxsIGJlIGFkZGVkIGEgYml0IGxhdGVyIGFzIHNvb24gYXMgdGhlIHNjaGVkdWxlIHBpY2tzIHVwIHRoZSBqb2IgYW5kIGluc2VydHMgaXQgaW50byB0aGUgYmxvY2tjaGFpbi4gaXQgZG9lcyBub3QgaGFwcGVuIGltbWVkaWF0ZWx5LiB3YWl0aW5nLi4uJyk7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBsZXQgb3VyX29wdEluID0gbnVsbDtcbiAgICBsZXQgbmFtZUlkID0gbnVsbDtcbiAgICBhd2FpdCAoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgd2hpbGUocnVubmluZyAmJiArK2NvdW50ZXI8NTApeyAvL3RyeWluZyA1MHggdG8gZ2V0IG9wdC1pblxuXG4gICAgICAgICAgICB0ZXN0TG9nZ2luZygnZmluZCBvcHQtSW4nLG9wdEluSWQpO1xuICAgICAgICAgICAgb3VyX29wdEluID0gT3B0SW5zQ29sbGVjdGlvbi5maW5kT25lKHtfaWQ6IG9wdEluSWR9KTtcbiAgICAgICAgICAgIGlmKG91cl9vcHRJbi50eElkIT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnZm91bmQgdHhJZCBvZiBvcHQtSW4nLG91cl9vcHRJbi50eElkKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdkaWQgbm90IGZpbmQgdHhJZCB5ZXQgZm9yIG9wdC1Jbi1JZCcsb3VyX29wdEluLl9pZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSk7XG4gICAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgdHJ5e1xuXG4gICAgICAgIGNoYWkuYXNzZXJ0LmVxdWFsKG91cl9vcHRJbi5faWQsb3B0SW5JZCk7XG4gICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ29wdEluOicsb3VyX29wdEluKTtcbiAgICAgICAgbmFtZUlkID0gZ2V0TmFtZUlkT2ZSYXdUcmFuc2FjdGlvbih1cmwsYXV0aCxvdXJfb3B0SW4udHhJZCk7XG4gICAgICAgIGNoYWkuYXNzZXJ0LmVxdWFsKFwiZS9cIitvdXJfb3B0SW4ubmFtZUlkLG5hbWVJZCk7XG5cbiAgICAgICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnbmFtZUlkOicsbmFtZUlkKTtcbiAgICAgICAgY2hhaS5hc3NlcnQubm90RXF1YWwobmFtZUlkLG51bGwpO1xuICAgICAgICBjaGFpLmFzc2VydC5pc0JlbG93KGNvdW50ZXIsNTAsXCJPcHRJbiBub3QgZm91bmQgYWZ0ZXIgcmV0cmllc1wiKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCxuYW1lSWQpO1xuICAgIH1cbiAgICBjYXRjaChlcnJvcil7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLG5hbWVJZCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hDb25maXJtTGlua0Zyb21Qb3AzTWFpbChob3N0bmFtZSxwb3J0LHVzZXJuYW1lLHBhc3N3b3JkLGFsaWNlZGFwcF91cmwsbG9nKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGZldGNoX2NvbmZpcm1fbGlua19mcm9tX3BvcDNfbWFpbCk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGhvc3RuYW1lLHBvcnQsdXNlcm5hbWUscGFzc3dvcmQsYWxpY2VkYXBwX3VybCxsb2cpO1xufVxuXG5mdW5jdGlvbiBmZXRjaF9jb25maXJtX2xpbmtfZnJvbV9wb3AzX21haWwoaG9zdG5hbWUscG9ydCx1c2VybmFtZSxwYXNzd29yZCxhbGljZWRhcHBfdXJsLGxvZyxjYWxsYmFjaykge1xuXG4gICAgdGVzdExvZ2dpbmcoXCJzdGVwIDMgLSBnZXR0aW5nIGVtYWlsIGZyb20gYm9icyBpbmJveFwiKTtcbiAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9kaXRlc2gvbm9kZS1wb3BsaWIvYmxvYi9tYXN0ZXIvZGVtb3MvcmV0cmlldmUtYWxsLmpzXG4gICAgdmFyIGNsaWVudCA9IG5ldyBQT1AzQ2xpZW50KHBvcnQsIGhvc3RuYW1lLCB7XG4gICAgICAgIHRsc2VycnM6IGZhbHNlLFxuICAgICAgICBlbmFibGV0bHM6IGZhbHNlLFxuICAgICAgICBkZWJ1ZzogZmFsc2VcbiAgICB9KTtcblxuICAgIGNsaWVudC5vbihcImNvbm5lY3RcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRlc3RMb2dnaW5nKFwiQ09OTkVDVCBzdWNjZXNzXCIpO1xuICAgICAgICBjbGllbnQubG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgICAgICAgY2xpZW50Lm9uKFwibG9naW5cIiwgZnVuY3Rpb24oc3RhdHVzLCByYXdkYXRhKSB7XG4gICAgICAgICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJMT0dJTi9QQVNTIHN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgY2xpZW50Lmxpc3QoKTtcblxuICAgICAgICAgICAgICAgIGNsaWVudC5vbihcImxpc3RcIiwgZnVuY3Rpb24oc3RhdHVzLCBtc2djb3VudCwgbXNnbnVtYmVyLCBkYXRhLCByYXdkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IFwiTElTVCBmYWlsZWRcIisgbXNnbnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LnJzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKFwiTElTVCBzdWNjZXNzIHdpdGggXCIgKyBtc2djb3VudCArIFwiIGVsZW1lbnQocylcIiwnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY2hhaS5leHBlY3QobXNnY291bnQpLnRvLmJlLmFib3ZlKDAsICdubyBlbWFpbCBpbiBib2JzIGluYm94Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobXNnY291bnQgPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucmV0cigxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQub24oXCJyZXRyXCIsIGZ1bmN0aW9uKHN0YXR1cywgbXNnbnVtYmVyLCBtYWlsZGF0YSwgcmF3ZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJSRVRSIHN1Y2Nlc3MgXCIgKyBtc2dudW1iZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9lbWFpbGpzL2VtYWlsanMtbWltZS1jb2RlY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGh0bWwgID0gcXVvdGVkUHJpbnRhYmxlRGVjb2RlKG1haWxkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG9zLmhvc3RuYW1lKCkhPT0ncmVndGVzdCcpeyAvL3RoaXMgaXMgcHJvYmFibHkgYSBzZWxlbml1bSB0ZXN0IGZyb20gb3V0c2lkZSBkb2NrZXIgIC0gc28gcmVwbGFjZSBVUkwgc28gaXQgY2FuIGJlIGNvbmZpcm1lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sID0gcmVwbGFjZUFsbChodG1sLCdodHRwOi8vMTcyLjIwLjAuOCcsJ2h0dHA6Ly9sb2NhbGhvc3QnKTsgIC8vVE9ETyBwdXQgdGhpcyBJUCBpbnNpZGUgYSBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYWkuZXhwZWN0KGh0bWwuaW5kZXhPZihhbGljZWRhcHBfdXJsKSkudG8ubm90LmVxdWFsKC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmtkYXRhID0gIGh0bWwuc3Vic3RyaW5nKGh0bWwuaW5kZXhPZihhbGljZWRhcHBfdXJsKSxodG1sLmluZGV4T2YoXCInXCIsaHRtbC5pbmRleE9mKGFsaWNlZGFwcF91cmwpKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYWkuZXhwZWN0KGxpbmtkYXRhKS50by5ub3QuYmUubnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxvZyAmJiAhKGxvZz09PXRydWUpKWNoYWkuZXhwZWN0KGh0bWwuaW5kZXhPZihsb2cpKS50by5ub3QuZXF1YWwoLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVxdWVzdERhdGEgPSB7XCJsaW5rZGF0YVwiOmxpbmtkYXRhLFwiaHRtbFwiOmh0bWx9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5kZWxlKG1zZ251bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQub24oXCJkZWxlXCIsIGZ1bmN0aW9uKHN0YXR1cywgbXNnbnVtYmVyLCBkYXRhLCByYXdkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LnF1aXQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsbGlua2RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IFwiUkVUUiBmYWlsZWQgZm9yIG1zZ251bWJlciBcIisgbXNnbnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LnJzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IFwiZW1wdHkgbWFpbGJveFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LnF1aXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBcIkxPR0lOL1BBU1MgZmFpbGVkXCI7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICBjbGllbnQucXVpdCgpO1xuICAgICAgICAgICAgICAgIGNsaWVudC5lbmQoKTtcbiAgICAgICAgICAgICAgICBjbGllbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VBbGwoc3RyLCBmaW5kLCByZXBsYWNlKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoZmluZCwgJ2cnKSwgcmVwbGFjZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMyhob3N0bmFtZSxwb3J0LHVzZXJuYW1lLHBhc3N3b3JkLGxvZykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkZWxldGVfYWxsX2VtYWlsc19mcm9tX3BvcDMpO1xuICAgIHJldHVybiBzeW5jRnVuYyhob3N0bmFtZSxwb3J0LHVzZXJuYW1lLHBhc3N3b3JkLGxvZyk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZV9hbGxfZW1haWxzX2Zyb21fcG9wMyhob3N0bmFtZSxwb3J0LHVzZXJuYW1lLHBhc3N3b3JkLGxvZyxjYWxsYmFjaykge1xuXG4gICAgdGVzdExvZ2dpbmcoXCJkZWxldGluZyBhbGwgZW1haWxzIGZyb20gYm9icyBpbmJveFwiKTtcbiAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9kaXRlc2gvbm9kZS1wb3BsaWIvYmxvYi9tYXN0ZXIvZGVtb3MvcmV0cmlldmUtYWxsLmpzXG4gICAgdmFyIGNsaWVudCA9IG5ldyBQT1AzQ2xpZW50KHBvcnQsIGhvc3RuYW1lLCB7XG4gICAgICAgIHRsc2VycnM6IGZhbHNlLFxuICAgICAgICBlbmFibGV0bHM6IGZhbHNlLFxuICAgICAgICBkZWJ1ZzogZmFsc2VcbiAgICB9KTtcblxuICAgIGNsaWVudC5vbihcImNvbm5lY3RcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRlc3RMb2dnaW5nKFwiQ09OTkVDVCBzdWNjZXNzXCIpO1xuICAgICAgICBjbGllbnQubG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgICAgICAgY2xpZW50Lm9uKFwibG9naW5cIiwgZnVuY3Rpb24oc3RhdHVzLCByYXdkYXRhKSB7XG4gICAgICAgICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJMT0dJTi9QQVNTIHN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgY2xpZW50Lmxpc3QoKTtcblxuICAgICAgICAgICAgICAgIGNsaWVudC5vbihcImxpc3RcIiwgZnVuY3Rpb24oc3RhdHVzLCBtc2djb3VudCwgbXNnbnVtYmVyLCBkYXRhLCByYXdkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IFwiTElTVCBmYWlsZWRcIisgbXNnbnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LnJzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKFwiTElTVCBzdWNjZXNzIHdpdGggXCIgKyBtc2djb3VudCArIFwiIGVsZW1lbnQocylcIiwnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY2hhaS5leHBlY3QobXNnY291bnQpLnRvLmJlLmFib3ZlKDAsICdubyBlbWFpbCBpbiBib2JzIGluYm94Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobXNnY291bnQgPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwO2k8PW1zZ2NvdW50O2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5kZWxlKGkrMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5vbihcImRlbGVcIiwgZnVuY3Rpb24oc3RhdHVzLCBtc2dudW1iZXIsIGRhdGEsIHJhd2RhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKFwiZGVsZXRlZCBlbWFpbFwiKyhpKzEpK1wiIHN0YXR1czpcIitzdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpPT1tc2djb3VudC0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5xdWl0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKFwiYWxsIGVtYWlscyBkZWxldGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwnYWxsIGVtYWlscyBkZWxldGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBcImVtcHR5IG1haWxib3hcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBlcnIpOyAvL3dlIGRvIG5vdCBzZW5kIGFuIGVycm9yIGhlcmUgd2hlbiBpbmJveCBpcyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5xdWl0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJMT0dJTi9QQVNTIGZhaWxlZFwiO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgY2xpZW50LnF1aXQoKTtcbiAgICAgICAgICAgICAgICBjbGllbnQuZW5kKCk7XG4gICAgICAgICAgICAgICAgY2xpZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlybUxpbmsoY29uZmlybUxpbmspIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoY29uZmlybV9saW5rKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY29uZmlybUxpbmspO1xufVxuXG5mdW5jdGlvbiBjb25maXJtX2xpbmsoY29uZmlybUxpbmssY2FsbGJhY2spe1xuICAgIHRlc3RMb2dnaW5nKFwiY2xpY2thYmxlIGxpbms6XCIsY29uZmlybUxpbmspO1xuICAgIGNvbnN0IGRvaUNvbmZpcm1saW5rUmVzdWx0ID0gZ2V0SHR0cEdFVChjb25maXJtTGluaywnJyk7XG4gICAgdHJ5e1xuICAgIGNoYWkuZXhwZWN0KGRvaUNvbmZpcm1saW5rUmVzdWx0LmNvbnRlbnQpLnRvLmhhdmUuc3RyaW5nKCdBTk1FTERVTkcgRVJGT0xHUkVJQ0gnKTtcbiAgICBjaGFpLmV4cGVjdChkb2lDb25maXJtbGlua1Jlc3VsdC5jb250ZW50KS50by5oYXZlLnN0cmluZygnVmllbGVuIERhbmsgZsO8ciBJaHJlIEFubWVsZHVuZycpO1xuICAgIGNoYWkuZXhwZWN0KGRvaUNvbmZpcm1saW5rUmVzdWx0LmNvbnRlbnQpLnRvLmhhdmUuc3RyaW5nKCdJaHJlIEFubWVsZHVuZyB3YXIgZXJmb2xncmVpY2guJyk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCBkb2lDb25maXJtbGlua1Jlc3VsdC5zdGF0dXNDb2RlKTtcbiAgICBjYWxsYmFjayhudWxsLHRydWUpO1xuICAgIH1cbiAgICBjYXRjaChlKXtcbiAgICAgICAgY2FsbGJhY2soZSxudWxsKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeURPSShkQXBwVXJsLCBkQXBwVXJsQXV0aCwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLG5hbWVJZCwgbG9nICl7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHZlcmlmeV9kb2kpO1xuICAgIHJldHVybiBzeW5jRnVuYyhkQXBwVXJsLCBkQXBwVXJsQXV0aCwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLG5hbWVJZCwgbG9nICk7XG59XG5cblxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5X2RvaShkQXBwVXJsLCBkQXBwVXJsQXV0aCwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLG5hbWVJZCwgbG9nLCBjYWxsYmFjayl7XG4gICAgbGV0IG91cl9yZWNpcGllbnRfbWFpbCA9cmVjaXBpZW50X21haWw7XG4gICAgaWYoQXJyYXkuaXNBcnJheShyZWNpcGllbnRfbWFpbCkpe1xuICAgICAgICBvdXJfcmVjaXBpZW50X21haWw9cmVjaXBpZW50X21haWxbMF07XG4gICAgfVxuICAgIGNvbnN0IHVybFZlcmlmeSA9IGRBcHBVcmwrJy9hcGkvdjEvb3B0LWluL3ZlcmlmeSc7XG4gICAgY29uc3QgcmVjaXBpZW50X3B1YmxpY19rZXkgPSBSZWNpcGllbnRzLmZpbmRPbmUoe2VtYWlsOiBvdXJfcmVjaXBpZW50X21haWx9KS5wdWJsaWNLZXk7XG4gICAgbGV0IHJlc3VsdFZlcmlmeSA9e307XG4gICAgbGV0IHN0YXR1c1ZlcmlmeSA9e307XG5cbiAgICBjb25zdCBkYXRhVmVyaWZ5ID0ge1xuICAgICAgICByZWNpcGllbnRfbWFpbDogb3VyX3JlY2lwaWVudF9tYWlsLFxuICAgICAgICBzZW5kZXJfbWFpbDogc2VuZGVyX21haWwsXG4gICAgICAgIG5hbWVfaWQ6IG5hbWVJZCxcbiAgICAgICAgcmVjaXBpZW50X3B1YmxpY19rZXk6IHJlY2lwaWVudF9wdWJsaWNfa2V5XG4gICAgfTtcblxuICAgIGNvbnN0IGhlYWRlcnNWZXJpZnkgPSB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ1gtVXNlci1JZCc6ZEFwcFVybEF1dGgudXNlcklkLFxuICAgICAgICAnWC1BdXRoLVRva2VuJzpkQXBwVXJsQXV0aC5hdXRoVG9rZW5cbiAgICB9O1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICBhd2FpdCAoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgd2hpbGUocnVubmluZyAmJiArK2NvdW50ZXI8NTApeyAvL3RyeWluZyA1MHggdG8gZ2V0IGVtYWlsIGZyb20gYm9icyBtYWlsYm94XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ1N0ZXAgNTogdmVyaWZ5aW5nIG9wdC1pbjonLCB7ZGF0YTpkYXRhVmVyaWZ5fSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVhbGRhdGFWZXJpZnkgPSB7IGRhdGE6IGRhdGFWZXJpZnksIGhlYWRlcnM6IGhlYWRlcnNWZXJpZnkgfTtcbiAgICAgICAgICAgICAgICByZXN1bHRWZXJpZnkgPSBnZXRIdHRwR0VUZGF0YSh1cmxWZXJpZnksIHJlYWxkYXRhVmVyaWZ5KTtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygncmVzdWx0IC9vcHQtaW4vdmVyaWZ5Oicse3N0YXR1czpyZXN1bHRWZXJpZnkuZGF0YS5zdGF0dXMsdmFsOnJlc3VsdFZlcmlmeS5kYXRhLmRhdGEudmFsfSApO1xuICAgICAgICAgICAgICAgIHN0YXR1c1ZlcmlmeSA9IHJlc3VsdFZlcmlmeS5zdGF0dXNDb2RlO1xuICAgICAgICAgICAgICAgIGlmKHJlc3VsdFZlcmlmeS5kYXRhLmRhdGEudmFsPT09dHJ1ZSkgcnVubmluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICB9Y2F0Y2goZXgpIHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygndHJ5aW5nIHRvIHZlcmlmeSBvcHQtaW4gLSBzbyBmYXIgbm8gc3VjY2VzczonLGV4KTtcbiAgICAgICAgICAgICAgICAvL2dlbmVyYXRldG9hZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGdsb2JhbC5hbGljZUFkZHJlc3MsIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgIC8vYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHl7XG4gICAgICAgICAgICAgICAgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSkoKTtcbiAgICAgICAgdHJ5e1xuICAgICAgICBjaGFpLmFzc2VydC5lcXVhbChzdGF0dXNWZXJpZnksMjAwKTtcbiAgICAgICAgY2hhaS5hc3NlcnQuZXF1YWwocmVzdWx0VmVyaWZ5LmRhdGEuZGF0YS52YWwsdHJ1ZSk7XG4gICAgICAgIGNoYWkuYXNzZXJ0LmlzQmVsb3coY291bnRlciw1MCk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyb3Ipe1xuICAgICAgICBjYWxsYmFjayhlcnJvcixmYWxzZSk7XG4gICAgICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVzZXIodXJsLGF1dGgsdXNlcm5hbWUsdGVtcGxhdGVVUkwsbG9nKXtcbiAgICBjb25zdCBoZWFkZXJzVXNlciA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnWC1Vc2VyLUlkJzphdXRoLnVzZXJJZCxcbiAgICAgICAgJ1gtQXV0aC1Ub2tlbic6YXV0aC5hdXRoVG9rZW5cbiAgICB9XG4gICAgY29uc3QgbWFpbFRlbXBsYXRlID0ge1xuICAgICAgICBcInN1YmplY3RcIjogXCJIZWxsbyBpIGFtIFwiK3VzZXJuYW1lLFxuICAgICAgICBcInJlZGlyZWN0XCI6IFwiaHR0cHM6Ly93d3cuZG9pY2hhaW4ub3JnL3ZpZWxlbi1kYW5rL1wiLFxuICAgICAgICBcInJldHVyblBhdGhcIjogIHVzZXJuYW1lK1wiLXRlc3RAZG9pY2hhaW4ub3JnXCIsXG4gICAgICAgIFwidGVtcGxhdGVVUkxcIjogdGVtcGxhdGVVUkxcbiAgICB9XG4gICAgY29uc3QgdXJsVXNlcnMgPSB1cmwrJy9hcGkvdjEvdXNlcnMnO1xuICAgIGNvbnN0IGRhdGFVc2VyID0ge1widXNlcm5hbWVcIjp1c2VybmFtZSxcImVtYWlsXCI6dXNlcm5hbWUrXCItdGVzdEBkb2ljaGFpbi5vcmdcIixcInBhc3N3b3JkXCI6XCJwYXNzd29yZFwiLFwibWFpbFRlbXBsYXRlXCI6bWFpbFRlbXBsYXRlfVxuXG4gICAgY29uc3QgcmVhbERhdGFVc2VyPSB7IGRhdGE6IGRhdGFVc2VyLCBoZWFkZXJzOiBoZWFkZXJzVXNlcn07XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnY3JlYXRlVXNlcjonLCByZWFsRGF0YVVzZXIpO1xuICAgIGxldCByZXMgPSBnZXRIdHRwUE9TVCh1cmxVc2VycyxyZWFsRGF0YVVzZXIpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJyZXNwb25zZVwiLHJlcyk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwocmVzLmRhdGEuc3RhdHVzLFwic3VjY2Vzc1wiKTtcbiAgICByZXR1cm4gcmVzLmRhdGEuZGF0YS51c2VyaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVXNlcih1c2VySWQpe1xuICAgIGNvbnN0IHJlcyA9IEFjY291bnRzLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VySWR9KTtcbiAgICBjaGFpLmV4cGVjdChyZXMpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRPcHRJbihvcHRJbklkLGxvZyl7XG4gICAgY29uc3QgcmVzID0gT3B0SW5zQ29sbGVjdGlvbi5maW5kT25lKHtfaWQ6b3B0SW5JZH0pO1xuICAgIGlmKGxvZyl0ZXN0TG9nZ2luZyhyZXMsb3B0SW5JZCk7XG4gICAgY2hhaS5leHBlY3QocmVzKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRPcHRJbnModXJsLGF1dGgsbG9nKXtcbiAgICBjb25zdCBoZWFkZXJzVXNlciA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnWC1Vc2VyLUlkJzphdXRoLnVzZXJJZCxcbiAgICAgICAgJ1gtQXV0aC1Ub2tlbic6YXV0aC5hdXRoVG9rZW5cbiAgICB9O1xuXG4gICAgY29uc3QgdXJsRXhwb3J0ID0gdXJsKycvYXBpL3YxL2V4cG9ydCc7XG4gICAgY29uc3QgcmVhbERhdGFVc2VyPSB7aGVhZGVyczogaGVhZGVyc1VzZXJ9O1xuICAgIGxldCByZXMgPSBnZXRIdHRwR0VUZGF0YSh1cmxFeHBvcnQscmVhbERhdGFVc2VyKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKHJlcyxsb2cpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKHJlcy5kYXRhLnN0YXR1cyxcInN1Y2Nlc3NcIik7XG4gICAgcmV0dXJuIHJlcy5kYXRhLmRhdGE7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UscnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsZGF0YUxvZ2luQWxpY2UsZGFwcFVybEJvYixyZWNpcGllbnRfbWFpbCxzZW5kZXJfbWFpbCxvcHRpb25hbERhdGEscmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgbG9nKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHJlcXVlc3RfY29uZmlybV92ZXJpZnlfYmFzaWNfZG9pKTtcbiAgICByZXR1cm4gc3luY0Z1bmMobm9kZV91cmxfYWxpY2UscnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsZGF0YUxvZ2luQWxpY2UsZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsc2VuZGVyX21haWwsb3B0aW9uYWxEYXRhLHJlY2lwaWVudF9wb3AzdXNlcm5hbWUsIHJlY2lwaWVudF9wb3AzcGFzc3dvcmQsIGxvZyk7XG59XG5cblxuYXN5bmMgZnVuY3Rpb24gcmVxdWVzdF9jb25maXJtX3ZlcmlmeV9iYXNpY19kb2kobm9kZV91cmxfYWxpY2UscnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsZGF0YUxvZ2luQWxpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCxzZW5kZXJfbWFpbF9pbixvcHRpb25hbERhdGEscmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgbG9nLCBjYWxsYmFjaykge1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ25vZGVfdXJsX2FsaWNlJyxub2RlX3VybF9hbGljZSk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygncnBjQXV0aEFsaWNlJyxycGNBdXRoQWxpY2UpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2RhcHBVcmxBbGljZScsZGFwcFVybEFsaWNlKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdkYXRhTG9naW5BbGljZScsZGF0YUxvZ2luQWxpY2UpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2RhcHBVcmxCb2InLGRhcHBVcmxCb2IpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3JlY2lwaWVudF9tYWlsJyxyZWNpcGllbnRfbWFpbCk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnc2VuZGVyX21haWxfaW4nLHNlbmRlcl9tYWlsX2luKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdvcHRpb25hbERhdGEnLG9wdGlvbmFsRGF0YSk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygncmVjaXBpZW50X3BvcDN1c2VybmFtZScscmVjaXBpZW50X3BvcDN1c2VybmFtZSk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygncmVjaXBpZW50X3BvcDNwYXNzd29yZCcscmVjaXBpZW50X3BvcDNwYXNzd29yZCk7XG5cblxuICAgIGxldCBzZW5kZXJfbWFpbCA9IHNlbmRlcl9tYWlsX2luO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2xvZyBpbnRvIGFsaWNlIGFuZCByZXF1ZXN0IERPSScpO1xuICAgIGxldCByZXN1bHREYXRhT3B0SW5UbXAgPSByZXF1ZXN0RE9JKGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgb3B0aW9uYWxEYXRhLCB0cnVlKTtcbiAgICBsZXQgcmVzdWx0RGF0YU9wdEluID0gcmVzdWx0RGF0YU9wdEluVG1wO1xuXG4gICAgaWYoQXJyYXkuaXNBcnJheShzZW5kZXJfbWFpbF9pbikpeyAgICAgICAgICAgICAgLy9TZWxlY3QgbWFzdGVyIGRvaSBmcm9tIHNlbmRlcnMgYW5kIHJlc3VsdFxuICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdNQVNURVIgRE9JOiAnLHJlc3VsdERhdGFPcHRJblRtcFswXSk7XG4gICAgICAgIHJlc3VsdERhdGFPcHRJbiA9IHJlc3VsdERhdGFPcHRJblRtcFswXTtcbiAgICAgICAgc2VuZGVyX21haWwgPSBzZW5kZXJfbWFpbF9pblswXTtcbiAgICB9XG5cbiAgICAvL2dlbmVyYXRpbmcgYSBibG9jayBzbyB0cmFuc2FjdGlvbiBnZXRzIGNvbmZpcm1lZCBhbmQgZGVsaXZlcmVkIHRvIGJvYi5cbiAgICBnZW5lcmF0ZXRvYWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBnbG9iYWwuYWxpY2VBZGRyZXNzLCAxLCB0cnVlKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGxldCBjb25maXJtZWRMaW5rID0gXCJcIjtcbiAgICBjb25maXJtZWRMaW5rID0gYXdhaXQoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgd2hpbGUocnVubmluZyAmJiArK2NvdW50ZXI8NTApeyAvL3RyeWluZyA1MHggdG8gZ2V0IGVtYWlsIGZyb20gYm9icyBtYWlsYm94XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0ZXAgMzogZ2V0dGluZyBlbWFpbCBmcm9tIGhvc3RuYW1lIScsb3MuaG9zdG5hbWUoKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGluazJDb25maXJtID0gZmV0Y2hDb25maXJtTGlua0Zyb21Qb3AzTWFpbCgob3MuaG9zdG5hbWUoKT09J3JlZ3Rlc3QnKT8nbWFpbCc6J2xvY2FsaG9zdCcsIDExMCwgcmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgZGFwcFVybEJvYiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdzdGVwIDQ6IGNvbmZpcm1pbmcgbGluaycsbGluazJDb25maXJtKTtcbiAgICAgICAgICAgICAgICBpZihsaW5rMkNvbmZpcm0hPW51bGwpe3J1bm5pbmc9ZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uZmlybUxpbmsobGluazJDb25maXJtKTtcbiAgICAgICAgICAgICAgICBjb25maXJtZWRMaW5rPWxpbmsyQ29uZmlybTtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnY29uZmlybWVkJylcbiAgICAgICAgICAgICAgICByZXR1cm4gbGluazJDb25maXJtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1jYXRjaChleCl7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3RyeWluZyB0byBnZXQgZW1haWwgLSBzbyBmYXIgbm8gc3VjY2VzczonLGNvdW50ZXIpO1xuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pKCk7XG5cbiAgIC8qIGlmKG9zLmhvc3RuYW1lKCkhPT0ncmVndGVzdCcpeyAvL2lmIHRoaXMgaXMgYSBzZWxlbml1bSB0ZXN0IGZyb20gb3V0c2lkZSBkb2NrZXIgLSBkb24ndCB2ZXJpZnkgRE9JIGhlcmUgZm9yIHNpbXBsaWNpdHlcbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdyZXR1cm5pbmcgdG8gdGVzdCB3aXRob3V0IERPSS12ZXJpZmljYXRpb24gd2hpbGUgZG9pbmcgc2VsZW5pdW0gb3V0c2lkZSBkb2NrZXInKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtzdGF0dXM6IFwiRE9JIGNvbmZpcm1lZFwifSk7XG4gICAgICAgICAgIC8vIHJldHVybjtcbiAgICB9ZWxzZXsqL1xuICAgICAgICBsZXQgbmFtZUlkPW51bGw7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzQmVsb3coY291bnRlciw1MCk7XG4gICAgICAgICAgICAvL2NvbmZpcm1MaW5rKGNvbmZpcm1lZExpbmspO1xuICAgICAgICAgICAgY29uc3QgbmFtZUlkID0gZ2V0TmFtZUlkT2ZPcHRJbkZyb21SYXdUeChub2RlX3VybF9hbGljZSxycGNBdXRoQWxpY2UscmVzdWx0RGF0YU9wdEluLmRhdGEuaWQsdHJ1ZSk7XG4gICAgICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdnb3QgbmFtZUlkJyxuYW1lSWQpO1xuICAgICAgICAgICAgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZygnYmVmb3JlIHZlcmlmaWNhdGlvbicpO1xuXG4gICAgICAgICAgICBpZihBcnJheS5pc0FycmF5KHNlbmRlcl9tYWlsX2luKSl7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHNlbmRlcl9tYWlsX2luLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdG1wSWQgPSBpbmRleD09MCA/IG5hbWVJZCA6IG5hbWVJZCtcIi1cIisoaW5kZXgpOyAvL2dldCBuYW1laWQgb2YgY29ET0lzIGJhc2VkIG9uIG1hc3RlclxuICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZyhcIk5hbWVJZCBvZiBjb0RvaTogXCIsdG1wSWQpO1xuICAgICAgICAgICAgICAgIHZlcmlmeURPSShkYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCBub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBzZW5kZXJfbWFpbF9pbltpbmRleF0sIHJlY2lwaWVudF9tYWlsLCB0bXBJZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2ZXJpZnlET0koZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLCBuYW1lSWQsIHRydWUpOyAvL25lZWQgdG8gZ2VuZXJhdGUgdHdvIGJsb2NrcyB0byBtYWtlIGJsb2NrIHZpc2libGUgb24gYWxpY2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdhZnRlciB2ZXJpZmljYXRpb24nKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtvcHRJbjogcmVzdWx0RGF0YU9wdEluLCBuYW1lSWQ6IG5hbWVJZH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCB7b3B0SW46IHJlc3VsdERhdGFPcHRJbiwgbmFtZUlkOiBuYW1lSWR9KTtcbiAgICAgICAgfVxuICAgLy8gfVxuXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVVzZXIodXJsLGF1dGgsdXBkYXRlSWQsbWFpbFRlbXBsYXRlLGxvZyl7XG5cbiAgICBjb25zdCBoZWFkZXJzVXNlciA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnWC1Vc2VyLUlkJzphdXRoLnVzZXJJZCxcbiAgICAgICAgJ1gtQXV0aC1Ub2tlbic6YXV0aC5hdXRoVG9rZW5cbiAgICB9XG5cbiAgICBjb25zdCBkYXRhVXNlciA9IHtcIm1haWxUZW1wbGF0ZVwiOm1haWxUZW1wbGF0ZX07XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygndXJsOicsIHVybCk7XG4gICAgY29uc3QgdXJsVXNlcnMgPSB1cmwrJy9hcGkvdjEvdXNlcnMvJyt1cGRhdGVJZDtcbiAgICBjb25zdCByZWFsRGF0YVVzZXI9IHsgZGF0YTogZGF0YVVzZXIsIGhlYWRlcnM6IGhlYWRlcnNVc2VyfTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCd1cGRhdGVVc2VyOicsIHJlYWxEYXRhVXNlcik7XG4gICAgbGV0IHJlcyA9IGdldEh0dHBQVVQodXJsVXNlcnMscmVhbERhdGFVc2VyKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKFwicmVzcG9uc2VcIixyZXMpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKHJlcy5kYXRhLnN0YXR1cyxcInN1Y2Nlc3NcIik7XG4gICAgY29uc3QgdXNEYXQgPSBBY2NvdW50cy51c2Vycy5maW5kT25lKHtfaWQ6dXBkYXRlSWR9KS5wcm9maWxlLm1haWxUZW1wbGF0ZTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKFwiSW5wdXRUZW1wbGF0ZVwiLGRhdGFVc2VyLm1haWxUZW1wbGF0ZSk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZyhcIlJlc3VsdFRlbXBsYXRlXCIsdXNEYXQpO1xuICAgIGNoYWkuZXhwZWN0KHVzRGF0KS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKGRhdGFVc2VyLm1haWxUZW1wbGF0ZS50ZW1wbGF0ZVVSTCx1c0RhdC50ZW1wbGF0ZVVSTCk7XG4gICAgcmV0dXJuIHVzRGF0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRVc2Vycygpe1xuICAgIEFjY291bnRzLnVzZXJzLnJlbW92ZShcbiAgICAgICAge1widXNlcm5hbWVcIjpcbiAgICAgICAge1wiJG5lXCI6XCJhZG1pblwifVxuICAgICAgICB9XG4gICAgKTtcbn1cbiIsImltcG9ydCB7XG4gICAgaHR0cFBPU1QgYXMgZ2V0SHR0cFBPU1QsXG4gICAgdGVzdExvZyBhcyB0ZXN0TG9nZ2luZyxcbiAgICB0ZXN0TG9nIGFzIGxvZ0Jsb2NrY2hhaW5cbn0gZnJvbSBcIm1ldGVvci9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpXCI7XG5cbmltcG9ydCB7Y2hhaX0gZnJvbSAnbWV0ZW9yL3ByYWN0aWNhbG1ldGVvcjpjaGFpJztcbmltcG9ydCB7TWV0ZW9yfSBmcm9tIFwibWV0ZW9yL21ldGVvclwiO1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xubGV0IHN1ZG8gPSAob3MuaG9zdG5hbWUoKT09J3JlZ3Rlc3QnKT8nc3VkbyAnOicnXG5jb25zdCBoZWFkZXJzID0geyAnQ29udGVudC1UeXBlJzondGV4dC9wbGFpbicgIH07XG5jb25zdCBleGVjID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0QmxvY2tjaGFpbihub2RlX3VybF9hbGljZSxub2RlX3VybF9ib2IscnBjQXV0aCxwcml2S2V5Qm9iLGxvZykgeyAgICAgICAgICAgIC8vY29ubmVjdCBub2RlcyAoYWxpY2UgJiBib2IpIGFuZCBnZW5lcmF0ZSBET0kgKG9ubHkgaWYgbm90IGNvbm5lY3RlZClcblxuICAgIHRlc3RMb2dnaW5nKFwiaW1wb3J0aW5nIHByaXZhdGUga2V5OlwiK3ByaXZLZXlCb2IpO1xuICAgIGltcG9ydFByaXZLZXkobm9kZV91cmxfYm9iLCBycGNBdXRoLCBwcml2S2V5Qm9iLCB0cnVlLCBsb2cpO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFsaWNlQ29udGFpbmVySWQgPSBnZXRDb250YWluZXJJZE9mTmFtZSgnYWxpY2UnKTtcbiAgICAgICAgY29uc3Qgc3RhdHVzRG9ja2VyID0gSlNPTi5wYXJzZShnZXREb2NrZXJTdGF0dXMoYWxpY2VDb250YWluZXJJZCkpO1xuICAgICAgICBsb2dCbG9ja2NoYWluKFwicmVhbCBiYWxhbmNlIDpcIiArIHN0YXR1c0RvY2tlci5iYWxhbmNlLCAoTnVtYmVyKHN0YXR1c0RvY2tlci5iYWxhbmNlKSA+IDApKTtcbiAgICAgICAgbG9nQmxvY2tjaGFpbihcImNvbm5lY3Rpb25zOlwiICsgc3RhdHVzRG9ja2VyLmNvbm5lY3Rpb25zKTtcbiAgICAgICAgaWYgKE51bWJlcihzdGF0dXNEb2NrZXIuY29ubmVjdGlvbnMpID09IDApIHtcbiAgICAgICAgICAgIGlzTm9kZUFsaXZlKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBsb2cpO1xuICAgICAgICAgICAgaXNOb2RlQWxpdmVBbmRDb25uZWN0ZWRUb0hvc3Qobm9kZV91cmxfYm9iLCBycGNBdXRoLCAnYWxpY2UnLCBsb2cpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE51bWJlcihzdGF0dXNEb2NrZXIuYmFsYW5jZSkgPiAwKSB7XG4gICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwiZW5vdWdoIGZvdW5kaW5nIGZvciBhbGljZSAtIGJsb2NrY2hhaW4gYWxyZWFkeSBjb25uZWN0ZWRcIik7XG4gICAgICAgICAgICBnbG9iYWwuYWxpY2VBZGRyZXNzID0gZ2V0TmV3QWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgbG9nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICBsb2dCbG9ja2NoYWluKFwiY29ubmVjdGluZyBibG9ja2NoYWluIGFuZCBtaW5pbmcgc29tZSBjb2luc1wiKTtcbiAgICB9XG4gICAgZ2xvYmFsLmFsaWNlQWRkcmVzcyA9IGdldE5ld0FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIGxvZyk7XG4gICAgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIGdsb2JhbC5hbGljZUFkZHJlc3MsIDIxMCk7ICAvLzExMCBibG9ja3MgdG8gbmV3IGFkZHJlc3MhIDExMCBibMO2Y2tlICoyNSBjb2luc1xuXG59XG5mdW5jdGlvbiB3YWl0X3RvX3N0YXJ0X2NvbnRhaW5lcihzdGFydGVkQ29udGFpbmVySWQsY2FsbGJhY2spe1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICAvL2hlcmUgd2UgbWFrZSBzdXJlIGJvYiBnZXRzIHN0YXJ0ZWQgYW5kIGNvbm5lY3RlZCBhZ2FpbiBpbiBwcm9iYWJseSBhbGwgcG9zc2libGUgc2l0YXV0aW9uc1xuICAgIHdoaWxlKHJ1bm5pbmcpe1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICBjb25zdCBzdGF0dXNEb2NrZXIgPSBKU09OLnBhcnNlKGdldERvY2tlclN0YXR1cyhzdGFydGVkQ29udGFpbmVySWQpKTtcbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKFwiZ2V0aW5mb1wiLHN0YXR1c0RvY2tlcik7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZyhcInZlcnNpb246XCIrc3RhdHVzRG9ja2VyLnZlcnNpb24pO1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJiYWxhbmNlOlwiK3N0YXR1c0RvY2tlci5iYWxhbmNlKTtcbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKFwiY29ubmVjdGlvbnM6XCIrc3RhdHVzRG9ja2VyLmNvbm5lY3Rpb25zKTtcbiAgICAgICAgICAgIGlmKHN0YXR1c0RvY2tlci5jb25uZWN0aW9ucz09PTApe1xuICAgICAgICAgICAgICAgIGRvaWNoYWluQWRkTm9kZShzdGFydGVkQ29udGFpbmVySWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKFwic3RhdHVzRG9ja2VyIHByb2JsZW0gdHJ5aW5nIHRvIHN0YXJ0IEJvYnMgbm9kZSBpbnNpZGUgZG9ja2VyIGNvbnRhaW5lcjpcIixlcnJvcik7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgY29ubmVjdERvY2tlckJvYihzdGFydGVkQ29udGFpbmVySWQpO1xuICAgICAgICAgICAgfWNhdGNoKGVycm9yMil7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJjb3VsZCBub3Qgc3RhcnQgYm9iOlwiLGVycm9yMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihjb3VudGVyPT01MClydW5uaW5nPWZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvdW50ZXIrKztcbiAgICB9XG4gICAgY2FsbGJhY2sobnVsbCwgc3RhcnRlZENvbnRhaW5lcklkKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlX29wdGlvbnNfZnJvbV9hbGljZV9hbmRfYm9iKGNhbGxiYWNrKXtcblxuICAgIGNvbnN0IGNvbnRhaW5lcklkID0gZ2V0Q29udGFpbmVySWRPZk5hbWUoJ21vbmdvJyk7XG4gICAgdGVzdExvZ2dpbmcoJ2NvbnRhaW5lcklkIG9mIG1vbmdvOicsY29udGFpbmVySWQpO1xuXG4gICAgZXhlYygoZ2xvYmFsLmluc2lkZV9kb2NrZXI/J3N1ZG8nOicnKSsgJ2RvY2tlciBleGVjICcrY29udGFpbmVySWQrJyBiYXNoIC1jIFwibW9uZ28gPCAvdG1wL2RlbGV0ZV9jb2xsZWN0aW9ucy5zaFwiJywgKGUsIHN0ZG91dCwgc3RkZXJyKT0+IHtcbiAgICAgICAgdGVzdExvZ2dpbmcoKGdsb2JhbC5pbnNpZGVfZG9ja2VyPydzdWRvJzonJykrJ2RvY2tlciBleGVjICcse3N0ZGVycjpzdGRlcnIsc3Rkb3V0OnN0ZG91dH0pO1xuICAgICAgICBjYWxsYmFjayhzdGRlcnIsIHN0ZG91dCk7XG4gICAgfSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTm9kZUFsaXZlKHVybCwgYXV0aCwgbG9nKSB7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnaXNOb2RlQWxpdmUgY2FsbGVkIHRvIHVybCcsdXJsKTtcbiAgICBjb25zdCBkYXRhR2V0TmV0d29ya0luZm8gPSB7XCJqc29ucnBjXCI6IFwiMS4wXCIsIFwiaWRcIjogXCJnZXRuZXR3b3JraW5mb1wiLCBcIm1ldGhvZFwiOiBcImdldG5ldHdvcmtpbmZvXCIsIFwicGFyYW1zXCI6IFtdfTtcbiAgICBjb25zdCByZWFsZGF0YUdldE5ldHdvcmtJbmZvID0ge2F1dGg6IGF1dGgsIGRhdGE6IGRhdGFHZXROZXR3b3JrSW5mbywgaGVhZGVyczogaGVhZGVyc307XG4gICAgY29uc3QgcmVzdWx0R2V0TmV0d29ya0luZm8gPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhR2V0TmV0d29ya0luZm8pO1xuICAgIGNvbnN0IHN0YXR1c0dldE5ldHdvcmtJbmZvID0gcmVzdWx0R2V0TmV0d29ya0luZm8uc3RhdHVzQ29kZTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHN0YXR1c0dldE5ldHdvcmtJbmZvKTtcbiAgICBpZihsb2cpXG4gICAgICAgIHRlc3RMb2dnaW5nKCdyZXN1bHRHZXROZXR3b3JrSW5mbzonLHJlc3VsdEdldE5ldHdvcmtJbmZvKTsgLy8gZ2V0bmV0d29ya2luZm8gfCBqcSAnLmxvY2FsYWRkcmVzc2VzWzBdLmFkZHJlc3MnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05vZGVBbGl2ZUFuZENvbm5lY3RlZFRvSG9zdCh1cmwsIGF1dGgsIGhvc3QsIGxvZykge1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2lzTm9kZUFsaXZlQW5kQ29ubmVjdGVkVG9Ib3N0IGNhbGxlZCcpO1xuICAgIGlzTm9kZUFsaXZlKHVybCwgYXV0aCwgbG9nKTtcblxuICAgIGNvbnN0IGRhdGFHZXROZXR3b3JrSW5mbyA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiYWRkbm9kZVwiLCBcIm1ldGhvZFwiOiBcImFkZG5vZGVcIiwgXCJwYXJhbXNcIjogWydhbGljZScsJ29uZXRyeSddIH07XG4gICAgY29uc3QgcmVhbGRhdGFHZXROZXR3b3JrSW5mbyA9IHsgYXV0aDogYXV0aCwgZGF0YTogZGF0YUdldE5ldHdvcmtJbmZvLCBoZWFkZXJzOiBoZWFkZXJzIH07XG4gICAgY29uc3QgcmVzdWx0R2V0TmV0d29ya0luZm8gPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhR2V0TmV0d29ya0luZm8pO1xuICAgIGNvbnN0IHN0YXR1c0FkZE5vZGUgPSByZXN1bHRHZXROZXR3b3JrSW5mby5zdGF0dXNDb2RlO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2FkZG5vZGU6JyxzdGF0dXNBZGROb2RlKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHN0YXR1c0FkZE5vZGUpO1xuXG5cbiAgICBjb25zdCBkYXRhR2V0UGVlckluZm8gPSB7XCJqc29ucnBjXCI6IFwiMS4wXCIsIFwiaWRcIjpcImdldHBlZXJpbmZvXCIsIFwibWV0aG9kXCI6IFwiZ2V0cGVlcmluZm9cIiwgXCJwYXJhbXNcIjogW10gfTtcbiAgICBjb25zdCByZWFsZGF0YUdldFBlZXJJbmZvID0geyBhdXRoOiBhdXRoLCBkYXRhOiBkYXRhR2V0UGVlckluZm8sIGhlYWRlcnM6IGhlYWRlcnMgfTtcbiAgICBjb25zdCByZXN1bHRHZXRQZWVySW5mbyA9IGdldEh0dHBQT1NUKHVybCwgcmVhbGRhdGFHZXRQZWVySW5mbyk7XG4gICAgY29uc3Qgc3RhdHVzR2V0UGVlckluZm8gPSByZXN1bHRHZXRQZWVySW5mby5zdGF0dXNDb2RlO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3Jlc3VsdEdldFBlZXJJbmZvOicscmVzdWx0R2V0UGVlckluZm8pO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgc3RhdHVzR2V0UGVlckluZm8pO1xuICAgIGNoYWkuYXNzZXJ0LmlzQWJvdmUocmVzdWx0R2V0UGVlckluZm8uZGF0YS5yZXN1bHQubGVuZ3RoLCAwLCAnbm8gY29ubmVjdGlvbiB0byBvdGhlciBub2RlcyEgJyk7XG4gICAgLy9jaGFpLmV4cGVjdChyZXN1bHRHZXRQZWVySW5mby5kYXRhLnJlc3VsdCkudG8uaGF2ZS5sZW5ndGhPZi5hdC5sZWFzdCgxKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0UHJpdktleSh1cmwsIGF1dGgsIHByaXZLZXksIHJlc2NhbiwgbG9nKSB7XG4gICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2ltcG9ydFByaXZLZXkgY2FsbGVkJywnJyk7XG4gICAgICAgIGNvbnN0IGRhdGFfaW1wb3J0cHJpdmtleSA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiaW1wb3J0cHJpdmtleVwiLCBcIm1ldGhvZFwiOiBcImltcG9ydHByaXZrZXlcIiwgXCJwYXJhbXNcIjogW3ByaXZLZXldIH07XG4gICAgICAgIGNvbnN0IHJlYWxkYXRhX2ltcG9ydHByaXZrZXkgPSB7IGF1dGg6IGF1dGgsIGRhdGE6IGRhdGFfaW1wb3J0cHJpdmtleSwgaGVhZGVyczogaGVhZGVycyB9O1xuICAgICAgICBjb25zdCByZXN1bHQgPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhX2ltcG9ydHByaXZrZXkpO1xuICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdyZXN1bHQ6JyxyZXN1bHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV3QWRkcmVzcyh1cmwsIGF1dGgsIGxvZykge1xuXG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnZ2V0TmV3QWRkcmVzcyBjYWxsZWQnKTtcbiAgICBjb25zdCBkYXRhR2V0TmV3QWRkcmVzcyA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiZ2V0bmV3YWRkcmVzc1wiLCBcIm1ldGhvZFwiOiBcImdldG5ld2FkZHJlc3NcIiwgXCJwYXJhbXNcIjogW10gfTtcbiAgICBjb25zdCByZWFsZGF0YUdldE5ld0FkZHJlc3MgPSB7IGF1dGg6IGF1dGgsIGRhdGE6IGRhdGFHZXROZXdBZGRyZXNzLCBoZWFkZXJzOiBoZWFkZXJzIH07XG4gICAgY29uc3QgcmVzdWx0R2V0TmV3QWRkcmVzcyA9IGdldEh0dHBQT1NUKHVybCwgcmVhbGRhdGFHZXROZXdBZGRyZXNzKTtcbiAgICBjb25zdCBzdGF0dXNPcHRJbkdldE5ld0FkZHJlc3MgPSByZXN1bHRHZXROZXdBZGRyZXNzLnN0YXR1c0NvZGU7XG4gICAgY29uc3QgbmV3QWRkcmVzcyAgPSByZXN1bHRHZXROZXdBZGRyZXNzLmRhdGEucmVzdWx0O1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgc3RhdHVzT3B0SW5HZXROZXdBZGRyZXNzKTtcbiAgICBjaGFpLmV4cGVjdChyZXN1bHRHZXROZXdBZGRyZXNzLmRhdGEuZXJyb3IpLnRvLmJlLm51bGw7XG4gICAgY2hhaS5leHBlY3QobmV3QWRkcmVzcykudG8ubm90LmJlLm51bGw7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZyhuZXdBZGRyZXNzKTtcbiAgICByZXR1cm4gbmV3QWRkcmVzcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRldG9hZGRyZXNzKHVybCxhdXRoLHRvYWRkcmVzcyxhbW91bnQsbG9nKXtcbiAgICBjb25zdCBkYXRhR2VuZXJhdGUgPSB7XCJqc29ucnBjXCI6IFwiMS4wXCIsIFwiaWRcIjpcImdlbmVyYXRldG9hZGRyZXNzXCIsIFwibWV0aG9kXCI6IFwiZ2VuZXJhdGV0b2FkZHJlc3NcIiwgXCJwYXJhbXNcIjogW2Ftb3VudCx0b2FkZHJlc3NdIH07XG4gICAgY29uc3QgaGVhZGVyc0dlbmVyYXRlcyA9IHsgJ0NvbnRlbnQtVHlwZSc6J3RleHQvcGxhaW4nICB9O1xuICAgIGNvbnN0IHJlYWxkYXRhR2VuZXJhdGUgPSB7IGF1dGg6IGF1dGgsIGRhdGE6IGRhdGFHZW5lcmF0ZSwgaGVhZGVyczogaGVhZGVyc0dlbmVyYXRlcyB9O1xuICAgIGNvbnN0IHJlc3VsdEdlbmVyYXRlID0gZ2V0SHR0cFBPU1QodXJsLCByZWFsZGF0YUdlbmVyYXRlKTtcbiAgICBjb25zdCBzdGF0dXNSZXN1bHRHZW5lcmF0ZSA9IHJlc3VsdEdlbmVyYXRlLnN0YXR1c0NvZGU7XG4gICAgaWYobG9nKXRlc3RMb2dnaW5nKCdzdGF0dXNSZXN1bHRHZW5lcmF0ZTonLHN0YXR1c1Jlc3VsdEdlbmVyYXRlKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHN0YXR1c1Jlc3VsdEdlbmVyYXRlKTtcbiAgICBjaGFpLmV4cGVjdChyZXN1bHRHZW5lcmF0ZS5kYXRhLmVycm9yKS50by5iZS5udWxsO1xuICAgIGNoYWkuZXhwZWN0KHJlc3VsdEdlbmVyYXRlLmRhdGEucmVzdWx0KS50by5ub3QuYmUubnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJhbGFuY2UodXJsLGF1dGgsbG9nKXtcbiAgICBjb25zdCBkYXRhR2V0QmFsYW5jZSA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiZ2V0YmFsYW5jZVwiLCBcIm1ldGhvZFwiOiBcImdldGJhbGFuY2VcIiwgXCJwYXJhbXNcIjogW10gfTtcbiAgICBjb25zdCByZWFsZGF0YUdldEJhbGFuY2UgPSB7IGF1dGg6IGF1dGgsIGRhdGE6IGRhdGFHZXRCYWxhbmNlLCBoZWFkZXJzOiBoZWFkZXJzIH07XG4gICAgY29uc3QgcmVzdWx0R2V0QmFsYW5jZSA9IGdldEh0dHBQT1NUKHVybCwgcmVhbGRhdGFHZXRCYWxhbmNlKTtcbiAgICBpZihsb2cpdGVzdExvZ2dpbmcoJ3Jlc3VsdEdldEJhbGFuY2U6JyxyZXN1bHRHZXRCYWxhbmNlLmRhdGEucmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0R2V0QmFsYW5jZS5kYXRhLnJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZ2V0X2NvbnRhaW5lcl9pZF9vZl9uYW1lKG5hbWUsY2FsbGJhY2spIHtcbiAgICBleGVjKHN1ZG8rJ2RvY2tlciBwcyAtLWZpbHRlciBcIm5hbWU9JytuYW1lKydcIiB8IGN1dCAtZjEgLWRcIiBcIiB8IHNlZCBcXCcxZFxcJycsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgIGlmKGUhPW51bGwpe1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2Nhbm5vdCBmaW5kICcrbmFtZSsnIG5vZGUgJytzdGRvdXQsc3RkZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJvYnNDb250YWluZXJJZCA9IHN0ZG91dC50b1N0cmluZygpLnRyaW0oKTsgLy8uc3Vic3RyaW5nKDAsc3Rkb3V0LnRvU3RyaW5nKCkubGVuZ3RoLTEpOyAvL3JlbW92ZSBsYXN0IGNoYXIgc2luY2UgaW5zIGEgbGluZSBicmVha1xuICAgICAgICBjYWxsYmFjayhzdGRlcnIsIGJvYnNDb250YWluZXJJZCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHN0b3BfZG9ja2VyX2JvYihjYWxsYmFjaykge1xuICAgIGNvbnN0IGJvYnNDb250YWluZXJJZCA9IGdldENvbnRhaW5lcklkT2ZOYW1lKCdib2InKTtcbiAgICB0ZXN0TG9nZ2luZygnc3RvcHBpbmcgQm9iIHdpdGggY29udGFpbmVyLWlkOiAnK2JvYnNDb250YWluZXJJZCk7XG4gICAgdHJ5e1xuICAgICAgICBleGVjKHN1ZG8rJ2RvY2tlciBzdG9wICcrYm9ic0NvbnRhaW5lcklkLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0b3BwaW5nIEJvYiB3aXRoIGNvbnRhaW5lci1pZDogJyx7c3Rkb3V0OnN0ZG91dCxzdGRlcnI6c3RkZXJyfSk7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBib2JzQ29udGFpbmVySWQpO1xuICAgICAgICB9KTtcbiAgICB9Y2F0Y2ggKGUpIHtcbiAgICAgICAgdGVzdExvZ2dpbmcoJ2NvdWxkbnQgc3RvcCBib2JzIG5vZGUnLGUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fYWRkX25vZGUoY29udGFpbmVySWQsY2FsbGJhY2spIHtcbiAgICBleGVjKHN1ZG8rJ2RvY2tlciBleGVjICcrY29udGFpbmVySWQrJyBkb2ljaGFpbi1jbGkgYWRkbm9kZSBhbGljZSBvbmV0cnknLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICB0ZXN0TG9nZ2luZygnYm9iICcrY29udGFpbmVySWQrJyBjb25uZWN0ZWQ/ICcse3N0ZG91dDpzdGRvdXQsc3RkZXJyOnN0ZGVycn0pO1xuICAgICAgICBjYWxsYmFjayhzdGRlcnIsIHN0ZG91dCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldF9kb2NrZXJfc3RhdHVzKGNvbnRhaW5lcklkLGNhbGxiYWNrKSB7XG4gICAgbG9nQmxvY2tjaGFpbignY29udGFpbmVySWQgJytjb250YWluZXJJZCsnIHJ1bm5pbmc/ICcpO1xuICAgIGV4ZWMoc3VkbysnZG9ja2VyIGV4ZWMgJytjb250YWluZXJJZCsnIGRvaWNoYWluLWNsaSAtZ2V0aW5mbycsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgIHRlc3RMb2dnaW5nKCdjb250YWluZXJJZCAnK2NvbnRhaW5lcklkKycgc3RhdHVzOiAnLHtzdGRvdXQ6c3Rkb3V0LHN0ZGVycjpzdGRlcnJ9KTtcbiAgICAgICAgY2FsbGJhY2soc3RkZXJyLCBzdGRvdXQpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzdGFydF9kb2NrZXJfYm9iKGJvYnNDb250YWluZXJJZCxjYWxsYmFjaykge1xuICAgIGV4ZWMoc3VkbysnZG9ja2VyIHN0YXJ0ICcrYm9ic0NvbnRhaW5lcklkLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICB0ZXN0TG9nZ2luZygnc3RhcnRlZCBib2JzIG5vZGUgYWdhaW46ICcrYm9ic0NvbnRhaW5lcklkLHtzdGRvdXQ6c3Rkb3V0LHN0ZGVycjpzdGRlcnJ9KTtcbiAgICAgICAgY2FsbGJhY2soc3RkZXJyLCBzdGRvdXQudG9TdHJpbmcoKS50cmltKCkpOyAvL3JlbW92ZSBsaW5lIGJyZWFrIGZyb20gdGhlIGVuZFxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjb25uZWN0X2RvY2tlcl9ib2IoYm9ic0NvbnRhaW5lcklkLCBjYWxsYmFjaykge1xuICAgIGV4ZWMoc3VkbysnZG9ja2VyIGV4ZWMgJytib2JzQ29udGFpbmVySWQrJyBkb2ljaGFpbmQgLXJlZ3Rlc3QgLWRhZW1vbiAtcmVpbmRleCAtYWRkbm9kZT1hbGljZScsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgIHRlc3RMb2dnaW5nKCdyZXN0YXJ0aW5nIGRvaWNoYWluZCBvbiBib2JzIG5vZGUgYW5kIGNvbm5lY3Rpbmcgd2l0aCBhbGljZTogJyx7c3Rkb3V0OnN0ZG91dCxzdGRlcnI6c3RkZXJyfSk7XG4gICAgICAgIGNhbGxiYWNrKHN0ZGVyciwgc3Rkb3V0KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc3RhcnRfM3JkX25vZGUoY2FsbGJhY2spIHtcbiAgICBleGVjKHN1ZG8rJ2RvY2tlciBzdGFydCAzcmRfbm9kZScsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgIHRlc3RMb2dnaW5nKCd0cnlpbmcgdG8gc3RhcnQgM3JkX25vZGUnLHtzdGRvdXQ6c3Rkb3V0LHN0ZGVycjpzdGRlcnJ9KTtcbiAgICAgICAgaWYoc3RkZXJyKXtcbiAgICAgICAgICAgIGV4ZWMoc3VkbysnZG9ja2VyIG5ldHdvcmsgbHMgfGdyZXAgZG9pY2hhaW4gfCBjdXQgLWY5IC1kXCIgXCInLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ldHdvcmsgPSBzdGRvdXQudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCxzdGRvdXQudG9TdHJpbmcoKS5sZW5ndGgtMSk7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2Nvbm5lY3RpbmcgM3JkIG5vZGUgdG8gZG9ja2VyIG5ldHdvcms6ICcrbmV0d29yayk7XG4gICAgICAgICAgICAgICAgZXhlYyhzdWRvKydkb2NrZXIgcnVuIC0tZXhwb3NlPTE4MzMyICcgK1xuICAgICAgICAgICAgICAgICAgICAnLWUgUkVHVEVTVD10cnVlICcgK1xuICAgICAgICAgICAgICAgICAgICAnLWUgRE9JQ0hBSU5fVkVSPTAuMTYuMy4yICcgK1xuICAgICAgICAgICAgICAgICAgICAnLWUgUlBDX0FMTE9XX0lQPTo6LzAgJyArXG4gICAgICAgICAgICAgICAgICAgICctZSBDT05ORUNUSU9OX05PREU9YWxpY2UgJytcbiAgICAgICAgICAgICAgICAgICAgJy1lIFJQQ19QQVNTV09SRD1nZW5lcmF0ZWQtcGFzc3dvcmQgJyArXG4gICAgICAgICAgICAgICAgICAgICctLW5hbWU9M3JkX25vZGUgJytcbiAgICAgICAgICAgICAgICAgICAgJy0tZG5zPTE3Mi4yMC4wLjUgICcgK1xuICAgICAgICAgICAgICAgICAgICAnLS1kbnM9OC44LjguOCAnICtcbiAgICAgICAgICAgICAgICAgICAgJy0tZG5zLXNlYXJjaD1jaS1kb2ljaGFpbi5vcmcgJyArXG4gICAgICAgICAgICAgICAgICAgICctLWlwPTE3Mi4yMC4wLjEwICcgK1xuICAgICAgICAgICAgICAgICAgICAnLS1uZXR3b3JrPScrbmV0d29yaysnIC1kIGRvaWNoYWluL2NvcmU6MC4xNi4zLjInLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhzdGRlcnIsIHN0ZG91dCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBjYWxsYmFjayhzdGRlcnIsIHN0ZG91dCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG59XG5cbmZ1bmN0aW9uIHJ1bl9hbmRfd2FpdChydW5mdW5jdGlvbixzZWNvbmRzLCBjYWxsYmFjayl7XG4gICAgTWV0ZW9yLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBydW5mdW5jdGlvbigpO1xuICAgICAgICBjYWxsYmFjayhudWxsLHRydWUpO1xuICAgIH0sIHNlY29uZHMrMTAwMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0VG9TdGFydENvbnRhaW5lcihjb250YWluZXJJZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyh3YWl0X3RvX3N0YXJ0X2NvbnRhaW5lcik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNvbnRhaW5lcklkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZU9wdEluc0Zyb21BbGljZUFuZEJvYigpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZGVsZXRlX29wdGlvbnNfZnJvbV9hbGljZV9hbmRfYm9iKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0M3JkTm9kZSgpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoc3RhcnRfM3JkX25vZGUpO1xuICAgIHJldHVybiBzeW5jRnVuYygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RvcERvY2tlckJvYigpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoc3RvcF9kb2NrZXJfYm9iKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRhaW5lcklkT2ZOYW1lKG5hbWUpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZ2V0X2NvbnRhaW5lcl9pZF9vZl9uYW1lKTtcbiAgICByZXR1cm4gc3luY0Z1bmMobmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydERvY2tlckJvYihjb250YWluZXJJZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhzdGFydF9kb2NrZXJfYm9iKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY29udGFpbmVySWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG9pY2hhaW5BZGROb2RlKGNvbnRhaW5lcklkKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2FkZF9ub2RlKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY29udGFpbmVySWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RG9ja2VyU3RhdHVzKGNvbnRhaW5lcklkKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGdldF9kb2NrZXJfc3RhdHVzKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY29udGFpbmVySWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29ubmVjdERvY2tlckJvYihjb250YWluZXJJZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhjb25uZWN0X2RvY2tlcl9ib2IpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjb250YWluZXJJZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5BbmRXYWl0KHJ1bmZ1bmN0aW9uLCBzZWNvbmRzKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHJ1bl9hbmRfd2FpdCk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHNlY29uZHMpO1xufSIsImltcG9ydCB7Y2hhaX0gZnJvbSAnbWV0ZW9yL3ByYWN0aWNhbG1ldGVvcjpjaGFpJztcbmltcG9ydCB7IHRlc3RMb2cgfSBmcm9tIFwibWV0ZW9yL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGlcIjtcbmltcG9ydCB7XG4gICAgZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iLCBnZXRCYWxhbmNlLCBpbml0QmxvY2tjaGFpblxufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1ub2RlXCI7XG5cbmdsb2JhbC5pbnNpZGVfZG9ja2VyID0gZmFsc2U7XG5cbmNvbnN0IGxvZyA9IHRydWU7XG5cbmdsb2JhbC5ub2RlX3VybF9hbGljZSA9ICdodHRwOi8vMTcyLjIwLjAuNjoxODMzMi8nO1xuaWYoIWdsb2JhbC5pbnNpZGVfZG9ja2VyKSBnbG9iYWwubm9kZV91cmxfYWxpY2UgPSAnaHR0cDovL2xvY2FsaG9zdDoxODU0My8nO1xuZ2xvYmFsLm5vZGVfdXJsX2JvYiA9ICAgJ2h0dHA6Ly8xNzIuMjAuMC43OjE4MzMyLyc7XG5pZighZ2xvYmFsLmluc2lkZV9kb2NrZXIpIGdsb2JhbC5ub2RlX3VybF9ib2IgPSAnaHR0cDovL2xvY2FsaG9zdDoxODU0NC8nO1xuZ2xvYmFsLnJwY0F1dGhBbGljZSA9IFwiYWRtaW46Z2VuZXJhdGVkLXBhc3N3b3JkXCI7XG5nbG9iYWwucnBjQXV0aCA9IFwiYWRtaW46Z2VuZXJhdGVkLXBhc3N3b3JkXCI7XG5cbmNvbnN0IHByaXZLZXlCb2IgPSBcImNQM0VpZ2t6c1d1eUtFbXhrOGNDNnFYWWI0Wmp3VW81dnp2WnBBUG1EUTgzUkNnWFFydWpcIjtcblxuZ2xvYmFsLmRhcHBVcmxBbGljZSA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCI7XG5nbG9iYWwuZGFwcFVybEJvYiA9IGdsb2JhbC5pbnNkZV9kb2NrZXI/XCJodHRwOi8vMTcyLjIwLjAuODo0MDAwXCI6XCJodHRwOi8vbG9jYWxob3N0OjQwMDBcIjtcbmdsb2JhbC5kQXBwTG9naW4gPSB7XCJ1c2VybmFtZVwiOlwiYWRtaW5cIixcInBhc3N3b3JkXCI6XCJwYXNzd29yZFwifTtcblxuXG5cbmlmKE1ldGVvci5pc0FwcFRlc3QpIHtcbiAgICBkZXNjcmliZSgnYmFzaWMtZG9pLXRlc3QtMCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0KDApO1xuXG4gICAgICAgIGJlZm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0ZXN0TG9nKFwicmVtb3ZpbmcgT3B0SW5zLFJlY2lwaWVudHMsU2VuZGVyc1wiLCcnKTtcbiAgICAgICAgICAgIGRlbGV0ZU9wdEluc0Zyb21BbGljZUFuZEJvYigpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBhIFJlZ1Rlc3QgRG9pY2hhaW4gd2l0aCBhbGljZSBhbmQgYm9iIGFuZCBzb21lIERvaSAtIGNvaW5zJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW5pdEJsb2NrY2hhaW4oZ2xvYmFsLm5vZGVfdXJsX2FsaWNlLGdsb2JhbC5ub2RlX3VybF9ib2IsZ2xvYmFsLnJwY0F1dGgscHJpdktleUJvYix0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGFsaWNlQmFsYW5jZSA9IGdldEJhbGFuY2UoZ2xvYmFsLm5vZGVfdXJsX2FsaWNlLCBnbG9iYWwucnBjQXV0aCwgbG9nKTtcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzQWJvdmUoYWxpY2VCYWxhbmNlLCAwLCAnbm8gZnVuZGluZyEgJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuaW1wb3J0IHtcbiAgICBsb2dpbixcbiAgICBjcmVhdGVVc2VyLFxuICAgIGZpbmRVc2VyLFxuICAgIGV4cG9ydE9wdElucyxcbiAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pLCByZXNldFVzZXJzLCB1cGRhdGVVc2VyLCBkZWxldGVBbGxFbWFpbHNGcm9tUG9wM1xufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1kYXBwXCI7XG5pbXBvcnQge1xuICAgIHRlc3RMb2cgYXMgbG9nQmxvY2tjaGFpblxufSBmcm9tIFwibWV0ZW9yL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGlcIjtcblxuaW1wb3J0IHtkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2J9IGZyb20gXCIuL3Rlc3QtYXBpL3Rlc3QtYXBpLW9uLW5vZGVcIjtcblxuXG5cbmxldCB0ZW1wbGF0ZVVybEE9XCJodHRwOi8vMTcyLjIwLjAuODo0MDAwL3RlbXBsYXRlcy9lbWFpbHMvZG9pY2hhaW4tYW5tZWxkdW5nLWZpbmFsLURFLmh0bWxcIjtcbmxldCB0ZW1wbGF0ZVVybEI9XCJodHRwOi8vMTcyLjIwLjAuODo0MDAwL3RlbXBsYXRlcy9lbWFpbHMvZG9pY2hhaW4tYW5tZWxkdW5nLWZpbmFsLUVOLmh0bWxcIjtcbmlmKCFnbG9iYWwuaW5zaWRlX2RvY2tlcil7XG4gICAgdGVtcGxhdGVVcmxBPVwiaHR0cDovL2xvY2FsaG9zdDo0MDAwL3RlbXBsYXRlcy9lbWFpbHMvZG9pY2hhaW4tYW5tZWxkdW5nLWZpbmFsLURFLmh0bWxcIjtcbiAgICB0ZW1wbGF0ZVVybEI9XCJodHRwOi8vbG9jYWxob3N0OjQwMDAvdGVtcGxhdGVzL2VtYWlscy9kb2ljaGFpbi1hbm1lbGR1bmctZmluYWwtRU4uaHRtbFwiO1xufVxuXG5jb25zdCBhbGljZUFMb2dpbiA9IHtcInVzZXJuYW1lXCI6XCJhbGljZS1hXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn07XG5jb25zdCBhbGljZUJMb2dpbiA9IHtcInVzZXJuYW1lXCI6XCJhbGljZS1hXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn07XG5cbmNvbnN0IHJlY2lwaWVudF9wb3AzdXNlcm5hbWUgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjtcbmNvbnN0IHJlY2lwaWVudF9wb3AzcGFzc3dvcmQgPSBcImJvYlwiO1xuXG5jb25zdCBsb2cgPSB0cnVlO1xuXG5pZihNZXRlb3IuaXNBcHBUZXN0KSB7XG4gICAgZGVzY3JpYmUoJ2Jhc2ljLWRvaS10ZXN0LTAxJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRpbWVvdXQoMCk7XG5cbiAgICAgICAgYmVmb3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJyZW1vdmluZyBPcHRJbnMsUmVjaXBpZW50cyxTZW5kZXJzXCIpO1xuICAgICAgICAgICAgZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iKCk7XG4gICAgICAgICAgICBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMyhnbG9iYWwuaW5zaWRlX2RvY2tlcj9cIm1haWxcIjpcImxvY2FsaG9zdFwiLCAxMTAsIHJlY2lwaWVudF9wb3AzdXNlcm5hbWUsIHJlY2lwaWVudF9wb3AzcGFzc3dvcmQsIHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICB4aXQoJ3Nob3VsZCB0ZXN0IGlmIGJhc2ljIERvaWNoYWluIHdvcmtmbG93IGlzIHdvcmtpbmcgd2l0aCBvcHRpb25hbCBkYXRhJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIHN0YW5kYXJkIHRvIG5vdCBjb25mdXNlIHBlb3BsZSFcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZUBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFMb2dpbkFsaWNlID0gbG9naW4oZ2xvYmFsLmRhcHBVcmxBbGljZSwgZ2xvYmFsLmRBcHBMb2dpbiwgZmFsc2UpOyAvL2xvZyBpbnRvIGRBcHBcbiAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2koZ2xvYmFsLm5vZGVfdXJsX2FsaWNlLCBnbG9iYWwucnBjQXV0aEFsaWNlLCBnbG9iYWwuZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgZ2xvYmFsLmRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgeydjaXR5JzogJ0VrYXRlcmluYnVyZyd9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHhpdCgnc2hvdWxkIHRlc3QgaWYgYmFzaWMgRG9pY2hhaW4gd29ya2Zsb3cgaXMgd29ya2luZyB3aXRob3V0IG9wdGlvbmFsIGRhdGEnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImFsaWNlQGNpLWRvaWNoYWluLm9yZ1wiOyAvL3BsZWFzZSB1c2UgdGhpcyBhcyBhbiBhbGVybmF0aXZlIHdoZW4gYWJvdmUgc3RhbmRhcmQgaXMgbm90IHBvc3NpYmxlXG4gICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbCA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgLy9sb2dpbiB0byBkQXBwICYgcmVxdWVzdCBET0kgb24gYWxpY2UgdmlhIGJvYlxuICAgICAgICAgICAgY29uc3QgZGF0YUxvZ2luQWxpY2UgPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCBnbG9iYWwuZEFwcExvZ2luLCBmYWxzZSk7IC8vbG9nIGludG8gZEFwcFxuICAgICAgICAgICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShnbG9iYWwubm9kZV91cmxfYWxpY2UsIGdsb2JhbC5ycGNBdXRoQWxpY2UsIGdsb2JhbC5kYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCBnbG9iYWwuZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsLCBudWxsLCBcImFsaWNlQGNpLWRvaWNoYWluLm9yZ1wiLCBcImFsaWNlXCIsIHRydWUpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB4aXQoJ3Nob3VsZCBjcmVhdGUgdHdvIG1vcmUgdXNlcnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgcmVzZXRVc2VycygpO1xuICAgICAgICAgICAgY29uc3QgbG9nQWRtaW4gPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCBnbG9iYWwuZEFwcExvZ2luLCBmYWxzZSk7XG4gICAgICAgICAgICBsZXQgdXNlckEgPSBjcmVhdGVVc2VyKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGxvZ0FkbWluLCBcImFsaWNlLWFcIiwgdGVtcGxhdGVVcmxBLCB0cnVlKTtcbiAgICAgICAgICAgIGNoYWkuZXhwZWN0KGZpbmRVc2VyKHVzZXJBKSkudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGxldCB1c2VyQiA9IGNyZWF0ZVVzZXIoZ2xvYmFsLmRhcHBVcmxBbGljZSwgbG9nQWRtaW4sIFwiYWxpY2UtYlwiLCB0ZW1wbGF0ZVVybEIsIHRydWUpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoZmluZFVzZXIodXNlckIpKS50by5ub3QuYmUudW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHhpdCgnc2hvdWxkIHRlc3QgaWYgRG9pY2hhaW4gd29ya2Zsb3cgaXMgdXNpbmcgZGlmZmVyZW50IHRlbXBsYXRlcyBmb3IgZGlmZmVyZW50IHVzZXJzJywgZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICAgICAgcmVzZXRVc2VycygpO1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjsgLy9cbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsX2FsaWNlX2EgPSBcImFsaWNlLWFAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbF9hbGljZV9iID0gXCJhbGljZS1iQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgY29uc3QgbG9nQWRtaW4gPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCBnbG9iYWwuZEFwcExvZ2luLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGxldCB1c2VyQSA9IGNyZWF0ZVVzZXIoZ2xvYmFsLmRhcHBVcmxBbGljZSwgbG9nQWRtaW4sIFwiYWxpY2UtYVwiLCB0ZW1wbGF0ZVVybEEsIHRydWUpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoZmluZFVzZXIodXNlckEpKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgICAgICAgICAgbGV0IHVzZXJCID0gY3JlYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgXCJhbGljZS1iXCIsIHRlbXBsYXRlVXJsQiwgdHJ1ZSk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChmaW5kVXNlcih1c2VyQikpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvZ1VzZXJBID0gbG9naW4oZ2xvYmFsLmRhcHBVcmxBbGljZSwgYWxpY2VBTG9naW4sIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgbG9nVXNlckIgPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCBhbGljZUJMb2dpbiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaSBjaGVja3MgaWYgdGhlIFwibG9nXCIgdmFsdWUgKGlmIGl0IGlzIGEgU3RyaW5nKSBpcyBpbiB0aGUgbWFpbC10ZXh0XG4gICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKGdsb2JhbC5ub2RlX3VybF9hbGljZSwgZ2xvYmFsLnJwY0F1dGhBbGljZSxnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dVc2VyQSwgZ2xvYmFsLmRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbF9hbGljZV9hLCB7J2NpdHknOiAnRWthdGVyaW5idXJnJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCBcImtvc3Rlbmxvc2UgQW5tZWxkdW5nXCIpO1xuICAgICAgICAgICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShnbG9iYWwubm9kZV91cmxfYWxpY2UsIGdsb2JhbC5ycGNBdXRoQWxpY2UsIGdsb2JhbC5kYXBwVXJsQWxpY2UsIGxvZ1VzZXJCLCBnbG9iYWwuZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsX2FsaWNlX2IsIHsnY2l0eSc6ICdTaW1iYWNoJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCBcImZyZWUgcmVnaXN0cmF0aW9uXCIpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiB1c2VycyBjYW4gZXhwb3J0IE9wdElucyAnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgcmVzZXRVc2VycygpO1xuXG4gICAgICAgICAgICBjb25zdCBsb2dBZG1pbiA9IGxvZ2luKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGdsb2JhbC5kQXBwTG9naW4sIGZhbHNlKTtcbiAgICAgICAgICAgIGxldCB1c2VyQSA9IGNyZWF0ZVVzZXIoZ2xvYmFsLmRhcHBVcmxBbGljZSwgbG9nQWRtaW4sIFwiYWxpY2UtYVwiLCB0ZW1wbGF0ZVVybEEsIHRydWUpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoZmluZFVzZXIodXNlckEpKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgICAgICAgICAgbGV0IHVzZXJCID0gY3JlYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgXCJhbGljZS1iXCIsIHRlbXBsYXRlVXJsQiwgdHJ1ZSk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChmaW5kVXNlcih1c2VyQikpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vXG4gICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbF9hbGljZV9hID0gXCJhbGljZS1leHBvcnRAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICBjb25zdCBsb2dVc2VyQSA9IGxvZ2luKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGFsaWNlQUxvZ2luLCBsb2cpO1xuICAgICAgICAgICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShnbG9iYWwubm9kZV91cmxfYWxpY2UsIGdsb2JhbC5ycGNBdXRoQWxpY2UsIGdsb2JhbC5kYXBwVXJsQWxpY2UsIGxvZ1VzZXJBLCBnbG9iYWwuZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsX2FsaWNlX2EsIHsnY2l0eSc6ICdNw7xuY2hlbid9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBleHBvcnRlZE9wdElucyA9IGV4cG9ydE9wdElucyhnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgbG9nKTtcbiAgICAgICAgICAgIGlmKGxvZykgbG9nQmxvY2tjaGFpbignZXhwb3J0ZWRPcHRJbnM6JyxleHBvcnRlZE9wdElucyk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChleHBvcnRlZE9wdElucykudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNoYWkuZXhwZWN0KGV4cG9ydGVkT3B0SW5zWzBdKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3QgZXhwb3J0ZWRPcHRJbnNBID0gZXhwb3J0T3B0SW5zKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGxvZ1VzZXJBLCBsb2cpO1xuICAgICAgICAgICAgaWYobG9nKWxvZ0Jsb2NrY2hhaW4oJ2V4cG9ydGVkT3B0SW5zQTonLGV4cG9ydGVkT3B0SW5zQSk7XG4gICAgICAgICAgICBleHBvcnRlZE9wdEluc0EuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICBjaGFpLmV4cGVjdChlbGVtZW50Lm93bmVySWQpLnRvLmJlLmVxdWFsKGxvZ1VzZXJBLnVzZXJJZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vY2hhaS5leHBlY3QoZmluZE9wdEluKHJlc3VsdERhdGFPcHRJbi5faWQpKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB4aXQoJ3Nob3VsZCB0ZXN0IGlmIGFkbWluIGNhbiB1cGRhdGUgdXNlciBwcm9maWxlcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlc2V0VXNlcnMoKTtcbiAgICAgICAgICAgIGxldCBsb2dBZG1pbiA9IGxvZ2luKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGdsb2JhbC5kQXBwTG9naW4sIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXNlclVwID0gY3JlYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgXCJ1cGRhdGVVc2VyXCIsIHRlbXBsYXRlVXJsQSwgdHJ1ZSk7XG4gICAgICAgICAgICBsb2dCbG9ja2NoYWluKCdjcmVhdGVVc2VyOicsdXNlclVwKTtcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZWREYXRhID0gdXBkYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgdXNlclVwLCB7XCJ0ZW1wbGF0ZVVSTFwiOiB0ZW1wbGF0ZVVybEJ9LCB0cnVlKTtcbiAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oJ2NoYW5nZWREYXRhOicsY2hhbmdlZERhdGEpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoY2hhbmdlZERhdGEpLm5vdC51bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHhpdCgnc2hvdWxkIHRlc3QgaWYgdXNlciBjYW4gdXBkYXRlIG93biBwcm9maWxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVzZXRVc2VycygpO1xuICAgICAgICAgICAgbGV0IGxvZ0FkbWluID0gbG9naW4oZ2xvYmFsLmRhcHBVcmxBbGljZSwgZ2xvYmFsLmRBcHBMb2dpbiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1c2VyVXAgPSBjcmVhdGVVc2VyKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGxvZ0FkbWluLCBcInVwZGF0ZVVzZXJcIiwgdGVtcGxhdGVVcmxBLCB0cnVlKTtcbiAgICAgICAgICAgIC8vbG9nQmxvY2tjaGFpbignc2hvdWxkIHRlc3QgaWYgdXNlciBjYW4gdXBkYXRlIG93biBwcm9maWxlOnVzZXJVcDonLHVzZXJVcCk7XG4gICAgICAgICAgICBjb25zdCBsb2dVc2VyVXAgPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCB7XCJ1c2VybmFtZVwiOiBcInVwZGF0ZVVzZXJcIiwgXCJwYXNzd29yZFwiOiBcInBhc3N3b3JkXCJ9LCB0cnVlKTtcbiAgICAgICAgICAgIC8vbG9nQmxvY2tjaGFpbignc2hvdWxkIHRlc3QgaWYgdXNlciBjYW4gdXBkYXRlIG93biBwcm9maWxlOmxvZ1VzZXJVcDonLGxvZ1VzZXJVcCk7XG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VkRGF0YSA9IHVwZGF0ZVVzZXIoZ2xvYmFsLmRhcHBVcmxBbGljZSwgbG9nVXNlclVwLCB1c2VyVXAsIHtcInRlbXBsYXRlVVJMXCI6IHRlbXBsYXRlVXJsQn0sIHRydWUpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoY2hhbmdlZERhdGEpLm5vdC51bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHhpdCgnc2hvdWxkIHRlc3QgaWYgY29Eb2kgd29ya3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBjb0RvaUxpc3QgPSBbXCJhbGljZTFAZG9pY2hhaW4tY2kuY29tXCIsIFwiYWxpY2UyQGRvaWNoYWluLWNpLmNvbVwiLCBcImFsaWNlM0Bkb2ljaGFpbi1jaS5jb21cIl07XG4gICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWwgPSBjb0RvaUxpc3Q7XG4gICAgICAgICAgICBsZXQgbG9nQWRtaW4gPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCBnbG9iYWwuZEFwcExvZ2luLCB0cnVlKTtcbiAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2koZ2xvYmFsLm5vZGVfdXJsX2FsaWNlLCBnbG9iYWwucnBjQXV0aEFsaWNlLCBnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgZ2xvYmFsLmRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgeydjaXR5JzogJ0VrYXRlcmluYnVyZyd9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHhpdCgnc2hvdWxkIGZpbmQgdXBkYXRlZCBEYXRhIGluIGVtYWlsJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIHN0YW5kYXJkIHRvIG5vdCBjb25mdXNlIHBlb3BsZSFcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZS11cGRhdGVAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICBjb25zdCBhZExvZyA9IGxvZ2luKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGdsb2JhbC5kQXBwTG9naW4sIGZhbHNlKTtcbiAgICAgICAgICAgIHVwZGF0ZVVzZXIoZ2xvYmFsLmRhcHBVcmxBbGljZSwgYWRMb2csIGFkTG9nLnVzZXJJZCwge1wic3ViamVjdFwiOiBcInVwZGF0ZVRlc3RcIiwgXCJ0ZW1wbGF0ZVVSTFwiOiB0ZW1wbGF0ZVVybEJ9KTtcbiAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2koZ2xvYmFsLm5vZGVfdXJsX2FsaWNlLCBnbG9iYWwucnBjQXV0aEFsaWNlLCBnbG9iYWwuZGFwcFVybEFsaWNlLCBhZExvZywgZ2xvYmFsLmRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCxcbiAgICAgICAgICAgICAgICB7J2NpdHknOiAnRWthdGVyaW5idXJnJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCB0cnVlKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZWRpcmVjdCBpZiBjb25maXJtYXRpb24tbGluayBpcyBjbGlja2VkIGFnYWluJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDM7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiOyAvL3BsZWFzZSB1c2UgdGhpcyBhcyBzdGFuZGFyZCB0byBub3QgY29uZnVzZSBwZW9wbGUhXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWwgPSBcImFsaWNlX1wiK2luZGV4K1wiQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFMb2dpbkFsaWNlID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIGZhbHNlKTsgLy9sb2cgaW50byBkQXBwXG4gICAgICAgICAgICAgICAgbGV0IHJldHVybmVkRGF0YSA9IHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsLCB7J2NpdHknOiAnRWthdGVyaW5idXJnJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5lcXVhbCh0cnVlLGNvbmZpcm1MaW5rKHJldHVybmVkRGF0YS5jb25maXJtTGluaykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuaW1wb3J0IHtcbiAgICBjb25maXJtTGluaywgZGVsZXRlQWxsRW1haWxzRnJvbVBvcDMsXG4gICAgZmV0Y2hDb25maXJtTGlua0Zyb21Qb3AzTWFpbCxcbiAgICBnZXROYW1lSWRPZk9wdEluRnJvbVJhd1R4LFxuICAgIGxvZ2luLFxuICAgIHJlcXVlc3RET0ksIHZlcmlmeURPSVxufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1kYXBwXCI7XG5pbXBvcnQge1xuICAgIHRlc3RMb2cgYXMgdGVzdExvZ2dpbmdcbn0gZnJvbSBcIm1ldGVvci9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpXCI7XG5pbXBvcnQge1xuICAgIGRlbGV0ZU9wdEluc0Zyb21BbGljZUFuZEJvYixcbiAgICBnZW5lcmF0ZXRvYWRkcmVzcyxcbiAgICBnZXROZXdBZGRyZXNzLFxuICAgIHN0YXJ0M3JkTm9kZSxcbiAgICBzdGFydERvY2tlckJvYixcbiAgICBzdG9wRG9ja2VyQm9iLCB3YWl0VG9TdGFydENvbnRhaW5lclxufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1ub2RlXCI7XG5jb25zdCBleGVjID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG5jb25zdCBub2RlX3VybF9hbGljZSA9ICdodHRwOi8vMTcyLjIwLjAuNjoxODMzMi8nO1xuY29uc3QgcmVjaXBpZW50X3BvcDN1c2VybmFtZSA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiO1xuY29uc3QgcmVjaXBpZW50X3BvcDNwYXNzd29yZCA9IFwiYm9iXCI7XG5cbmNvbnN0IHJwY0F1dGggPSBcImFkbWluOmdlbmVyYXRlZC1wYXNzd29yZFwiO1xuY29uc3QgZGFwcFVybEFsaWNlID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIjtcbmNvbnN0IGRhcHBVcmxCb2IgPSBcImh0dHA6Ly8xNzIuMjAuMC44OjQwMDBcIjtcbmNvbnN0IGRBcHBMb2dpbiA9IHtcInVzZXJuYW1lXCI6XCJhZG1pblwiLFwicGFzc3dvcmRcIjpcInBhc3N3b3JkXCJ9O1xuY29uc3QgbG9nID0gdHJ1ZTtcblxuaWYoTWV0ZW9yLmlzQXBwVGVzdCkge1xuICAgIGRlc2NyaWJlKCcwMi1iYXNpYy1kb2ktdGVzdC13aXRoLW9mZmxpbmUtbm9kZS0wMicsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iKCk7XG4gICAgICAgICAgICBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMyhcIm1haWxcIiwgMTEwLCByZWNpcGllbnRfcG9wM3VzZXJuYW1lLCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkLCB0cnVlKTtcbiAgICAgICAgICAgIGV4ZWMoJ3N1ZG8gZG9ja2VyIHJtIDNyZF9ub2RlJywgKGUsIHN0ZG91dDIsIHN0ZGVycjIpID0+IHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnZGVsZXRlZCAzcmRfbm9kZTonLCB7c3Rkb3V0OiBzdGRvdXQyLCBzdGRlcnI6IHN0ZGVycjJ9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGV4ZWMoJ3N1ZG8gZG9ja2VyIHN0b3AgM3JkX25vZGUnLCAoZSwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0b3BwZWQgM3JkX25vZGU6Jywge3N0ZG91dDogc3Rkb3V0LCBzdGRlcnI6IHN0ZGVycn0pO1xuICAgICAgICAgICAgICAgICAgICBleGVjKCdzdWRvIGRvY2tlciBybSAzcmRfbm9kZScsIChlLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3JlbW92ZWQgM3JkX25vZGU6Jywge3N0ZG91dDogc3Rkb3V0LCBzdGRlcnI6IHN0ZGVycn0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2NvdWxkIG5vdCBzdG9wIDNyZF9ub2RlJywpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9pbXBvcnRQcml2S2V5KG5vZGVfdXJsX2JvYiwgcnBjQXV0aCwgcHJpdktleUJvYiwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBleGVjKCdzdWRvIGRvY2tlciBzdG9wIDNyZF9ub2RlJywgKGUsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdzdG9wcGVkIDNyZF9ub2RlOicsIHtzdGRvdXQ6IHN0ZG91dCwgc3RkZXJyOiBzdGRlcnJ9KTtcbiAgICAgICAgICAgICAgICAgICAgZXhlYygnc3VkbyBkb2NrZXIgcm0gM3JkX25vZGUnLCAoZSwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdyZW1vdmVkIDNyZF9ub2RlOicsIHtzdGRvdXQ6IHN0ZG91dCwgc3RkZXJyOiBzdGRlcnJ9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjb3VsZCBub3Qgc3RvcCAzcmRfbm9kZScsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGJhc2ljIERvaWNoYWluIHdvcmtmbG93IGlzIHdvcmtpbmcgd2hlbiBCb2JzIG5vZGUgaXMgdGVtcG9yYXJpbHkgb2ZmbGluZScsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXQoMCk7XG4gICAgICAgICAgICBnbG9iYWwuYWxpY2VBZGRyZXNzID0gZ2V0TmV3QWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgZmFsc2UpO1xuICAgICAgICAgICAgLy9zdGFydCBhbm90aGVyIDNyZCBub2RlIGJlZm9yZSBzaHV0ZG93biBCb2JcbiAgICAgICAgICAgIHN0YXJ0M3JkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lcklkID0gc3RvcERvY2tlckJvYigpO1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZS10by1vZmZsaW5lLW5vZGVAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICAvL2xvZ2luIHRvIGRBcHAgJiByZXF1ZXN0IERPSSBvbiBhbGljZSB2aWEgYm9iXG4gICAgICAgICAgICBpZiAobG9nKSB0ZXN0TG9nZ2luZygnbG9nIGludG8gYWxpY2UgYW5kIHJlcXVlc3QgRE9JJyk7XG4gICAgICAgICAgICBsZXQgZGF0YUxvZ2luQWxpY2UgPSBsb2dpbihkYXBwVXJsQWxpY2UsIGRBcHBMb2dpbiwgZmFsc2UpOyAvL2xvZyBpbnRvIGRBcHBcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhT3B0SW4gPSByZXF1ZXN0RE9JKGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgbnVsbCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5hbWVJZCA9IGdldE5hbWVJZE9mT3B0SW5Gcm9tUmF3VHgobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIHJlc3VsdERhdGFPcHRJbi5kYXRhLmlkLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChsb2cpIHRlc3RMb2dnaW5nKCdnb3QgbmFtZUlkJywgbmFtZUlkKTtcbiAgICAgICAgICAgIHZhciBzdGFydGVkQ29udGFpbmVySWQgPSBzdGFydERvY2tlckJvYihjb250YWluZXJJZCk7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZyhcInN0YXJ0ZWQgYm9iJ3Mgbm9kZSB3aXRoIGNvbnRhaW5lcklkXCIsIHN0YXJ0ZWRDb250YWluZXJJZCk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChzdGFydGVkQ29udGFpbmVySWQpLnRvLm5vdC5iZS5udWxsO1xuICAgICAgICAgICAgd2FpdFRvU3RhcnRDb250YWluZXIoc3RhcnRlZENvbnRhaW5lcklkKTtcblxuICAgICAgICAgICAgLy9nZW5lcmF0aW5nIGEgYmxvY2sgc28gdHJhbnNhY3Rpb24gZ2V0cyBjb25maXJtZWQgYW5kIGRlbGl2ZXJlZCB0byBib2IuXG4gICAgICAgICAgICBnZW5lcmF0ZXRvYWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgICAgICAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgICAgICAoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAocnVubmluZyAmJiArK2NvdW50ZXIgPCA1MCkgeyAvL3RyeWluZyA1MHggdG8gZ2V0IGVtYWlsIGZyb20gYm9icyBtYWlsYm94XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIGdsb2JhbC5hbGljZUFkZHJlc3MsIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0ZXAgMzogZ2V0dGluZyBlbWFpbCEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsyQ29uZmlybSA9IGZldGNoQ29uZmlybUxpbmtGcm9tUG9wM01haWwoXCJtYWlsXCIsIDExMCwgcmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgZGFwcFVybEJvYiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0ZXAgNDogY29uZmlybWluZyBsaW5rJywgbGluazJDb25maXJtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5rMkNvbmZpcm0gIT0gbnVsbCkgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlybUxpbmsobGluazJDb25maXJtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjb25maXJtZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCd0cnlpbmcgdG8gZ2V0IGVtYWlsIC0gc28gZmFyIG5vIHN1Y2Nlc3M6JywgY291bnRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMjAwMCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIGdsb2JhbC5hbGljZUFkZHJlc3MsIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgIHZlcmlmeURPSShkYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCBub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLCBuYW1lSWQsIGxvZyk7IC8vbmVlZCB0byBnZW5lcmF0ZSB0d28gYmxvY2tzIHRvIG1ha2UgYmxvY2sgdmlzaWJsZSBvbiBhbGljZVxuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdlbmQgb2YgZ2V0TmFtZUlkT2ZSYXdUcmFuc2FjdGlvbiByZXR1cm5pbmcgbmFtZUlkJywgbmFtZUlkKTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBleGVjKCdzdWRvIGRvY2tlciBzdG9wIDNyZF9ub2RlJywgKGUsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnc3RvcHBlZCAzcmRfbm9kZTonLCB7c3Rkb3V0OiBzdGRvdXQsIHN0ZGVycjogc3RkZXJyfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGVjKCdzdWRvIGRvY2tlciBybSAzcmRfbm9kZScsIChlLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdyZW1vdmVkIDNyZF9ub2RlOicsIHtzdGRvdXQ6IHN0ZG91dCwgc3RkZXJyOiBzdGRlcnJ9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnY291bGQgbm90IHN0b3AgM3JkX25vZGUnLCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIC8vZG9uZSgpO1xuICAgICAgICB9KTsgLy9pdFxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuaW1wb3J0IHtcbiAgICBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMywgZmluZE9wdEluLFxuICAgIGxvZ2luLFxuICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2ksIHJlcXVlc3RET0lcbn0gZnJvbSBcIi4vdGVzdC1hcGkvdGVzdC1hcGktb24tZGFwcFwiO1xuaW1wb3J0IHtcbiAgICB0ZXN0TG9nIGFzIGxvZ0Jsb2NrY2hhaW5cbn0gZnJvbSBcIm1ldGVvci9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpXCI7XG5pbXBvcnQge2RlbGV0ZU9wdEluc0Zyb21BbGljZUFuZEJvYiwgZ2VuZXJhdGV0b2FkZHJlc3MsIGdldE5ld0FkZHJlc3N9IGZyb20gXCIuL3Rlc3QtYXBpL3Rlc3QtYXBpLW9uLW5vZGVcIjtcblxuY29uc3Qgbm9kZV91cmxfYWxpY2UgPSAnaHR0cDovLzE3Mi4yMC4wLjY6MTgzMzIvJztcbmNvbnN0IHJwY0F1dGhBbGljZSA9IFwiYWRtaW46Z2VuZXJhdGVkLXBhc3N3b3JkXCI7XG5jb25zdCBkYXBwVXJsQWxpY2UgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiO1xuY29uc3QgZGFwcFVybEJvYiA9IFwiaHR0cDovLzE3Mi4yMC4wLjg6NDAwMFwiO1xuY29uc3QgZEFwcExvZ2luID0ge1widXNlcm5hbWVcIjpcImFkbWluXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn07XG5jb25zdCByZWNpcGllbnRfcG9wM3VzZXJuYW1lID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7XG5jb25zdCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkID0gXCJib2JcIjtcblxuaWYoTWV0ZW9yLmlzQXBwVGVzdCkge1xuICAgIGRlc2NyaWJlKCcwMy1iYXNpYy1kb2ktdGVzdC0wMycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInJlbW92aW5nIE9wdElucyxSZWNpcGllbnRzLFNlbmRlcnNcIik7XG4gICAgICAgICAgICBkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IoKTtcbiAgICAgICAgICAgIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzKFwibWFpbFwiLCAxMTAsIHJlY2lwaWVudF9wb3AzdXNlcm5hbWUsIHJlY2lwaWVudF9wb3AzcGFzc3dvcmQsIHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRlc3QgaWYgYmFzaWMgRG9pY2hhaW4gd29ya2Zsb3cgcnVubmluZyA1IHRpbWVzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIHRoaXMudGltZW91dCgwKTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YUxvZ2luQWxpY2UgPSBsb2dpbihkYXBwVXJsQWxpY2UsIGRBcHBMb2dpbiwgZmFsc2UpOyAvL2xvZyBpbnRvIGRBcHBcbiAgICAgICAgICAgIGdsb2JhbC5hbGljZUFkZHJlc3MgPSBnZXROZXdBZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGZhbHNlKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIHN0YW5kYXJkIHRvIG5vdCBjb25mdXNlIHBlb3BsZSFcbiAgICAgICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbCA9IFwiYWxpY2VfXCIgKyBpICsgXCJAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICAgICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCBkYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIHsnY2l0eSc6ICdFa2F0ZXJpbmJ1cmdfJyArIGl9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiBiYXNpYyBEb2ljaGFpbiB3b3JrZmxvdyBydW5uaW5nIDIwIHRpbWVzIHdpdGhvdXQgY29uZmlybWF0aW9uIGFuZCB2ZXJpZmljYXRpb24nLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0KDApO1xuICAgICAgICAgICAgZGVsZXRlQWxsRW1haWxzRnJvbVBvcDMoXCJtYWlsXCIsIDExMCwgcmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBkYXRhTG9naW5BbGljZSA9IGxvZ2luKGRhcHBVcmxBbGljZSwgZEFwcExvZ2luLCBmYWxzZSk7IC8vbG9nIGludG8gZEFwcFxuICAgICAgICAgICAgZ2xvYmFsLmFsaWNlQWRkcmVzcyA9IGdldE5ld0FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZmFsc2UpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjsgLy9wbGVhc2UgdXNlIHRoaXMgYXMgc3RhbmRhcmQgdG8gbm90IGNvbmZ1c2UgcGVvcGxlIVxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZV9cIiArIGkgKyBcIkBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHREYXRhT3B0SW4gPSByZXF1ZXN0RE9JKGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgY2hhaS5leHBlY3QoZmluZE9wdEluKHJlc3VsdERhdGFPcHRJbi5kYXRhLmlkLCB0cnVlKSkudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGJhc2ljIERvaWNoYWluIHdvcmtmbG93IHJ1bm5pbmcgMTAwIHRpbWVzIHdpdGggd2l0aG91dCBjb25maXJtYXRpb24gYW5kIHZlcmlmaWNhdGlvbicsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXQoMCk7XG4gICAgICAgICAgICBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMyhcIm1haWxcIiwgMTEwLCByZWNpcGllbnRfcG9wM3VzZXJuYW1lLCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFMb2dpbkFsaWNlID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIGZhbHNlKTsgLy9sb2cgaW50byBkQXBwXG4gICAgICAgICAgICBnbG9iYWwuYWxpY2VBZGRyZXNzID0gZ2V0TmV3QWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBmYWxzZSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjsgLy9wbGVhc2UgdXNlIHRoaXMgYXMgc3RhbmRhcmQgdG8gbm90IGNvbmZ1c2UgcGVvcGxlIVxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZV9cIiArIGkgKyBcIkBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHREYXRhT3B0SW4gPSByZXF1ZXN0RE9JKGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgY2hhaS5leHBlY3QoZmluZE9wdEluKHJlc3VsdERhdGFPcHRJbi5kYXRhLmlkLCB0cnVlKSkudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAoaSAlIDEwMCA9PT0gMCkgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSIsImlmKE1ldGVvci5pc0FwcFRlc3QgfHwgTWV0ZW9yLmlzVGVzdCkge1xuXG4gICAgeGRlc2NyaWJlKCdzaW1wbGUtc2VsZW5pdW0tdGVzdCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLnRpbWVvdXQoMTAwMDApO1xuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB9KTtcblxuXG4gICAgfSk7XG59XG4iLCJpbXBvcnQge2NoYWl9IGZyb20gJ21ldGVvci9wcmFjdGljYWxtZXRlb3I6Y2hhaSc7XG5pbXBvcnQge1xuICAgIHRlc3RMb2cgYXMgbG9nQmxvY2tjaGFpblxufSBmcm9tIFwibWV0ZW9yL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGlcIjtcblxuaW1wb3J0IHtkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IsIGdldEJhbGFuY2UsIGluaXRCbG9ja2NoYWlufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1ub2RlXCI7XG5pbXBvcnQge2xvZ2luLCByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pfSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1kYXBwXCI7XG5jb25zdCBub2RlX3VybF9hbGljZSA9ICdodHRwOi8vMTcyLjIwLjAuNjoxODMzMi8nO1xuY29uc3Qgbm9kZV91cmxfYm9iID0gICAnaHR0cDovLzE3Mi4yMC4wLjc6MTgzMzIvJztcbmNvbnN0IHJwY0F1dGggPSBcImFkbWluOmdlbmVyYXRlZC1wYXNzd29yZFwiO1xuY29uc3QgcHJpdktleUJvYiA9IFwiY1AzRWlna3pzV3V5S0VteGs4Y0M2cVhZYjRaandVbzV2enZacEFQbURRODNSQ2dYUXJ1alwiO1xuY29uc3QgbG9nID0gdHJ1ZTtcblxuXG5jb25zdCBycGNBdXRoQWxpY2UgPSBcImFkbWluOmdlbmVyYXRlZC1wYXNzd29yZFwiO1xuY29uc3QgZGFwcFVybEFsaWNlID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIjtcbmNvbnN0IGRhcHBVcmxCb2IgPSBcImh0dHA6Ly8xNzIuMjAuMC44OjQwMDBcIjtcbmNvbnN0IGRBcHBMb2dpbiA9IHtcInVzZXJuYW1lXCI6XCJhZG1pblwiLFwicGFzc3dvcmRcIjpcInBhc3N3b3JkXCJ9O1xuXG5cbmlmKE1ldGVvci5pc1Rlc3QgfHwgTWV0ZW9yLmlzQXBwVGVzdCkge1xuXG4gICAgeGRlc2NyaWJlKCdiYXNpYy1kb2ktdGVzdC1uaWNvJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRpbWVvdXQoNjAwMDAwKTtcblxuICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInJlbW92aW5nIE9wdElucyxSZWNpcGllbnRzLFNlbmRlcnNcIik7XG4gICAgICAgICAgICBkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgeGl0KCdzaG91bGQgY3JlYXRlIGEgUmVnVGVzdCBEb2ljaGFpbiB3aXRoIGFsaWNlIGFuZCBib2IgYW5kIHNvbWUgRG9pIC0gY29pbnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbml0QmxvY2tjaGFpbihub2RlX3VybF9hbGljZSxub2RlX3VybF9ib2IscnBjQXV0aCxwcml2S2V5Qm9iLHRydWUpO1xuICAgICAgICAgICAgY29uc3QgYWxpY2VCYWxhbmNlID0gZ2V0QmFsYW5jZShub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgbG9nKTtcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzQWJvdmUoYWxpY2VCYWxhbmNlLCAwLCAnbm8gZnVuZGluZyEgJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHhpdCgnc2hvdWxkIHRlc3QgaWYgYmFzaWMgRG9pY2hhaW4gd29ya2Zsb3cgaXMgd29ya2luZyB3aXRoIG9wdGlvbmFsIGRhdGEnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYisxQGNpLWRvaWNoYWluLm9yZ1wiOyAvL3BsZWFzZSB1c2UgdGhpcyBhcyBzdGFuZGFyZCB0byBub3QgY29uZnVzZSBwZW9wbGUhXG4gICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbCA9IFwiYWxpY2VAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICBjb25zdCBkYXRhTG9naW5BbGljZSA9IGxvZ2luKGRhcHBVcmxBbGljZSwgZEFwcExvZ2luLCBmYWxzZSk7IC8vbG9nIGludG8gZEFwcFxuICAgICAgICAgICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCBkYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIHsnY2l0eSc6ICdFa2F0ZXJpbmJ1cmcnfSwgXCJib2JAY2ktZG9pY2hhaW4ub3JnXCIsIFwiYm9iXCIsIHRydWUpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHhkZXNjcmliZSgnYmFzaWMtZG9pLXRlc3QtbmljbycsIGZ1bmN0aW9uICgpIHtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmZvcm1hdGlvbiByZWdhcmRpbmcgdG8gZXZlbnQgbG9vcCBub2RlLmpzXG4gICAgICAgICAqIC0gaHR0cHM6Ly9ub2RlanMub3JnL2VuL2RvY3MvZ3VpZGVzL2V2ZW50LWxvb3AtdGltZXJzLWFuZC1uZXh0dGljay9cbiAgICAgICAgICpcbiAgICAgICAgICogUHJvbWlzZXM6XG4gICAgICAgICAqIC0gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL2Z1bmRhbWVudGFscy9wcmltZXJzL3Byb21pc2VzXG4gICAgICAgICAqXG4gICAgICAgICAqIFByb21pc2UgbG9vcHMgYW5kIGFzeW5jIHdhaXRcbiAgICAgICAgICogLSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80MDMyODkzMi9qYXZhc2NyaXB0LWVzNi1wcm9taXNlLWZvci1sb29wXG4gICAgICAgICAqXG4gICAgICAgICAqIEFzeW5jaHJvbm91cyBsb29wcyB3aXRoIG1vY2hhOlxuICAgICAgICAgKiAtIGh0dHBzOi8vd2hpdGZpbi5pby9hc3luY2hyb25vdXMtdGVzdC1sb29wcy13aXRoLW1vY2hhL1xuICAgICAgICAgKi9cbiAgICAgICAgLyogIGl0KCdzaG91bGQgdGVzdCBhIHRpbWVvdXQgd2l0aCBhIHByb21pc2UnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwidHJ1eWluZyBhIHByb21pc2VcIik7XG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aW1lb3V0ID0gTWF0aC5yYW5kb20oKSAqIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwcm9taXNlOicraSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIC8vIFRPRE86IENoYWluIHRoaXMgcHJvbWlzZSB0byB0aGUgcHJldmlvdXMgb25lIChtYXliZSB3aXRob3V0IGhhdmluZyBpdCBydW5uaW5nPylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpdCgnc2hvdWxkIHJ1biBhIGxvb3Agd2l0aCBhc3luYyB3YWl0JywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInRyeWluZyBhc3ljbiB3YWl0XCIpO1xuICAgICAgICAgICAgICAoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBNYXRoLnJhbmRvbSgpICogMTAwMCkpO1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhc3luYyB3YWl0JytpKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGRvbmUoKVxuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgeGl0KCdzaG91bGQgc2FmZWx5IHN0b3AgYW5kIHN0YXJ0IGJvYnMgZG9pY2hhaW4gbm9kZSBjb250YWluZXInLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgICB2YXIgY29udGFpbmVySWQgPSBzdG9wRG9ja2VyQm9iKCk7XG5cbiAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInN0b3BwZWQgYm9iJ3Mgbm9kZSB3aXRoIGNvbnRhaW5lcklkXCIsY29udGFpbmVySWQpO1xuICAgICAgICAgICAgICBjaGFpLmV4cGVjdChjb250YWluZXJJZCkudG8ubm90LmJlLm51bGw7XG5cbiAgICAgICAgICAgICAgdmFyIHN0YXJ0ZWRDb250YWluZXJJZCA9IHN0YXJ0RG9ja2VyQm9iKGNvbnRhaW5lcklkKTtcbiAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInN0YXJ0ZWQgYm9iJ3Mgbm9kZSB3aXRoIGNvbnRhaW5lcklkXCIsc3RhcnRlZENvbnRhaW5lcklkKTtcbiAgICAgICAgICAgICAgY2hhaS5leHBlY3Qoc3RhcnRlZENvbnRhaW5lcklkKS50by5ub3QuYmUubnVsbDtcblxuICAgICAgICAgICAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICAgIHdoaWxlKHJ1bm5pbmcpe1xuICAgICAgICAgICAgICAgICAgcnVuQW5kV2FpdChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0dXNEb2NrZXIgPSBKU09OLnBhcnNlKGdldERvY2tlclN0YXR1cyhjb250YWluZXJJZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwiZ2V0aW5mb1wiLHN0YXR1c0RvY2tlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJ2ZXJzaW9uOlwiK3N0YXR1c0RvY2tlci52ZXJzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcImJhbGFuY2U6XCIrc3RhdHVzRG9ja2VyLmJhbGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwiYmFsYW5jZTpcIitzdGF0dXNEb2NrZXIuY29ubmVjdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzdGF0dXNEb2NrZXIuY29ubmVjdGlvbnM9PT0wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvaWNoYWluQWRkTm9kZShjb250YWluZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBjYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJzdGF0dXNEb2NrZXIgcHJvYmxlbTpcIixlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSwyKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9KTsqL1xuICAgIH0pO1xufSIsImltcG9ydCB7Y2hhaX0gZnJvbSAnbWV0ZW9yL3ByYWN0aWNhbG1ldGVvcjpjaGFpJztcbmlmKE1ldGVvci5pc1Rlc3QpIHtcblxuICAgIHhkZXNjcmliZSgnYmFzaWMtZG9pLXRlc3QtZmxvJywgZnVuY3Rpb24gKCkge1xuICAgIH0pO1xufVxuXG5cbiIsIk1ldGVvci5wdWJsaXNoKCd1c2Vycy51c2VyJywgZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gTWV0ZW9yLnVzZXJzLmZpbmQoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICAnZW1haWxzJzogMSxcbiAgICAgICAgJ3Byb2ZpbGUnOiAxLFxuICAgICAgICAnc2VydmljZXMnOiAxXG4gICAgICB9XG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpXG4gIH1cbn0pXG4iXX0=
