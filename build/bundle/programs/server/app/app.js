var require = meteorInstall({"server":{"test":{"test-api":{"test-api-on-dapp.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/test-api/test-api-on-dapp.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
let OptInsCollection, Recipients, getHttpGET, getHttpGETdata, getHttpPOST, testLogging;
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
      if (our_optIn._id != optInId) throw new Error("OptInId wrong", our_optIn._id, optInId);
      if (log) testLogging('optIn:', our_optIn);
      nameId = getNameIdOfRawTransaction(url, auth, our_optIn.txId);
      if ("e/" + our_optIn.nameId != nameId) throw new AssertionError("NameId wrong", "e/" + our_optIn.nameId, nameId);
      if (log) testLogging('nameId:', nameId);
      if (nameId == null) throw new Error("NameId null");
      if (counter >= 50) throw new Error("OptIn not found after retries");
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
  testLogging("clickable link:", confirmLink);
  const doiConfirmlinkResult = getHttpGET(confirmLink, '');
  chai.expect(doiConfirmlinkResult.content).to.have.string('ANMELDUNG ERFOLGREICH');
  chai.expect(doiConfirmlinkResult.content).to.have.string('Vielen Dank für Ihre Anmeldung');
  chai.expect(doiConfirmlinkResult.content).to.have.string('Ihre Anmeldung war erfolgreich.');
  chai.assert.equal(200, doiConfirmlinkResult.statusCode);
  return true;
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
            testLogging('trying to verify opt-in - so far no success:');
            generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
            Promise.await(new Promise(resolve => setTimeout(resolve, 2000)));
          }
        }
      });
    }());

    try {
      if (statusVerify != 200) throw new AssertionError("Bad verify response", statusVerify, 200);
      if (resultVerify.data.data.val != true) throw new Error("Verification did not return true");
      if (counter >= 50) throw new Error("could not verify DOI after retries");
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
    let resultDataOptInTmp = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
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
    Promise.await(function loop() {
      return Promise.asyncApply(() => {
        while (running && ++counter < 50) {
          //trying 50x to get email from bobs mailbox
          try {
            testLogging('step 3: getting email from hostname!', os.hostname());
            const link2Confirm = fetchConfirmLinkFromPop3Mail(os.hostname() == 'regtest' ? 'mail' : 'localhost', 110, recipient_pop3username, recipient_pop3password, dappUrlBob, false);
            testLogging('step 4: confirming link', link2Confirm);
            if (link2Confirm != null) running = false;
            confirmLink(link2Confirm);
            testLogging('confirmed');
          } catch (ex) {
            testLogging('trying to get email - so far no success:', counter);
            Promise.await(new Promise(resolve => setTimeout(resolve, 3000)));
          }
        }

        if (counter >= 50) {
          throw new Error("email not found after max retries");
        }
      });
    }());

    if (os.hostname() !== 'regtest') {
      //if this is a selenium test from outside docker - don't verify DOI here for simplicity 
      testLogging('returning to test without DOI-verification while doing selenium outside docker');
      callback(null, {
        status: "DOI confirmed"
      }); // return;
    } else {
      let nameId = null;

      try {
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
      }
    }
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
  let res = HTTP.put(urlUsers, realDataUser);
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"test-api-on-node.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/test-api/test-api-on-node.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  exec('sudo docker cp /home/doichain/dapp/contrib/scripts/meteor/delete_collections.sh ' + containerId + ':/tmp/', (e, stdout, stderr) => {
    testLogging('copied delete_collections into mongo docker container', {
      stderr: stderr,
      stdout: stdout
    });
    exec('sudo docker exec ' + containerId + ' bash -c "mongo < /tmp/delete_collections.sh"', (e, stdout, stderr) => {
      testLogging('sudo docker exec ' + containerId + ' bash -c "mongo < /tmp/delete_collections.sh"', {
        stderr: stderr,
        stdout: stdout
      });
      callback(stderr, stdout);
    });
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"0-basic-doi-tests.0.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/0-basic-doi-tests.0.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
const node_url_alice = 'http://172.20.0.6:18332/';
const node_url_bob = 'http://172.20.0.7:18332/';
const rpcAuth = "admin:generated-password";
const privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj";
const log = true;

if (Meteor.isAppTest) {
  describe('basic-doi-test-0', function () {
    this.timeout(0);
    before(function () {
      testLog("removing OptIns,Recipients,Senders", '');
      deleteOptInsFromAliceAndBob();
    });
    it('should create a RegTest Doichain with alice and bob and some Doi - coins', function () {
      initBlockchain(node_url_alice, node_url_bob, rpcAuth, privKeyBob, true);
      const aliceBalance = getBalance(node_url_alice, rpcAuth, log);
      chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"1-basic-doi-test.1.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/1-basic-doi-test.1.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
const node_url_alice = 'http://172.20.0.6:18332/';
const rpcAuthAlice = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {
  "username": "admin",
  "password": "password"
};
const templateUrlA = "http://172.20.0.8:4000/templates/emails/doichain-anmeldung-final-DE.html";
const templateUrlB = "http://172.20.0.8:4000/templates/emails/doichain-anmeldung-final-EN.html";
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

if (Meteor.isAppTest) {
  describe('basic-doi-test-01', function () {
    this.timeout(0);
    before(function () {
      logBlockchain("removing OptIns,Recipients,Senders");
      deleteOptInsFromAliceAndBob();
      deleteAllEmailsFromPop3("mail", 110, recipient_pop3username, recipient_pop3password, true);
    });
    it('should test if basic Doichain workflow is working with optional data', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail = "alice@ci-doichain.org";
      const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
      done();
    });
    it('should test if basic Doichain workflow is working without optional data', function (done) {
      const recipient_mail = "alice@ci-doichain.org"; //please use this as an alernative when above standard is not possible

      const sender_mail = "bob@ci-doichain.org"; //login to dApp & request DOI on alice via bob

      const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, null, "alice@ci-doichain.org", "alice", true);
      done();
    });
    it('should create two more users', function (done) {
      resetUsers();
      const logAdmin = login(dappUrlAlice, dAppLogin, false);
      let userA = createUser(dappUrlAlice, logAdmin, "alice-a", templateUrlA, true);
      chai.expect(findUser(userA)).to.not.be.undefined;
      let userB = createUser(dappUrlAlice, logAdmin, "alice-b", templateUrlB, true);
      chai.expect(findUser(userB)).to.not.be.undefined;
      done();
    });
    it('should test if Doichain workflow is using different templates for different users', function (done) {
      resetUsers();
      const recipient_mail = "bob@ci-doichain.org"; //

      const sender_mail_alice_a = "alice-a@ci-doichain.org";
      const sender_mail_alice_b = "alice-b@ci-doichain.org";
      const logAdmin = login(dappUrlAlice, dAppLogin, false);
      let userA = createUser(dappUrlAlice, logAdmin, "alice-a", templateUrlA, true);
      chai.expect(findUser(userA)).to.not.be.undefined;
      let userB = createUser(dappUrlAlice, logAdmin, "alice-b", templateUrlB, true);
      chai.expect(findUser(userB)).to.not.be.undefined;
      const logUserA = login(dappUrlAlice, aliceALogin, true);
      const logUserB = login(dappUrlAlice, aliceBLogin, true); //requestConfirmVerifyBasicDoi checks if the "log" value (if it is a String) is in the mail-text

      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, logUserA, dappUrlBob, recipient_mail, sender_mail_alice_a, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", "kostenlose Anmeldung");
      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, logUserB, dappUrlBob, recipient_mail, sender_mail_alice_b, {
        'city': 'Simbach'
      }, "bob@ci-doichain.org", "bob", "free registration");
      done();
    });
    it('should test if users can export OptIns ', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //

      const sender_mail_alice_a = "alice-export@ci-doichain.org";
      const logAdmin = login(dappUrlAlice, dAppLogin, true);
      const logUserA = login(dappUrlAlice, aliceALogin, true);
      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, logUserA, dappUrlBob, recipient_mail, sender_mail_alice_a, {
        'city': 'München'
      }, "bob@ci-doichain.org", "bob", true);
      const exportedOptIns = exportOptIns(dappUrlAlice, logAdmin, true);
      chai.expect(exportedOptIns).to.not.be.undefined;
      chai.expect(exportedOptIns[0]).to.not.be.undefined;
      const exportedOptInsA = exportOptIns(dappUrlAlice, logUserA, true);
      exportedOptInsA.forEach(element => {
        chai.expect(element.ownerId).to.be.equal(logUserA.userId);
      }); //chai.expect(findOptIn(resultDataOptIn._id)).to.not.be.undefined;

      done();
    });
    it('should test if admin can update user profiles', function () {
      resetUsers();
      let logAdmin = login(dappUrlAlice, dAppLogin, true);
      const userUp = createUser(dappUrlAlice, logAdmin, "updateUser", templateUrlA, true);
      const changedData = updateUser(dappUrlAlice, logAdmin, userUp, {
        "templateURL": templateUrlB
      }, true);
      chai.expect(changedData).not.undefined;
    });
    it('should test if user can update own profile', function () {
      resetUsers();
      let logAdmin = login(dappUrlAlice, dAppLogin, true);
      const userUp = createUser(dappUrlAlice, logAdmin, "updateUser", templateUrlA, true);
      const logUserUp = login(dappUrlAlice, {
        "username": "updateUser",
        "password": "password"
      }, true);
      const changedData = updateUser(dappUrlAlice, logUserUp, userUp, {
        "templateURL": templateUrlB
      }, true);
      chai.expect(changedData).not.undefined;
    });
    it('should test if coDoi works', function () {
      const coDoiList = ["alice1@doichain-ci.com", "alice2@doichain-ci.com", "alice3@doichain-ci.com"];
      const recipient_mail = "bob@ci-doichain.org";
      const sender_mail = coDoiList;
      let logAdmin = login(dappUrlAlice, dAppLogin, true);
      const coDois = requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, logAdmin, dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
    });
    it('should find updated Data in email', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail = "alice-update@ci-doichain.org";
      const adLog = login(dappUrlAlice, dAppLogin, false);
      updateUser(dappUrlAlice, adLog, adLog.userId, {
        "subject": "updateTest",
        "templateURL": templateUrlB
      });
      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, adLog, dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
      done();
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"2-basic-doi-test.2.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/2-basic-doi-test.2.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

          done();
        });
      })(); //done();

    }); //it
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"3-basic-doi-test.3.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/3-basic-doi-test.3.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      //logBlockchain("removing OptIns,Recipients,Senders");
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"5-selenium-test-flo.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/5-selenium-test-flo.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
if (Meteor.isAppTest || Meteor.isTest) {
  describe('simple-selenium-test', function () {
    this.timeout(10000);
    beforeEach(function () {});
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"basic-doi-test-nico.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/basic-doi-test-nico.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  describe('basic-doi-test-nico', function () {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"basic-doi-test.flo.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/basic-doi-test.flo.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);

if (Meteor.isTest) {
  describe('basic-doi-test-flo', function () {});
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/server/test/test-api/test-api-on-dapp.js");
require("/server/test/test-api/test-api-on-node.js");
require("/server/test/0-basic-doi-tests.0.js");
require("/server/test/1-basic-doi-test.1.js");
require("/server/test/2-basic-doi-test.2.js");
require("/server/test/3-basic-doi-test.3.js");
require("/server/test/5-selenium-test-flo.js");
require("/server/test/basic-doi-test-nico.js");
require("/server/test/basic-doi-test.flo.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvdGVzdC1hcGkvdGVzdC1hcGktb24tZGFwcC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvdGVzdC1hcGkvdGVzdC1hcGktb24tbm9kZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvMC1iYXNpYy1kb2ktdGVzdHMuMC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvMS1iYXNpYy1kb2ktdGVzdC4xLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvdGVzdC8yLWJhc2ljLWRvaS10ZXN0LjIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci90ZXN0LzMtYmFzaWMtZG9pLXRlc3QuMy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvNS1zZWxlbml1bS10ZXN0LWZsby5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvYmFzaWMtZG9pLXRlc3Qtbmljby5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvYmFzaWMtZG9pLXRlc3QuZmxvLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsImxvZ2luIiwicmVxdWVzdERPSSIsImdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24iLCJnZXROYW1lSWRPZk9wdEluRnJvbVJhd1R4IiwiZmV0Y2hDb25maXJtTGlua0Zyb21Qb3AzTWFpbCIsImRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzIiwiY29uZmlybUxpbmsiLCJ2ZXJpZnlET0kiLCJjcmVhdGVVc2VyIiwiZmluZFVzZXIiLCJmaW5kT3B0SW4iLCJleHBvcnRPcHRJbnMiLCJyZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pIiwidXBkYXRlVXNlciIsInJlc2V0VXNlcnMiLCJNZXRlb3IiLCJsaW5rIiwidiIsImNoYWkiLCJxdW90ZWRQcmludGFibGVEZWNvZGUiLCJBc3NlcnRpb25FcnJvciIsIk9wdEluc0NvbGxlY3Rpb24iLCJSZWNpcGllbnRzIiwiZ2V0SHR0cEdFVCIsImdldEh0dHBHRVRkYXRhIiwiZ2V0SHR0cFBPU1QiLCJ0ZXN0TG9nZ2luZyIsIlJlY2lwaWVudHNDb2xsZWN0aW9uIiwiaHR0cEdFVCIsImh0dHBHRVRkYXRhIiwiaHR0cFBPU1QiLCJ0ZXN0TG9nIiwiZ2VuZXJhdGV0b2FkZHJlc3MiLCJoZWFkZXJzIiwib3MiLCJyZXF1aXJlIiwiUE9QM0NsaWVudCIsInVybCIsInBhcmFtc0xvZ2luIiwibG9nIiwidXJsTG9naW4iLCJoZWFkZXJzTG9naW4iLCJyZWFsRGF0YUxvZ2luIiwicGFyYW1zIiwicmVzdWx0Iiwic3RhdHVzQ29kZSIsImRhdGFMb2dpbiIsImRhdGEiLCJzdGF0dXNMb2dpbiIsInN0YXR1cyIsImFzc2VydCIsImVxdWFsIiwiYXV0aCIsInJlY2lwaWVudF9tYWlsIiwic2VuZGVyX21haWwiLCJ1cmxPcHRJbiIsImRhdGFPcHRJbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJoZWFkZXJzT3B0SW4iLCJ1c2VySWQiLCJhdXRoVG9rZW4iLCJyZWFsRGF0YU9wdEluIiwicmVzdWx0T3B0SW4iLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwiZWxlbWVudCIsInR4SWQiLCJzeW5jRnVuYyIsIndyYXBBc3luYyIsImdldF9uYW1laWRfb2ZfcmF3X3RyYW5zYWN0aW9uIiwiY2FsbGJhY2siLCJuYW1lSWQiLCJydW5uaW5nIiwiY291bnRlciIsImxvb3AiLCJkYXRhR2V0UmF3VHJhbnNhY3Rpb24iLCJyZWFsZGF0YUdldFJhd1RyYW5zYWN0aW9uIiwicmVzdWx0R2V0UmF3VHJhbnNhY3Rpb24iLCJ2b3V0Iiwic2NyaXB0UHViS2V5IiwibmFtZU9wIiwidW5kZWZpbmVkIiwibmFtZSIsInR4aWQiLCJleCIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsIm9wdEluSWQiLCJnZXRfbmFtZWlkX29mX29wdGluX2Zyb21fcmF3dHgiLCJvdXJfb3B0SW4iLCJmaW5kT25lIiwiX2lkIiwiRXJyb3IiLCJlcnJvciIsImhvc3RuYW1lIiwicG9ydCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJhbGljZWRhcHBfdXJsIiwiZmV0Y2hfY29uZmlybV9saW5rX2Zyb21fcG9wM19tYWlsIiwiY2xpZW50IiwidGxzZXJycyIsImVuYWJsZXRscyIsImRlYnVnIiwib24iLCJyYXdkYXRhIiwibGlzdCIsIm1zZ2NvdW50IiwibXNnbnVtYmVyIiwiZXJyIiwicnNldCIsInJldHIiLCJtYWlsZGF0YSIsImh0bWwiLCJyZXBsYWNlQWxsIiwiZXhwZWN0IiwiaW5kZXhPZiIsInRvIiwibm90IiwibGlua2RhdGEiLCJzdWJzdHJpbmciLCJiZSIsIm51bGwiLCJyZXF1ZXN0RGF0YSIsImRlbGUiLCJxdWl0IiwiZW5kIiwic3RyIiwiZmluZCIsInJlcGxhY2UiLCJSZWdFeHAiLCJkZWxldGVfYWxsX2VtYWlsc19mcm9tX3BvcDMiLCJpIiwiZG9pQ29uZmlybWxpbmtSZXN1bHQiLCJjb250ZW50IiwiaGF2ZSIsInN0cmluZyIsImRBcHBVcmwiLCJkQXBwVXJsQXV0aCIsIm5vZGVfdXJsX2FsaWNlIiwicnBjQXV0aEFsaWNlIiwidmVyaWZ5X2RvaSIsIm91cl9yZWNpcGllbnRfbWFpbCIsInVybFZlcmlmeSIsInJlY2lwaWVudF9wdWJsaWNfa2V5IiwiZW1haWwiLCJwdWJsaWNLZXkiLCJyZXN1bHRWZXJpZnkiLCJzdGF0dXNWZXJpZnkiLCJkYXRhVmVyaWZ5IiwibmFtZV9pZCIsImhlYWRlcnNWZXJpZnkiLCJyZWFsZGF0YVZlcmlmeSIsInZhbCIsImdsb2JhbCIsImFsaWNlQWRkcmVzcyIsInRlbXBsYXRlVVJMIiwiaGVhZGVyc1VzZXIiLCJtYWlsVGVtcGxhdGUiLCJ1cmxVc2VycyIsImRhdGFVc2VyIiwicmVhbERhdGFVc2VyIiwicmVzIiwidXNlcmlkIiwiQWNjb3VudHMiLCJ1c2VycyIsInVybEV4cG9ydCIsImRhcHBVcmxBbGljZSIsImRhdGFMb2dpbkFsaWNlIiwiZGFwcFVybEJvYiIsIm9wdGlvbmFsRGF0YSIsInJlY2lwaWVudF9wb3AzdXNlcm5hbWUiLCJyZWNpcGllbnRfcG9wM3Bhc3N3b3JkIiwicmVxdWVzdF9jb25maXJtX3ZlcmlmeV9iYXNpY19kb2kiLCJzZW5kZXJfbWFpbF9pbiIsInJlc3VsdERhdGFPcHRJblRtcCIsInJlc3VsdERhdGFPcHRJbiIsImxpbmsyQ29uZmlybSIsImlkIiwiaW5kZXgiLCJsZW5ndGgiLCJ0bXBJZCIsIm9wdEluIiwidXBkYXRlSWQiLCJIVFRQIiwicHV0IiwidXNEYXQiLCJwcm9maWxlIiwicmVtb3ZlIiwiaW5pdEJsb2NrY2hhaW4iLCJpc05vZGVBbGl2ZSIsImlzTm9kZUFsaXZlQW5kQ29ubmVjdGVkVG9Ib3N0IiwiaW1wb3J0UHJpdktleSIsImdldE5ld0FkZHJlc3MiLCJnZXRCYWxhbmNlIiwid2FpdFRvU3RhcnRDb250YWluZXIiLCJkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IiLCJzdGFydDNyZE5vZGUiLCJzdG9wRG9ja2VyQm9iIiwiZ2V0Q29udGFpbmVySWRPZk5hbWUiLCJzdGFydERvY2tlckJvYiIsImRvaWNoYWluQWRkTm9kZSIsImdldERvY2tlclN0YXR1cyIsImNvbm5lY3REb2NrZXJCb2IiLCJydW5BbmRXYWl0IiwibG9nQmxvY2tjaGFpbiIsInN1ZG8iLCJleGVjIiwibm9kZV91cmxfYm9iIiwicnBjQXV0aCIsInByaXZLZXlCb2IiLCJhbGljZUNvbnRhaW5lcklkIiwic3RhdHVzRG9ja2VyIiwicGFyc2UiLCJiYWxhbmNlIiwiTnVtYmVyIiwiY29ubmVjdGlvbnMiLCJleGNlcHRpb24iLCJ3YWl0X3RvX3N0YXJ0X2NvbnRhaW5lciIsInN0YXJ0ZWRDb250YWluZXJJZCIsInZlcnNpb24iLCJlcnJvcjIiLCJkZWxldGVfb3B0aW9uc19mcm9tX2FsaWNlX2FuZF9ib2IiLCJjb250YWluZXJJZCIsImUiLCJzdGRvdXQiLCJzdGRlcnIiLCJkYXRhR2V0TmV0d29ya0luZm8iLCJyZWFsZGF0YUdldE5ldHdvcmtJbmZvIiwicmVzdWx0R2V0TmV0d29ya0luZm8iLCJzdGF0dXNHZXROZXR3b3JrSW5mbyIsImhvc3QiLCJzdGF0dXNBZGROb2RlIiwiZGF0YUdldFBlZXJJbmZvIiwicmVhbGRhdGFHZXRQZWVySW5mbyIsInJlc3VsdEdldFBlZXJJbmZvIiwic3RhdHVzR2V0UGVlckluZm8iLCJpc0Fib3ZlIiwicHJpdktleSIsInJlc2NhbiIsImRhdGFfaW1wb3J0cHJpdmtleSIsInJlYWxkYXRhX2ltcG9ydHByaXZrZXkiLCJkYXRhR2V0TmV3QWRkcmVzcyIsInJlYWxkYXRhR2V0TmV3QWRkcmVzcyIsInJlc3VsdEdldE5ld0FkZHJlc3MiLCJzdGF0dXNPcHRJbkdldE5ld0FkZHJlc3MiLCJuZXdBZGRyZXNzIiwidG9hZGRyZXNzIiwiYW1vdW50IiwiZGF0YUdlbmVyYXRlIiwiaGVhZGVyc0dlbmVyYXRlcyIsInJlYWxkYXRhR2VuZXJhdGUiLCJyZXN1bHRHZW5lcmF0ZSIsInN0YXR1c1Jlc3VsdEdlbmVyYXRlIiwiZGF0YUdldEJhbGFuY2UiLCJyZWFsZGF0YUdldEJhbGFuY2UiLCJyZXN1bHRHZXRCYWxhbmNlIiwiZ2V0X2NvbnRhaW5lcl9pZF9vZl9uYW1lIiwiYm9ic0NvbnRhaW5lcklkIiwidG9TdHJpbmciLCJ0cmltIiwic3RvcF9kb2NrZXJfYm9iIiwiZG9pY2hhaW5fYWRkX25vZGUiLCJnZXRfZG9ja2VyX3N0YXR1cyIsInN0YXJ0X2RvY2tlcl9ib2IiLCJjb25uZWN0X2RvY2tlcl9ib2IiLCJzdGFydF8zcmRfbm9kZSIsIm5ldHdvcmsiLCJydW5fYW5kX3dhaXQiLCJydW5mdW5jdGlvbiIsInNlY29uZHMiLCJpc0FwcFRlc3QiLCJkZXNjcmliZSIsInRpbWVvdXQiLCJiZWZvcmUiLCJpdCIsImFsaWNlQmFsYW5jZSIsImRBcHBMb2dpbiIsInRlbXBsYXRlVXJsQSIsInRlbXBsYXRlVXJsQiIsImFsaWNlQUxvZ2luIiwiYWxpY2VCTG9naW4iLCJkb25lIiwibG9nQWRtaW4iLCJ1c2VyQSIsInVzZXJCIiwic2VuZGVyX21haWxfYWxpY2VfYSIsInNlbmRlcl9tYWlsX2FsaWNlX2IiLCJsb2dVc2VyQSIsImxvZ1VzZXJCIiwiZXhwb3J0ZWRPcHRJbnMiLCJleHBvcnRlZE9wdEluc0EiLCJvd25lcklkIiwidXNlclVwIiwiY2hhbmdlZERhdGEiLCJsb2dVc2VyVXAiLCJjb0RvaUxpc3QiLCJjb0RvaXMiLCJhZExvZyIsInN0ZG91dDIiLCJzdGRlcnIyIiwiaXNUZXN0IiwiYmVmb3JlRWFjaCIsInhpdCIsInhkZXNjcmliZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ0MsT0FBSyxFQUFDLE1BQUlBLEtBQVg7QUFBaUJDLFlBQVUsRUFBQyxNQUFJQSxVQUFoQztBQUEyQ0MsMkJBQXlCLEVBQUMsTUFBSUEseUJBQXpFO0FBQW1HQywyQkFBeUIsRUFBQyxNQUFJQSx5QkFBakk7QUFBMkpDLDhCQUE0QixFQUFDLE1BQUlBLDRCQUE1TDtBQUF5TkMseUJBQXVCLEVBQUMsTUFBSUEsdUJBQXJQO0FBQTZRQyxhQUFXLEVBQUMsTUFBSUEsV0FBN1I7QUFBeVNDLFdBQVMsRUFBQyxNQUFJQSxTQUF2VDtBQUFpVUMsWUFBVSxFQUFDLE1BQUlBLFVBQWhWO0FBQTJWQyxVQUFRLEVBQUMsTUFBSUEsUUFBeFc7QUFBaVhDLFdBQVMsRUFBQyxNQUFJQSxTQUEvWDtBQUF5WUMsY0FBWSxFQUFDLE1BQUlBLFlBQTFaO0FBQXVhQyw4QkFBNEIsRUFBQyxNQUFJQSw0QkFBeGM7QUFBcWVDLFlBQVUsRUFBQyxNQUFJQSxVQUFwZjtBQUErZkMsWUFBVSxFQUFDLE1BQUlBO0FBQTlnQixDQUFkO0FBQXlpQixJQUFJQyxNQUFKO0FBQVdqQixNQUFNLENBQUNrQixJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRCxRQUFNLENBQUNFLENBQUQsRUFBRztBQUFDRixVQUFNLEdBQUNFLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUMsSUFBSjtBQUFTcEIsTUFBTSxDQUFDa0IsSUFBUCxDQUFZLDZCQUFa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Q0FBMUMsRUFBNEQsQ0FBNUQ7O0FBQ1QsSUFBR0YsTUFBTSxDQUFDaVMsTUFBVixFQUFrQjtBQUVkN0IsVUFBUSxDQUFDLG9CQUFELEVBQXVCLFlBQVksQ0FDMUMsQ0FETyxDQUFSO0FBRUgsQyIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNZXRlb3J9IGZyb20gXCJtZXRlb3IvbWV0ZW9yXCI7XG5pbXBvcnQge2NoYWl9IGZyb20gJ21ldGVvci9wcmFjdGljYWxtZXRlb3I6Y2hhaSc7XG5pbXBvcnQge3F1b3RlZFByaW50YWJsZURlY29kZX0gZnJvbSBcImVtYWlsanMtbWltZS1jb2RlY1wiO1xuaW1wb3J0IHsgQXNzZXJ0aW9uRXJyb3IgfSBmcm9tIFwiYXNzZXJ0XCI7XG5pbXBvcnQge1xuICAgIE9wdEluc0NvbGxlY3Rpb24sXG4gICAgUmVjaXBpZW50c0NvbGxlY3Rpb24gYXMgUmVjaXBpZW50cyxcbiAgICBodHRwR0VUIGFzIGdldEh0dHBHRVQsXG4gICAgaHR0cEdFVGRhdGEgYXMgZ2V0SHR0cEdFVGRhdGEsXG4gICAgaHR0cFBPU1QgYXMgZ2V0SHR0cFBPU1QsXG4gICAgdGVzdExvZyBhcyB0ZXN0TG9nZ2luZ1xufSBmcm9tIFwibWV0ZW9yL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGlcIjtcbmltcG9ydCB7Z2VuZXJhdGV0b2FkZHJlc3N9IGZyb20gXCIuL3Rlc3QtYXBpLW9uLW5vZGVcIjtcblxuY29uc3QgaGVhZGVycyA9IHsgJ0NvbnRlbnQtVHlwZSc6J3RleHQvcGxhaW4nICB9O1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xudmFyIFBPUDNDbGllbnQgPSByZXF1aXJlKFwicG9wbGliXCIpO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9naW4odXJsLCBwYXJhbXNMb2dpbiwgbG9nKSB7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnZEFwcCBsb2dpbi4nKTtcblxuICAgIGNvbnN0IHVybExvZ2luID0gdXJsKycvYXBpL3YxL2xvZ2luJztcbiAgICBjb25zdCBoZWFkZXJzTG9naW4gPSBbeydDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJ31dO1xuICAgIGNvbnN0IHJlYWxEYXRhTG9naW49IHsgcGFyYW1zOiBwYXJhbXNMb2dpbiwgaGVhZGVyczogaGVhZGVyc0xvZ2luIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBnZXRIdHRwUE9TVCh1cmxMb2dpbiwgcmVhbERhdGFMb2dpbik7XG5cbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdyZXN1bHQgbG9naW46JyxyZXN1bHQpO1xuICAgIGNvbnN0IHN0YXR1c0NvZGUgPSByZXN1bHQuc3RhdHVzQ29kZTtcbiAgICBjb25zdCBkYXRhTG9naW4gPSByZXN1bHQuZGF0YTtcblxuICAgIGNvbnN0IHN0YXR1c0xvZ2luID0gZGF0YUxvZ2luLnN0YXR1cztcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHN0YXR1c0NvZGUpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKCdzdWNjZXNzJywgc3RhdHVzTG9naW4pO1xuICAgIHJldHVybiBkYXRhTG9naW4uZGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RET0kodXJsLCBhdXRoLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIGRhdGEsICBsb2cpIHtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdzdGVwIDEgLSByZXF1ZXN0RE9JIGNhbGxlZCB2aWEgUkVTVCcpO1xuXG4gICAgY29uc3QgdXJsT3B0SW4gPSB1cmwrJy9hcGkvdjEvb3B0LWluJztcbiAgICBsZXQgZGF0YU9wdEluID0ge307XG5cbiAgICBpZihkYXRhKXtcbiAgICAgICAgZGF0YU9wdEluID0ge1xuICAgICAgICAgICAgXCJyZWNpcGllbnRfbWFpbFwiOnJlY2lwaWVudF9tYWlsLFxuICAgICAgICAgICAgXCJzZW5kZXJfbWFpbFwiOnNlbmRlcl9tYWlsLFxuICAgICAgICAgICAgXCJkYXRhXCI6SlNPTi5zdHJpbmdpZnkoZGF0YSlcbiAgICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgICBkYXRhT3B0SW4gPSB7XG4gICAgICAgICAgICBcInJlY2lwaWVudF9tYWlsXCI6cmVjaXBpZW50X21haWwsXG4gICAgICAgICAgICBcInNlbmRlcl9tYWlsXCI6c2VuZGVyX21haWxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGhlYWRlcnNPcHRJbiA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnWC1Vc2VyLUlkJzphdXRoLnVzZXJJZCxcbiAgICAgICAgJ1gtQXV0aC1Ub2tlbic6YXV0aC5hdXRoVG9rZW5cbiAgICB9O1xuXG4gICAgY29uc3QgcmVhbERhdGFPcHRJbiA9IHsgZGF0YTogZGF0YU9wdEluLCBoZWFkZXJzOiBoZWFkZXJzT3B0SW59O1xuICAgIGNvbnN0IHJlc3VsdE9wdEluID0gZ2V0SHR0cFBPU1QodXJsT3B0SW4sIHJlYWxEYXRhT3B0SW4pO1xuXG4gICAgLy9sb2dCbG9ja2NoYWluKFwicmVzdWx0T3B0SW5cIixyZXN1bHRPcHRJbik7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCByZXN1bHRPcHRJbi5zdGF0dXNDb2RlKTtcbiAgICB0ZXN0TG9nZ2luZyhcIlJFVFVSTkVEIFZBTFVFUzogXCIscmVzdWx0T3B0SW4pO1xuICAgIGlmKEFycmF5LmlzQXJyYXkocmVzdWx0T3B0SW4uZGF0YSkpe1xuICAgICAgICB0ZXN0TG9nZ2luZygnYWRkaW5nIGNvRE9JcycpO1xuICAgICAgICByZXN1bHRPcHRJbi5kYXRhLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBjaGFpLmFzc2VydC5lcXVhbCgnc3VjY2VzcycsIGVsZW1lbnQuc3RhdHVzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZWxzZXtcbiAgICAgICAgdGVzdExvZ2dpbmcoJ2FkZGluZyBET0knKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgnc3VjY2VzcycsICByZXN1bHRPcHRJbi5kYXRhLnN0YXR1cyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRPcHRJbi5kYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZUlkT2ZSYXdUcmFuc2FjdGlvbih1cmwsIGF1dGgsIHR4SWQpIHtcbiAgICB0ZXN0TG9nZ2luZygncHJlLXN0YXJ0IG9mIGdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24nLHR4SWQpO1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhnZXRfbmFtZWlkX29mX3Jhd190cmFuc2FjdGlvbik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHVybCwgYXV0aCwgdHhJZCk7XG59XG5cbmZ1bmN0aW9uIGdldF9uYW1laWRfb2ZfcmF3X3RyYW5zYWN0aW9uKHVybCwgYXV0aCwgdHhJZCwgY2FsbGJhY2spe1xuXG4gICAgbGV0IG5hbWVJZCA9ICcnO1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgY291bnRlciA9IDA7XG4gICAgdGVzdExvZ2dpbmcoJ3N0YXJ0IGdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24nLHR4SWQpO1xuICAgIChhc3luYyBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICB3aGlsZShydW5uaW5nICYmICsrY291bnRlcjwxNTAwKXsgLy90cnlpbmcgNTB4IHRvIGdldCBlbWFpbCBmcm9tIGJvYnMgbWFpbGJveFxuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygndHJ5aW5nIHRvIGdldCB0cmFuc2FjdGlvbicsdHhJZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFHZXRSYXdUcmFuc2FjdGlvbiA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiZ2V0cmF3dHJhbnNhY3Rpb25cIiwgXCJtZXRob2RcIjogXCJnZXRyYXd0cmFuc2FjdGlvblwiLCBcInBhcmFtc1wiOiBbdHhJZCwxXSB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWFsZGF0YUdldFJhd1RyYW5zYWN0aW9uID0geyBhdXRoOiBhdXRoLCBkYXRhOiBkYXRhR2V0UmF3VHJhbnNhY3Rpb24sIGhlYWRlcnM6IGhlYWRlcnMgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0R2V0UmF3VHJhbnNhY3Rpb24gPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhR2V0UmF3VHJhbnNhY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdEdldFJhd1RyYW5zYWN0aW9uLmRhdGEucmVzdWx0LnZvdXRbMV0uc2NyaXB0UHViS2V5Lm5hbWVPcCE9PXVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lSWQgPSByZXN1bHRHZXRSYXdUcmFuc2FjdGlvbi5kYXRhLnJlc3VsdC52b3V0WzFdLnNjcmlwdFB1YktleS5uYW1lT3AubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZUlkID0gcmVzdWx0R2V0UmF3VHJhbnNhY3Rpb24uZGF0YS5yZXN1bHQudm91dFswXS5zY3JpcHRQdWJLZXkubmFtZU9wLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHRHZXRSYXdUcmFuc2FjdGlvbi5kYXRhLnJlc3VsdC50eGlkIT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjb25maXJtZWQgdHhpZDonK3Jlc3VsdEdldFJhd1RyYW5zYWN0aW9uLmRhdGEucmVzdWx0LnR4aWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZz1mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL2NoYWkuYXNzZXJ0LmVxdWFsKHR4SWQsIHJlc3VsdEdldFJhd1RyYW5zYWN0aW9uLmRhdGEucmVzdWx0LnR4aWQpO1xuICAgICAgICAgICAgfWNhdGNoKGV4KXtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygndHJ5aW5nIHRvIGdldCBlbWFpbCAtIHNvIGZhciBubyBzdWNjZXNzOicsY291bnRlcik7XG4gICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZXN0TG9nZ2luZygnZW5kIG9mIGdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24gcmV0dXJuaW5nIG5hbWVJZCcsbmFtZUlkKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCxuYW1lSWQpO1xuICAgIH0pKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lSWRPZk9wdEluRnJvbVJhd1R4KHVybCwgYXV0aCwgb3B0SW5JZCxsb2cpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZ2V0X25hbWVpZF9vZl9vcHRpbl9mcm9tX3Jhd3R4KTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBhdXRoLCBvcHRJbklkLGxvZyk7XG59XG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0X25hbWVpZF9vZl9vcHRpbl9mcm9tX3Jhd3R4KHVybCwgYXV0aCwgb3B0SW5JZCwgbG9nLCBjYWxsYmFjayl7XG4gICAgdGVzdExvZ2dpbmcoJ3N0ZXAgMiAtIGdldHRpbmcgbmFtZUlkIG9mIHJhdyB0cmFuc2FjdGlvbiBmcm9tIGJsb2NrY2hhaW4nKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCd0aGUgdHhJZCB3aWxsIGJlIGFkZGVkIGEgYml0IGxhdGVyIGFzIHNvb24gYXMgdGhlIHNjaGVkdWxlIHBpY2tzIHVwIHRoZSBqb2IgYW5kIGluc2VydHMgaXQgaW50byB0aGUgYmxvY2tjaGFpbi4gaXQgZG9lcyBub3QgaGFwcGVuIGltbWVkaWF0ZWx5LiB3YWl0aW5nLi4uJyk7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBsZXQgb3VyX29wdEluID0gbnVsbDtcbiAgICBsZXQgbmFtZUlkID0gbnVsbDtcbiAgICBhd2FpdCAoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgd2hpbGUocnVubmluZyAmJiArK2NvdW50ZXI8NTApeyAvL3RyeWluZyA1MHggdG8gZ2V0IG9wdC1pblxuXG4gICAgICAgICAgICB0ZXN0TG9nZ2luZygnZmluZCBvcHQtSW4nLG9wdEluSWQpO1xuICAgICAgICAgICAgb3VyX29wdEluID0gT3B0SW5zQ29sbGVjdGlvbi5maW5kT25lKHtfaWQ6IG9wdEluSWR9KTtcbiAgICAgICAgICAgIGlmKG91cl9vcHRJbi50eElkIT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnZm91bmQgdHhJZCBvZiBvcHQtSW4nLG91cl9vcHRJbi50eElkKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdkaWQgbm90IGZpbmQgdHhJZCB5ZXQgZm9yIG9wdC1Jbi1JZCcsb3VyX29wdEluLl9pZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSk7XG4gICAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgdHJ5e1xuXG4gICAgICAgIGlmKG91cl9vcHRJbi5faWQgIT0gb3B0SW5JZCkgdGhyb3cgbmV3IEVycm9yKFwiT3B0SW5JZCB3cm9uZ1wiLG91cl9vcHRJbi5faWQsb3B0SW5JZCk7XG4gICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ29wdEluOicsb3VyX29wdEluKTtcbiAgICAgICAgbmFtZUlkID0gZ2V0TmFtZUlkT2ZSYXdUcmFuc2FjdGlvbih1cmwsYXV0aCxvdXJfb3B0SW4udHhJZCk7XG4gICAgICAgIGlmKFwiZS9cIitvdXJfb3B0SW4ubmFtZUlkICE9IG5hbWVJZCkgdGhyb3cgbmV3IEFzc2VydGlvbkVycm9yKFwiTmFtZUlkIHdyb25nXCIsXCJlL1wiK291cl9vcHRJbi5uYW1lSWQsbmFtZUlkKTtcblxuICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCduYW1lSWQ6JyxuYW1lSWQpO1xuICAgICAgICBpZihuYW1lSWQgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKFwiTmFtZUlkIG51bGxcIik7XG4gICAgICAgIGlmKGNvdW50ZXIgPj0gNTApIHRocm93IG5ldyBFcnJvcihcIk9wdEluIG5vdCBmb3VuZCBhZnRlciByZXRyaWVzXCIpO1xuICAgICAgICBjYWxsYmFjayhudWxsLG5hbWVJZCk7XG4gICAgfVxuICAgIGNhdGNoKGVycm9yKXtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsbmFtZUlkKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaENvbmZpcm1MaW5rRnJvbVBvcDNNYWlsKGhvc3RuYW1lLHBvcnQsdXNlcm5hbWUscGFzc3dvcmQsYWxpY2VkYXBwX3VybCxsb2cpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZmV0Y2hfY29uZmlybV9saW5rX2Zyb21fcG9wM19tYWlsKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoaG9zdG5hbWUscG9ydCx1c2VybmFtZSxwYXNzd29yZCxhbGljZWRhcHBfdXJsLGxvZyk7XG59XG5cbmZ1bmN0aW9uIGZldGNoX2NvbmZpcm1fbGlua19mcm9tX3BvcDNfbWFpbChob3N0bmFtZSxwb3J0LHVzZXJuYW1lLHBhc3N3b3JkLGFsaWNlZGFwcF91cmwsbG9nLGNhbGxiYWNrKSB7XG5cbiAgICB0ZXN0TG9nZ2luZyhcInN0ZXAgMyAtIGdldHRpbmcgZW1haWwgZnJvbSBib2JzIGluYm94XCIpO1xuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2RpdGVzaC9ub2RlLXBvcGxpYi9ibG9iL21hc3Rlci9kZW1vcy9yZXRyaWV2ZS1hbGwuanNcbiAgICB2YXIgY2xpZW50ID0gbmV3IFBPUDNDbGllbnQocG9ydCwgaG9zdG5hbWUsIHtcbiAgICAgICAgdGxzZXJyczogZmFsc2UsXG4gICAgICAgIGVuYWJsZXRsczogZmFsc2UsXG4gICAgICAgIGRlYnVnOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgY2xpZW50Lm9uKFwiY29ubmVjdFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGVzdExvZ2dpbmcoXCJDT05ORUNUIHN1Y2Nlc3NcIik7XG4gICAgICAgIGNsaWVudC5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICBjbGllbnQub24oXCJsb2dpblwiLCBmdW5jdGlvbihzdGF0dXMsIHJhd2RhdGEpIHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZyhcIkxPR0lOL1BBU1Mgc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICBjbGllbnQubGlzdCgpO1xuXG4gICAgICAgICAgICAgICAgY2xpZW50Lm9uKFwibGlzdFwiLCBmdW5jdGlvbihzdGF0dXMsIG1zZ2NvdW50LCBtc2dudW1iZXIsIGRhdGEsIHJhd2RhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJMSVNUIGZhaWxlZFwiKyBtc2dudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucnNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJMSVNUIHN1Y2Nlc3Mgd2l0aCBcIiArIG1zZ2NvdW50ICsgXCIgZWxlbWVudChzKVwiLCcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jaGFpLmV4cGVjdChtc2djb3VudCkudG8uYmUuYWJvdmUoMCwgJ25vIGVtYWlsIGluIGJvYnMgaW5ib3gnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2djb3VudCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5yZXRyKDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5vbihcInJldHJcIiwgZnVuY3Rpb24oc3RhdHVzLCBtc2dudW1iZXIsIG1haWxkYXRhLCByYXdkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobG9nKSB0ZXN0TG9nZ2luZyhcIlJFVFIgc3VjY2VzcyBcIiArIG1zZ251bWJlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2VtYWlsanMvZW1haWxqcy1taW1lLWNvZGVjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaHRtbCAgPSBxdW90ZWRQcmludGFibGVEZWNvZGUobWFpbGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYob3MuaG9zdG5hbWUoKSE9PSdyZWd0ZXN0Jyl7IC8vdGhpcyBpcyBwcm9iYWJseSBhIHNlbGVuaXVtIHRlc3QgZnJvbSBvdXRzaWRlIGRvY2tlciAgLSBzbyByZXBsYWNlIFVSTCBzbyBpdCBjYW4gYmUgY29uZmlybWVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgPSByZXBsYWNlQWxsKGh0bWwsJ2h0dHA6Ly8xNzIuMjAuMC44JywnaHR0cDovL2xvY2FsaG9zdCcpOyAgLy9UT0RPIHB1dCB0aGlzIElQIGluc2lkZSBhIGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhaS5leHBlY3QoaHRtbC5pbmRleE9mKGFsaWNlZGFwcF91cmwpKS50by5ub3QuZXF1YWwoLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlua2RhdGEgPSAgaHRtbC5zdWJzdHJpbmcoaHRtbC5pbmRleE9mKGFsaWNlZGFwcF91cmwpLGh0bWwuaW5kZXhPZihcIidcIixodG1sLmluZGV4T2YoYWxpY2VkYXBwX3VybCkpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhaS5leHBlY3QobGlua2RhdGEpLnRvLm5vdC5iZS5udWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobG9nICYmICEobG9nPT09dHJ1ZSkpY2hhaS5leHBlY3QoaHRtbC5pbmRleE9mKGxvZykpLnRvLm5vdC5lcXVhbCgtMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0RGF0YSA9IHtcImxpbmtkYXRhXCI6bGlua2RhdGEsXCJodG1sXCI6aHRtbH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmRlbGUobXNnbnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5vbihcImRlbGVcIiwgZnVuY3Rpb24oc3RhdHVzLCBtc2dudW1iZXIsIGRhdGEsIHJhd2RhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucXVpdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCxsaW5rZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJSRVRSIGZhaWxlZCBmb3IgbXNnbnVtYmVyIFwiKyBtc2dudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucnNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJlbXB0eSBtYWlsYm94XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucXVpdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IFwiTE9HSU4vUEFTUyBmYWlsZWRcIjtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgIGNsaWVudC5xdWl0KCk7XG4gICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgIGNsaWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZUFsbChzdHIsIGZpbmQsIHJlcGxhY2UpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cChmaW5kLCAnZycpLCByZXBsYWNlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzKGhvc3RuYW1lLHBvcnQsdXNlcm5hbWUscGFzc3dvcmQsbG9nKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRlbGV0ZV9hbGxfZW1haWxzX2Zyb21fcG9wMyk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGhvc3RuYW1lLHBvcnQsdXNlcm5hbWUscGFzc3dvcmQsbG9nKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlX2FsbF9lbWFpbHNfZnJvbV9wb3AzKGhvc3RuYW1lLHBvcnQsdXNlcm5hbWUscGFzc3dvcmQsbG9nLGNhbGxiYWNrKSB7XG5cbiAgICB0ZXN0TG9nZ2luZyhcImRlbGV0aW5nIGFsbCBlbWFpbHMgZnJvbSBib2JzIGluYm94XCIpO1xuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2RpdGVzaC9ub2RlLXBvcGxpYi9ibG9iL21hc3Rlci9kZW1vcy9yZXRyaWV2ZS1hbGwuanNcbiAgICB2YXIgY2xpZW50ID0gbmV3IFBPUDNDbGllbnQocG9ydCwgaG9zdG5hbWUsIHtcbiAgICAgICAgdGxzZXJyczogZmFsc2UsXG4gICAgICAgIGVuYWJsZXRsczogZmFsc2UsXG4gICAgICAgIGRlYnVnOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgY2xpZW50Lm9uKFwiY29ubmVjdFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGVzdExvZ2dpbmcoXCJDT05ORUNUIHN1Y2Nlc3NcIik7XG4gICAgICAgIGNsaWVudC5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICBjbGllbnQub24oXCJsb2dpblwiLCBmdW5jdGlvbihzdGF0dXMsIHJhd2RhdGEpIHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZyhcIkxPR0lOL1BBU1Mgc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICBjbGllbnQubGlzdCgpO1xuXG4gICAgICAgICAgICAgICAgY2xpZW50Lm9uKFwibGlzdFwiLCBmdW5jdGlvbihzdGF0dXMsIG1zZ2NvdW50LCBtc2dudW1iZXIsIGRhdGEsIHJhd2RhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJMSVNUIGZhaWxlZFwiKyBtc2dudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucnNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJMSVNUIHN1Y2Nlc3Mgd2l0aCBcIiArIG1zZ2NvdW50ICsgXCIgZWxlbWVudChzKVwiLCcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jaGFpLmV4cGVjdChtc2djb3VudCkudG8uYmUuYWJvdmUoMCwgJ25vIGVtYWlsIGluIGJvYnMgaW5ib3gnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2djb3VudCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7aTw9bXNnY291bnQ7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmRlbGUoaSsxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50Lm9uKFwiZGVsZVwiLCBmdW5jdGlvbihzdGF0dXMsIG1zZ251bWJlciwgZGF0YSwgcmF3ZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJkZWxldGVkIGVtYWlsXCIrKGkrMSkrXCIgc3RhdHVzOlwiK3N0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGk9PW1zZ2NvdW50LTEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LnF1aXQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJhbGwgZW1haWxzIGRlbGV0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCdhbGwgZW1haWxzIGRlbGV0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IFwiZW1wdHkgbWFpbGJveFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGVycik7IC8vd2UgZG8gbm90IHNlbmQgYW4gZXJyb3IgaGVyZSB3aGVuIGluYm94IGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LnF1aXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBcIkxPR0lOL1BBU1MgZmFpbGVkXCI7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICBjbGllbnQucXVpdCgpO1xuICAgICAgICAgICAgICAgIGNsaWVudC5lbmQoKTtcbiAgICAgICAgICAgICAgICBjbGllbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25maXJtTGluayhjb25maXJtTGluayl7XG4gICAgdGVzdExvZ2dpbmcoXCJjbGlja2FibGUgbGluazpcIixjb25maXJtTGluayk7XG4gICAgY29uc3QgZG9pQ29uZmlybWxpbmtSZXN1bHQgPSBnZXRIdHRwR0VUKGNvbmZpcm1MaW5rLCcnKTtcblxuICAgIGNoYWkuZXhwZWN0KGRvaUNvbmZpcm1saW5rUmVzdWx0LmNvbnRlbnQpLnRvLmhhdmUuc3RyaW5nKCdBTk1FTERVTkcgRVJGT0xHUkVJQ0gnKTtcbiAgICBjaGFpLmV4cGVjdChkb2lDb25maXJtbGlua1Jlc3VsdC5jb250ZW50KS50by5oYXZlLnN0cmluZygnVmllbGVuIERhbmsgZsO8ciBJaHJlIEFubWVsZHVuZycpO1xuICAgIGNoYWkuZXhwZWN0KGRvaUNvbmZpcm1saW5rUmVzdWx0LmNvbnRlbnQpLnRvLmhhdmUuc3RyaW5nKCdJaHJlIEFubWVsZHVuZyB3YXIgZXJmb2xncmVpY2guJyk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCBkb2lDb25maXJtbGlua1Jlc3VsdC5zdGF0dXNDb2RlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeURPSShkQXBwVXJsLCBkQXBwVXJsQXV0aCwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLG5hbWVJZCwgbG9nICl7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHZlcmlmeV9kb2kpO1xuICAgIHJldHVybiBzeW5jRnVuYyhkQXBwVXJsLCBkQXBwVXJsQXV0aCwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLG5hbWVJZCwgbG9nICk7XG59XG5cblxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5X2RvaShkQXBwVXJsLCBkQXBwVXJsQXV0aCwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLG5hbWVJZCwgbG9nLCBjYWxsYmFjayl7XG4gICAgbGV0IG91cl9yZWNpcGllbnRfbWFpbCA9cmVjaXBpZW50X21haWw7XG4gICAgaWYoQXJyYXkuaXNBcnJheShyZWNpcGllbnRfbWFpbCkpe1xuICAgICAgICBvdXJfcmVjaXBpZW50X21haWw9cmVjaXBpZW50X21haWxbMF07XG4gICAgfVxuICAgIGNvbnN0IHVybFZlcmlmeSA9IGRBcHBVcmwrJy9hcGkvdjEvb3B0LWluL3ZlcmlmeSc7XG4gICAgY29uc3QgcmVjaXBpZW50X3B1YmxpY19rZXkgPSBSZWNpcGllbnRzLmZpbmRPbmUoe2VtYWlsOiBvdXJfcmVjaXBpZW50X21haWx9KS5wdWJsaWNLZXk7XG4gICAgbGV0IHJlc3VsdFZlcmlmeSA9e307XG4gICAgbGV0IHN0YXR1c1ZlcmlmeSA9e307XG5cbiAgICBjb25zdCBkYXRhVmVyaWZ5ID0ge1xuICAgICAgICByZWNpcGllbnRfbWFpbDogb3VyX3JlY2lwaWVudF9tYWlsLFxuICAgICAgICBzZW5kZXJfbWFpbDogc2VuZGVyX21haWwsXG4gICAgICAgIG5hbWVfaWQ6IG5hbWVJZCxcbiAgICAgICAgcmVjaXBpZW50X3B1YmxpY19rZXk6IHJlY2lwaWVudF9wdWJsaWNfa2V5XG4gICAgfTtcblxuICAgIGNvbnN0IGhlYWRlcnNWZXJpZnkgPSB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ1gtVXNlci1JZCc6ZEFwcFVybEF1dGgudXNlcklkLFxuICAgICAgICAnWC1BdXRoLVRva2VuJzpkQXBwVXJsQXV0aC5hdXRoVG9rZW5cbiAgICB9O1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICBhd2FpdCAoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgd2hpbGUocnVubmluZyAmJiArK2NvdW50ZXI8NTApeyAvL3RyeWluZyA1MHggdG8gZ2V0IGVtYWlsIGZyb20gYm9icyBtYWlsYm94XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ1N0ZXAgNTogdmVyaWZ5aW5nIG9wdC1pbjonLCB7ZGF0YTpkYXRhVmVyaWZ5fSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVhbGRhdGFWZXJpZnkgPSB7IGRhdGE6IGRhdGFWZXJpZnksIGhlYWRlcnM6IGhlYWRlcnNWZXJpZnkgfTtcbiAgICAgICAgICAgICAgICByZXN1bHRWZXJpZnkgPSBnZXRIdHRwR0VUZGF0YSh1cmxWZXJpZnksIHJlYWxkYXRhVmVyaWZ5KTtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygncmVzdWx0IC9vcHQtaW4vdmVyaWZ5Oicse3N0YXR1czpyZXN1bHRWZXJpZnkuZGF0YS5zdGF0dXMsdmFsOnJlc3VsdFZlcmlmeS5kYXRhLmRhdGEudmFsfSApO1xuICAgICAgICAgICAgICAgIHN0YXR1c1ZlcmlmeSA9IHJlc3VsdFZlcmlmeS5zdGF0dXNDb2RlO1xuICAgICAgICAgICAgICAgIGlmKHJlc3VsdFZlcmlmeS5kYXRhLmRhdGEudmFsPT09dHJ1ZSkgcnVubmluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICB9Y2F0Y2goZXgpIHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygndHJ5aW5nIHRvIHZlcmlmeSBvcHQtaW4gLSBzbyBmYXIgbm8gc3VjY2VzczonKTtcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZXRvYWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBnbG9iYWwuYWxpY2VBZGRyZXNzLCAxLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMjAwMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9KSgpO1xuICAgIHRyeXtcbiAgICAgICAgaWYoc3RhdHVzVmVyaWZ5IT0yMDApIHRocm93IG5ldyBBc3NlcnRpb25FcnJvcihcIkJhZCB2ZXJpZnkgcmVzcG9uc2VcIixzdGF0dXNWZXJpZnksMjAwKTtcbiAgICAgICAgaWYocmVzdWx0VmVyaWZ5LmRhdGEuZGF0YS52YWwgIT0gdHJ1ZSkgdGhyb3cgbmV3IEVycm9yKFwiVmVyaWZpY2F0aW9uIGRpZCBub3QgcmV0dXJuIHRydWVcIik7XG4gICAgICAgIGlmKGNvdW50ZXIgPj0gNTApIHRocm93IG5ldyBFcnJvcihcImNvdWxkIG5vdCB2ZXJpZnkgRE9JIGFmdGVyIHJldHJpZXNcIik7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsdHJ1ZSk7XG4gICAgfVxuICAgIGNhdGNoKGVycm9yKXtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsZmFsc2UpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVzZXIodXJsLGF1dGgsdXNlcm5hbWUsdGVtcGxhdGVVUkwsbG9nKXtcbiAgICBjb25zdCBoZWFkZXJzVXNlciA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnWC1Vc2VyLUlkJzphdXRoLnVzZXJJZCxcbiAgICAgICAgJ1gtQXV0aC1Ub2tlbic6YXV0aC5hdXRoVG9rZW5cbiAgICB9XG4gICAgY29uc3QgbWFpbFRlbXBsYXRlID0ge1xuICAgICAgICBcInN1YmplY3RcIjogXCJIZWxsbyBpIGFtIFwiK3VzZXJuYW1lLFxuICAgICAgICBcInJlZGlyZWN0XCI6IFwiaHR0cHM6Ly93d3cuZG9pY2hhaW4ub3JnL3ZpZWxlbi1kYW5rL1wiLFxuICAgICAgICBcInJldHVyblBhdGhcIjogIHVzZXJuYW1lK1wiLXRlc3RAZG9pY2hhaW4ub3JnXCIsXG4gICAgICAgIFwidGVtcGxhdGVVUkxcIjogdGVtcGxhdGVVUkxcbiAgICB9XG4gICAgY29uc3QgdXJsVXNlcnMgPSB1cmwrJy9hcGkvdjEvdXNlcnMnO1xuICAgIGNvbnN0IGRhdGFVc2VyID0ge1widXNlcm5hbWVcIjp1c2VybmFtZSxcImVtYWlsXCI6dXNlcm5hbWUrXCItdGVzdEBkb2ljaGFpbi5vcmdcIixcInBhc3N3b3JkXCI6XCJwYXNzd29yZFwiLFwibWFpbFRlbXBsYXRlXCI6bWFpbFRlbXBsYXRlfVxuXG4gICAgY29uc3QgcmVhbERhdGFVc2VyPSB7IGRhdGE6IGRhdGFVc2VyLCBoZWFkZXJzOiBoZWFkZXJzVXNlcn07XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnY3JlYXRlVXNlcjonLCByZWFsRGF0YVVzZXIpO1xuICAgIGxldCByZXMgPSBnZXRIdHRwUE9TVCh1cmxVc2VycyxyZWFsRGF0YVVzZXIpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJyZXNwb25zZVwiLHJlcyk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwocmVzLmRhdGEuc3RhdHVzLFwic3VjY2Vzc1wiKTtcbiAgICByZXR1cm4gcmVzLmRhdGEuZGF0YS51c2VyaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVXNlcih1c2VySWQpe1xuICAgIGNvbnN0IHJlcyA9IEFjY291bnRzLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VySWR9KTtcbiAgICBjaGFpLmV4cGVjdChyZXMpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRPcHRJbihvcHRJbklkLGxvZyl7XG4gICAgY29uc3QgcmVzID0gT3B0SW5zQ29sbGVjdGlvbi5maW5kT25lKHtfaWQ6b3B0SW5JZH0pO1xuICAgIGlmKGxvZyl0ZXN0TG9nZ2luZyhyZXMsb3B0SW5JZCk7XG4gICAgY2hhaS5leHBlY3QocmVzKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRPcHRJbnModXJsLGF1dGgsbG9nKXtcbiAgICBjb25zdCBoZWFkZXJzVXNlciA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnWC1Vc2VyLUlkJzphdXRoLnVzZXJJZCxcbiAgICAgICAgJ1gtQXV0aC1Ub2tlbic6YXV0aC5hdXRoVG9rZW5cbiAgICB9O1xuXG4gICAgY29uc3QgdXJsRXhwb3J0ID0gdXJsKycvYXBpL3YxL2V4cG9ydCc7XG4gICAgY29uc3QgcmVhbERhdGFVc2VyPSB7aGVhZGVyczogaGVhZGVyc1VzZXJ9O1xuICAgIGxldCByZXMgPSBnZXRIdHRwR0VUZGF0YSh1cmxFeHBvcnQscmVhbERhdGFVc2VyKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKHJlcyxsb2cpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKHJlcy5kYXRhLnN0YXR1cyxcInN1Y2Nlc3NcIik7XG4gICAgcmV0dXJuIHJlcy5kYXRhLmRhdGE7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UscnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsZGF0YUxvZ2luQWxpY2UsZGFwcFVybEJvYixyZWNpcGllbnRfbWFpbCxzZW5kZXJfbWFpbCxvcHRpb25hbERhdGEscmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgbG9nKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHJlcXVlc3RfY29uZmlybV92ZXJpZnlfYmFzaWNfZG9pKTtcbiAgICByZXR1cm4gc3luY0Z1bmMobm9kZV91cmxfYWxpY2UscnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsZGF0YUxvZ2luQWxpY2UsZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsc2VuZGVyX21haWwsb3B0aW9uYWxEYXRhLHJlY2lwaWVudF9wb3AzdXNlcm5hbWUsIHJlY2lwaWVudF9wb3AzcGFzc3dvcmQsIGxvZyk7XG59XG5cblxuYXN5bmMgZnVuY3Rpb24gcmVxdWVzdF9jb25maXJtX3ZlcmlmeV9iYXNpY19kb2kobm9kZV91cmxfYWxpY2UscnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsZGF0YUxvZ2luQWxpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCxzZW5kZXJfbWFpbF9pbixvcHRpb25hbERhdGEscmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgbG9nLCBjYWxsYmFjaykge1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ25vZGVfdXJsX2FsaWNlJyxub2RlX3VybF9hbGljZSk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygncnBjQXV0aEFsaWNlJyxycGNBdXRoQWxpY2UpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2RhcHBVcmxBbGljZScsZGFwcFVybEFsaWNlKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdkYXRhTG9naW5BbGljZScsZGF0YUxvZ2luQWxpY2UpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2RhcHBVcmxCb2InLGRhcHBVcmxCb2IpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3JlY2lwaWVudF9tYWlsJyxyZWNpcGllbnRfbWFpbCk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnc2VuZGVyX21haWxfaW4nLHNlbmRlcl9tYWlsX2luKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdvcHRpb25hbERhdGEnLG9wdGlvbmFsRGF0YSk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygncmVjaXBpZW50X3BvcDN1c2VybmFtZScscmVjaXBpZW50X3BvcDN1c2VybmFtZSk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygncmVjaXBpZW50X3BvcDNwYXNzd29yZCcscmVjaXBpZW50X3BvcDNwYXNzd29yZCk7XG5cblxuICAgIGxldCBzZW5kZXJfbWFpbCA9IHNlbmRlcl9tYWlsX2luO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2xvZyBpbnRvIGFsaWNlIGFuZCByZXF1ZXN0IERPSScpO1xuICAgIGxldCByZXN1bHREYXRhT3B0SW5UbXAgPSByZXF1ZXN0RE9JKGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgbnVsbCwgdHJ1ZSk7XG4gICAgbGV0IHJlc3VsdERhdGFPcHRJbiA9IHJlc3VsdERhdGFPcHRJblRtcDtcblxuICAgIGlmKEFycmF5LmlzQXJyYXkoc2VuZGVyX21haWxfaW4pKXsgICAgICAgICAgICAgIC8vU2VsZWN0IG1hc3RlciBkb2kgZnJvbSBzZW5kZXJzIGFuZCByZXN1bHRcbiAgICAgICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnTUFTVEVSIERPSTogJyxyZXN1bHREYXRhT3B0SW5UbXBbMF0pO1xuICAgICAgICByZXN1bHREYXRhT3B0SW4gPSByZXN1bHREYXRhT3B0SW5UbXBbMF07XG4gICAgICAgIHNlbmRlcl9tYWlsID0gc2VuZGVyX21haWxfaW5bMF07XG4gICAgfVxuXG4gICAgLy9nZW5lcmF0aW5nIGEgYmxvY2sgc28gdHJhbnNhY3Rpb24gZ2V0cyBjb25maXJtZWQgYW5kIGRlbGl2ZXJlZCB0byBib2IuXG4gICAgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBhd2FpdCAoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgd2hpbGUocnVubmluZyAmJiArK2NvdW50ZXI8NTApeyAvL3RyeWluZyA1MHggdG8gZ2V0IGVtYWlsIGZyb20gYm9icyBtYWlsYm94XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0ZXAgMzogZ2V0dGluZyBlbWFpbCBmcm9tIGhvc3RuYW1lIScsb3MuaG9zdG5hbWUoKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGluazJDb25maXJtID0gZmV0Y2hDb25maXJtTGlua0Zyb21Qb3AzTWFpbCgob3MuaG9zdG5hbWUoKT09J3JlZ3Rlc3QnKT8nbWFpbCc6J2xvY2FsaG9zdCcsIDExMCwgcmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgZGFwcFVybEJvYiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdzdGVwIDQ6IGNvbmZpcm1pbmcgbGluaycsbGluazJDb25maXJtKTtcbiAgICAgICAgICAgICAgICBpZihsaW5rMkNvbmZpcm0hPW51bGwpIHJ1bm5pbmc9ZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uZmlybUxpbmsobGluazJDb25maXJtKTtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnY29uZmlybWVkJylcbiAgICAgICAgICAgIH1jYXRjaChleCl7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3RyeWluZyB0byBnZXQgZW1haWwgLSBzbyBmYXIgbm8gc3VjY2VzczonLGNvdW50ZXIpO1xuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZihjb3VudGVyID49IDUwKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImVtYWlsIG5vdCBmb3VuZCBhZnRlciBtYXggcmV0cmllc1wiKTtcbiAgICAgICAgfVxuXG4gICAgfSkoKTtcblxuICAgIGlmKG9zLmhvc3RuYW1lKCkhPT0ncmVndGVzdCcpeyAvL2lmIHRoaXMgaXMgYSBzZWxlbml1bSB0ZXN0IGZyb20gb3V0c2lkZSBkb2NrZXIgLSBkb24ndCB2ZXJpZnkgRE9JIGhlcmUgZm9yIHNpbXBsaWNpdHkgXG4gICAgICAgICAgICB0ZXN0TG9nZ2luZygncmV0dXJuaW5nIHRvIHRlc3Qgd2l0aG91dCBET0ktdmVyaWZpY2F0aW9uIHdoaWxlIGRvaW5nIHNlbGVuaXVtIG91dHNpZGUgZG9ja2VyJyk7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7c3RhdHVzOiBcIkRPSSBjb25maXJtZWRcIn0pO1xuICAgICAgICAgICAvLyByZXR1cm47XG4gICAgfWVsc2V7XG4gICAgICAgIGxldCBuYW1lSWQ9bnVsbDtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgY29uc3QgbmFtZUlkID0gZ2V0TmFtZUlkT2ZPcHRJbkZyb21SYXdUeChub2RlX3VybF9hbGljZSxycGNBdXRoQWxpY2UscmVzdWx0RGF0YU9wdEluLmRhdGEuaWQsdHJ1ZSk7XG4gICAgICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdnb3QgbmFtZUlkJyxuYW1lSWQpO1xuICAgICAgICAgICAgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZygnYmVmb3JlIHZlcmlmaWNhdGlvbicpO1xuXG4gICAgICAgICAgICBpZihBcnJheS5pc0FycmF5KHNlbmRlcl9tYWlsX2luKSl7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHNlbmRlcl9tYWlsX2luLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdG1wSWQgPSBpbmRleD09MCA/IG5hbWVJZCA6IG5hbWVJZCtcIi1cIisoaW5kZXgpOyAvL2dldCBuYW1laWQgb2YgY29ET0lzIGJhc2VkIG9uIG1hc3RlclxuICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZyhcIk5hbWVJZCBvZiBjb0RvaTogXCIsdG1wSWQpO1xuICAgICAgICAgICAgICAgIHZlcmlmeURPSShkYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCBub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBzZW5kZXJfbWFpbF9pbltpbmRleF0sIHJlY2lwaWVudF9tYWlsLCB0bXBJZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2ZXJpZnlET0koZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLCBuYW1lSWQsIHRydWUpOyAvL25lZWQgdG8gZ2VuZXJhdGUgdHdvIGJsb2NrcyB0byBtYWtlIGJsb2NrIHZpc2libGUgb24gYWxpY2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdhZnRlciB2ZXJpZmljYXRpb24nKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtvcHRJbjogcmVzdWx0RGF0YU9wdEluLCBuYW1lSWQ6IG5hbWVJZH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCB7b3B0SW46IHJlc3VsdERhdGFPcHRJbiwgbmFtZUlkOiBuYW1lSWR9KTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVVc2VyKHVybCxhdXRoLHVwZGF0ZUlkLG1haWxUZW1wbGF0ZSxsb2cpe1xuICAgIGNvbnN0IGhlYWRlcnNVc2VyID0ge1xuICAgICAgICAnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICdYLVVzZXItSWQnOmF1dGgudXNlcklkLFxuICAgICAgICAnWC1BdXRoLVRva2VuJzphdXRoLmF1dGhUb2tlblxuICAgIH1cblxuICAgIGNvbnN0IGRhdGFVc2VyID0ge1wibWFpbFRlbXBsYXRlXCI6bWFpbFRlbXBsYXRlfTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCd1cmw6JywgdXJsKTtcbiAgICBjb25zdCB1cmxVc2VycyA9IHVybCsnL2FwaS92MS91c2Vycy8nK3VwZGF0ZUlkO1xuICAgIGNvbnN0IHJlYWxEYXRhVXNlcj0geyBkYXRhOiBkYXRhVXNlciwgaGVhZGVyczogaGVhZGVyc1VzZXJ9O1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3VwZGF0ZVVzZXI6JywgcmVhbERhdGFVc2VyKTtcbiAgICBsZXQgcmVzID0gSFRUUC5wdXQodXJsVXNlcnMscmVhbERhdGFVc2VyKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKFwicmVzcG9uc2VcIixyZXMpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKHJlcy5kYXRhLnN0YXR1cyxcInN1Y2Nlc3NcIik7XG4gICAgY29uc3QgdXNEYXQgPSBBY2NvdW50cy51c2Vycy5maW5kT25lKHtfaWQ6dXBkYXRlSWR9KS5wcm9maWxlLm1haWxUZW1wbGF0ZTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKFwiSW5wdXRUZW1wbGF0ZVwiLGRhdGFVc2VyLm1haWxUZW1wbGF0ZSk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZyhcIlJlc3VsdFRlbXBsYXRlXCIsdXNEYXQpO1xuICAgIGNoYWkuZXhwZWN0KHVzRGF0KS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKGRhdGFVc2VyLm1haWxUZW1wbGF0ZS50ZW1wbGF0ZVVSTCx1c0RhdC50ZW1wbGF0ZVVSTCk7XG4gICAgcmV0dXJuIHVzRGF0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRVc2Vycygpe1xuICAgIEFjY291bnRzLnVzZXJzLnJlbW92ZShcbiAgICAgICAge1widXNlcm5hbWVcIjpcbiAgICAgICAge1wiJG5lXCI6XCJhZG1pblwifVxuICAgICAgICB9XG4gICAgKTtcbn1cbiIsImltcG9ydCB7XG4gICAgaHR0cFBPU1QgYXMgZ2V0SHR0cFBPU1QsXG4gICAgdGVzdExvZyBhcyB0ZXN0TG9nZ2luZyxcbiAgICB0ZXN0TG9nIGFzIGxvZ0Jsb2NrY2hhaW5cbn0gZnJvbSBcIm1ldGVvci9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpXCI7XG5cbmltcG9ydCB7Y2hhaX0gZnJvbSAnbWV0ZW9yL3ByYWN0aWNhbG1ldGVvcjpjaGFpJztcbmltcG9ydCB7TWV0ZW9yfSBmcm9tIFwibWV0ZW9yL21ldGVvclwiO1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xubGV0IHN1ZG8gPSAob3MuaG9zdG5hbWUoKT09J3JlZ3Rlc3QnKT8nc3VkbyAnOicnXG5jb25zdCBoZWFkZXJzID0geyAnQ29udGVudC1UeXBlJzondGV4dC9wbGFpbicgIH07XG5jb25zdCBleGVjID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0QmxvY2tjaGFpbihub2RlX3VybF9hbGljZSxub2RlX3VybF9ib2IscnBjQXV0aCxwcml2S2V5Qm9iLGxvZykgeyAgICAgICAgICAgIC8vY29ubmVjdCBub2RlcyAoYWxpY2UgJiBib2IpIGFuZCBnZW5lcmF0ZSBET0kgKG9ubHkgaWYgbm90IGNvbm5lY3RlZClcblxuICAgIHRlc3RMb2dnaW5nKFwiaW1wb3J0aW5nIHByaXZhdGUga2V5OlwiK3ByaXZLZXlCb2IpO1xuICAgIGltcG9ydFByaXZLZXkobm9kZV91cmxfYm9iLCBycGNBdXRoLCBwcml2S2V5Qm9iLCB0cnVlLCBsb2cpO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFsaWNlQ29udGFpbmVySWQgPSBnZXRDb250YWluZXJJZE9mTmFtZSgnYWxpY2UnKTtcbiAgICAgICAgY29uc3Qgc3RhdHVzRG9ja2VyID0gSlNPTi5wYXJzZShnZXREb2NrZXJTdGF0dXMoYWxpY2VDb250YWluZXJJZCkpO1xuICAgICAgICBsb2dCbG9ja2NoYWluKFwicmVhbCBiYWxhbmNlIDpcIiArIHN0YXR1c0RvY2tlci5iYWxhbmNlLCAoTnVtYmVyKHN0YXR1c0RvY2tlci5iYWxhbmNlKSA+IDApKTtcbiAgICAgICAgbG9nQmxvY2tjaGFpbihcImNvbm5lY3Rpb25zOlwiICsgc3RhdHVzRG9ja2VyLmNvbm5lY3Rpb25zKTtcbiAgICAgICAgaWYgKE51bWJlcihzdGF0dXNEb2NrZXIuY29ubmVjdGlvbnMpID09IDApIHtcbiAgICAgICAgICAgIGlzTm9kZUFsaXZlKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBsb2cpO1xuICAgICAgICAgICAgaXNOb2RlQWxpdmVBbmRDb25uZWN0ZWRUb0hvc3Qobm9kZV91cmxfYm9iLCBycGNBdXRoLCAnYWxpY2UnLCBsb2cpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE51bWJlcihzdGF0dXNEb2NrZXIuYmFsYW5jZSkgPiAwKSB7XG4gICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwiZW5vdWdoIGZvdW5kaW5nIGZvciBhbGljZSAtIGJsb2NrY2hhaW4gYWxyZWFkeSBjb25uZWN0ZWRcIik7XG4gICAgICAgICAgICBnbG9iYWwuYWxpY2VBZGRyZXNzID0gZ2V0TmV3QWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgbG9nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICBsb2dCbG9ja2NoYWluKFwiY29ubmVjdGluZyBibG9ja2NoYWluIGFuZCBtaW5pbmcgc29tZSBjb2luc1wiKTtcbiAgICB9XG4gICAgZ2xvYmFsLmFsaWNlQWRkcmVzcyA9IGdldE5ld0FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIGxvZyk7XG4gICAgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIGdsb2JhbC5hbGljZUFkZHJlc3MsIDIxMCk7ICAvLzExMCBibG9ja3MgdG8gbmV3IGFkZHJlc3MhIDExMCBibMO2Y2tlICoyNSBjb2luc1xuXG59XG5mdW5jdGlvbiB3YWl0X3RvX3N0YXJ0X2NvbnRhaW5lcihzdGFydGVkQ29udGFpbmVySWQsY2FsbGJhY2spe1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICAvL2hlcmUgd2UgbWFrZSBzdXJlIGJvYiBnZXRzIHN0YXJ0ZWQgYW5kIGNvbm5lY3RlZCBhZ2FpbiBpbiBwcm9iYWJseSBhbGwgcG9zc2libGUgc2l0YXV0aW9uc1xuICAgIHdoaWxlKHJ1bm5pbmcpe1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICBjb25zdCBzdGF0dXNEb2NrZXIgPSBKU09OLnBhcnNlKGdldERvY2tlclN0YXR1cyhzdGFydGVkQ29udGFpbmVySWQpKTtcbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKFwiZ2V0aW5mb1wiLHN0YXR1c0RvY2tlcik7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZyhcInZlcnNpb246XCIrc3RhdHVzRG9ja2VyLnZlcnNpb24pO1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJiYWxhbmNlOlwiK3N0YXR1c0RvY2tlci5iYWxhbmNlKTtcbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKFwiY29ubmVjdGlvbnM6XCIrc3RhdHVzRG9ja2VyLmNvbm5lY3Rpb25zKTtcbiAgICAgICAgICAgIGlmKHN0YXR1c0RvY2tlci5jb25uZWN0aW9ucz09PTApe1xuICAgICAgICAgICAgICAgIGRvaWNoYWluQWRkTm9kZShzdGFydGVkQ29udGFpbmVySWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKFwic3RhdHVzRG9ja2VyIHByb2JsZW0gdHJ5aW5nIHRvIHN0YXJ0IEJvYnMgbm9kZSBpbnNpZGUgZG9ja2VyIGNvbnRhaW5lcjpcIixlcnJvcik7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgY29ubmVjdERvY2tlckJvYihzdGFydGVkQ29udGFpbmVySWQpO1xuICAgICAgICAgICAgfWNhdGNoKGVycm9yMil7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJjb3VsZCBub3Qgc3RhcnQgYm9iOlwiLGVycm9yMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihjb3VudGVyPT01MClydW5uaW5nPWZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvdW50ZXIrKztcbiAgICB9XG4gICAgY2FsbGJhY2sobnVsbCwgc3RhcnRlZENvbnRhaW5lcklkKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlX29wdGlvbnNfZnJvbV9hbGljZV9hbmRfYm9iKGNhbGxiYWNrKXtcbiAgICBjb25zdCBjb250YWluZXJJZCA9IGdldENvbnRhaW5lcklkT2ZOYW1lKCdtb25nbycpO1xuICAgIGV4ZWMoJ3N1ZG8gZG9ja2VyIGNwIC9ob21lL2RvaWNoYWluL2RhcHAvY29udHJpYi9zY3JpcHRzL21ldGVvci9kZWxldGVfY29sbGVjdGlvbnMuc2ggJytjb250YWluZXJJZCsnOi90bXAvJywgKGUsIHN0ZG91dCwgc3RkZXJyKT0+IHtcbiAgICAgICAgdGVzdExvZ2dpbmcoJ2NvcGllZCBkZWxldGVfY29sbGVjdGlvbnMgaW50byBtb25nbyBkb2NrZXIgY29udGFpbmVyJyx7c3RkZXJyOnN0ZGVycixzdGRvdXQ6c3Rkb3V0fSk7XG4gICAgICAgIGV4ZWMoJ3N1ZG8gZG9ja2VyIGV4ZWMgJytjb250YWluZXJJZCsnIGJhc2ggLWMgXCJtb25nbyA8IC90bXAvZGVsZXRlX2NvbGxlY3Rpb25zLnNoXCInLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N1ZG8gZG9ja2VyIGV4ZWMgJytjb250YWluZXJJZCsnIGJhc2ggLWMgXCJtb25nbyA8IC90bXAvZGVsZXRlX2NvbGxlY3Rpb25zLnNoXCInLHtzdGRlcnI6c3RkZXJyLHN0ZG91dDpzdGRvdXR9KTtcbiAgICAgICAgICAgIGNhbGxiYWNrKHN0ZGVyciwgc3Rkb3V0KTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTm9kZUFsaXZlKHVybCwgYXV0aCwgbG9nKSB7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnaXNOb2RlQWxpdmUgY2FsbGVkIHRvIHVybCcsdXJsKTtcbiAgICBjb25zdCBkYXRhR2V0TmV0d29ya0luZm8gPSB7XCJqc29ucnBjXCI6IFwiMS4wXCIsIFwiaWRcIjogXCJnZXRuZXR3b3JraW5mb1wiLCBcIm1ldGhvZFwiOiBcImdldG5ldHdvcmtpbmZvXCIsIFwicGFyYW1zXCI6IFtdfTtcbiAgICBjb25zdCByZWFsZGF0YUdldE5ldHdvcmtJbmZvID0ge2F1dGg6IGF1dGgsIGRhdGE6IGRhdGFHZXROZXR3b3JrSW5mbywgaGVhZGVyczogaGVhZGVyc307XG4gICAgY29uc3QgcmVzdWx0R2V0TmV0d29ya0luZm8gPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhR2V0TmV0d29ya0luZm8pO1xuICAgIGNvbnN0IHN0YXR1c0dldE5ldHdvcmtJbmZvID0gcmVzdWx0R2V0TmV0d29ya0luZm8uc3RhdHVzQ29kZTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHN0YXR1c0dldE5ldHdvcmtJbmZvKTtcbiAgICBpZihsb2cpXG4gICAgICAgIHRlc3RMb2dnaW5nKCdyZXN1bHRHZXROZXR3b3JrSW5mbzonLHJlc3VsdEdldE5ldHdvcmtJbmZvKTsgLy8gZ2V0bmV0d29ya2luZm8gfCBqcSAnLmxvY2FsYWRkcmVzc2VzWzBdLmFkZHJlc3MnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05vZGVBbGl2ZUFuZENvbm5lY3RlZFRvSG9zdCh1cmwsIGF1dGgsIGhvc3QsIGxvZykge1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2lzTm9kZUFsaXZlQW5kQ29ubmVjdGVkVG9Ib3N0IGNhbGxlZCcpO1xuICAgIGlzTm9kZUFsaXZlKHVybCwgYXV0aCwgbG9nKTtcblxuICAgIGNvbnN0IGRhdGFHZXROZXR3b3JrSW5mbyA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiYWRkbm9kZVwiLCBcIm1ldGhvZFwiOiBcImFkZG5vZGVcIiwgXCJwYXJhbXNcIjogWydhbGljZScsJ29uZXRyeSddIH07XG4gICAgY29uc3QgcmVhbGRhdGFHZXROZXR3b3JrSW5mbyA9IHsgYXV0aDogYXV0aCwgZGF0YTogZGF0YUdldE5ldHdvcmtJbmZvLCBoZWFkZXJzOiBoZWFkZXJzIH07XG4gICAgY29uc3QgcmVzdWx0R2V0TmV0d29ya0luZm8gPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhR2V0TmV0d29ya0luZm8pO1xuICAgIGNvbnN0IHN0YXR1c0FkZE5vZGUgPSByZXN1bHRHZXROZXR3b3JrSW5mby5zdGF0dXNDb2RlO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2FkZG5vZGU6JyxzdGF0dXNBZGROb2RlKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHN0YXR1c0FkZE5vZGUpO1xuXG5cbiAgICBjb25zdCBkYXRhR2V0UGVlckluZm8gPSB7XCJqc29ucnBjXCI6IFwiMS4wXCIsIFwiaWRcIjpcImdldHBlZXJpbmZvXCIsIFwibWV0aG9kXCI6IFwiZ2V0cGVlcmluZm9cIiwgXCJwYXJhbXNcIjogW10gfTtcbiAgICBjb25zdCByZWFsZGF0YUdldFBlZXJJbmZvID0geyBhdXRoOiBhdXRoLCBkYXRhOiBkYXRhR2V0UGVlckluZm8sIGhlYWRlcnM6IGhlYWRlcnMgfTtcbiAgICBjb25zdCByZXN1bHRHZXRQZWVySW5mbyA9IGdldEh0dHBQT1NUKHVybCwgcmVhbGRhdGFHZXRQZWVySW5mbyk7XG4gICAgY29uc3Qgc3RhdHVzR2V0UGVlckluZm8gPSByZXN1bHRHZXRQZWVySW5mby5zdGF0dXNDb2RlO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3Jlc3VsdEdldFBlZXJJbmZvOicscmVzdWx0R2V0UGVlckluZm8pO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgc3RhdHVzR2V0UGVlckluZm8pO1xuICAgIGNoYWkuYXNzZXJ0LmlzQWJvdmUocmVzdWx0R2V0UGVlckluZm8uZGF0YS5yZXN1bHQubGVuZ3RoLCAwLCAnbm8gY29ubmVjdGlvbiB0byBvdGhlciBub2RlcyEgJyk7XG4gICAgLy9jaGFpLmV4cGVjdChyZXN1bHRHZXRQZWVySW5mby5kYXRhLnJlc3VsdCkudG8uaGF2ZS5sZW5ndGhPZi5hdC5sZWFzdCgxKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0UHJpdktleSh1cmwsIGF1dGgsIHByaXZLZXksIHJlc2NhbiwgbG9nKSB7XG4gICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2ltcG9ydFByaXZLZXkgY2FsbGVkJywnJyk7XG4gICAgICAgIGNvbnN0IGRhdGFfaW1wb3J0cHJpdmtleSA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiaW1wb3J0cHJpdmtleVwiLCBcIm1ldGhvZFwiOiBcImltcG9ydHByaXZrZXlcIiwgXCJwYXJhbXNcIjogW3ByaXZLZXldIH07XG4gICAgICAgIGNvbnN0IHJlYWxkYXRhX2ltcG9ydHByaXZrZXkgPSB7IGF1dGg6IGF1dGgsIGRhdGE6IGRhdGFfaW1wb3J0cHJpdmtleSwgaGVhZGVyczogaGVhZGVycyB9O1xuICAgICAgICBjb25zdCByZXN1bHQgPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhX2ltcG9ydHByaXZrZXkpO1xuICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdyZXN1bHQ6JyxyZXN1bHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV3QWRkcmVzcyh1cmwsIGF1dGgsIGxvZykge1xuXG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnZ2V0TmV3QWRkcmVzcyBjYWxsZWQnKTtcbiAgICBjb25zdCBkYXRhR2V0TmV3QWRkcmVzcyA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiZ2V0bmV3YWRkcmVzc1wiLCBcIm1ldGhvZFwiOiBcImdldG5ld2FkZHJlc3NcIiwgXCJwYXJhbXNcIjogW10gfTtcbiAgICBjb25zdCByZWFsZGF0YUdldE5ld0FkZHJlc3MgPSB7IGF1dGg6IGF1dGgsIGRhdGE6IGRhdGFHZXROZXdBZGRyZXNzLCBoZWFkZXJzOiBoZWFkZXJzIH07XG4gICAgY29uc3QgcmVzdWx0R2V0TmV3QWRkcmVzcyA9IGdldEh0dHBQT1NUKHVybCwgcmVhbGRhdGFHZXROZXdBZGRyZXNzKTtcbiAgICBjb25zdCBzdGF0dXNPcHRJbkdldE5ld0FkZHJlc3MgPSByZXN1bHRHZXROZXdBZGRyZXNzLnN0YXR1c0NvZGU7XG4gICAgY29uc3QgbmV3QWRkcmVzcyAgPSByZXN1bHRHZXROZXdBZGRyZXNzLmRhdGEucmVzdWx0O1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgc3RhdHVzT3B0SW5HZXROZXdBZGRyZXNzKTtcbiAgICBjaGFpLmV4cGVjdChyZXN1bHRHZXROZXdBZGRyZXNzLmRhdGEuZXJyb3IpLnRvLmJlLm51bGw7XG4gICAgY2hhaS5leHBlY3QobmV3QWRkcmVzcykudG8ubm90LmJlLm51bGw7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZyhuZXdBZGRyZXNzKTtcbiAgICByZXR1cm4gbmV3QWRkcmVzcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRldG9hZGRyZXNzKHVybCxhdXRoLHRvYWRkcmVzcyxhbW91bnQsbG9nKXtcbiAgICBjb25zdCBkYXRhR2VuZXJhdGUgPSB7XCJqc29ucnBjXCI6IFwiMS4wXCIsIFwiaWRcIjpcImdlbmVyYXRldG9hZGRyZXNzXCIsIFwibWV0aG9kXCI6IFwiZ2VuZXJhdGV0b2FkZHJlc3NcIiwgXCJwYXJhbXNcIjogW2Ftb3VudCx0b2FkZHJlc3NdIH07XG4gICAgY29uc3QgaGVhZGVyc0dlbmVyYXRlcyA9IHsgJ0NvbnRlbnQtVHlwZSc6J3RleHQvcGxhaW4nICB9O1xuICAgIGNvbnN0IHJlYWxkYXRhR2VuZXJhdGUgPSB7IGF1dGg6IGF1dGgsIGRhdGE6IGRhdGFHZW5lcmF0ZSwgaGVhZGVyczogaGVhZGVyc0dlbmVyYXRlcyB9O1xuICAgIGNvbnN0IHJlc3VsdEdlbmVyYXRlID0gZ2V0SHR0cFBPU1QodXJsLCByZWFsZGF0YUdlbmVyYXRlKTtcbiAgICBjb25zdCBzdGF0dXNSZXN1bHRHZW5lcmF0ZSA9IHJlc3VsdEdlbmVyYXRlLnN0YXR1c0NvZGU7XG4gICAgaWYobG9nKXRlc3RMb2dnaW5nKCdzdGF0dXNSZXN1bHRHZW5lcmF0ZTonLHN0YXR1c1Jlc3VsdEdlbmVyYXRlKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHN0YXR1c1Jlc3VsdEdlbmVyYXRlKTtcbiAgICBjaGFpLmV4cGVjdChyZXN1bHRHZW5lcmF0ZS5kYXRhLmVycm9yKS50by5iZS5udWxsO1xuICAgIGNoYWkuZXhwZWN0KHJlc3VsdEdlbmVyYXRlLmRhdGEucmVzdWx0KS50by5ub3QuYmUubnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJhbGFuY2UodXJsLGF1dGgsbG9nKXtcbiAgICBjb25zdCBkYXRhR2V0QmFsYW5jZSA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiZ2V0YmFsYW5jZVwiLCBcIm1ldGhvZFwiOiBcImdldGJhbGFuY2VcIiwgXCJwYXJhbXNcIjogW10gfTtcbiAgICBjb25zdCByZWFsZGF0YUdldEJhbGFuY2UgPSB7IGF1dGg6IGF1dGgsIGRhdGE6IGRhdGFHZXRCYWxhbmNlLCBoZWFkZXJzOiBoZWFkZXJzIH07XG4gICAgY29uc3QgcmVzdWx0R2V0QmFsYW5jZSA9IGdldEh0dHBQT1NUKHVybCwgcmVhbGRhdGFHZXRCYWxhbmNlKTtcbiAgICBpZihsb2cpdGVzdExvZ2dpbmcoJ3Jlc3VsdEdldEJhbGFuY2U6JyxyZXN1bHRHZXRCYWxhbmNlLmRhdGEucmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0R2V0QmFsYW5jZS5kYXRhLnJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZ2V0X2NvbnRhaW5lcl9pZF9vZl9uYW1lKG5hbWUsY2FsbGJhY2spIHtcbiAgICBleGVjKHN1ZG8rJ2RvY2tlciBwcyAtLWZpbHRlciBcIm5hbWU9JytuYW1lKydcIiB8IGN1dCAtZjEgLWRcIiBcIiB8IHNlZCBcXCcxZFxcJycsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgIGlmKGUhPW51bGwpe1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2Nhbm5vdCBmaW5kICcrbmFtZSsnIG5vZGUgJytzdGRvdXQsc3RkZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJvYnNDb250YWluZXJJZCA9IHN0ZG91dC50b1N0cmluZygpLnRyaW0oKTsgLy8uc3Vic3RyaW5nKDAsc3Rkb3V0LnRvU3RyaW5nKCkubGVuZ3RoLTEpOyAvL3JlbW92ZSBsYXN0IGNoYXIgc2luY2UgaW5zIGEgbGluZSBicmVha1xuICAgICAgICBjYWxsYmFjayhzdGRlcnIsIGJvYnNDb250YWluZXJJZCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHN0b3BfZG9ja2VyX2JvYihjYWxsYmFjaykge1xuICAgIGNvbnN0IGJvYnNDb250YWluZXJJZCA9IGdldENvbnRhaW5lcklkT2ZOYW1lKCdib2InKTtcbiAgICB0ZXN0TG9nZ2luZygnc3RvcHBpbmcgQm9iIHdpdGggY29udGFpbmVyLWlkOiAnK2JvYnNDb250YWluZXJJZCk7XG4gICAgdHJ5e1xuICAgICAgICBleGVjKHN1ZG8rJ2RvY2tlciBzdG9wICcrYm9ic0NvbnRhaW5lcklkLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0b3BwaW5nIEJvYiB3aXRoIGNvbnRhaW5lci1pZDogJyx7c3Rkb3V0OnN0ZG91dCxzdGRlcnI6c3RkZXJyfSk7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBib2JzQ29udGFpbmVySWQpO1xuICAgICAgICB9KTtcbiAgICB9Y2F0Y2ggKGUpIHtcbiAgICAgICAgdGVzdExvZ2dpbmcoJ2NvdWxkbnQgc3RvcCBib2JzIG5vZGUnLGUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fYWRkX25vZGUoY29udGFpbmVySWQsY2FsbGJhY2spIHtcbiAgICBleGVjKHN1ZG8rJ2RvY2tlciBleGVjICcrY29udGFpbmVySWQrJyBkb2ljaGFpbi1jbGkgYWRkbm9kZSBhbGljZSBvbmV0cnknLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICB0ZXN0TG9nZ2luZygnYm9iICcrY29udGFpbmVySWQrJyBjb25uZWN0ZWQ/ICcse3N0ZG91dDpzdGRvdXQsc3RkZXJyOnN0ZGVycn0pO1xuICAgICAgICBjYWxsYmFjayhzdGRlcnIsIHN0ZG91dCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldF9kb2NrZXJfc3RhdHVzKGNvbnRhaW5lcklkLGNhbGxiYWNrKSB7XG4gICAgbG9nQmxvY2tjaGFpbignY29udGFpbmVySWQgJytjb250YWluZXJJZCsnIHJ1bm5pbmc/ICcpO1xuICAgIGV4ZWMoc3VkbysnZG9ja2VyIGV4ZWMgJytjb250YWluZXJJZCsnIGRvaWNoYWluLWNsaSAtZ2V0aW5mbycsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgIHRlc3RMb2dnaW5nKCdjb250YWluZXJJZCAnK2NvbnRhaW5lcklkKycgc3RhdHVzOiAnLHtzdGRvdXQ6c3Rkb3V0LHN0ZGVycjpzdGRlcnJ9KTtcbiAgICAgICAgY2FsbGJhY2soc3RkZXJyLCBzdGRvdXQpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzdGFydF9kb2NrZXJfYm9iKGJvYnNDb250YWluZXJJZCxjYWxsYmFjaykge1xuICAgIGV4ZWMoc3VkbysnZG9ja2VyIHN0YXJ0ICcrYm9ic0NvbnRhaW5lcklkLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICB0ZXN0TG9nZ2luZygnc3RhcnRlZCBib2JzIG5vZGUgYWdhaW46ICcrYm9ic0NvbnRhaW5lcklkLHtzdGRvdXQ6c3Rkb3V0LHN0ZGVycjpzdGRlcnJ9KTtcbiAgICAgICAgY2FsbGJhY2soc3RkZXJyLCBzdGRvdXQudG9TdHJpbmcoKS50cmltKCkpOyAvL3JlbW92ZSBsaW5lIGJyZWFrIGZyb20gdGhlIGVuZFxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjb25uZWN0X2RvY2tlcl9ib2IoYm9ic0NvbnRhaW5lcklkLCBjYWxsYmFjaykge1xuICAgIGV4ZWMoc3VkbysnZG9ja2VyIGV4ZWMgJytib2JzQ29udGFpbmVySWQrJyBkb2ljaGFpbmQgLXJlZ3Rlc3QgLWRhZW1vbiAtcmVpbmRleCAtYWRkbm9kZT1hbGljZScsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgIHRlc3RMb2dnaW5nKCdyZXN0YXJ0aW5nIGRvaWNoYWluZCBvbiBib2JzIG5vZGUgYW5kIGNvbm5lY3Rpbmcgd2l0aCBhbGljZTogJyx7c3Rkb3V0OnN0ZG91dCxzdGRlcnI6c3RkZXJyfSk7XG4gICAgICAgIGNhbGxiYWNrKHN0ZGVyciwgc3Rkb3V0KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc3RhcnRfM3JkX25vZGUoY2FsbGJhY2spIHtcbiAgICBleGVjKHN1ZG8rJ2RvY2tlciBzdGFydCAzcmRfbm9kZScsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgIHRlc3RMb2dnaW5nKCd0cnlpbmcgdG8gc3RhcnQgM3JkX25vZGUnLHtzdGRvdXQ6c3Rkb3V0LHN0ZGVycjpzdGRlcnJ9KTtcbiAgICAgICAgaWYoc3RkZXJyKXtcbiAgICAgICAgICAgIGV4ZWMoc3VkbysnZG9ja2VyIG5ldHdvcmsgbHMgfGdyZXAgZG9pY2hhaW4gfCBjdXQgLWY5IC1kXCIgXCInLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ldHdvcmsgPSBzdGRvdXQudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCxzdGRvdXQudG9TdHJpbmcoKS5sZW5ndGgtMSk7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2Nvbm5lY3RpbmcgM3JkIG5vZGUgdG8gZG9ja2VyIG5ldHdvcms6ICcrbmV0d29yayk7XG4gICAgICAgICAgICAgICAgZXhlYyhzdWRvKydkb2NrZXIgcnVuIC0tZXhwb3NlPTE4MzMyICcgK1xuICAgICAgICAgICAgICAgICAgICAnLWUgUkVHVEVTVD10cnVlICcgK1xuICAgICAgICAgICAgICAgICAgICAnLWUgRE9JQ0hBSU5fVkVSPTAuMTYuMy4yICcgK1xuICAgICAgICAgICAgICAgICAgICAnLWUgUlBDX0FMTE9XX0lQPTo6LzAgJyArXG4gICAgICAgICAgICAgICAgICAgICctZSBDT05ORUNUSU9OX05PREU9YWxpY2UgJytcbiAgICAgICAgICAgICAgICAgICAgJy1lIFJQQ19QQVNTV09SRD1nZW5lcmF0ZWQtcGFzc3dvcmQgJyArXG4gICAgICAgICAgICAgICAgICAgICctLW5hbWU9M3JkX25vZGUgJytcbiAgICAgICAgICAgICAgICAgICAgJy0tZG5zPTE3Mi4yMC4wLjUgICcgK1xuICAgICAgICAgICAgICAgICAgICAnLS1kbnM9OC44LjguOCAnICtcbiAgICAgICAgICAgICAgICAgICAgJy0tZG5zLXNlYXJjaD1jaS1kb2ljaGFpbi5vcmcgJyArXG4gICAgICAgICAgICAgICAgICAgICctLWlwPTE3Mi4yMC4wLjEwICcgK1xuICAgICAgICAgICAgICAgICAgICAnLS1uZXR3b3JrPScrbmV0d29yaysnIC1kIGRvaWNoYWluL2NvcmU6MC4xNi4zLjInLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhzdGRlcnIsIHN0ZG91dCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBjYWxsYmFjayhzdGRlcnIsIHN0ZG91dCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG59XG5cbmZ1bmN0aW9uIHJ1bl9hbmRfd2FpdChydW5mdW5jdGlvbixzZWNvbmRzLCBjYWxsYmFjayl7XG4gICAgTWV0ZW9yLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBydW5mdW5jdGlvbigpO1xuICAgICAgICBjYWxsYmFjayhudWxsLHRydWUpO1xuICAgIH0sIHNlY29uZHMrMTAwMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0VG9TdGFydENvbnRhaW5lcihjb250YWluZXJJZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyh3YWl0X3RvX3N0YXJ0X2NvbnRhaW5lcik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNvbnRhaW5lcklkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZU9wdEluc0Zyb21BbGljZUFuZEJvYigpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZGVsZXRlX29wdGlvbnNfZnJvbV9hbGljZV9hbmRfYm9iKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0M3JkTm9kZSgpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoc3RhcnRfM3JkX25vZGUpO1xuICAgIHJldHVybiBzeW5jRnVuYygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RvcERvY2tlckJvYigpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoc3RvcF9kb2NrZXJfYm9iKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRhaW5lcklkT2ZOYW1lKG5hbWUpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZ2V0X2NvbnRhaW5lcl9pZF9vZl9uYW1lKTtcbiAgICByZXR1cm4gc3luY0Z1bmMobmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydERvY2tlckJvYihjb250YWluZXJJZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhzdGFydF9kb2NrZXJfYm9iKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY29udGFpbmVySWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG9pY2hhaW5BZGROb2RlKGNvbnRhaW5lcklkKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2FkZF9ub2RlKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY29udGFpbmVySWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RG9ja2VyU3RhdHVzKGNvbnRhaW5lcklkKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGdldF9kb2NrZXJfc3RhdHVzKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY29udGFpbmVySWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29ubmVjdERvY2tlckJvYihjb250YWluZXJJZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhjb25uZWN0X2RvY2tlcl9ib2IpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjb250YWluZXJJZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5BbmRXYWl0KHJ1bmZ1bmN0aW9uLCBzZWNvbmRzKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHJ1bl9hbmRfd2FpdCk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHNlY29uZHMpO1xufSIsImltcG9ydCB7Y2hhaX0gZnJvbSAnbWV0ZW9yL3ByYWN0aWNhbG1ldGVvcjpjaGFpJztcbmltcG9ydCB7IHRlc3RMb2cgfSBmcm9tIFwibWV0ZW9yL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGlcIjtcbmltcG9ydCB7XG4gICAgZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iLCBnZXRCYWxhbmNlLCBpbml0QmxvY2tjaGFpblxufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1ub2RlXCI7XG5jb25zdCBub2RlX3VybF9hbGljZSA9ICdodHRwOi8vMTcyLjIwLjAuNjoxODMzMi8nO1xuY29uc3Qgbm9kZV91cmxfYm9iID0gICAnaHR0cDovLzE3Mi4yMC4wLjc6MTgzMzIvJztcbmNvbnN0IHJwY0F1dGggPSBcImFkbWluOmdlbmVyYXRlZC1wYXNzd29yZFwiO1xuY29uc3QgcHJpdktleUJvYiA9IFwiY1AzRWlna3pzV3V5S0VteGs4Y0M2cVhZYjRaandVbzV2enZacEFQbURRODNSQ2dYUXJ1alwiO1xuY29uc3QgbG9nID0gdHJ1ZTtcblxuaWYoTWV0ZW9yLmlzQXBwVGVzdCkge1xuICAgIGRlc2NyaWJlKCdiYXNpYy1kb2ktdGVzdC0wJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRpbWVvdXQoMCk7XG5cbiAgICAgICAgYmVmb3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRlc3RMb2coXCJyZW1vdmluZyBPcHRJbnMsUmVjaXBpZW50cyxTZW5kZXJzXCIsJycpO1xuICAgICAgICAgICAgZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY3JlYXRlIGEgUmVnVGVzdCBEb2ljaGFpbiB3aXRoIGFsaWNlIGFuZCBib2IgYW5kIHNvbWUgRG9pIC0gY29pbnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbml0QmxvY2tjaGFpbihub2RlX3VybF9hbGljZSxub2RlX3VybF9ib2IscnBjQXV0aCxwcml2S2V5Qm9iLHRydWUpO1xuICAgICAgICAgICAgY29uc3QgYWxpY2VCYWxhbmNlID0gZ2V0QmFsYW5jZShub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgbG9nKTtcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzQWJvdmUoYWxpY2VCYWxhbmNlLCAwLCAnbm8gZnVuZGluZyEgJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuaW1wb3J0IHtcbiAgICBsb2dpbixcbiAgICBjcmVhdGVVc2VyLFxuICAgIGZpbmRVc2VyLFxuICAgIGV4cG9ydE9wdElucyxcbiAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pLCByZXNldFVzZXJzLCB1cGRhdGVVc2VyLCBkZWxldGVBbGxFbWFpbHNGcm9tUG9wM1xufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1kYXBwXCI7XG5pbXBvcnQge1xuICAgIHRlc3RMb2cgYXMgbG9nQmxvY2tjaGFpblxufSBmcm9tIFwibWV0ZW9yL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGlcIjtcblxuaW1wb3J0IHtkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2J9IGZyb20gXCIuL3Rlc3QtYXBpL3Rlc3QtYXBpLW9uLW5vZGVcIjtcblxuY29uc3Qgbm9kZV91cmxfYWxpY2UgPSAnaHR0cDovLzE3Mi4yMC4wLjY6MTgzMzIvJztcblxuY29uc3QgcnBjQXV0aEFsaWNlID0gXCJhZG1pbjpnZW5lcmF0ZWQtcGFzc3dvcmRcIjtcbmNvbnN0IGRhcHBVcmxBbGljZSA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCI7XG5jb25zdCBkYXBwVXJsQm9iID0gXCJodHRwOi8vMTcyLjIwLjAuODo0MDAwXCI7XG5jb25zdCBkQXBwTG9naW4gPSB7XCJ1c2VybmFtZVwiOlwiYWRtaW5cIixcInBhc3N3b3JkXCI6XCJwYXNzd29yZFwifTtcblxuY29uc3QgdGVtcGxhdGVVcmxBPVwiaHR0cDovLzE3Mi4yMC4wLjg6NDAwMC90ZW1wbGF0ZXMvZW1haWxzL2RvaWNoYWluLWFubWVsZHVuZy1maW5hbC1ERS5odG1sXCI7XG5jb25zdCB0ZW1wbGF0ZVVybEI9XCJodHRwOi8vMTcyLjIwLjAuODo0MDAwL3RlbXBsYXRlcy9lbWFpbHMvZG9pY2hhaW4tYW5tZWxkdW5nLWZpbmFsLUVOLmh0bWxcIjtcbmNvbnN0IGFsaWNlQUxvZ2luID0ge1widXNlcm5hbWVcIjpcImFsaWNlLWFcIixcInBhc3N3b3JkXCI6XCJwYXNzd29yZFwifTtcbmNvbnN0IGFsaWNlQkxvZ2luID0ge1widXNlcm5hbWVcIjpcImFsaWNlLWFcIixcInBhc3N3b3JkXCI6XCJwYXNzd29yZFwifTtcblxuY29uc3QgcmVjaXBpZW50X3BvcDN1c2VybmFtZSA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiO1xuY29uc3QgcmVjaXBpZW50X3BvcDNwYXNzd29yZCA9IFwiYm9iXCI7XG5cbmlmKE1ldGVvci5pc0FwcFRlc3QpIHtcbiAgICBkZXNjcmliZSgnYmFzaWMtZG9pLXRlc3QtMDEnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudGltZW91dCgwKTtcblxuICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInJlbW92aW5nIE9wdElucyxSZWNpcGllbnRzLFNlbmRlcnNcIik7XG4gICAgICAgICAgICBkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IoKTtcbiAgICAgICAgICAgIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzKFwibWFpbFwiLCAxMTAsIHJlY2lwaWVudF9wb3AzdXNlcm5hbWUsIHJlY2lwaWVudF9wb3AzcGFzc3dvcmQsIHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRlc3QgaWYgYmFzaWMgRG9pY2hhaW4gd29ya2Zsb3cgaXMgd29ya2luZyB3aXRoIG9wdGlvbmFsIGRhdGEnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjsgLy9wbGVhc2UgdXNlIHRoaXMgYXMgc3RhbmRhcmQgdG8gbm90IGNvbmZ1c2UgcGVvcGxlIVxuICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWwgPSBcImFsaWNlQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgY29uc3QgZGF0YUxvZ2luQWxpY2UgPSBsb2dpbihkYXBwVXJsQWxpY2UsIGRBcHBMb2dpbiwgZmFsc2UpOyAvL2xvZyBpbnRvIGRBcHBcbiAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsLCB7J2NpdHknOiAnRWthdGVyaW5idXJnJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCB0cnVlKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGJhc2ljIERvaWNoYWluIHdvcmtmbG93IGlzIHdvcmtpbmcgd2l0aG91dCBvcHRpb25hbCBkYXRhJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJhbGljZUBjaS1kb2ljaGFpbi5vcmdcIjsgLy9wbGVhc2UgdXNlIHRoaXMgYXMgYW4gYWxlcm5hdGl2ZSB3aGVuIGFib3ZlIHN0YW5kYXJkIGlzIG5vdCBwb3NzaWJsZVxuICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIC8vbG9naW4gdG8gZEFwcCAmIHJlcXVlc3QgRE9JIG9uIGFsaWNlIHZpYSBib2JcbiAgICAgICAgICAgIGNvbnN0IGRhdGFMb2dpbkFsaWNlID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIGZhbHNlKTsgLy9sb2cgaW50byBkQXBwXG4gICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIGRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgbnVsbCwgXCJhbGljZUBjaS1kb2ljaGFpbi5vcmdcIiwgXCJhbGljZVwiLCB0cnVlKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgdHdvIG1vcmUgdXNlcnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgcmVzZXRVc2VycygpO1xuICAgICAgICAgICAgY29uc3QgbG9nQWRtaW4gPSBsb2dpbihkYXBwVXJsQWxpY2UsIGRBcHBMb2dpbiwgZmFsc2UpO1xuICAgICAgICAgICAgbGV0IHVzZXJBID0gY3JlYXRlVXNlcihkYXBwVXJsQWxpY2UsIGxvZ0FkbWluLCBcImFsaWNlLWFcIiwgdGVtcGxhdGVVcmxBLCB0cnVlKTtcbiAgICAgICAgICAgIGNoYWkuZXhwZWN0KGZpbmRVc2VyKHVzZXJBKSkudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGxldCB1c2VyQiA9IGNyZWF0ZVVzZXIoZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgXCJhbGljZS1iXCIsIHRlbXBsYXRlVXJsQiwgdHJ1ZSk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChmaW5kVXNlcih1c2VyQikpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIERvaWNoYWluIHdvcmtmbG93IGlzIHVzaW5nIGRpZmZlcmVudCB0ZW1wbGF0ZXMgZm9yIGRpZmZlcmVudCB1c2VycycsIGZ1bmN0aW9uIChkb25lKSB7XG5cbiAgICAgICAgICAgIHJlc2V0VXNlcnMoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vXG4gICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbF9hbGljZV9hID0gXCJhbGljZS1hQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWxfYWxpY2VfYiA9IFwiYWxpY2UtYkBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IGxvZ0FkbWluID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIGZhbHNlKTtcblxuICAgICAgICAgICAgbGV0IHVzZXJBID0gY3JlYXRlVXNlcihkYXBwVXJsQWxpY2UsIGxvZ0FkbWluLCBcImFsaWNlLWFcIiwgdGVtcGxhdGVVcmxBLCB0cnVlKTtcbiAgICAgICAgICAgIGNoYWkuZXhwZWN0KGZpbmRVc2VyKHVzZXJBKSkudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGxldCB1c2VyQiA9IGNyZWF0ZVVzZXIoZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgXCJhbGljZS1iXCIsIHRlbXBsYXRlVXJsQiwgdHJ1ZSk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChmaW5kVXNlcih1c2VyQikpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvZ1VzZXJBID0gbG9naW4oZGFwcFVybEFsaWNlLCBhbGljZUFMb2dpbiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBsb2dVc2VyQiA9IGxvZ2luKGRhcHBVcmxBbGljZSwgYWxpY2VCTG9naW4sIHRydWUpO1xuXG4gICAgICAgICAgICAvL3JlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kgY2hlY2tzIGlmIHRoZSBcImxvZ1wiIHZhbHVlIChpZiBpdCBpcyBhIFN0cmluZykgaXMgaW4gdGhlIG1haWwtdGV4dFxuICAgICAgICAgICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsIGxvZ1VzZXJBLCBkYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWxfYWxpY2VfYSwgeydjaXR5JzogJ0VrYXRlcmluYnVyZyd9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgXCJrb3N0ZW5sb3NlIEFubWVsZHVuZ1wiKTtcbiAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZGFwcFVybEFsaWNlLCBsb2dVc2VyQiwgZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsX2FsaWNlX2IsIHsnY2l0eSc6ICdTaW1iYWNoJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCBcImZyZWUgcmVnaXN0cmF0aW9uXCIpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiB1c2VycyBjYW4gZXhwb3J0IE9wdElucyAnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjsgLy9cbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsX2FsaWNlX2EgPSBcImFsaWNlLWV4cG9ydEBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IGxvZ0FkbWluID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgbG9nVXNlckEgPSBsb2dpbihkYXBwVXJsQWxpY2UsIGFsaWNlQUxvZ2luLCB0cnVlKTtcbiAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZGFwcFVybEFsaWNlLCBsb2dVc2VyQSwgZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsX2FsaWNlX2EsIHsnY2l0eSc6ICdNw7xuY2hlbid9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBleHBvcnRlZE9wdElucyA9IGV4cG9ydE9wdElucyhkYXBwVXJsQWxpY2UsIGxvZ0FkbWluLCB0cnVlKTtcbiAgICAgICAgICAgIGNoYWkuZXhwZWN0KGV4cG9ydGVkT3B0SW5zKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoZXhwb3J0ZWRPcHRJbnNbMF0pLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBleHBvcnRlZE9wdEluc0EgPSBleHBvcnRPcHRJbnMoZGFwcFVybEFsaWNlLCBsb2dVc2VyQSwgdHJ1ZSk7XG4gICAgICAgICAgICBleHBvcnRlZE9wdEluc0EuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICBjaGFpLmV4cGVjdChlbGVtZW50Lm93bmVySWQpLnRvLmJlLmVxdWFsKGxvZ1VzZXJBLnVzZXJJZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vY2hhaS5leHBlY3QoZmluZE9wdEluKHJlc3VsdERhdGFPcHRJbi5faWQpKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiBhZG1pbiBjYW4gdXBkYXRlIHVzZXIgcHJvZmlsZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXNldFVzZXJzKCk7XG4gICAgICAgICAgICBsZXQgbG9nQWRtaW4gPSBsb2dpbihkYXBwVXJsQWxpY2UsIGRBcHBMb2dpbiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1c2VyVXAgPSBjcmVhdGVVc2VyKGRhcHBVcmxBbGljZSwgbG9nQWRtaW4sIFwidXBkYXRlVXNlclwiLCB0ZW1wbGF0ZVVybEEsIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlZERhdGEgPSB1cGRhdGVVc2VyKGRhcHBVcmxBbGljZSwgbG9nQWRtaW4sIHVzZXJVcCwge1widGVtcGxhdGVVUkxcIjogdGVtcGxhdGVVcmxCfSwgdHJ1ZSk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChjaGFuZ2VkRGF0YSkubm90LnVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIHVzZXIgY2FuIHVwZGF0ZSBvd24gcHJvZmlsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlc2V0VXNlcnMoKTtcbiAgICAgICAgICAgIGxldCBsb2dBZG1pbiA9IGxvZ2luKGRhcHBVcmxBbGljZSwgZEFwcExvZ2luLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJVcCA9IGNyZWF0ZVVzZXIoZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgXCJ1cGRhdGVVc2VyXCIsIHRlbXBsYXRlVXJsQSwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBsb2dVc2VyVXAgPSBsb2dpbihkYXBwVXJsQWxpY2UsIHtcInVzZXJuYW1lXCI6IFwidXBkYXRlVXNlclwiLCBcInBhc3N3b3JkXCI6IFwicGFzc3dvcmRcIn0sIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlZERhdGEgPSB1cGRhdGVVc2VyKGRhcHBVcmxBbGljZSwgbG9nVXNlclVwLCB1c2VyVXAsIHtcInRlbXBsYXRlVVJMXCI6IHRlbXBsYXRlVXJsQn0sIHRydWUpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoY2hhbmdlZERhdGEpLm5vdC51bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiBjb0RvaSB3b3JrcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvRG9pTGlzdCA9IFtcImFsaWNlMUBkb2ljaGFpbi1jaS5jb21cIiwgXCJhbGljZTJAZG9pY2hhaW4tY2kuY29tXCIsIFwiYWxpY2UzQGRvaWNoYWluLWNpLmNvbVwiXTtcbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbCA9IGNvRG9pTGlzdDtcbiAgICAgICAgICAgIGxldCBsb2dBZG1pbiA9IGxvZ2luKGRhcHBVcmxBbGljZSwgZEFwcExvZ2luLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGNvRG9pcyA9IHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsLCB7J2NpdHknOiAnRWthdGVyaW5idXJnJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCB0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBmaW5kIHVwZGF0ZWQgRGF0YSBpbiBlbWFpbCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiOyAvL3BsZWFzZSB1c2UgdGhpcyBhcyBzdGFuZGFyZCB0byBub3QgY29uZnVzZSBwZW9wbGUhXG4gICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbCA9IFwiYWxpY2UtdXBkYXRlQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgY29uc3QgYWRMb2cgPSBsb2dpbihkYXBwVXJsQWxpY2UsIGRBcHBMb2dpbiwgZmFsc2UpO1xuICAgICAgICAgICAgdXBkYXRlVXNlcihkYXBwVXJsQWxpY2UsIGFkTG9nLCBhZExvZy51c2VySWQsIHtcInN1YmplY3RcIjogXCJ1cGRhdGVUZXN0XCIsIFwidGVtcGxhdGVVUkxcIjogdGVtcGxhdGVVcmxCfSk7XG4gICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGRhcHBVcmxBbGljZSwgYWRMb2csIGRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgeydjaXR5JzogJ0VrYXRlcmluYnVyZyd9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuaW1wb3J0IHtcbiAgICBjb25maXJtTGluaywgZGVsZXRlQWxsRW1haWxzRnJvbVBvcDMsXG4gICAgZmV0Y2hDb25maXJtTGlua0Zyb21Qb3AzTWFpbCxcbiAgICBnZXROYW1lSWRPZk9wdEluRnJvbVJhd1R4LFxuICAgIGxvZ2luLFxuICAgIHJlcXVlc3RET0ksIHZlcmlmeURPSVxufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1kYXBwXCI7XG5pbXBvcnQge1xuICAgIHRlc3RMb2cgYXMgdGVzdExvZ2dpbmdcbn0gZnJvbSBcIm1ldGVvci9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpXCI7XG5pbXBvcnQge1xuICAgIGRlbGV0ZU9wdEluc0Zyb21BbGljZUFuZEJvYixcbiAgICBnZW5lcmF0ZXRvYWRkcmVzcyxcbiAgICBnZXROZXdBZGRyZXNzLFxuICAgIHN0YXJ0M3JkTm9kZSxcbiAgICBzdGFydERvY2tlckJvYixcbiAgICBzdG9wRG9ja2VyQm9iLCB3YWl0VG9TdGFydENvbnRhaW5lclxufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1ub2RlXCI7XG5jb25zdCBleGVjID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG5jb25zdCBub2RlX3VybF9hbGljZSA9ICdodHRwOi8vMTcyLjIwLjAuNjoxODMzMi8nO1xuY29uc3QgcmVjaXBpZW50X3BvcDN1c2VybmFtZSA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiO1xuY29uc3QgcmVjaXBpZW50X3BvcDNwYXNzd29yZCA9IFwiYm9iXCI7XG5cbmNvbnN0IHJwY0F1dGggPSBcImFkbWluOmdlbmVyYXRlZC1wYXNzd29yZFwiO1xuY29uc3QgZGFwcFVybEFsaWNlID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIjtcbmNvbnN0IGRhcHBVcmxCb2IgPSBcImh0dHA6Ly8xNzIuMjAuMC44OjQwMDBcIjtcbmNvbnN0IGRBcHBMb2dpbiA9IHtcInVzZXJuYW1lXCI6XCJhZG1pblwiLFwicGFzc3dvcmRcIjpcInBhc3N3b3JkXCJ9O1xuY29uc3QgbG9nID0gdHJ1ZTtcblxuaWYoTWV0ZW9yLmlzQXBwVGVzdCkge1xuICAgIGRlc2NyaWJlKCcwMi1iYXNpYy1kb2ktdGVzdC13aXRoLW9mZmxpbmUtbm9kZS0wMicsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iKCk7XG4gICAgICAgICAgICBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMyhcIm1haWxcIiwgMTEwLCByZWNpcGllbnRfcG9wM3VzZXJuYW1lLCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkLCB0cnVlKTtcbiAgICAgICAgICAgIGV4ZWMoJ3N1ZG8gZG9ja2VyIHJtIDNyZF9ub2RlJywgKGUsIHN0ZG91dDIsIHN0ZGVycjIpID0+IHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnZGVsZXRlZCAzcmRfbm9kZTonLCB7c3Rkb3V0OiBzdGRvdXQyLCBzdGRlcnI6IHN0ZGVycjJ9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGV4ZWMoJ3N1ZG8gZG9ja2VyIHN0b3AgM3JkX25vZGUnLCAoZSwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0b3BwZWQgM3JkX25vZGU6Jywge3N0ZG91dDogc3Rkb3V0LCBzdGRlcnI6IHN0ZGVycn0pO1xuICAgICAgICAgICAgICAgICAgICBleGVjKCdzdWRvIGRvY2tlciBybSAzcmRfbm9kZScsIChlLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3JlbW92ZWQgM3JkX25vZGU6Jywge3N0ZG91dDogc3Rkb3V0LCBzdGRlcnI6IHN0ZGVycn0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2NvdWxkIG5vdCBzdG9wIDNyZF9ub2RlJywpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9pbXBvcnRQcml2S2V5KG5vZGVfdXJsX2JvYiwgcnBjQXV0aCwgcHJpdktleUJvYiwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBleGVjKCdzdWRvIGRvY2tlciBzdG9wIDNyZF9ub2RlJywgKGUsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdzdG9wcGVkIDNyZF9ub2RlOicsIHtzdGRvdXQ6IHN0ZG91dCwgc3RkZXJyOiBzdGRlcnJ9KTtcbiAgICAgICAgICAgICAgICAgICAgZXhlYygnc3VkbyBkb2NrZXIgcm0gM3JkX25vZGUnLCAoZSwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdyZW1vdmVkIDNyZF9ub2RlOicsIHtzdGRvdXQ6IHN0ZG91dCwgc3RkZXJyOiBzdGRlcnJ9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjb3VsZCBub3Qgc3RvcCAzcmRfbm9kZScsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGJhc2ljIERvaWNoYWluIHdvcmtmbG93IGlzIHdvcmtpbmcgd2hlbiBCb2JzIG5vZGUgaXMgdGVtcG9yYXJpbHkgb2ZmbGluZScsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXQoMCk7XG4gICAgICAgICAgICBnbG9iYWwuYWxpY2VBZGRyZXNzID0gZ2V0TmV3QWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgZmFsc2UpO1xuICAgICAgICAgICAgLy9zdGFydCBhbm90aGVyIDNyZCBub2RlIGJlZm9yZSBzaHV0ZG93biBCb2JcbiAgICAgICAgICAgIHN0YXJ0M3JkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lcklkID0gc3RvcERvY2tlckJvYigpO1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZS10by1vZmZsaW5lLW5vZGVAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICAvL2xvZ2luIHRvIGRBcHAgJiByZXF1ZXN0IERPSSBvbiBhbGljZSB2aWEgYm9iXG4gICAgICAgICAgICBpZiAobG9nKSB0ZXN0TG9nZ2luZygnbG9nIGludG8gYWxpY2UgYW5kIHJlcXVlc3QgRE9JJyk7XG4gICAgICAgICAgICBsZXQgZGF0YUxvZ2luQWxpY2UgPSBsb2dpbihkYXBwVXJsQWxpY2UsIGRBcHBMb2dpbiwgZmFsc2UpOyAvL2xvZyBpbnRvIGRBcHBcbiAgICAgICAgICAgIGxldCByZXN1bHREYXRhT3B0SW4gPSByZXF1ZXN0RE9JKGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgbnVsbCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5hbWVJZCA9IGdldE5hbWVJZE9mT3B0SW5Gcm9tUmF3VHgobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIHJlc3VsdERhdGFPcHRJbi5kYXRhLmlkLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChsb2cpIHRlc3RMb2dnaW5nKCdnb3QgbmFtZUlkJywgbmFtZUlkKTtcbiAgICAgICAgICAgIHZhciBzdGFydGVkQ29udGFpbmVySWQgPSBzdGFydERvY2tlckJvYihjb250YWluZXJJZCk7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZyhcInN0YXJ0ZWQgYm9iJ3Mgbm9kZSB3aXRoIGNvbnRhaW5lcklkXCIsIHN0YXJ0ZWRDb250YWluZXJJZCk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChzdGFydGVkQ29udGFpbmVySWQpLnRvLm5vdC5iZS5udWxsO1xuICAgICAgICAgICAgd2FpdFRvU3RhcnRDb250YWluZXIoc3RhcnRlZENvbnRhaW5lcklkKTtcblxuICAgICAgICAgICAgLy9nZW5lcmF0aW5nIGEgYmxvY2sgc28gdHJhbnNhY3Rpb24gZ2V0cyBjb25maXJtZWQgYW5kIGRlbGl2ZXJlZCB0byBib2IuXG4gICAgICAgICAgICBnZW5lcmF0ZXRvYWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgICAgICAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgICAgICAoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAocnVubmluZyAmJiArK2NvdW50ZXIgPCA1MCkgeyAvL3RyeWluZyA1MHggdG8gZ2V0IGVtYWlsIGZyb20gYm9icyBtYWlsYm94XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIGdsb2JhbC5hbGljZUFkZHJlc3MsIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0ZXAgMzogZ2V0dGluZyBlbWFpbCEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsyQ29uZmlybSA9IGZldGNoQ29uZmlybUxpbmtGcm9tUG9wM01haWwoXCJtYWlsXCIsIDExMCwgcmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgZGFwcFVybEJvYiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0ZXAgNDogY29uZmlybWluZyBsaW5rJywgbGluazJDb25maXJtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5rMkNvbmZpcm0gIT0gbnVsbCkgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlybUxpbmsobGluazJDb25maXJtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjb25maXJtZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCd0cnlpbmcgdG8gZ2V0IGVtYWlsIC0gc28gZmFyIG5vIHN1Y2Nlc3M6JywgY291bnRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMjAwMCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdlbmVyYXRldG9hZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBnbG9iYWwuYWxpY2VBZGRyZXNzLCAxLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB2ZXJpZnlET0koZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIHNlbmRlcl9tYWlsLCByZWNpcGllbnRfbWFpbCwgbmFtZUlkLCBsb2cpOyAvL25lZWQgdG8gZ2VuZXJhdGUgdHdvIGJsb2NrcyB0byBtYWtlIGJsb2NrIHZpc2libGUgb24gYWxpY2VcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnZW5kIG9mIGdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24gcmV0dXJuaW5nIG5hbWVJZCcsIG5hbWVJZCk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZXhlYygnc3VkbyBkb2NrZXIgc3RvcCAzcmRfbm9kZScsIChlLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0b3BwZWQgM3JkX25vZGU6Jywge3N0ZG91dDogc3Rkb3V0LCBzdGRlcnI6IHN0ZGVycn0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhlYygnc3VkbyBkb2NrZXIgcm0gM3JkX25vZGUnLCAoZSwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygncmVtb3ZlZCAzcmRfbm9kZTonLCB7c3Rkb3V0OiBzdGRvdXQsIHN0ZGVycjogc3RkZXJyfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2NvdWxkIG5vdCBzdG9wIDNyZF9ub2RlJywpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgLy9kb25lKCk7XG4gICAgICAgIH0pOyAvL2l0XG4gICAgfSk7XG59XG4iLCJpbXBvcnQge2NoYWl9IGZyb20gJ21ldGVvci9wcmFjdGljYWxtZXRlb3I6Y2hhaSc7XG5pbXBvcnQge1xuICAgIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzLCBmaW5kT3B0SW4sXG4gICAgbG9naW4sXG4gICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaSwgcmVxdWVzdERPSVxufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1kYXBwXCI7XG5pbXBvcnQge1xuICAgIHRlc3RMb2cgYXMgbG9nQmxvY2tjaGFpblxufSBmcm9tIFwibWV0ZW9yL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGlcIjtcbmltcG9ydCB7ZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iLCBnZW5lcmF0ZXRvYWRkcmVzcywgZ2V0TmV3QWRkcmVzc30gZnJvbSBcIi4vdGVzdC1hcGkvdGVzdC1hcGktb24tbm9kZVwiO1xuXG5jb25zdCBub2RlX3VybF9hbGljZSA9ICdodHRwOi8vMTcyLjIwLjAuNjoxODMzMi8nO1xuY29uc3QgcnBjQXV0aEFsaWNlID0gXCJhZG1pbjpnZW5lcmF0ZWQtcGFzc3dvcmRcIjtcbmNvbnN0IGRhcHBVcmxBbGljZSA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCI7XG5jb25zdCBkYXBwVXJsQm9iID0gXCJodHRwOi8vMTcyLjIwLjAuODo0MDAwXCI7XG5jb25zdCBkQXBwTG9naW4gPSB7XCJ1c2VybmFtZVwiOlwiYWRtaW5cIixcInBhc3N3b3JkXCI6XCJwYXNzd29yZFwifTtcbmNvbnN0IHJlY2lwaWVudF9wb3AzdXNlcm5hbWUgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjtcbmNvbnN0IHJlY2lwaWVudF9wb3AzcGFzc3dvcmQgPSBcImJvYlwiO1xuXG5pZihNZXRlb3IuaXNBcHBUZXN0KSB7XG4gICAgZGVzY3JpYmUoJzAzLWJhc2ljLWRvaS10ZXN0LTAzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGJlZm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL2xvZ0Jsb2NrY2hhaW4oXCJyZW1vdmluZyBPcHRJbnMsUmVjaXBpZW50cyxTZW5kZXJzXCIpO1xuICAgICAgICAgICAgZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iKCk7XG4gICAgICAgICAgICBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMyhcIm1haWxcIiwgMTEwLCByZWNpcGllbnRfcG9wM3VzZXJuYW1lLCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkLCB0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGJhc2ljIERvaWNoYWluIHdvcmtmbG93IHJ1bm5pbmcgNSB0aW1lcycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXQoMCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGFMb2dpbkFsaWNlID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIGZhbHNlKTsgLy9sb2cgaW50byBkQXBwXG4gICAgICAgICAgICBnbG9iYWwuYWxpY2VBZGRyZXNzID0gZ2V0TmV3QWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBmYWxzZSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDIwOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiOyAvL3BsZWFzZSB1c2UgdGhpcyBhcyBzdGFuZGFyZCB0byBub3QgY29uZnVzZSBwZW9wbGUhXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWwgPSBcImFsaWNlX1wiICsgaSArIFwiQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsLCB7J2NpdHknOiAnRWthdGVyaW5idXJnXycgKyBpfSwgXCJib2JAY2ktZG9pY2hhaW4ub3JnXCIsIFwiYm9iXCIsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRlc3QgaWYgYmFzaWMgRG9pY2hhaW4gd29ya2Zsb3cgcnVubmluZyAyMCB0aW1lcyB3aXRob3V0IGNvbmZpcm1hdGlvbiBhbmQgdmVyaWZpY2F0aW9uJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIHRoaXMudGltZW91dCgwKTtcbiAgICAgICAgICAgIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzKFwibWFpbFwiLCAxMTAsIHJlY2lwaWVudF9wb3AzdXNlcm5hbWUsIHJlY2lwaWVudF9wb3AzcGFzc3dvcmQsIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgZGF0YUxvZ2luQWxpY2UgPSBsb2dpbihkYXBwVXJsQWxpY2UsIGRBcHBMb2dpbiwgZmFsc2UpOyAvL2xvZyBpbnRvIGRBcHBcbiAgICAgICAgICAgIGdsb2JhbC5hbGljZUFkZHJlc3MgPSBnZXROZXdBZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGZhbHNlKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIHN0YW5kYXJkIHRvIG5vdCBjb25mdXNlIHBlb3BsZSFcbiAgICAgICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbCA9IFwiYWxpY2VfXCIgKyBpICsgXCJAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0RGF0YU9wdEluID0gcmVxdWVzdERPSShkYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgIGNoYWkuZXhwZWN0KGZpbmRPcHRJbihyZXN1bHREYXRhT3B0SW4uZGF0YS5pZCwgdHJ1ZSkpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiBiYXNpYyBEb2ljaGFpbiB3b3JrZmxvdyBydW5uaW5nIDEwMCB0aW1lcyB3aXRoIHdpdGhvdXQgY29uZmlybWF0aW9uIGFuZCB2ZXJpZmljYXRpb24nLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0KDApO1xuICAgICAgICAgICAgZGVsZXRlQWxsRW1haWxzRnJvbVBvcDMoXCJtYWlsXCIsIDExMCwgcmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBkYXRhTG9naW5BbGljZSA9IGxvZ2luKGRhcHBVcmxBbGljZSwgZEFwcExvZ2luLCBmYWxzZSk7IC8vbG9nIGludG8gZEFwcFxuICAgICAgICAgICAgZ2xvYmFsLmFsaWNlQWRkcmVzcyA9IGdldE5ld0FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZmFsc2UpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIHN0YW5kYXJkIHRvIG5vdCBjb25mdXNlIHBlb3BsZSFcbiAgICAgICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbCA9IFwiYWxpY2VfXCIgKyBpICsgXCJAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0RGF0YU9wdEluID0gcmVxdWVzdERPSShkYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgIGNoYWkuZXhwZWN0KGZpbmRPcHRJbihyZXN1bHREYXRhT3B0SW4uZGF0YS5pZCwgdHJ1ZSkpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKGkgJSAxMDAgPT09IDApIGdlbmVyYXRldG9hZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGdsb2JhbC5hbGljZUFkZHJlc3MsIDEsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0iLCJpZihNZXRlb3IuaXNBcHBUZXN0IHx8IE1ldGVvci5pc1Rlc3QpIHtcblxuICAgIGRlc2NyaWJlKCdzaW1wbGUtc2VsZW5pdW0tdGVzdCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLnRpbWVvdXQoMTAwMDApO1xuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB9KTtcblxuXG4gICAgfSk7XG59XG4iLCJpbXBvcnQge2NoYWl9IGZyb20gJ21ldGVvci9wcmFjdGljYWxtZXRlb3I6Y2hhaSc7XG5pbXBvcnQge1xuICAgIHRlc3RMb2cgYXMgbG9nQmxvY2tjaGFpblxufSBmcm9tIFwibWV0ZW9yL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGlcIjtcblxuaW1wb3J0IHtkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IsIGdldEJhbGFuY2UsIGluaXRCbG9ja2NoYWlufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1ub2RlXCI7XG5pbXBvcnQge2xvZ2luLCByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pfSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1kYXBwXCI7XG5jb25zdCBub2RlX3VybF9hbGljZSA9ICdodHRwOi8vMTcyLjIwLjAuNjoxODMzMi8nO1xuY29uc3Qgbm9kZV91cmxfYm9iID0gICAnaHR0cDovLzE3Mi4yMC4wLjc6MTgzMzIvJztcbmNvbnN0IHJwY0F1dGggPSBcImFkbWluOmdlbmVyYXRlZC1wYXNzd29yZFwiO1xuY29uc3QgcHJpdktleUJvYiA9IFwiY1AzRWlna3pzV3V5S0VteGs4Y0M2cVhZYjRaandVbzV2enZacEFQbURRODNSQ2dYUXJ1alwiO1xuY29uc3QgbG9nID0gdHJ1ZTtcblxuXG5jb25zdCBycGNBdXRoQWxpY2UgPSBcImFkbWluOmdlbmVyYXRlZC1wYXNzd29yZFwiO1xuY29uc3QgZGFwcFVybEFsaWNlID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIjtcbmNvbnN0IGRhcHBVcmxCb2IgPSBcImh0dHA6Ly8xNzIuMjAuMC44OjQwMDBcIjtcbmNvbnN0IGRBcHBMb2dpbiA9IHtcInVzZXJuYW1lXCI6XCJhZG1pblwiLFwicGFzc3dvcmRcIjpcInBhc3N3b3JkXCJ9O1xuXG5cbmlmKE1ldGVvci5pc1Rlc3QgfHwgTWV0ZW9yLmlzQXBwVGVzdCkge1xuXG4gICAgZGVzY3JpYmUoJ2Jhc2ljLWRvaS10ZXN0LW5pY28nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudGltZW91dCg2MDAwMDApO1xuXG4gICAgICAgIGJlZm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwicmVtb3ZpbmcgT3B0SW5zLFJlY2lwaWVudHMsU2VuZGVyc1wiKTtcbiAgICAgICAgICAgIGRlbGV0ZU9wdEluc0Zyb21BbGljZUFuZEJvYigpO1xuICAgICAgICB9KTtcblxuICAgICAgICB4aXQoJ3Nob3VsZCBjcmVhdGUgYSBSZWdUZXN0IERvaWNoYWluIHdpdGggYWxpY2UgYW5kIGJvYiBhbmQgc29tZSBEb2kgLSBjb2lucycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGluaXRCbG9ja2NoYWluKG5vZGVfdXJsX2FsaWNlLG5vZGVfdXJsX2JvYixycGNBdXRoLHByaXZLZXlCb2IsdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBhbGljZUJhbGFuY2UgPSBnZXRCYWxhbmNlKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBsb2cpO1xuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNBYm92ZShhbGljZUJhbGFuY2UsIDAsICdubyBmdW5kaW5nISAnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgeGl0KCdzaG91bGQgdGVzdCBpZiBiYXNpYyBEb2ljaGFpbiB3b3JrZmxvdyBpcyB3b3JraW5nIHdpdGggb3B0aW9uYWwgZGF0YScsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYm9iKzFAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIHN0YW5kYXJkIHRvIG5vdCBjb25mdXNlIHBlb3BsZSFcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZUBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFMb2dpbkFsaWNlID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIGZhbHNlKTsgLy9sb2cgaW50byBkQXBwXG4gICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIGRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgeydjaXR5JzogJ0VrYXRlcmluYnVyZyd9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgeGRlc2NyaWJlKCdiYXNpYy1kb2ktdGVzdC1uaWNvJywgZnVuY3Rpb24gKCkge1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZm9ybWF0aW9uIHJlZ2FyZGluZyB0byBldmVudCBsb29wIG5vZGUuanNcbiAgICAgICAgICogLSBodHRwczovL25vZGVqcy5vcmcvZW4vZG9jcy9ndWlkZXMvZXZlbnQtbG9vcC10aW1lcnMtYW5kLW5leHR0aWNrL1xuICAgICAgICAgKlxuICAgICAgICAgKiBQcm9taXNlczpcbiAgICAgICAgICogLSBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3ByaW1lcnMvcHJvbWlzZXNcbiAgICAgICAgICpcbiAgICAgICAgICogUHJvbWlzZSBsb29wcyBhbmQgYXN5bmMgd2FpdFxuICAgICAgICAgKiAtIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQwMzI4OTMyL2phdmFzY3JpcHQtZXM2LXByb21pc2UtZm9yLWxvb3BcbiAgICAgICAgICpcbiAgICAgICAgICogQXN5bmNocm9ub3VzIGxvb3BzIHdpdGggbW9jaGE6XG4gICAgICAgICAqIC0gaHR0cHM6Ly93aGl0ZmluLmlvL2FzeW5jaHJvbm91cy10ZXN0LWxvb3BzLXdpdGgtbW9jaGEvXG4gICAgICAgICAqL1xuICAgICAgICAvKiAgaXQoJ3Nob3VsZCB0ZXN0IGEgdGltZW91dCB3aXRoIGEgcHJvbWlzZScsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJ0cnV5aW5nIGEgcHJvbWlzZVwiKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbWVvdXQgPSBNYXRoLnJhbmRvbSgpICogMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Byb21pc2U6JytpKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgLy8gVE9ETzogQ2hhaW4gdGhpcyBwcm9taXNlIHRvIHRoZSBwcmV2aW91cyBvbmUgKG1heWJlIHdpdGhvdXQgaGF2aW5nIGl0IHJ1bm5pbmc/KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGl0KCdzaG91bGQgcnVuIGEgbG9vcCB3aXRoIGFzeW5jIHdhaXQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwidHJ5aW5nIGFzeWNuIHdhaXRcIik7XG4gICAgICAgICAgICAgIChhc3luYyBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIE1hdGgucmFuZG9tKCkgKiAxMDAwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FzeW5jIHdhaXQnK2kpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZG9uZSgpXG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB4aXQoJ3Nob3VsZCBzYWZlbHkgc3RvcCBhbmQgc3RhcnQgYm9icyBkb2ljaGFpbiBub2RlIGNvbnRhaW5lcicsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAgIHZhciBjb250YWluZXJJZCA9IHN0b3BEb2NrZXJCb2IoKTtcblxuICAgICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwic3RvcHBlZCBib2IncyBub2RlIHdpdGggY29udGFpbmVySWRcIixjb250YWluZXJJZCk7XG4gICAgICAgICAgICAgIGNoYWkuZXhwZWN0KGNvbnRhaW5lcklkKS50by5ub3QuYmUubnVsbDtcblxuICAgICAgICAgICAgICB2YXIgc3RhcnRlZENvbnRhaW5lcklkID0gc3RhcnREb2NrZXJCb2IoY29udGFpbmVySWQpO1xuICAgICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwic3RhcnRlZCBib2IncyBub2RlIHdpdGggY29udGFpbmVySWRcIixzdGFydGVkQ29udGFpbmVySWQpO1xuICAgICAgICAgICAgICBjaGFpLmV4cGVjdChzdGFydGVkQ29udGFpbmVySWQpLnRvLm5vdC5iZS5udWxsO1xuXG4gICAgICAgICAgICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgd2hpbGUocnVubmluZyl7XG4gICAgICAgICAgICAgICAgICBydW5BbmRXYWl0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1c0RvY2tlciA9IEpTT04ucGFyc2UoZ2V0RG9ja2VyU3RhdHVzKGNvbnRhaW5lcklkKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJnZXRpbmZvXCIsc3RhdHVzRG9ja2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInZlcnNpb246XCIrc3RhdHVzRG9ja2VyLnZlcnNpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwiYmFsYW5jZTpcIitzdGF0dXNEb2NrZXIuYmFsYW5jZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJiYWxhbmNlOlwiK3N0YXR1c0RvY2tlci5jb25uZWN0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN0YXR1c0RvY2tlci5jb25uZWN0aW9ucz09PTApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9pY2hhaW5BZGROb2RlKGNvbnRhaW5lcklkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIGNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInN0YXR1c0RvY2tlciBwcm9ibGVtOlwiLGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9LDIpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgIH0pOyovXG4gICAgfSk7XG59IiwiaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuaWYoTWV0ZW9yLmlzVGVzdCkge1xuXG4gICAgZGVzY3JpYmUoJ2Jhc2ljLWRvaS10ZXN0LWZsbycsIGZ1bmN0aW9uICgpIHtcbiAgICB9KTtcbn1cblxuXG4iXX0=
