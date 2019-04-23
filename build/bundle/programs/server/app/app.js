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
  clickConfirmLink: () => clickConfirmLink,
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
let HTTP;
module.link("meteor/http", {
  HTTP(v) {
    HTTP = v;
  }

}, 1);
let URL;
module.link("url", {
  URL(v) {
    URL = v;
  }

}, 2);
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 3);
let quotedPrintableDecode;
module.link("emailjs-mime-codec", {
  quotedPrintableDecode(v) {
    quotedPrintableDecode = v;
  }

}, 4);
let OptInsCollection, Recipients, getHttpGETdata, getHttpPOST, getUrl, testLogging;
module.link("meteor/doichain:doichain-meteor-api", {
  OptInsCollection(v) {
    OptInsCollection = v;
  },

  RecipientsCollection(v) {
    Recipients = v;
  },

  httpGETdata(v) {
    getHttpGETdata = v;
  },

  httpPOST(v) {
    getHttpPOST = v;
  },

  getServerUrl(v) {
    getUrl = v;
  },

  testLog(v) {
    testLogging = v;
  }

}, 5);
let generatetoaddress;
module.link("./test-api-on-node", {
  generatetoaddress(v) {
    generatetoaddress = v;
  }

}, 6);
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
  const syncFunc = Meteor.wrapAsync(request_DOI);
  return syncFunc(url, auth, recipient_mail, sender_mail, data, log);
}

function request_DOI(url, auth, recipient_mail, sender_mail, data, log, callback) {
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

  try {
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

    callback(null, resultOptIn.data);
  } catch (e) {
    callback(e, null);
  }
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

function fetchConfirmLinkFromPop3Mail(hostname, port, username, password, alicedapp_url, log, mail_test_string = "") {
  const syncFunc = Meteor.wrapAsync(fetch_confirm_link_from_pop3_mail);
  return syncFunc(hostname, port, username, password, alicedapp_url, log, mail_test_string);
}

function fetch_confirm_link_from_pop3_mail(hostname, port, username, password, alicedapp_url, log, mail_test_string, callback) {
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

                  let linkdata = null;
                  chai.expect(html.indexOf(alicedapp_url), "dappUrl not found in email").to.not.equal(-1);
                  linkdata = html.substring(html.indexOf(alicedapp_url)).match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*[a-z,A-Z,0-9]{16,}/)[0];
                  chai.expect(linkdata, "no linkdata found").to.not.be.null;
                  if (mail_test_string) chai.expect(html.indexOf(mail_test_string), 'teststring: "' + mail_test_string + '" not found').to.not.equal(-1);
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

function clickConfirmLink(confirmLink) {
  const syncFunc = Meteor.wrapAsync(confirm_link);
  return syncFunc(confirmLink);
}

function confirm_link(confirmlink, callback) {
  testLogging("clickable link:", confirmlink);
  const doiConfirmlinkRedir = HTTP.get(confirmlink, {
    followRedirects: false
  });
  let redirLocation = doiConfirmlinkRedir.headers.location;

  if (!redirLocation.startsWith("http://") && !redirLocation.startsWith("https://")) {
    redirLocation = getUrl() + "templates/pages/" + redirLocation;
    testLogging('redirectUrl:', redirLocation);
  }

  const doiConfirmlinkResult = HTTP.get(redirLocation);
  testLogging("Response location:", redirLocation);

  try {
    if (doiConfirmlinkResult.content.indexOf("Hello world!") == -1) {
      //    chai.expect(doiConfirmlinkResult.content.indexOf("ANMELDUNG ERFOLGREICH")).to.not.equal(-1);
      chai.expect(doiConfirmlinkResult.content).to.have.string('ANMELDUNG ERFOLGREICH');
      chai.expect(doiConfirmlinkResult.content).to.have.string('Vielen Dank für Ihre Anmeldung');
      chai.expect(doiConfirmlinkResult.content).to.have.string('Ihre Anmeldung war erfolgreich.');
    } else {
      chai.expect(doiConfirmlinkResult.content.indexOf("Hello world!")).to.not.equal(-1);
    }

    chai.assert.equal(200, doiConfirmlinkResult.statusCode);
    callback(null, {
      location: redirLocation
    });
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
    "redirect": "thank-you-de.html",
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

function requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, optionalData, recipient_pop3username, recipient_pop3password, log, mail_test_string = "") {
  const syncFunc = Meteor.wrapAsync(request_confirm_verify_basic_doi);
  return syncFunc(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, optionalData, recipient_pop3username, recipient_pop3password, log, mail_test_string);
}

function request_confirm_verify_basic_doi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail_in, optionalData, recipient_pop3username, recipient_pop3password, log, mail_test_string, callback) {
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
    let lastError = null;
    confirmedLink = Promise.await(function loop() {
      return Promise.asyncApply(() => {
        while (running && ++counter < 50) {
          //trying 50x to get email from bobs mailbox
          try {
            testLogging('step 3: getting email from hostname!', os.hostname());
            const link2Confirm = fetchConfirmLinkFromPop3Mail(os.hostname() == 'regtest' ? 'mail' : 'localhost', 110, recipient_pop3username, recipient_pop3password, dappUrlBob, false);
            testLogging('step 4: confirming link', link2Confirm);

            if (link2Confirm != undefined) {
              running = false;
              confirmedLink = link2Confirm;
              testLogging('confirmed');
              return link2Confirm;
            }
          } catch (ex) {
            lastError = ex;
            testLogging('trying to get email - so far no success:', ex);
            testLogging('trying to get email - so far no success:', counter);
            Promise.await(new Promise(resolve => setTimeout(resolve, 3000)));
          }
        }
      });
    }());
    /*  if(os.hostname()!=='regtest'){ //if this is a selenium test from outside docker - don't verify DOI here for simplicity
          testLogging('returning to test without DOI-verification while doing selenium outside docker');
          callback(null, {status: "DOI confirmed"});
          // return;
      }else{*/

    let nameId = null;

    try {
      if (counter >= 50) {
        throw lastError;
      }

      testLogging('step 4: confirming link', confirmedLink); //Checking the redirect-parameters after confirming link

      let redirLink = clickConfirmLink(confirmedLink);

      if (optionalData && optionalData.redirectParam) {
        testLogging('step 4.5: redirectLink after confirmation in case of optional data', {
          optionalData: optionalData,
          redirLink: redirLink
        });
        testLogging('redirLink.location:', redirLink.location);
        let redirUrl = new URL(redirLink.location);
        testLogging("Checking for redirect params:", optionalData.redirectParam);
        Object.keys(optionalData.redirectParam).forEach(function (key) {
          chai.assert.isTrue(redirUrl.searchParams.has(key));
          chai.assert.equal(redirUrl.searchParams.get(key), "" + optionalData.redirectParam[key]);
        });
      }

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

      testLogging('after verification'); //confirmLink(confirmedLink);

      callback(null, {
        optIn: resultDataOptIn,
        nameId: nameId,
        confirmLink: confirmedLink
      });
    } catch (error) {
      callback(error, {
        optIn: resultDataOptIn,
        nameId: nameId
      });
    } //}

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

function initBlockchain(node_url_alice, node_url_bob, rpcAuth, privKeyAlice, privKeyBob, log) {
  //connect nodes (alice & bob) and generate DOI (only if not connected)
  testLogging("importing private key of Alice:" + privKeyAlice);
  importPrivKey(node_url_alice, rpcAuth, privKeyAlice, true, log);
  testLogging("importing private key of Bob:" + privKeyBob);
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
  exec(sudo + 'docker ps --filter "name=' + name + '" -q', (e, stdout, stderr) => {
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
global.inside_docker = false;
const log = true;

const dns = require('dns');

dns.setServers(['127.0.0.1']); //we use our own dns in order to resolve the ci-doichain.org test domain including its TXT entry

global.node_url_alice = 'http://172.20.0.6:18332/';
if (!global.inside_docker) global.node_url_alice = 'http://localhost:18543/';
global.node_url_bob = 'http://172.20.0.7:18332/';
if (!global.inside_docker) global.node_url_bob = 'http://localhost:18544/';
global.rpcAuthAlice = "admin:generated-password";
global.rpcAuth = "admin:generated-password";
global.privKeyAlice = "cNEuvnaPVkW7Xp3JS49k9aSqMBe4LSyws3aq1KvCU1utSDLtT9Dj";
global.privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj";
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
      initBlockchain(global.node_url_alice, global.node_url_bob, global.rpcAuth, global.privKeyAlice, global.privKeyBob, true);
      const aliceBalance = getBalance(global.node_url_alice, global.rpcAuth, log);
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
let login, createUser, findUser, exportOptIns, requestConfirmVerifyBasicDoi, resetUsers, updateUser, deleteAllEmailsFromPop3, confirmLink, clickConfirmLink;
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
  },

  confirmLink(v) {
    confirmLink = v;
  },

  clickConfirmLink(v) {
    clickConfirmLink = v;
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
      const adLog = login(global.dappUrlAlice, global.dAppLogin, false);
      updateUser(global.dappUrlAlice, adLog, adLog.userId, {}, false);
    });
    afterEach(function () {
      const adLog = login(global.dappUrlAlice, global.dAppLogin, false);
      updateUser(global.dappUrlAlice, adLog, adLog.userId, {}, false);
    });
    it('should test if basic Doichain workflow is working with optional data', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail = "alice@ci-doichain.org";
      const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp

      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, dataLoginAlice, global.dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
      done();
    });
    it('should test if basic Doichain workflow is working without optional data', function (done) {
      const recipient_mail = "alice@ci-doichain.org"; //please use this as an alernative when above standard is not possible

      const sender_mail = "bob@ci-doichain.org"; //login to dApp & request DOI on alice via bob

      const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp

      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, dataLoginAlice, global.dappUrlBob, recipient_mail, sender_mail, null, "alice@ci-doichain.org", "alice", true);
      done();
    });
    it('should create two more users', function (done) {
      resetUsers();
      const logAdmin = login(global.dappUrlAlice, global.dAppLogin, false);
      let userA = createUser(global.dappUrlAlice, logAdmin, "alice-a", templateUrlA, true);
      chai.expect(findUser(userA)).to.not.be.undefined;
      let userB = createUser(global.dappUrlAlice, logAdmin, "alice-b", templateUrlB, true);
      chai.expect(findUser(userB)).to.not.be.undefined;
      done();
    });
    it('should test if Doichain workflow is using different templates for different users', function (done) {
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
      const recipient_mail = "bob@ci-doichain.org"; //

      const sender_mail_alice_a = "alice-export_a@ci-doichain.org";
      const sender_mail_alice_b = "alice-export_b@ci-doichain.org";
      const logAdmin = login(global.dappUrlAlice, global.dAppLogin, true);
      createUser(global.dappUrlAlice, logAdmin, "basicuser", templateUrlA, true);
      const logBasic = login(global.dappUrlAlice, {
        "username": "basicuser",
        "password": "password"
      }, true);
      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, logBasic, global.dappUrlBob, recipient_mail, sender_mail_alice_a, {
        'city': 'München'
      }, "bob@ci-doichain.org", "bob", true);
      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, logAdmin, global.dappUrlBob, recipient_mail, sender_mail_alice_b, {
        'city': 'München'
      }, "bob@ci-doichain.org", "bob", true);
      const exportedOptIns = exportOptIns(global.dappUrlAlice, logAdmin, true);
      chai.expect(exportedOptIns).to.not.be.undefined;
      console.log(exportedOptIns);
      chai.expect(exportedOptIns[0]).to.not.be.undefined;
      chai.expect(exportedOptIns[0].RecipientEmail.email).to.be.equal(recipient_mail);
      const exportedOptInsA = exportOptIns(global.dappUrlAlice, logBasic, true);
      exportedOptInsA.forEach(element => {
        chai.expect(element.ownerId).to.be.equal(logBasic.userId);
      }); //chai.expect(findOptIn(resultDataOptIn._id)).to.not.be.undefined;

      done();
    });
    it('should test if admin can update user profiles', function () {
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
    it('should test if user can update own profile', function () {
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
    it('should test if coDoi works', function () {
      const coDoiList = ["aliceCo1@doichain-ci.com", "aliceCo2@doichain-ci.com", "aliceCo3@doichain-ci.com"];
      const recipient_mail = "bob@ci-doichain.org";
      const sender_mail = coDoiList;
      let logAdmin = login(global.dappUrlAlice, global.dAppLogin, true);
      const coDois = requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, logAdmin, global.dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
    });
    it('should find updated Data in email', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail = "alice-update@ci-doichain.org";
      const adLog = login(global.dappUrlAlice, global.dAppLogin, false);
      updateUser(global.dappUrlAlice, adLog, adLog.userId, {
        "subject": "updateTest",
        "templateURL": templateUrlB
      });
      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, adLog, global.dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true, "updateTest");
      done();
    });
    it('should use URL params', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail_a = "alice-param-a@ci-doichain.org";
      const sender_mail_b = "alice-param-b@ci-doichain.org";
      const adLog = login(global.dappUrlAlice, global.dAppLogin, false);
      updateUser(global.dappUrlAlice, adLog, adLog.userId, {
        "subject": "paramTest",
        "redirect": "https://www.doichain.org",
        "templateURL": global.dappUrlAlice + "/api/v1/template"
      }, true);
      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, adLog, global.dappUrlBob, recipient_mail, sender_mail_a, {
        'redirectParam': {
          'p': 1
        },
        'templateParam': {
          'lang': 'en'
        }
      }, "bob@ci-doichain.org", "bob", true, "your free registation");
      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, adLog, global.dappUrlBob, recipient_mail, sender_mail_b, {
        'redirectParam': {
          'p': 1
        },
        'templateParam': {
          'lang': 'de'
        }
      }, "bob@ci-doichain.org", "bob", true, "Ihre kostenlose Anmeldung");
      updateUser(global.dappUrlAlice, adLog, adLog.userId, {}, true);
      done();
    });
    it('should use the text version', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail_a = "alice-text@ci-doichain.org";
      const adLog = login(global.dappUrlAlice, global.dAppLogin, false);
      updateUser(global.dappUrlAlice, adLog, adLog.userId, {
        "subject": "textTest",
        "redirect": "",
        "templateURL": templateUrlA.replace("html", "txt")
      }, true);
      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, adLog, global.dappUrlBob, recipient_mail, sender_mail_a, null, "bob@ci-doichain.org", "bob", true, "your free registation");
      updateUser(global.dappUrlAlice, adLog, adLog.userId, {}, true);
      done();
    });
    it('should use the json/multipart version', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail_a = "alice-param-multi@ci-doichain.org";
      const adLog = login(global.dappUrlAlice, global.dAppLogin, false);
      updateUser(global.dappUrlAlice, adLog, adLog.userId, {
        "subject": "multiTest",
        "redirect": "",
        "templateURL": templateUrlA.replace("html", "json")
      }, true);
      requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, adLog, global.dappUrlBob, recipient_mail, sender_mail_a, null, "bob@ci-doichain.org", "bob", true, "your free registation");
      updateUser(global.dappUrlAlice, adLog, adLog.userId, {}, true);
      done();
    });
    it('should redirect if confirmation-link is clicked again', function () {
      for (let index = 0; index < 3; index++) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

        const sender_mail = "alice_" + index + "@ci-doichain.org";
        const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp

        updateUser(global.dappUrlAlice, dataLoginAlice, dataLoginAlice.userId, {
          "subject": "multiclickTest"
        }, true);
        let returnedData = requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, dataLoginAlice, global.dappUrlBob, recipient_mail, sender_mail, {
          'city': 'Ekaterinburg'
        }, "bob@ci-doichain.org", "bob", true);
        logBlockchain('double link click test returnedData:', returnedData);
        chai.assert.notEqual(null, clickConfirmLink(returnedData.confirmLink).location);
      }
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
let deleteAllEmailsFromPop3, fetchConfirmLinkFromPop3Mail, getNameIdOfOptInFromRawTx, login, requestDOI, verifyDOI, clickConfirmLink;
module.link("./test-api/test-api-on-dapp", {
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
  },

  clickConfirmLink(v) {
    clickConfirmLink = v;
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

const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";
const rpcAuth = "admin:generated-password";
const dAppLogin = {
  "username": "admin",
  "password": "password"
};
const log = true;

if (Meteor.isAppTest) {
  describe('02-basic-doi-test-with-offline-node-02', function () {
    before(function () {
      deleteOptInsFromAliceAndBob();
      deleteAllEmailsFromPop3(global.inside_docker ? "mail" : "localhost", 110, recipient_pop3username, recipient_pop3password, true);
      exec((global.inside_docker ? 'sudo' : '') + ' docker rm 3rd_node', (e, stdout2, stderr2) => {
        testLogging('deleted 3rd_node:', {
          stdout: stdout2,
          stderr: stderr2
        });
      });

      try {
        exec((global.inside_docker ? 'sudo' : '') + ' docker stop 3rd_node', (e, stdout, stderr) => {
          testLogging('stopped 3rd_node:', {
            stdout: stdout,
            stderr: stderr
          });
          exec((global.inside_docker ? 'sudo' : '') + ' docker rm 3rd_node', (e, stdout, stderr) => {
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
    before(function () {
      try {
        exec((global.inside_docker ? 'sudo' : '') + ' docker stop 3rd_node', (e, stdout, stderr) => {
          testLogging('stopped 3rd_node:', {
            stdout: stdout,
            stderr: stderr
          });
          exec((global.inside_docker ? 'sudo' : '') + ' docker rm 3rd_node', (e, stdout, stderr) => {
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
      global.aliceAddress = getNewAddress(global.node_url_alice, rpcAuth, false); //start another 3rd node before shutdown Bob

      start3rdNode();
      var containerId = stopDockerBob();
      const recipient_mail = "bob@ci-doichain.org";
      const sender_mail = "alice-to-offline-node@ci-doichain.org"; //login to dApp & request DOI on alice via bob

      if (log) testLogging('log into alice and request DOI');
      let dataLoginAlice = login(global.dappUrlAlice, dAppLogin, false); //log into dApp

      let resultDataOptIn = requestDOI(global.dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
      const nameId = getNameIdOfOptInFromRawTx(global.node_url_alice, rpcAuth, resultDataOptIn.data.id, true);
      if (log) testLogging('got nameId', nameId);
      var startedContainerId = startDockerBob(containerId);
      testLogging("started bob's node with containerId", startedContainerId);
      chai.expect(startedContainerId).to.not.be.null;
      waitToStartContainer(startedContainerId); //generating a block so transaction gets confirmed and delivered to bob.

      generatetoaddress(global.node_url_alice, rpcAuth, global.aliceAddress, 1, true);
      let running = true;
      let counter = 0;

      (function loop() {
        return Promise.asyncApply(() => {
          while (running && ++counter < 50) {
            //trying 50x to get email from bobs mailbox
            try {
              //  generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, true);
              testLogging('step 3: getting email!');
              const link2Confirm = fetchConfirmLinkFromPop3Mail(global.inside_docker ? "mail" : "localhost", 110, recipient_pop3username, recipient_pop3password, dappUrlBob, false);
              testLogging('step 4: confirming link', link2Confirm);
              if (link2Confirm != null) running = false;
              clickConfirmLink(link2Confirm);
              testLogging('confirmed');
            } catch (ex) {
              testLogging('trying to get email - so far no success:', counter);
              Promise.await(new Promise(resolve => setTimeout(resolve, 2000)));
            }
          }
        });
      })();

      generatetoaddress(global.node_url_alice, rpcAuth, global.aliceAddress, 1, true);
      verifyDOI(global.dappUrlAlice, dataLoginAlice, global.node_url_alice, rpcAuth, sender_mail, recipient_mail, nameId, log); //need to generate two blocks to make block visible on alice

      testLogging('end of getNameIdOfRawTransaction returning nameId', nameId);

      try {
        exec((global.inside_docker ? 'sudo' : '') + ' docker stop 3rd_node', (e, stdout, stderr) => {
          testLogging('stopped 3rd_node:', {
            stdout: stdout,
            stderr: stderr
          });
          exec((global.inside_docker ? 'sudo' : '') + ' docker rm 3rd_node', (e, stdout, stderr) => {
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
const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";

if (Meteor.isAppTest) {
  describe('03-basic-doi-test-03', function () {
    this.timeout(0);
    before(function () {
      logBlockchain("removing OptIns,Recipients,Senders"); //deleteOptInsFromAliceAndBob();
      //deleteAllEmailsFromPop3(global.inside_docker?"mail":"localhost", 110, recipient_pop3username, recipient_pop3password, true);
    });
    it('should test if basic Doichain workflow running 5 times', function (done) {
      this.timeout(0);
      const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp

      global.aliceAddress = getNewAddress(global.node_url_alice, global.rpcAuthAlice, false);

      for (let i = 0; i < 5; i++) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

        const sender_mail = "alice_" + i + "@ci-doichain.org";
        requestConfirmVerifyBasicDoi(global.node_url_alice, global.rpcAuthAlice, global.dappUrlAlice, dataLoginAlice, global.dappUrlBob, recipient_mail, sender_mail, {
          'city': 'Ekaterinburg_' + i
        }, "bob@ci-doichain.org", "bob", true);
      }

      done();
    });
    it('should test if basic Doichain workflow runs 20 times without confirmation, verification and new block', function (done) {
      this.timeout(0);
      deleteAllEmailsFromPop3(global.inside_docker ? "mail" : "localhost", 110, recipient_pop3username, recipient_pop3password, true);
      const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp

      global.aliceAddress = getNewAddress(global.node_url_alice, global.rpcAuthAlice, false);

      for (let i = 0; i < 20; i++) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

        const sender_mail = "alice_" + i + "@ci-doichain.org";
        const resultDataOptIn = requestDOI(global.dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
        chai.expect(findOptIn(resultDataOptIn.data.id, true)).to.not.be.undefined;
      }

      done();
    });
    it('should test if basic Doichain workflow runs 100 times without confirmation and verification', function (done) {
      this.timeout(0);
      deleteAllEmailsFromPop3(global.inside_docker ? "mail" : "localhost", 110, recipient_pop3username, recipient_pop3password, true);
      const dataLoginAlice = login(global.dappUrlAlice, global.dAppLogin, false); //log into dApp

      global.aliceAddress = getNewAddress(global.node_url_alice, global.rpcAuthAlice, false);

      for (let i = 0; i < 100; i++) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

        const sender_mail = "alice_" + i + "@ci-doichain.org";
        const resultDataOptIn = requestDOI(global.dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
        chai.expect(findOptIn(resultDataOptIn.data.id, true)).to.not.be.undefined;
        if (i % 100 === 0) generatetoaddress(global.node_url_alice, global.rpcAuthAlice, global.aliceAddress, 1, true);
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
  xdescribe('simple-selenium-test', function () {
    this.timeout(10000);
    beforeEach(function () {});
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"basic-doi-test-nico.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/basic-doi-test-nico.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// import {chai} from 'meteor/practicalmeteor:chai';
// import {
//     testLog as logBlockchain
// } from "meteor/doichain:doichain-meteor-api";
//
// import {deleteOptInsFromAliceAndBob, getBalance, initBlockchain} from "./test-api/test-api-on-node";
// import {login, requestConfirmVerifyBasicDoi} from "./test-api/test-api-on-dapp";
// const node_url_alice = 'http://172.20.0.6:18332/';
// const node_url_bob =   'http://172.20.0.7:18332/';
// const rpcAuth = "admin:generated-password";
// const privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj";
// const log = true;
//
//
// const rpcAuthAlice = "admin:generated-password";
// const dappUrlAlice = "http://localhost:3000";
// const dappUrlBob = "http://172.20.0.8:4000";
// const dAppLogin = {"username":"admin","password":"password"};
//
//
// if(Meteor.isTest || Meteor.isAppTest) {
//
//     xdescribe('basic-doi-test-nico', function () {
//         this.timeout(600000);
//
//         before(function () {
//             logBlockchain("removing OptIns,Recipients,Senders");
//             deleteOptInsFromAliceAndBob();
//         });
//
//         xit('should create a RegTest Doichain with alice and bob and some Doi - coins', function () {
//             initBlockchain(node_url_alice,node_url_bob,rpcAuth,privKeyBob,true);
//             const aliceBalance = getBalance(node_url_alice, rpcAuth, log);
//             chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
//         });
//
//         xit('should test if basic Doichain workflow is working with optional data', function (done) {
//             const recipient_mail = "bob+1@ci-doichain.org"; //please use this as standard to not confuse people!
//             const sender_mail = "alice@ci-doichain.org";
//             const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp
//             requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, {'city': 'Ekaterinburg'}, "bob@ci-doichain.org", "bob", true);
//             done();
//         });
//     });
//
//     xdescribe('basic-doi-test-nico', function () {
//
//
//         /**
//          * Information regarding to event loop node.js
//          * - https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
//          *
//          * Promises:
//          * - https://developers.google.com/web/fundamentals/primers/promises
//          *
//          * Promise loops and async wait
//          * - https://stackoverflow.com/questions/40328932/javascript-es6-promise-for-loop
//          *
//          * Asynchronous loops with mocha:
//          * - https://whitfin.io/asynchronous-test-loops-with-mocha/
//          */
//         /*  it('should test a timeout with a promise', function (done) {
//               logBlockchain("truying a promise");
//               for (let i = 0; i < 10; i++) {
//                   const promise = new Promise((resolve, reject) => {
//                       const timeout = Math.random() * 1000;
//                       setTimeout(() => {
//                           console.log('promise:'+i);
//                       }, timeout);
//                   });
//                   // TODO: Chain this promise to the previous one (maybe without having it running?)
//               }
//               done();
//           });
//
//           it('should run a loop with async wait', function (done) {
//               logBlockchain("trying asycn wait");
//               (async function loop() {
//                   for (let i = 0; i < 10; i++) {
//                       await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
//                       console.log('async wait'+i);
//                   }
//                   done()
//               })();
//           });
//
//           xit('should safely stop and start bobs doichain node container', function (done) {
//               var containerId = stopDockerBob();
//
//               logBlockchain("stopped bob's node with containerId",containerId);
//               chai.expect(containerId).to.not.be.null;
//
//               var startedContainerId = startDockerBob(containerId);
//               logBlockchain("started bob's node with containerId",startedContainerId);
//               chai.expect(startedContainerId).to.not.be.null;
//
//               let running = true;
//               while(running){
//                   runAndWait(function () {
//                       try{
//                           const statusDocker = JSON.parse(getDockerStatus(containerId));
//                           logBlockchain("getinfo",statusDocker);
//                           logBlockchain("version:"+statusDocker.version);
//                           logBlockchain("balance:"+statusDocker.balance);
//                           logBlockchain("balance:"+statusDocker.connections);
//                           if(statusDocker.connections===0){
//                               doichainAddNode(containerId);
//                           }
//                           running = false;
//                       }
//                       catch(error){
//                           logBlockchain("statusDocker problem:",error);
//                       }
//                   },2);
//               }
//
//               done();
//           });*/
//     });
// }
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
  xdescribe('basic-doi-test-flo', function () {});
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"publications":{"user.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/user.js                                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvdGVzdC1hcGkvdGVzdC1hcGktb24tZGFwcC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvdGVzdC1hcGkvdGVzdC1hcGktb24tbm9kZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvMC1iYXNpYy1kb2ktdGVzdHMuMC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvMS1iYXNpYy1kb2ktdGVzdC4xLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvdGVzdC8yLWJhc2ljLWRvaS10ZXN0LjIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci90ZXN0LzMtYmFzaWMtZG9pLXRlc3QuMy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvNS1zZWxlbml1bS10ZXN0LWZsby5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvYmFzaWMtZG9pLXRlc3Qtbmljby5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvYmFzaWMtZG9pLXRlc3QuZmxvLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3VzZXIuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwibG9naW4iLCJyZXF1ZXN0RE9JIiwiZ2V0TmFtZUlkT2ZSYXdUcmFuc2FjdGlvbiIsImdldE5hbWVJZE9mT3B0SW5Gcm9tUmF3VHgiLCJmZXRjaENvbmZpcm1MaW5rRnJvbVBvcDNNYWlsIiwiZGVsZXRlQWxsRW1haWxzRnJvbVBvcDMiLCJjbGlja0NvbmZpcm1MaW5rIiwidmVyaWZ5RE9JIiwiY3JlYXRlVXNlciIsImZpbmRVc2VyIiwiZmluZE9wdEluIiwiZXhwb3J0T3B0SW5zIiwicmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaSIsInVwZGF0ZVVzZXIiLCJyZXNldFVzZXJzIiwiTWV0ZW9yIiwibGluayIsInYiLCJIVFRQIiwiVVJMIiwiY2hhaSIsInF1b3RlZFByaW50YWJsZURlY29kZSIsIk9wdEluc0NvbGxlY3Rpb24iLCJSZWNpcGllbnRzIiwiZ2V0SHR0cEdFVGRhdGEiLCJnZXRIdHRwUE9TVCIsImdldFVybCIsInRlc3RMb2dnaW5nIiwiUmVjaXBpZW50c0NvbGxlY3Rpb24iLCJodHRwR0VUZGF0YSIsImh0dHBQT1NUIiwiZ2V0U2VydmVyVXJsIiwidGVzdExvZyIsImdlbmVyYXRldG9hZGRyZXNzIiwiaGVhZGVycyIsIm9zIiwicmVxdWlyZSIsIlBPUDNDbGllbnQiLCJ1cmwiLCJwYXJhbXNMb2dpbiIsImxvZyIsInVybExvZ2luIiwiaGVhZGVyc0xvZ2luIiwicmVhbERhdGFMb2dpbiIsInBhcmFtcyIsInJlc3VsdCIsInN0YXR1c0NvZGUiLCJkYXRhTG9naW4iLCJkYXRhIiwic3RhdHVzTG9naW4iLCJzdGF0dXMiLCJhc3NlcnQiLCJlcXVhbCIsImF1dGgiLCJyZWNpcGllbnRfbWFpbCIsInNlbmRlcl9tYWlsIiwic3luY0Z1bmMiLCJ3cmFwQXN5bmMiLCJyZXF1ZXN0X0RPSSIsImNhbGxiYWNrIiwidXJsT3B0SW4iLCJkYXRhT3B0SW4iLCJKU09OIiwic3RyaW5naWZ5IiwiaGVhZGVyc09wdEluIiwidXNlcklkIiwiYXV0aFRva2VuIiwicmVhbERhdGFPcHRJbiIsInJlc3VsdE9wdEluIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsImVsZW1lbnQiLCJlIiwidHhJZCIsImdldF9uYW1laWRfb2ZfcmF3X3RyYW5zYWN0aW9uIiwibmFtZUlkIiwicnVubmluZyIsImNvdW50ZXIiLCJsb29wIiwiZGF0YUdldFJhd1RyYW5zYWN0aW9uIiwicmVhbGRhdGFHZXRSYXdUcmFuc2FjdGlvbiIsInJlc3VsdEdldFJhd1RyYW5zYWN0aW9uIiwidm91dCIsInNjcmlwdFB1YktleSIsIm5hbWVPcCIsInVuZGVmaW5lZCIsIm5hbWUiLCJ0eGlkIiwiZXgiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiLCJvcHRJbklkIiwiZ2V0X25hbWVpZF9vZl9vcHRpbl9mcm9tX3Jhd3R4Iiwib3VyX29wdEluIiwiZmluZE9uZSIsIl9pZCIsIm5vdEVxdWFsIiwiaXNCZWxvdyIsImVycm9yIiwiaG9zdG5hbWUiLCJwb3J0IiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImFsaWNlZGFwcF91cmwiLCJtYWlsX3Rlc3Rfc3RyaW5nIiwiZmV0Y2hfY29uZmlybV9saW5rX2Zyb21fcG9wM19tYWlsIiwiY2xpZW50IiwidGxzZXJycyIsImVuYWJsZXRscyIsImRlYnVnIiwib24iLCJyYXdkYXRhIiwibGlzdCIsIm1zZ2NvdW50IiwibXNnbnVtYmVyIiwiZXJyIiwicnNldCIsInJldHIiLCJtYWlsZGF0YSIsImh0bWwiLCJyZXBsYWNlQWxsIiwibGlua2RhdGEiLCJleHBlY3QiLCJpbmRleE9mIiwidG8iLCJub3QiLCJzdWJzdHJpbmciLCJtYXRjaCIsImJlIiwibnVsbCIsInJlcXVlc3REYXRhIiwiZGVsZSIsInF1aXQiLCJlbmQiLCJzdHIiLCJmaW5kIiwicmVwbGFjZSIsIlJlZ0V4cCIsImRlbGV0ZV9hbGxfZW1haWxzX2Zyb21fcG9wMyIsImkiLCJjb25maXJtTGluayIsImNvbmZpcm1fbGluayIsImNvbmZpcm1saW5rIiwiZG9pQ29uZmlybWxpbmtSZWRpciIsImdldCIsImZvbGxvd1JlZGlyZWN0cyIsInJlZGlyTG9jYXRpb24iLCJsb2NhdGlvbiIsInN0YXJ0c1dpdGgiLCJkb2lDb25maXJtbGlua1Jlc3VsdCIsImNvbnRlbnQiLCJoYXZlIiwic3RyaW5nIiwiZEFwcFVybCIsImRBcHBVcmxBdXRoIiwibm9kZV91cmxfYWxpY2UiLCJycGNBdXRoQWxpY2UiLCJ2ZXJpZnlfZG9pIiwib3VyX3JlY2lwaWVudF9tYWlsIiwidXJsVmVyaWZ5IiwicmVjaXBpZW50X3B1YmxpY19rZXkiLCJlbWFpbCIsInB1YmxpY0tleSIsInJlc3VsdFZlcmlmeSIsInN0YXR1c1ZlcmlmeSIsImRhdGFWZXJpZnkiLCJuYW1lX2lkIiwiaGVhZGVyc1ZlcmlmeSIsInJlYWxkYXRhVmVyaWZ5IiwidmFsIiwiZ2xvYmFsIiwiYWxpY2VBZGRyZXNzIiwidGVtcGxhdGVVUkwiLCJoZWFkZXJzVXNlciIsIm1haWxUZW1wbGF0ZSIsInVybFVzZXJzIiwiZGF0YVVzZXIiLCJyZWFsRGF0YVVzZXIiLCJyZXMiLCJ1c2VyaWQiLCJBY2NvdW50cyIsInVzZXJzIiwidXJsRXhwb3J0IiwiZGFwcFVybEFsaWNlIiwiZGF0YUxvZ2luQWxpY2UiLCJkYXBwVXJsQm9iIiwib3B0aW9uYWxEYXRhIiwicmVjaXBpZW50X3BvcDN1c2VybmFtZSIsInJlY2lwaWVudF9wb3AzcGFzc3dvcmQiLCJyZXF1ZXN0X2NvbmZpcm1fdmVyaWZ5X2Jhc2ljX2RvaSIsInNlbmRlcl9tYWlsX2luIiwicmVzdWx0RGF0YU9wdEluVG1wIiwicmVzdWx0RGF0YU9wdEluIiwiY29uZmlybWVkTGluayIsImxhc3RFcnJvciIsImxpbmsyQ29uZmlybSIsInJlZGlyTGluayIsInJlZGlyZWN0UGFyYW0iLCJyZWRpclVybCIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJpc1RydWUiLCJzZWFyY2hQYXJhbXMiLCJoYXMiLCJpZCIsImluZGV4IiwibGVuZ3RoIiwidG1wSWQiLCJvcHRJbiIsInVwZGF0ZUlkIiwicHV0IiwidXNEYXQiLCJwcm9maWxlIiwicmVtb3ZlIiwiaW5pdEJsb2NrY2hhaW4iLCJpc05vZGVBbGl2ZSIsImlzTm9kZUFsaXZlQW5kQ29ubmVjdGVkVG9Ib3N0IiwiaW1wb3J0UHJpdktleSIsImdldE5ld0FkZHJlc3MiLCJnZXRCYWxhbmNlIiwid2FpdFRvU3RhcnRDb250YWluZXIiLCJkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IiLCJzdGFydDNyZE5vZGUiLCJzdG9wRG9ja2VyQm9iIiwiZ2V0Q29udGFpbmVySWRPZk5hbWUiLCJzdGFydERvY2tlckJvYiIsImRvaWNoYWluQWRkTm9kZSIsImdldERvY2tlclN0YXR1cyIsImNvbm5lY3REb2NrZXJCb2IiLCJydW5BbmRXYWl0IiwibG9nQmxvY2tjaGFpbiIsInN1ZG8iLCJleGVjIiwibm9kZV91cmxfYm9iIiwicnBjQXV0aCIsInByaXZLZXlBbGljZSIsInByaXZLZXlCb2IiLCJhbGljZUNvbnRhaW5lcklkIiwic3RhdHVzRG9ja2VyIiwicGFyc2UiLCJiYWxhbmNlIiwiTnVtYmVyIiwiY29ubmVjdGlvbnMiLCJleGNlcHRpb24iLCJ3YWl0X3RvX3N0YXJ0X2NvbnRhaW5lciIsInN0YXJ0ZWRDb250YWluZXJJZCIsInZlcnNpb24iLCJlcnJvcjIiLCJkZWxldGVfb3B0aW9uc19mcm9tX2FsaWNlX2FuZF9ib2IiLCJjb250YWluZXJJZCIsImluc2lkZV9kb2NrZXIiLCJzdGRvdXQiLCJzdGRlcnIiLCJkYXRhR2V0TmV0d29ya0luZm8iLCJyZWFsZGF0YUdldE5ldHdvcmtJbmZvIiwicmVzdWx0R2V0TmV0d29ya0luZm8iLCJzdGF0dXNHZXROZXR3b3JrSW5mbyIsImhvc3QiLCJzdGF0dXNBZGROb2RlIiwiZGF0YUdldFBlZXJJbmZvIiwicmVhbGRhdGFHZXRQZWVySW5mbyIsInJlc3VsdEdldFBlZXJJbmZvIiwic3RhdHVzR2V0UGVlckluZm8iLCJpc0Fib3ZlIiwicHJpdktleSIsInJlc2NhbiIsImRhdGFfaW1wb3J0cHJpdmtleSIsInJlYWxkYXRhX2ltcG9ydHByaXZrZXkiLCJkYXRhR2V0TmV3QWRkcmVzcyIsInJlYWxkYXRhR2V0TmV3QWRkcmVzcyIsInJlc3VsdEdldE5ld0FkZHJlc3MiLCJzdGF0dXNPcHRJbkdldE5ld0FkZHJlc3MiLCJuZXdBZGRyZXNzIiwidG9hZGRyZXNzIiwiYW1vdW50IiwiZGF0YUdlbmVyYXRlIiwiaGVhZGVyc0dlbmVyYXRlcyIsInJlYWxkYXRhR2VuZXJhdGUiLCJyZXN1bHRHZW5lcmF0ZSIsInN0YXR1c1Jlc3VsdEdlbmVyYXRlIiwiZGF0YUdldEJhbGFuY2UiLCJyZWFsZGF0YUdldEJhbGFuY2UiLCJyZXN1bHRHZXRCYWxhbmNlIiwiZ2V0X2NvbnRhaW5lcl9pZF9vZl9uYW1lIiwiYm9ic0NvbnRhaW5lcklkIiwidG9TdHJpbmciLCJ0cmltIiwic3RvcF9kb2NrZXJfYm9iIiwiZG9pY2hhaW5fYWRkX25vZGUiLCJnZXRfZG9ja2VyX3N0YXR1cyIsInN0YXJ0X2RvY2tlcl9ib2IiLCJjb25uZWN0X2RvY2tlcl9ib2IiLCJzdGFydF8zcmRfbm9kZSIsIm5ldHdvcmsiLCJydW5fYW5kX3dhaXQiLCJydW5mdW5jdGlvbiIsInNlY29uZHMiLCJkbnMiLCJzZXRTZXJ2ZXJzIiwiaW5zZGVfZG9ja2VyIiwiZEFwcExvZ2luIiwiaXNBcHBUZXN0IiwiZGVzY3JpYmUiLCJ0aW1lb3V0IiwiYmVmb3JlIiwiaXQiLCJhbGljZUJhbGFuY2UiLCJ0ZW1wbGF0ZVVybEEiLCJ0ZW1wbGF0ZVVybEIiLCJhbGljZUFMb2dpbiIsImFsaWNlQkxvZ2luIiwiYWRMb2ciLCJhZnRlckVhY2giLCJkb25lIiwibG9nQWRtaW4iLCJ1c2VyQSIsInVzZXJCIiwic2VuZGVyX21haWxfYWxpY2VfYSIsInNlbmRlcl9tYWlsX2FsaWNlX2IiLCJsb2dVc2VyQSIsImxvZ1VzZXJCIiwibG9nQmFzaWMiLCJleHBvcnRlZE9wdElucyIsImNvbnNvbGUiLCJSZWNpcGllbnRFbWFpbCIsImV4cG9ydGVkT3B0SW5zQSIsIm93bmVySWQiLCJ1c2VyVXAiLCJjaGFuZ2VkRGF0YSIsImxvZ1VzZXJVcCIsImNvRG9pTGlzdCIsImNvRG9pcyIsInNlbmRlcl9tYWlsX2EiLCJzZW5kZXJfbWFpbF9iIiwicmV0dXJuZWREYXRhIiwic3Rkb3V0MiIsInN0ZGVycjIiLCJpc1Rlc3QiLCJ4ZGVzY3JpYmUiLCJiZWZvcmVFYWNoIiwicHVibGlzaCIsImZpZWxkcyIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxPQUFLLEVBQUMsTUFBSUEsS0FBWDtBQUFpQkMsWUFBVSxFQUFDLE1BQUlBLFVBQWhDO0FBQTJDQywyQkFBeUIsRUFBQyxNQUFJQSx5QkFBekU7QUFBbUdDLDJCQUF5QixFQUFDLE1BQUlBLHlC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Tzs7QUFBaEIsQ0FBMUMsRUFBNEQsQ0FBNUQ7O0FBQ1QsSUFBR0YsTUFBTSxDQUFDcVUsTUFBVixFQUFrQjtBQUVkQyxXQUFTLENBQUMsb0JBQUQsRUFBdUIsWUFBWSxDQUMzQyxDQURRLENBQVQ7QUFFSCxDOzs7Ozs7Ozs7OztBQ0xEdFUsTUFBTSxDQUFDd1UsT0FBUCxDQUFlLFlBQWYsRUFBNkIsWUFBWTtBQUN2QyxNQUFJLEtBQUt0UixNQUFULEVBQWlCO0FBQ2YsV0FBT2xELE1BQU0sQ0FBQ3dLLEtBQVAsQ0FBYTlDLElBQWIsQ0FBa0I7QUFDdkJ4QyxTQUFHLEVBQUUsS0FBS2hDO0FBRGEsS0FBbEIsRUFFSjtBQUNEdVIsWUFBTSxFQUFFO0FBQ04sa0JBQVUsQ0FESjtBQUVOLG1CQUFXLENBRkw7QUFHTixvQkFBWTtBQUhOO0FBRFAsS0FGSSxDQUFQO0FBU0QsR0FWRCxNQVVPO0FBQ0wsV0FBTyxLQUFLQyxLQUFMLEVBQVA7QUFDRDtBQUNGLENBZEQsRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNZXRlb3J9IGZyb20gXCJtZXRlb3IvbWV0ZW9yXCI7XG5pbXBvcnQgeyBIVFRQIH0gZnJvbSAnbWV0ZW9yL2h0dHAnO1xuaW1wb3J0IHsgVVJMIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuaW1wb3J0IHtxdW90ZWRQcmludGFibGVEZWNvZGV9IGZyb20gXCJlbWFpbGpzLW1pbWUtY29kZWNcIjtcbmltcG9ydCB7XG4gICAgT3B0SW5zQ29sbGVjdGlvbixcbiAgICBSZWNpcGllbnRzQ29sbGVjdGlvbiBhcyBSZWNpcGllbnRzLFxuICAgIGh0dHBHRVRkYXRhIGFzIGdldEh0dHBHRVRkYXRhLFxuICAgIGh0dHBQT1NUIGFzIGdldEh0dHBQT1NULFxuICAgIGdldFNlcnZlclVybCBhcyBnZXRVcmwsXG4gICAgdGVzdExvZyBhcyB0ZXN0TG9nZ2luZ1xufSBmcm9tIFwibWV0ZW9yL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGlcIjtcbmltcG9ydCB7Z2VuZXJhdGV0b2FkZHJlc3N9IGZyb20gXCIuL3Rlc3QtYXBpLW9uLW5vZGVcIjtcblxuY29uc3QgaGVhZGVycyA9IHsgJ0NvbnRlbnQtVHlwZSc6J3RleHQvcGxhaW4nICB9O1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xudmFyIFBPUDNDbGllbnQgPSByZXF1aXJlKFwicG9wbGliXCIpO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9naW4odXJsLCBwYXJhbXNMb2dpbiwgbG9nKSB7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnZEFwcCBsb2dpbi4nKTtcblxuICAgIGNvbnN0IHVybExvZ2luID0gdXJsKycvYXBpL3YxL2xvZ2luJztcbiAgICBjb25zdCBoZWFkZXJzTG9naW4gPSBbeydDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJ31dO1xuICAgIGNvbnN0IHJlYWxEYXRhTG9naW49IHsgcGFyYW1zOiBwYXJhbXNMb2dpbiwgaGVhZGVyczogaGVhZGVyc0xvZ2luIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBnZXRIdHRwUE9TVCh1cmxMb2dpbiwgcmVhbERhdGFMb2dpbik7XG5cbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdyZXN1bHQgbG9naW46JyxyZXN1bHQpO1xuICAgIGNvbnN0IHN0YXR1c0NvZGUgPSByZXN1bHQuc3RhdHVzQ29kZTtcbiAgICBjb25zdCBkYXRhTG9naW4gPSByZXN1bHQuZGF0YTtcblxuICAgIGNvbnN0IHN0YXR1c0xvZ2luID0gZGF0YUxvZ2luLnN0YXR1cztcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHN0YXR1c0NvZGUpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKCdzdWNjZXNzJywgc3RhdHVzTG9naW4pO1xuICAgIHJldHVybiBkYXRhTG9naW4uZGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RET0kodXJsLCBhdXRoLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIGRhdGEsICBsb2cpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMocmVxdWVzdF9ET0kpO1xuICAgIHJldHVybiBzeW5jRnVuYyh1cmwsIGF1dGgsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgZGF0YSwgIGxvZyk7XG59XG5mdW5jdGlvbiByZXF1ZXN0X0RPSSh1cmwsIGF1dGgsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgZGF0YSwgIGxvZywgY2FsbGJhY2spIHtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdzdGVwIDEgLSByZXF1ZXN0RE9JIGNhbGxlZCB2aWEgUkVTVCcpO1xuXG4gICAgY29uc3QgdXJsT3B0SW4gPSB1cmwrJy9hcGkvdjEvb3B0LWluJztcbiAgICBsZXQgZGF0YU9wdEluID0ge307XG5cbiAgICBpZihkYXRhKXtcbiAgICAgICAgZGF0YU9wdEluID0ge1xuICAgICAgICAgICAgXCJyZWNpcGllbnRfbWFpbFwiOnJlY2lwaWVudF9tYWlsLFxuICAgICAgICAgICAgXCJzZW5kZXJfbWFpbFwiOnNlbmRlcl9tYWlsLFxuICAgICAgICAgICAgXCJkYXRhXCI6SlNPTi5zdHJpbmdpZnkoZGF0YSlcbiAgICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgICBkYXRhT3B0SW4gPSB7XG4gICAgICAgICAgICBcInJlY2lwaWVudF9tYWlsXCI6cmVjaXBpZW50X21haWwsXG4gICAgICAgICAgICBcInNlbmRlcl9tYWlsXCI6c2VuZGVyX21haWxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGhlYWRlcnNPcHRJbiA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnWC1Vc2VyLUlkJzphdXRoLnVzZXJJZCxcbiAgICAgICAgJ1gtQXV0aC1Ub2tlbic6YXV0aC5hdXRoVG9rZW5cbiAgICB9O1xuICAgIHRyeXtcbiAgICAgICAgY29uc3QgcmVhbERhdGFPcHRJbiA9IHsgZGF0YTogZGF0YU9wdEluLCBoZWFkZXJzOiBoZWFkZXJzT3B0SW59O1xuICAgICAgICBjb25zdCByZXN1bHRPcHRJbiA9IGdldEh0dHBQT1NUKHVybE9wdEluLCByZWFsRGF0YU9wdEluKTtcblxuICAgICAgICAvL2xvZ0Jsb2NrY2hhaW4oXCJyZXN1bHRPcHRJblwiLHJlc3VsdE9wdEluKTtcbiAgICAgICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCByZXN1bHRPcHRJbi5zdGF0dXNDb2RlKTtcbiAgICAgICAgdGVzdExvZ2dpbmcoXCJSRVRVUk5FRCBWQUxVRVM6IFwiLHJlc3VsdE9wdEluKTtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShyZXN1bHRPcHRJbi5kYXRhKSl7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZygnYWRkaW5nIGNvRE9JcycpO1xuICAgICAgICAgICAgcmVzdWx0T3B0SW4uZGF0YS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmVxdWFsKCdzdWNjZXNzJywgZWxlbWVudC5zdGF0dXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2FkZGluZyBET0knKTtcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmVxdWFsKCdzdWNjZXNzJywgIHJlc3VsdE9wdEluLmRhdGEuc3RhdHVzKTtcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjayhudWxsLHJlc3VsdE9wdEluLmRhdGEpO1xuICAgIH1cbiAgICBjYXRjaChlKXtcbiAgICAgICAgY2FsbGJhY2soZSxudWxsKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lSWRPZlJhd1RyYW5zYWN0aW9uKHVybCwgYXV0aCwgdHhJZCkge1xuICAgIHRlc3RMb2dnaW5nKCdwcmUtc3RhcnQgb2YgZ2V0TmFtZUlkT2ZSYXdUcmFuc2FjdGlvbicsdHhJZCk7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGdldF9uYW1laWRfb2ZfcmF3X3RyYW5zYWN0aW9uKTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBhdXRoLCB0eElkKTtcbn1cblxuZnVuY3Rpb24gZ2V0X25hbWVpZF9vZl9yYXdfdHJhbnNhY3Rpb24odXJsLCBhdXRoLCB0eElkLCBjYWxsYmFjayl7XG5cbiAgICBsZXQgbmFtZUlkID0gJyc7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICB0ZXN0TG9nZ2luZygnc3RhcnQgZ2V0TmFtZUlkT2ZSYXdUcmFuc2FjdGlvbicsdHhJZCk7XG4gICAgKGFzeW5jIGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgIHdoaWxlKHJ1bm5pbmcgJiYgKytjb3VudGVyPDE1MDApeyAvL3RyeWluZyA1MHggdG8gZ2V0IGVtYWlsIGZyb20gYm9icyBtYWlsYm94XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCd0cnlpbmcgdG8gZ2V0IHRyYW5zYWN0aW9uJyx0eElkKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YUdldFJhd1RyYW5zYWN0aW9uID0ge1wianNvbnJwY1wiOiBcIjEuMFwiLCBcImlkXCI6XCJnZXRyYXd0cmFuc2FjdGlvblwiLCBcIm1ldGhvZFwiOiBcImdldHJhd3RyYW5zYWN0aW9uXCIsIFwicGFyYW1zXCI6IFt0eElkLDFdIH07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlYWxkYXRhR2V0UmF3VHJhbnNhY3Rpb24gPSB7IGF1dGg6IGF1dGgsIGRhdGE6IGRhdGFHZXRSYXdUcmFuc2FjdGlvbiwgaGVhZGVyczogaGVhZGVycyB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRHZXRSYXdUcmFuc2FjdGlvbiA9IGdldEh0dHBQT1NUKHVybCwgcmVhbGRhdGFHZXRSYXdUcmFuc2FjdGlvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0R2V0UmF3VHJhbnNhY3Rpb24uZGF0YS5yZXN1bHQudm91dFsxXS5zY3JpcHRQdWJLZXkubmFtZU9wIT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVJZCA9IHJlc3VsdEdldFJhd1RyYW5zYWN0aW9uLmRhdGEucmVzdWx0LnZvdXRbMV0uc2NyaXB0UHViS2V5Lm5hbWVPcC5uYW1lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lSWQgPSByZXN1bHRHZXRSYXdUcmFuc2FjdGlvbi5kYXRhLnJlc3VsdC52b3V0WzBdLnNjcmlwdFB1YktleS5uYW1lT3AubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdEdldFJhd1RyYW5zYWN0aW9uLmRhdGEucmVzdWx0LnR4aWQhPT11bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2NvbmZpcm1lZCB0eGlkOicrcmVzdWx0R2V0UmF3VHJhbnNhY3Rpb24uZGF0YS5yZXN1bHQudHhpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBydW5uaW5nPWZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vY2hhaS5hc3NlcnQuZXF1YWwodHhJZCwgcmVzdWx0R2V0UmF3VHJhbnNhY3Rpb24uZGF0YS5yZXN1bHQudHhpZCk7XG4gICAgICAgICAgICB9Y2F0Y2goZXgpe1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCd0cnlpbmcgdG8gZ2V0IGVtYWlsIC0gc28gZmFyIG5vIHN1Y2Nlc3M6Jyxjb3VudGVyKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMjAwMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlc3RMb2dnaW5nKCdlbmQgb2YgZ2V0TmFtZUlkT2ZSYXdUcmFuc2FjdGlvbiByZXR1cm5pbmcgbmFtZUlkJyxuYW1lSWQpO1xuICAgICAgICBjYWxsYmFjayhudWxsLG5hbWVJZCk7XG4gICAgfSkoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWVJZE9mT3B0SW5Gcm9tUmF3VHgodXJsLCBhdXRoLCBvcHRJbklkLGxvZykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhnZXRfbmFtZWlkX29mX29wdGluX2Zyb21fcmF3dHgpO1xuICAgIHJldHVybiBzeW5jRnVuYyh1cmwsIGF1dGgsIG9wdEluSWQsbG9nKTtcbn1cblxuXG5hc3luYyBmdW5jdGlvbiBnZXRfbmFtZWlkX29mX29wdGluX2Zyb21fcmF3dHgodXJsLCBhdXRoLCBvcHRJbklkLCBsb2csIGNhbGxiYWNrKXtcbiAgICB0ZXN0TG9nZ2luZygnc3RlcCAyIC0gZ2V0dGluZyBuYW1lSWQgb2YgcmF3IHRyYW5zYWN0aW9uIGZyb20gYmxvY2tjaGFpbicpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3RoZSB0eElkIHdpbGwgYmUgYWRkZWQgYSBiaXQgbGF0ZXIgYXMgc29vbiBhcyB0aGUgc2NoZWR1bGUgcGlja3MgdXAgdGhlIGpvYiBhbmQgaW5zZXJ0cyBpdCBpbnRvIHRoZSBibG9ja2NoYWluLiBpdCBkb2VzIG5vdCBoYXBwZW4gaW1tZWRpYXRlbHkuIHdhaXRpbmcuLi4nKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGxldCBvdXJfb3B0SW4gPSBudWxsO1xuICAgIGxldCBuYW1lSWQgPSBudWxsO1xuICAgIGF3YWl0IChhc3luYyBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICB3aGlsZShydW5uaW5nICYmICsrY291bnRlcjw1MCl7IC8vdHJ5aW5nIDUweCB0byBnZXQgb3B0LWluXG5cbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdmaW5kIG9wdC1Jbicsb3B0SW5JZCk7XG4gICAgICAgICAgICBvdXJfb3B0SW4gPSBPcHRJbnNDb2xsZWN0aW9uLmZpbmRPbmUoe19pZDogb3B0SW5JZH0pO1xuICAgICAgICAgICAgaWYob3VyX29wdEluLnR4SWQhPT11bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdmb3VuZCB0eElkIG9mIG9wdC1Jbicsb3VyX29wdEluLnR4SWQpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2RpZCBub3QgZmluZCB0eElkIHlldCBmb3Igb3B0LUluLUlkJyxvdXJfb3B0SW4uX2lkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMDApKTtcbiAgICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICB0cnl7XG5cbiAgICAgICAgY2hhaS5hc3NlcnQuZXF1YWwob3VyX29wdEluLl9pZCxvcHRJbklkKTtcbiAgICAgICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnb3B0SW46JyxvdXJfb3B0SW4pO1xuICAgICAgICBuYW1lSWQgPSBnZXROYW1lSWRPZlJhd1RyYW5zYWN0aW9uKHVybCxhdXRoLG91cl9vcHRJbi50eElkKTtcbiAgICAgICAgY2hhaS5hc3NlcnQuZXF1YWwoXCJlL1wiK291cl9vcHRJbi5uYW1lSWQsbmFtZUlkKTtcblxuICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCduYW1lSWQ6JyxuYW1lSWQpO1xuICAgICAgICBjaGFpLmFzc2VydC5ub3RFcXVhbChuYW1lSWQsbnVsbCk7XG4gICAgICAgIGNoYWkuYXNzZXJ0LmlzQmVsb3coY291bnRlciw1MCxcIk9wdEluIG5vdCBmb3VuZCBhZnRlciByZXRyaWVzXCIpO1xuICAgICAgICBjYWxsYmFjayhudWxsLG5hbWVJZCk7XG4gICAgfVxuICAgIGNhdGNoKGVycm9yKXtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsbmFtZUlkKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hDb25maXJtTGlua0Zyb21Qb3AzTWFpbChob3N0bmFtZSxwb3J0LHVzZXJuYW1lLHBhc3N3b3JkLGFsaWNlZGFwcF91cmwsbG9nLG1haWxfdGVzdF9zdHJpbmc9XCJcIikge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhmZXRjaF9jb25maXJtX2xpbmtfZnJvbV9wb3AzX21haWwpO1xuICAgIHJldHVybiBzeW5jRnVuYyhob3N0bmFtZSxwb3J0LHVzZXJuYW1lLHBhc3N3b3JkLGFsaWNlZGFwcF91cmwsbG9nLG1haWxfdGVzdF9zdHJpbmcpO1xufVxuXG5mdW5jdGlvbiBmZXRjaF9jb25maXJtX2xpbmtfZnJvbV9wb3AzX21haWwoaG9zdG5hbWUscG9ydCx1c2VybmFtZSxwYXNzd29yZCxhbGljZWRhcHBfdXJsLGxvZyxtYWlsX3Rlc3Rfc3RyaW5nLGNhbGxiYWNrKSB7XG5cbiAgICB0ZXN0TG9nZ2luZyhcInN0ZXAgMyAtIGdldHRpbmcgZW1haWwgZnJvbSBib2JzIGluYm94XCIpO1xuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2RpdGVzaC9ub2RlLXBvcGxpYi9ibG9iL21hc3Rlci9kZW1vcy9yZXRyaWV2ZS1hbGwuanNcbiAgICB2YXIgY2xpZW50ID0gbmV3IFBPUDNDbGllbnQocG9ydCwgaG9zdG5hbWUsIHtcbiAgICAgICAgdGxzZXJyczogZmFsc2UsXG4gICAgICAgIGVuYWJsZXRsczogZmFsc2UsXG4gICAgICAgIGRlYnVnOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgY2xpZW50Lm9uKFwiY29ubmVjdFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGVzdExvZ2dpbmcoXCJDT05ORUNUIHN1Y2Nlc3NcIik7XG4gICAgICAgIGNsaWVudC5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICBjbGllbnQub24oXCJsb2dpblwiLCBmdW5jdGlvbihzdGF0dXMsIHJhd2RhdGEpIHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZyhcIkxPR0lOL1BBU1Mgc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICBjbGllbnQubGlzdCgpO1xuXG4gICAgICAgICAgICAgICAgY2xpZW50Lm9uKFwibGlzdFwiLCBmdW5jdGlvbihzdGF0dXMsIG1zZ2NvdW50LCBtc2dudW1iZXIsIGRhdGEsIHJhd2RhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJMSVNUIGZhaWxlZFwiKyBtc2dudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucnNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJMSVNUIHN1Y2Nlc3Mgd2l0aCBcIiArIG1zZ2NvdW50ICsgXCIgZWxlbWVudChzKVwiLCcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jaGFpLmV4cGVjdChtc2djb3VudCkudG8uYmUuYWJvdmUoMCwgJ25vIGVtYWlsIGluIGJvYnMgaW5ib3gnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2djb3VudCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5yZXRyKDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5vbihcInJldHJcIiwgZnVuY3Rpb24oc3RhdHVzLCBtc2dudW1iZXIsIG1haWxkYXRhLCByYXdkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobG9nKSB0ZXN0TG9nZ2luZyhcIlJFVFIgc3VjY2VzcyBcIiArIG1zZ251bWJlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2VtYWlsanMvZW1haWxqcy1taW1lLWNvZGVjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaHRtbCAgPSBxdW90ZWRQcmludGFibGVEZWNvZGUobWFpbGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYob3MuaG9zdG5hbWUoKSE9PSdyZWd0ZXN0Jyl7IC8vdGhpcyBpcyBwcm9iYWJseSBhIHNlbGVuaXVtIHRlc3QgZnJvbSBvdXRzaWRlIGRvY2tlciAgLSBzbyByZXBsYWNlIFVSTCBzbyBpdCBjYW4gYmUgY29uZmlybWVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCA9IHJlcGxhY2VBbGwoaHRtbCwnaHR0cDovLzE3Mi4yMC4wLjgnLCdodHRwOi8vbG9jYWxob3N0Jyk7ICAvL1RPRE8gcHV0IHRoaXMgSVAgaW5zaWRlIGEgY29uZmlnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGlua2RhdGEgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhaS5leHBlY3QoaHRtbC5pbmRleE9mKGFsaWNlZGFwcF91cmwpLFwiZGFwcFVybCBub3QgZm91bmQgaW4gZW1haWxcIikudG8ubm90LmVxdWFsKC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmtkYXRhID0gIGh0bWwuc3Vic3RyaW5nKGh0bWwuaW5kZXhPZihhbGljZWRhcHBfdXJsKSkubWF0Y2goL14oaHR0cHM/fGZ0cCk6XFwvXFwvW15cXHMvJC4/I10uW15cXHNdKlthLXosQS1aLDAtOV17MTYsfS8pWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFpLmV4cGVjdChsaW5rZGF0YSxcIm5vIGxpbmtkYXRhIGZvdW5kXCIpLnRvLm5vdC5iZS5udWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihtYWlsX3Rlc3Rfc3RyaW5nKWNoYWkuZXhwZWN0KGh0bWwuaW5kZXhPZihtYWlsX3Rlc3Rfc3RyaW5nKSwndGVzdHN0cmluZzogXCInK21haWxfdGVzdF9zdHJpbmcrJ1wiIG5vdCBmb3VuZCcpLnRvLm5vdC5lcXVhbCgtMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0RGF0YSA9IHtcImxpbmtkYXRhXCI6bGlua2RhdGEsXCJodG1sXCI6aHRtbH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmRlbGUobXNnbnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5vbihcImRlbGVcIiwgZnVuY3Rpb24oc3RhdHVzLCBtc2dudW1iZXIsIGRhdGEsIHJhd2RhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucXVpdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCxsaW5rZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJSRVRSIGZhaWxlZCBmb3IgbXNnbnVtYmVyIFwiKyBtc2dudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucnNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJlbXB0eSBtYWlsYm94XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucXVpdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IFwiTE9HSU4vUEFTUyBmYWlsZWRcIjtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgIGNsaWVudC5xdWl0KCk7XG4gICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgIGNsaWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZUFsbChzdHIsIGZpbmQsIHJlcGxhY2UpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cChmaW5kLCAnZycpLCByZXBsYWNlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzKGhvc3RuYW1lLHBvcnQsdXNlcm5hbWUscGFzc3dvcmQsbG9nKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRlbGV0ZV9hbGxfZW1haWxzX2Zyb21fcG9wMyk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGhvc3RuYW1lLHBvcnQsdXNlcm5hbWUscGFzc3dvcmQsbG9nKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlX2FsbF9lbWFpbHNfZnJvbV9wb3AzKGhvc3RuYW1lLHBvcnQsdXNlcm5hbWUscGFzc3dvcmQsbG9nLGNhbGxiYWNrKSB7XG5cbiAgICB0ZXN0TG9nZ2luZyhcImRlbGV0aW5nIGFsbCBlbWFpbHMgZnJvbSBib2JzIGluYm94XCIpO1xuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2RpdGVzaC9ub2RlLXBvcGxpYi9ibG9iL21hc3Rlci9kZW1vcy9yZXRyaWV2ZS1hbGwuanNcbiAgICB2YXIgY2xpZW50ID0gbmV3IFBPUDNDbGllbnQocG9ydCwgaG9zdG5hbWUsIHtcbiAgICAgICAgdGxzZXJyczogZmFsc2UsXG4gICAgICAgIGVuYWJsZXRsczogZmFsc2UsXG4gICAgICAgIGRlYnVnOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgY2xpZW50Lm9uKFwiY29ubmVjdFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGVzdExvZ2dpbmcoXCJDT05ORUNUIHN1Y2Nlc3NcIik7XG4gICAgICAgIGNsaWVudC5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICBjbGllbnQub24oXCJsb2dpblwiLCBmdW5jdGlvbihzdGF0dXMsIHJhd2RhdGEpIHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZyhcIkxPR0lOL1BBU1Mgc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICBjbGllbnQubGlzdCgpO1xuXG4gICAgICAgICAgICAgICAgY2xpZW50Lm9uKFwibGlzdFwiLCBmdW5jdGlvbihzdGF0dXMsIG1zZ2NvdW50LCBtc2dudW1iZXIsIGRhdGEsIHJhd2RhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJMSVNUIGZhaWxlZFwiKyBtc2dudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucnNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJMSVNUIHN1Y2Nlc3Mgd2l0aCBcIiArIG1zZ2NvdW50ICsgXCIgZWxlbWVudChzKVwiLCcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jaGFpLmV4cGVjdChtc2djb3VudCkudG8uYmUuYWJvdmUoMCwgJ25vIGVtYWlsIGluIGJvYnMgaW5ib3gnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2djb3VudCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7aTw9bXNnY291bnQ7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmRlbGUoaSsxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50Lm9uKFwiZGVsZVwiLCBmdW5jdGlvbihzdGF0dXMsIG1zZ251bWJlciwgZGF0YSwgcmF3ZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJkZWxldGVkIGVtYWlsXCIrKGkrMSkrXCIgc3RhdHVzOlwiK3N0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGk9PW1zZ2NvdW50LTEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LnF1aXQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJhbGwgZW1haWxzIGRlbGV0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCdhbGwgZW1haWxzIGRlbGV0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IFwiZW1wdHkgbWFpbGJveFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGVycik7IC8vd2UgZG8gbm90IHNlbmQgYW4gZXJyb3IgaGVyZSB3aGVuIGluYm94IGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LnF1aXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBcIkxPR0lOL1BBU1MgZmFpbGVkXCI7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICBjbGllbnQucXVpdCgpO1xuICAgICAgICAgICAgICAgIGNsaWVudC5lbmQoKTtcbiAgICAgICAgICAgICAgICBjbGllbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGlja0NvbmZpcm1MaW5rKGNvbmZpcm1MaW5rKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGNvbmZpcm1fbGluayk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNvbmZpcm1MaW5rKTtcbn1cblxuZnVuY3Rpb24gY29uZmlybV9saW5rKGNvbmZpcm1saW5rLGNhbGxiYWNrKXtcbiAgICB0ZXN0TG9nZ2luZyhcImNsaWNrYWJsZSBsaW5rOlwiLGNvbmZpcm1saW5rKTtcbiAgICBjb25zdCBkb2lDb25maXJtbGlua1JlZGlyID0gSFRUUC5nZXQoY29uZmlybWxpbmsse2ZvbGxvd1JlZGlyZWN0czpmYWxzZX0pO1xuICAgIGxldCByZWRpckxvY2F0aW9uID0gZG9pQ29uZmlybWxpbmtSZWRpci5oZWFkZXJzLmxvY2F0aW9uO1xuXG4gICAgaWYoIXJlZGlyTG9jYXRpb24uc3RhcnRzV2l0aChcImh0dHA6Ly9cIikgJiYgIXJlZGlyTG9jYXRpb24uc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpKXtcbiAgICAgICAgcmVkaXJMb2NhdGlvbiA9IGdldFVybCgpK1widGVtcGxhdGVzL3BhZ2VzL1wiK3JlZGlyTG9jYXRpb247XG4gICAgICAgIHRlc3RMb2dnaW5nKCdyZWRpcmVjdFVybDonLHJlZGlyTG9jYXRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IGRvaUNvbmZpcm1saW5rUmVzdWx0ID0gSFRUUC5nZXQocmVkaXJMb2NhdGlvbik7XG4gICAgdGVzdExvZ2dpbmcoXCJSZXNwb25zZSBsb2NhdGlvbjpcIixyZWRpckxvY2F0aW9uKTtcbiAgICB0cnl7XG4gICAgICAgIGlmKGRvaUNvbmZpcm1saW5rUmVzdWx0LmNvbnRlbnQuaW5kZXhPZihcIkhlbGxvIHdvcmxkIVwiKT09LTEpe1xuICAgICAgICAgICAgLy8gICAgY2hhaS5leHBlY3QoZG9pQ29uZmlybWxpbmtSZXN1bHQuY29udGVudC5pbmRleE9mKFwiQU5NRUxEVU5HIEVSRk9MR1JFSUNIXCIpKS50by5ub3QuZXF1YWwoLTEpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoZG9pQ29uZmlybWxpbmtSZXN1bHQuY29udGVudCkudG8uaGF2ZS5zdHJpbmcoJ0FOTUVMRFVORyBFUkZPTEdSRUlDSCcpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoZG9pQ29uZmlybWxpbmtSZXN1bHQuY29udGVudCkudG8uaGF2ZS5zdHJpbmcoJ1ZpZWxlbiBEYW5rIGbDvHIgSWhyZSBBbm1lbGR1bmcnKTtcbiAgICAgICAgICAgIGNoYWkuZXhwZWN0KGRvaUNvbmZpcm1saW5rUmVzdWx0LmNvbnRlbnQpLnRvLmhhdmUuc3RyaW5nKCdJaHJlIEFubWVsZHVuZyB3YXIgZXJmb2xncmVpY2guJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGNoYWkuZXhwZWN0KGRvaUNvbmZpcm1saW5rUmVzdWx0LmNvbnRlbnQuaW5kZXhPZihcIkhlbGxvIHdvcmxkIVwiKSkudG8ubm90LmVxdWFsKC0xKTtcbiAgICAgICAgfVxuICAgICAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIGRvaUNvbmZpcm1saW5rUmVzdWx0LnN0YXR1c0NvZGUpO1xuICAgICAgICBjYWxsYmFjayhudWxsLHtsb2NhdGlvbjogcmVkaXJMb2NhdGlvbn0pO1xuICAgIH1cbiAgICBjYXRjaChlKXtcbiAgICAgICAgY2FsbGJhY2soZSxudWxsKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlET0koZEFwcFVybCwgZEFwcFVybEF1dGgsIG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIHNlbmRlcl9tYWlsLCByZWNpcGllbnRfbWFpbCxuYW1lSWQsIGxvZyApe1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyh2ZXJpZnlfZG9pKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoZEFwcFVybCwgZEFwcFVybEF1dGgsIG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIHNlbmRlcl9tYWlsLCByZWNpcGllbnRfbWFpbCxuYW1lSWQsIGxvZyApO1xufVxuXG5cbmFzeW5jIGZ1bmN0aW9uIHZlcmlmeV9kb2koZEFwcFVybCwgZEFwcFVybEF1dGgsIG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIHNlbmRlcl9tYWlsLCByZWNpcGllbnRfbWFpbCxuYW1lSWQsIGxvZywgY2FsbGJhY2spe1xuICAgIGxldCBvdXJfcmVjaXBpZW50X21haWwgPXJlY2lwaWVudF9tYWlsO1xuICAgIGlmKEFycmF5LmlzQXJyYXkocmVjaXBpZW50X21haWwpKXtcbiAgICAgICAgb3VyX3JlY2lwaWVudF9tYWlsPXJlY2lwaWVudF9tYWlsWzBdO1xuICAgIH1cbiAgICBjb25zdCB1cmxWZXJpZnkgPSBkQXBwVXJsKycvYXBpL3YxL29wdC1pbi92ZXJpZnknO1xuICAgIGNvbnN0IHJlY2lwaWVudF9wdWJsaWNfa2V5ID0gUmVjaXBpZW50cy5maW5kT25lKHtlbWFpbDogb3VyX3JlY2lwaWVudF9tYWlsfSkucHVibGljS2V5O1xuICAgIGxldCByZXN1bHRWZXJpZnkgPXt9O1xuICAgIGxldCBzdGF0dXNWZXJpZnkgPXt9O1xuXG4gICAgY29uc3QgZGF0YVZlcmlmeSA9IHtcbiAgICAgICAgcmVjaXBpZW50X21haWw6IG91cl9yZWNpcGllbnRfbWFpbCxcbiAgICAgICAgc2VuZGVyX21haWw6IHNlbmRlcl9tYWlsLFxuICAgICAgICBuYW1lX2lkOiBuYW1lSWQsXG4gICAgICAgIHJlY2lwaWVudF9wdWJsaWNfa2V5OiByZWNpcGllbnRfcHVibGljX2tleVxuICAgIH07XG5cbiAgICBjb25zdCBoZWFkZXJzVmVyaWZ5ID0ge1xuICAgICAgICAnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICdYLVVzZXItSWQnOmRBcHBVcmxBdXRoLnVzZXJJZCxcbiAgICAgICAgJ1gtQXV0aC1Ub2tlbic6ZEFwcFVybEF1dGguYXV0aFRva2VuXG4gICAgfTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuXG4gICAgYXdhaXQgKGFzeW5jIGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgIHdoaWxlKHJ1bm5pbmcgJiYgKytjb3VudGVyPDUwKXsgLy90cnlpbmcgNTB4IHRvIGdldCBlbWFpbCBmcm9tIGJvYnMgbWFpbGJveFxuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdTdGVwIDU6IHZlcmlmeWluZyBvcHQtaW46Jywge2RhdGE6ZGF0YVZlcmlmeX0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlYWxkYXRhVmVyaWZ5ID0geyBkYXRhOiBkYXRhVmVyaWZ5LCBoZWFkZXJzOiBoZWFkZXJzVmVyaWZ5IH07XG4gICAgICAgICAgICAgICAgcmVzdWx0VmVyaWZ5ID0gZ2V0SHR0cEdFVGRhdGEodXJsVmVyaWZ5LCByZWFsZGF0YVZlcmlmeSk7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3Jlc3VsdCAvb3B0LWluL3ZlcmlmeTonLHtzdGF0dXM6cmVzdWx0VmVyaWZ5LmRhdGEuc3RhdHVzLHZhbDpyZXN1bHRWZXJpZnkuZGF0YS5kYXRhLnZhbH0gKTtcbiAgICAgICAgICAgICAgICBzdGF0dXNWZXJpZnkgPSByZXN1bHRWZXJpZnkuc3RhdHVzQ29kZTtcbiAgICAgICAgICAgICAgICBpZihyZXN1bHRWZXJpZnkuZGF0YS5kYXRhLnZhbD09PXRydWUpIHJ1bm5pbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgfWNhdGNoKGV4KSB7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3RyeWluZyB0byB2ZXJpZnkgb3B0LWluIC0gc28gZmFyIG5vIHN1Y2Nlc3M6JyxleCk7XG4gICAgICAgICAgICAgICAgLy9nZW5lcmF0ZXRvYWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBnbG9iYWwuYWxpY2VBZGRyZXNzLCAxLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAvL2F3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyMDAwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5e1xuICAgICAgICAgICAgICAgIGdlbmVyYXRldG9hZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGdsb2JhbC5hbGljZUFkZHJlc3MsIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyMDAwKSk7IFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9KSgpO1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICBjaGFpLmFzc2VydC5lcXVhbChzdGF0dXNWZXJpZnksMjAwKTtcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmVxdWFsKHJlc3VsdFZlcmlmeS5kYXRhLmRhdGEudmFsLHRydWUpO1xuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNCZWxvdyhjb3VudGVyLDUwKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsZmFsc2UpO1xuICAgICAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVVc2VyKHVybCxhdXRoLHVzZXJuYW1lLHRlbXBsYXRlVVJMLGxvZyl7XG4gICAgY29uc3QgaGVhZGVyc1VzZXIgPSB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ1gtVXNlci1JZCc6YXV0aC51c2VySWQsXG4gICAgICAgICdYLUF1dGgtVG9rZW4nOmF1dGguYXV0aFRva2VuXG4gICAgfVxuICAgIGNvbnN0IG1haWxUZW1wbGF0ZSA9IHtcbiAgICAgICAgXCJzdWJqZWN0XCI6IFwiSGVsbG8gaSBhbSBcIit1c2VybmFtZSxcbiAgICAgICAgXCJyZWRpcmVjdFwiOiBcInRoYW5rLXlvdS1kZS5odG1sXCIsXG4gICAgICAgIFwicmV0dXJuUGF0aFwiOiAgdXNlcm5hbWUrXCItdGVzdEBkb2ljaGFpbi5vcmdcIixcbiAgICAgICAgXCJ0ZW1wbGF0ZVVSTFwiOiB0ZW1wbGF0ZVVSTFxuICAgIH1cbiAgICBjb25zdCB1cmxVc2VycyA9IHVybCsnL2FwaS92MS91c2Vycyc7XG4gICAgY29uc3QgZGF0YVVzZXIgPSB7XCJ1c2VybmFtZVwiOnVzZXJuYW1lLFwiZW1haWxcIjp1c2VybmFtZStcIi10ZXN0QGRvaWNoYWluLm9yZ1wiLFwicGFzc3dvcmRcIjpcInBhc3N3b3JkXCIsXCJtYWlsVGVtcGxhdGVcIjptYWlsVGVtcGxhdGV9XG5cbiAgICBjb25zdCByZWFsRGF0YVVzZXI9IHsgZGF0YTogZGF0YVVzZXIsIGhlYWRlcnM6IGhlYWRlcnNVc2VyfTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdjcmVhdGVVc2VyOicsIHJlYWxEYXRhVXNlcik7XG4gICAgbGV0IHJlcyA9IGdldEh0dHBQT1NUKHVybFVzZXJzLHJlYWxEYXRhVXNlcik7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZyhcInJlc3BvbnNlXCIscmVzKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbChyZXMuZGF0YS5zdGF0dXMsXCJzdWNjZXNzXCIpO1xuICAgIHJldHVybiByZXMuZGF0YS5kYXRhLnVzZXJpZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRVc2VyKHVzZXJJZCl7XG4gICAgY29uc3QgcmVzID0gQWNjb3VudHMudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJJZH0pO1xuICAgIGNoYWkuZXhwZWN0KHJlcykudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZE9wdEluKG9wdEluSWQsbG9nKXtcbiAgICBjb25zdCByZXMgPSBPcHRJbnNDb2xsZWN0aW9uLmZpbmRPbmUoe19pZDpvcHRJbklkfSk7XG4gICAgaWYobG9nKXRlc3RMb2dnaW5nKHJlcyxvcHRJbklkKTtcbiAgICBjaGFpLmV4cGVjdChyZXMpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4cG9ydE9wdElucyh1cmwsYXV0aCxsb2cpe1xuICAgIGNvbnN0IGhlYWRlcnNVc2VyID0ge1xuICAgICAgICAnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICdYLVVzZXItSWQnOmF1dGgudXNlcklkLFxuICAgICAgICAnWC1BdXRoLVRva2VuJzphdXRoLmF1dGhUb2tlblxuICAgIH07XG5cbiAgICBjb25zdCB1cmxFeHBvcnQgPSB1cmwrJy9hcGkvdjEvZXhwb3J0JztcbiAgICBjb25zdCByZWFsRGF0YVVzZXI9IHtoZWFkZXJzOiBoZWFkZXJzVXNlcn07XG4gICAgbGV0IHJlcyA9IGdldEh0dHBHRVRkYXRhKHVybEV4cG9ydCxyZWFsRGF0YVVzZXIpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcocmVzLGxvZyk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwocmVzLmRhdGEuc3RhdHVzLFwic3VjY2Vzc1wiKTtcbiAgICByZXR1cm4gcmVzLmRhdGEuZGF0YTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShub2RlX3VybF9hbGljZSxycGNBdXRoQWxpY2UsIGRhcHBVcmxBbGljZSxkYXRhTG9naW5BbGljZSxkYXBwVXJsQm9iLHJlY2lwaWVudF9tYWlsLHNlbmRlcl9tYWlsLG9wdGlvbmFsRGF0YSxyZWNpcGllbnRfcG9wM3VzZXJuYW1lLCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkLCBsb2csbWFpbF90ZXN0X3N0cmluZz1cIlwiKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHJlcXVlc3RfY29uZmlybV92ZXJpZnlfYmFzaWNfZG9pKTtcbiAgICByZXR1cm4gc3luY0Z1bmMobm9kZV91cmxfYWxpY2UscnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsZGF0YUxvZ2luQWxpY2UsZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsc2VuZGVyX21haWwsb3B0aW9uYWxEYXRhLHJlY2lwaWVudF9wb3AzdXNlcm5hbWUsIHJlY2lwaWVudF9wb3AzcGFzc3dvcmQsIGxvZyxtYWlsX3Rlc3Rfc3RyaW5nKTtcbn1cblxuXG5hc3luYyBmdW5jdGlvbiByZXF1ZXN0X2NvbmZpcm1fdmVyaWZ5X2Jhc2ljX2RvaShub2RlX3VybF9hbGljZSxycGNBdXRoQWxpY2UsIGRhcHBVcmxBbGljZSxkYXRhTG9naW5BbGljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLHNlbmRlcl9tYWlsX2luLG9wdGlvbmFsRGF0YSxyZWNpcGllbnRfcG9wM3VzZXJuYW1lLCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkLCBsb2csbWFpbF90ZXN0X3N0cmluZywgY2FsbGJhY2spIHtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdub2RlX3VybF9hbGljZScsbm9kZV91cmxfYWxpY2UpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3JwY0F1dGhBbGljZScscnBjQXV0aEFsaWNlKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdkYXBwVXJsQWxpY2UnLGRhcHBVcmxBbGljZSk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnZGF0YUxvZ2luQWxpY2UnLGRhdGFMb2dpbkFsaWNlKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdkYXBwVXJsQm9iJyxkYXBwVXJsQm9iKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdyZWNpcGllbnRfbWFpbCcscmVjaXBpZW50X21haWwpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3NlbmRlcl9tYWlsX2luJyxzZW5kZXJfbWFpbF9pbik7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnb3B0aW9uYWxEYXRhJyxvcHRpb25hbERhdGEpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3JlY2lwaWVudF9wb3AzdXNlcm5hbWUnLHJlY2lwaWVudF9wb3AzdXNlcm5hbWUpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3JlY2lwaWVudF9wb3AzcGFzc3dvcmQnLHJlY2lwaWVudF9wb3AzcGFzc3dvcmQpO1xuXG5cbiAgICBsZXQgc2VuZGVyX21haWwgPSBzZW5kZXJfbWFpbF9pbjtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdsb2cgaW50byBhbGljZSBhbmQgcmVxdWVzdCBET0knKTtcbiAgICBsZXQgcmVzdWx0RGF0YU9wdEluVG1wID0gcmVxdWVzdERPSShkYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIG9wdGlvbmFsRGF0YSwgdHJ1ZSk7XG4gICAgbGV0IHJlc3VsdERhdGFPcHRJbiA9IHJlc3VsdERhdGFPcHRJblRtcDtcblxuICAgIGlmKEFycmF5LmlzQXJyYXkoc2VuZGVyX21haWxfaW4pKXsgICAgICAgICAgICAgIC8vU2VsZWN0IG1hc3RlciBkb2kgZnJvbSBzZW5kZXJzIGFuZCByZXN1bHRcbiAgICAgICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnTUFTVEVSIERPSTogJyxyZXN1bHREYXRhT3B0SW5UbXBbMF0pO1xuICAgICAgICByZXN1bHREYXRhT3B0SW4gPSByZXN1bHREYXRhT3B0SW5UbXBbMF07XG4gICAgICAgIHNlbmRlcl9tYWlsID0gc2VuZGVyX21haWxfaW5bMF07XG4gICAgfVxuXG4gICAgLy9nZW5lcmF0aW5nIGEgYmxvY2sgc28gdHJhbnNhY3Rpb24gZ2V0cyBjb25maXJtZWQgYW5kIGRlbGl2ZXJlZCB0byBib2IuXG4gICAgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBsZXQgY29uZmlybWVkTGluayA9IFwiXCI7XG4gICAgbGV0IGxhc3RFcnJvcj1udWxsO1xuICAgIGNvbmZpcm1lZExpbmsgPSBhd2FpdChhc3luYyBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICB3aGlsZShydW5uaW5nICYmICsrY291bnRlcjw1MCl7IC8vdHJ5aW5nIDUweCB0byBnZXQgZW1haWwgZnJvbSBib2JzIG1haWxib3hcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnc3RlcCAzOiBnZXR0aW5nIGVtYWlsIGZyb20gaG9zdG5hbWUhJyxvcy5ob3N0bmFtZSgpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rMkNvbmZpcm0gPSBmZXRjaENvbmZpcm1MaW5rRnJvbVBvcDNNYWlsKChvcy5ob3N0bmFtZSgpPT0ncmVndGVzdCcpPydtYWlsJzonbG9jYWxob3N0JywgMTEwLCByZWNpcGllbnRfcG9wM3VzZXJuYW1lLCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkLCBkYXBwVXJsQm9iLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0ZXAgNDogY29uZmlybWluZyBsaW5rJyxsaW5rMkNvbmZpcm0pO1xuICAgICAgICAgICAgICAgIGlmKGxpbmsyQ29uZmlybSE9dW5kZWZpbmVkKXtydW5uaW5nPWZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbmZpcm1lZExpbms9bGluazJDb25maXJtO1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjb25maXJtZWQnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGluazJDb25maXJtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1jYXRjaChleCl7XG4gICAgICAgICAgICAgICAgbGFzdEVycm9yPWV4O1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCd0cnlpbmcgdG8gZ2V0IGVtYWlsIC0gc28gZmFyIG5vIHN1Y2Nlc3M6JyxleCk7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3RyeWluZyB0byBnZXQgZW1haWwgLSBzbyBmYXIgbm8gc3VjY2VzczonLGNvdW50ZXIpO1xuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pKCk7XG5cbiAgLyogIGlmKG9zLmhvc3RuYW1lKCkhPT0ncmVndGVzdCcpeyAvL2lmIHRoaXMgaXMgYSBzZWxlbml1bSB0ZXN0IGZyb20gb3V0c2lkZSBkb2NrZXIgLSBkb24ndCB2ZXJpZnkgRE9JIGhlcmUgZm9yIHNpbXBsaWNpdHlcbiAgICAgICAgdGVzdExvZ2dpbmcoJ3JldHVybmluZyB0byB0ZXN0IHdpdGhvdXQgRE9JLXZlcmlmaWNhdGlvbiB3aGlsZSBkb2luZyBzZWxlbml1bSBvdXRzaWRlIGRvY2tlcicpO1xuICAgICAgICBjYWxsYmFjayhudWxsLCB7c3RhdHVzOiBcIkRPSSBjb25maXJtZWRcIn0pO1xuICAgICAgICAvLyByZXR1cm47XG4gICAgfWVsc2V7Ki9cbiAgICAgICAgbGV0IG5hbWVJZD1udWxsO1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICBpZihjb3VudGVyPj01MCl7XG4gICAgICAgICAgICAgICAgdGhyb3cgbGFzdEVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0ZXAgNDogY29uZmlybWluZyBsaW5rJyxjb25maXJtZWRMaW5rKTtcbiAgICAgICAgICAgIC8vQ2hlY2tpbmcgdGhlIHJlZGlyZWN0LXBhcmFtZXRlcnMgYWZ0ZXIgY29uZmlybWluZyBsaW5rXG4gICAgICAgICAgICBsZXQgcmVkaXJMaW5rID0gY2xpY2tDb25maXJtTGluayhjb25maXJtZWRMaW5rKTtcbiAgICAgICAgICAgIGlmKG9wdGlvbmFsRGF0YSAmJiBvcHRpb25hbERhdGEucmVkaXJlY3RQYXJhbSl7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0ZXAgNC41OiByZWRpcmVjdExpbmsgYWZ0ZXIgY29uZmlybWF0aW9uIGluIGNhc2Ugb2Ygb3B0aW9uYWwgZGF0YScse29wdGlvbmFsRGF0YTpvcHRpb25hbERhdGEscmVkaXJMaW5rOnJlZGlyTGlua30pO1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdyZWRpckxpbmsubG9jYXRpb246JyxyZWRpckxpbmsubG9jYXRpb24pO1xuICAgICAgICAgICAgICAgIGxldCByZWRpclVybCA9IG5ldyBVUkwocmVkaXJMaW5rLmxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZyhcIkNoZWNraW5nIGZvciByZWRpcmVjdCBwYXJhbXM6XCIsb3B0aW9uYWxEYXRhLnJlZGlyZWN0UGFyYW0pXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMob3B0aW9uYWxEYXRhLnJlZGlyZWN0UGFyYW0pLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHJlZGlyVXJsLnNlYXJjaFBhcmFtcy5oYXMoa2V5KSk7XG4gICAgICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmVxdWFsKHJlZGlyVXJsLnNlYXJjaFBhcmFtcy5nZXQoa2V5KSxcIlwiK29wdGlvbmFsRGF0YS5yZWRpcmVjdFBhcmFtW2tleV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc0JlbG93KGNvdW50ZXIsNTApO1xuICAgICAgICAgICAgLy9jb25maXJtTGluayhjb25maXJtZWRMaW5rKTtcbiAgICAgICAgICAgIGNvbnN0IG5hbWVJZCA9IGdldE5hbWVJZE9mT3B0SW5Gcm9tUmF3VHgobm9kZV91cmxfYWxpY2UscnBjQXV0aEFsaWNlLHJlc3VsdERhdGFPcHRJbi5kYXRhLmlkLHRydWUpO1xuICAgICAgICAgICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnZ290IG5hbWVJZCcsbmFtZUlkKTtcbiAgICAgICAgICAgIGdlbmVyYXRldG9hZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGdsb2JhbC5hbGljZUFkZHJlc3MsIDEsIHRydWUpO1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2JlZm9yZSB2ZXJpZmljYXRpb24nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoQXJyYXkuaXNBcnJheShzZW5kZXJfbWFpbF9pbikpe1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBzZW5kZXJfbWFpbF9pbi5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRtcElkID0gaW5kZXg9PTAgPyBuYW1lSWQgOiBuYW1lSWQrXCItXCIrKGluZGV4KTsgLy9nZXQgbmFtZWlkIG9mIGNvRE9JcyBiYXNlZCBvbiBtYXN0ZXJcbiAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJOYW1lSWQgb2YgY29Eb2k6IFwiLHRtcElkKTtcbiAgICAgICAgICAgICAgICAgICAgdmVyaWZ5RE9JKGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIHNlbmRlcl9tYWlsX2luW2luZGV4XSwgcmVjaXBpZW50X21haWwsIHRtcElkLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHZlcmlmeURPSShkYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCBub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBzZW5kZXJfbWFpbCwgcmVjaXBpZW50X21haWwsIG5hbWVJZCwgdHJ1ZSk7IC8vbmVlZCB0byBnZW5lcmF0ZSB0d28gYmxvY2tzIHRvIG1ha2UgYmxvY2sgdmlzaWJsZSBvbiBhbGljZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2FmdGVyIHZlcmlmaWNhdGlvbicpO1xuICAgICAgICAgICAgLy9jb25maXJtTGluayhjb25maXJtZWRMaW5rKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtvcHRJbjogcmVzdWx0RGF0YU9wdEluLCBuYW1lSWQ6IG5hbWVJZCxjb25maXJtTGluazogY29uZmlybWVkTGlua30pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCB7b3B0SW46IHJlc3VsdERhdGFPcHRJbiwgbmFtZUlkOiBuYW1lSWR9KTtcbiAgICAgICAgfVxuICAgIC8vfVxuXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVVzZXIodXJsLGF1dGgsdXBkYXRlSWQsbWFpbFRlbXBsYXRlLGxvZyl7XG4gICAgY29uc3QgaGVhZGVyc1VzZXIgPSB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ1gtVXNlci1JZCc6YXV0aC51c2VySWQsXG4gICAgICAgICdYLUF1dGgtVG9rZW4nOmF1dGguYXV0aFRva2VuXG4gICAgfVxuXG4gICAgY29uc3QgZGF0YVVzZXIgPSB7XCJtYWlsVGVtcGxhdGVcIjptYWlsVGVtcGxhdGV9O1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3VybDonLCB1cmwpO1xuICAgIGNvbnN0IHVybFVzZXJzID0gdXJsKycvYXBpL3YxL3VzZXJzLycrdXBkYXRlSWQ7XG4gICAgY29uc3QgcmVhbERhdGFVc2VyPSB7IGRhdGE6IGRhdGFVc2VyLCBoZWFkZXJzOiBoZWFkZXJzVXNlcn07XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygndXBkYXRlVXNlcjonLCByZWFsRGF0YVVzZXIpO1xuICAgIGxldCByZXMgPSBIVFRQLnB1dCh1cmxVc2VycyxyZWFsRGF0YVVzZXIpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJyZXNwb25zZVwiLHJlcyk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwocmVzLmRhdGEuc3RhdHVzLFwic3VjY2Vzc1wiKTtcbiAgICBjb25zdCB1c0RhdCA9IEFjY291bnRzLnVzZXJzLmZpbmRPbmUoe19pZDp1cGRhdGVJZH0pLnByb2ZpbGUubWFpbFRlbXBsYXRlO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJJbnB1dFRlbXBsYXRlXCIsZGF0YVVzZXIubWFpbFRlbXBsYXRlKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKFwiUmVzdWx0VGVtcGxhdGVcIix1c0RhdCk7XG4gICAgY2hhaS5leHBlY3QodXNEYXQpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoZGF0YVVzZXIubWFpbFRlbXBsYXRlLnRlbXBsYXRlVVJMLHVzRGF0LnRlbXBsYXRlVVJMKTtcbiAgICByZXR1cm4gdXNEYXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldFVzZXJzKCl7XG4gICAgQWNjb3VudHMudXNlcnMucmVtb3ZlKFxuICAgICAgICB7XCJ1c2VybmFtZVwiOlxuICAgICAgICAgICAgICAgIHtcIiRuZVwiOlwiYWRtaW5cIn1cbiAgICAgICAgfVxuICAgICk7XG59XG4iLCJpbXBvcnQge1xuICAgIGh0dHBQT1NUIGFzIGdldEh0dHBQT1NULFxuICAgIHRlc3RMb2cgYXMgdGVzdExvZ2dpbmcsXG4gICAgdGVzdExvZyBhcyBsb2dCbG9ja2NoYWluXG59IGZyb20gXCJtZXRlb3IvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaVwiO1xuXG5pbXBvcnQge2NoYWl9IGZyb20gJ21ldGVvci9wcmFjdGljYWxtZXRlb3I6Y2hhaSc7XG5pbXBvcnQge01ldGVvcn0gZnJvbSBcIm1ldGVvci9tZXRlb3JcIjtcbmNvbnN0IG9zID0gcmVxdWlyZSgnb3MnKTtcbmxldCBzdWRvID0gKG9zLmhvc3RuYW1lKCk9PSdyZWd0ZXN0Jyk/J3N1ZG8gJzonJ1xuY29uc3QgaGVhZGVycyA9IHsgJ0NvbnRlbnQtVHlwZSc6J3RleHQvcGxhaW4nICB9O1xuY29uc3QgZXhlYyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdEJsb2NrY2hhaW4obm9kZV91cmxfYWxpY2Usbm9kZV91cmxfYm9iLHJwY0F1dGgscHJpdktleUFsaWNlLHByaXZLZXlCb2IsbG9nKSB7ICAgICAgICAgICAgLy9jb25uZWN0IG5vZGVzIChhbGljZSAmIGJvYikgYW5kIGdlbmVyYXRlIERPSSAob25seSBpZiBub3QgY29ubmVjdGVkKVxuXG4gICAgdGVzdExvZ2dpbmcoXCJpbXBvcnRpbmcgcHJpdmF0ZSBrZXkgb2YgQWxpY2U6XCIrcHJpdktleUFsaWNlKTtcbiAgICBpbXBvcnRQcml2S2V5KG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBwcml2S2V5QWxpY2UsIHRydWUsIGxvZyk7XG5cbiAgICB0ZXN0TG9nZ2luZyhcImltcG9ydGluZyBwcml2YXRlIGtleSBvZiBCb2I6XCIrcHJpdktleUJvYik7XG4gICAgaW1wb3J0UHJpdktleShub2RlX3VybF9ib2IsIHJwY0F1dGgsIHByaXZLZXlCb2IsIHRydWUsIGxvZyk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBhbGljZUNvbnRhaW5lcklkID0gZ2V0Q29udGFpbmVySWRPZk5hbWUoJ2FsaWNlJyk7XG4gICAgICAgIGNvbnN0IHN0YXR1c0RvY2tlciA9IEpTT04ucGFyc2UoZ2V0RG9ja2VyU3RhdHVzKGFsaWNlQ29udGFpbmVySWQpKTtcbiAgICAgICAgbG9nQmxvY2tjaGFpbihcInJlYWwgYmFsYW5jZSA6XCIgKyBzdGF0dXNEb2NrZXIuYmFsYW5jZSwgKE51bWJlcihzdGF0dXNEb2NrZXIuYmFsYW5jZSkgPiAwKSk7XG4gICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJjb25uZWN0aW9uczpcIiArIHN0YXR1c0RvY2tlci5jb25uZWN0aW9ucyk7XG4gICAgICAgIGlmIChOdW1iZXIoc3RhdHVzRG9ja2VyLmNvbm5lY3Rpb25zKSA9PSAwKSB7XG4gICAgICAgICAgICBpc05vZGVBbGl2ZShub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgbG9nKTtcbiAgICAgICAgICAgIGlzTm9kZUFsaXZlQW5kQ29ubmVjdGVkVG9Ib3N0KG5vZGVfdXJsX2JvYiwgcnBjQXV0aCwgJ2FsaWNlJywgbG9nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChOdW1iZXIoc3RhdHVzRG9ja2VyLmJhbGFuY2UpID4gMCkge1xuICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcImVub3VnaCBmb3VuZGluZyBmb3IgYWxpY2UgLSBibG9ja2NoYWluIGFscmVhZHkgY29ubmVjdGVkXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLmFsaWNlQWRkcmVzcyA9IGdldE5ld0FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIGxvZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgbG9nQmxvY2tjaGFpbihcImNvbm5lY3RpbmcgYmxvY2tjaGFpbiBhbmQgbWluaW5nIHNvbWUgY29pbnNcIik7XG4gICAgfVxuICAgIGdsb2JhbC5hbGljZUFkZHJlc3MgPSBnZXROZXdBZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBsb2cpO1xuICAgIGdlbmVyYXRldG9hZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBnbG9iYWwuYWxpY2VBZGRyZXNzLCAyMTApOyAgLy8xMTAgYmxvY2tzIHRvIG5ldyBhZGRyZXNzISAxMTAgYmzDtmNrZSAqMjUgY29pbnNcblxufVxuZnVuY3Rpb24gd2FpdF90b19zdGFydF9jb250YWluZXIoc3RhcnRlZENvbnRhaW5lcklkLGNhbGxiYWNrKXtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuXG4gICAgLy9oZXJlIHdlIG1ha2Ugc3VyZSBib2IgZ2V0cyBzdGFydGVkIGFuZCBjb25uZWN0ZWQgYWdhaW4gaW4gcHJvYmFibHkgYWxsIHBvc3NpYmxlIHNpdGF1dGlvbnNcbiAgICB3aGlsZShydW5uaW5nKXtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgY29uc3Qgc3RhdHVzRG9ja2VyID0gSlNPTi5wYXJzZShnZXREb2NrZXJTdGF0dXMoc3RhcnRlZENvbnRhaW5lcklkKSk7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZyhcImdldGluZm9cIixzdGF0dXNEb2NrZXIpO1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJ2ZXJzaW9uOlwiK3N0YXR1c0RvY2tlci52ZXJzaW9uKTtcbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKFwiYmFsYW5jZTpcIitzdGF0dXNEb2NrZXIuYmFsYW5jZSk7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZyhcImNvbm5lY3Rpb25zOlwiK3N0YXR1c0RvY2tlci5jb25uZWN0aW9ucyk7XG4gICAgICAgICAgICBpZihzdGF0dXNEb2NrZXIuY29ubmVjdGlvbnM9PT0wKXtcbiAgICAgICAgICAgICAgICBkb2ljaGFpbkFkZE5vZGUoc3RhcnRlZENvbnRhaW5lcklkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlcnJvcil7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZyhcInN0YXR1c0RvY2tlciBwcm9ibGVtIHRyeWluZyB0byBzdGFydCBCb2JzIG5vZGUgaW5zaWRlIGRvY2tlciBjb250YWluZXI6XCIsZXJyb3IpO1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgIGNvbm5lY3REb2NrZXJCb2Ioc3RhcnRlZENvbnRhaW5lcklkKTtcbiAgICAgICAgICAgIH1jYXRjaChlcnJvcjIpe1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKFwiY291bGQgbm90IHN0YXJ0IGJvYjpcIixlcnJvcjIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoY291bnRlcj09NTApcnVubmluZz1mYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb3VudGVyKys7XG4gICAgfVxuICAgIGNhbGxiYWNrKG51bGwsIHN0YXJ0ZWRDb250YWluZXJJZCk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZV9vcHRpb25zX2Zyb21fYWxpY2VfYW5kX2JvYihjYWxsYmFjayl7XG5cbiAgICBjb25zdCBjb250YWluZXJJZCA9IGdldENvbnRhaW5lcklkT2ZOYW1lKCdtb25nbycpO1xuICAgIHRlc3RMb2dnaW5nKCdjb250YWluZXJJZCBvZiBtb25nbzonLGNvbnRhaW5lcklkKTtcblxuICAgIGV4ZWMoKGdsb2JhbC5pbnNpZGVfZG9ja2VyPydzdWRvJzonJykrICdkb2NrZXIgZXhlYyAnK2NvbnRhaW5lcklkKycgYmFzaCAtYyBcIm1vbmdvIDwgL3RtcC9kZWxldGVfY29sbGVjdGlvbnMuc2hcIicsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgIHRlc3RMb2dnaW5nKChnbG9iYWwuaW5zaWRlX2RvY2tlcj8nc3Vkbyc6JycpKydkb2NrZXIgZXhlYyAnLHtzdGRlcnI6c3RkZXJyLHN0ZG91dDpzdGRvdXR9KTtcbiAgICAgICAgY2FsbGJhY2soc3RkZXJyLCBzdGRvdXQpO1xuICAgIH0pO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05vZGVBbGl2ZSh1cmwsIGF1dGgsIGxvZykge1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2lzTm9kZUFsaXZlIGNhbGxlZCB0byB1cmwnLHVybCk7XG4gICAgY29uc3QgZGF0YUdldE5ldHdvcmtJbmZvID0ge1wianNvbnJwY1wiOiBcIjEuMFwiLCBcImlkXCI6IFwiZ2V0bmV0d29ya2luZm9cIiwgXCJtZXRob2RcIjogXCJnZXRuZXR3b3JraW5mb1wiLCBcInBhcmFtc1wiOiBbXX07XG4gICAgY29uc3QgcmVhbGRhdGFHZXROZXR3b3JrSW5mbyA9IHthdXRoOiBhdXRoLCBkYXRhOiBkYXRhR2V0TmV0d29ya0luZm8sIGhlYWRlcnM6IGhlYWRlcnN9O1xuICAgIGNvbnN0IHJlc3VsdEdldE5ldHdvcmtJbmZvID0gZ2V0SHR0cFBPU1QodXJsLCByZWFsZGF0YUdldE5ldHdvcmtJbmZvKTtcbiAgICBjb25zdCBzdGF0dXNHZXROZXR3b3JrSW5mbyA9IHJlc3VsdEdldE5ldHdvcmtJbmZvLnN0YXR1c0NvZGU7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCBzdGF0dXNHZXROZXR3b3JrSW5mbyk7XG4gICAgaWYobG9nKVxuICAgICAgICB0ZXN0TG9nZ2luZygncmVzdWx0R2V0TmV0d29ya0luZm86JyxyZXN1bHRHZXROZXR3b3JrSW5mbyk7IC8vIGdldG5ldHdvcmtpbmZvIHwganEgJy5sb2NhbGFkZHJlc3Nlc1swXS5hZGRyZXNzJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOb2RlQWxpdmVBbmRDb25uZWN0ZWRUb0hvc3QodXJsLCBhdXRoLCBob3N0LCBsb2cpIHtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdpc05vZGVBbGl2ZUFuZENvbm5lY3RlZFRvSG9zdCBjYWxsZWQnKTtcbiAgICBpc05vZGVBbGl2ZSh1cmwsIGF1dGgsIGxvZyk7XG5cbiAgICBjb25zdCBkYXRhR2V0TmV0d29ya0luZm8gPSB7XCJqc29ucnBjXCI6IFwiMS4wXCIsIFwiaWRcIjpcImFkZG5vZGVcIiwgXCJtZXRob2RcIjogXCJhZGRub2RlXCIsIFwicGFyYW1zXCI6IFsnYWxpY2UnLCdvbmV0cnknXSB9O1xuICAgIGNvbnN0IHJlYWxkYXRhR2V0TmV0d29ya0luZm8gPSB7IGF1dGg6IGF1dGgsIGRhdGE6IGRhdGFHZXROZXR3b3JrSW5mbywgaGVhZGVyczogaGVhZGVycyB9O1xuICAgIGNvbnN0IHJlc3VsdEdldE5ldHdvcmtJbmZvID0gZ2V0SHR0cFBPU1QodXJsLCByZWFsZGF0YUdldE5ldHdvcmtJbmZvKTtcbiAgICBjb25zdCBzdGF0dXNBZGROb2RlID0gcmVzdWx0R2V0TmV0d29ya0luZm8uc3RhdHVzQ29kZTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdhZGRub2RlOicsc3RhdHVzQWRkTm9kZSk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCBzdGF0dXNBZGROb2RlKTtcblxuXG4gICAgY29uc3QgZGF0YUdldFBlZXJJbmZvID0ge1wianNvbnJwY1wiOiBcIjEuMFwiLCBcImlkXCI6XCJnZXRwZWVyaW5mb1wiLCBcIm1ldGhvZFwiOiBcImdldHBlZXJpbmZvXCIsIFwicGFyYW1zXCI6IFtdIH07XG4gICAgY29uc3QgcmVhbGRhdGFHZXRQZWVySW5mbyA9IHsgYXV0aDogYXV0aCwgZGF0YTogZGF0YUdldFBlZXJJbmZvLCBoZWFkZXJzOiBoZWFkZXJzIH07XG4gICAgY29uc3QgcmVzdWx0R2V0UGVlckluZm8gPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhR2V0UGVlckluZm8pO1xuICAgIGNvbnN0IHN0YXR1c0dldFBlZXJJbmZvID0gcmVzdWx0R2V0UGVlckluZm8uc3RhdHVzQ29kZTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdyZXN1bHRHZXRQZWVySW5mbzonLHJlc3VsdEdldFBlZXJJbmZvKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHN0YXR1c0dldFBlZXJJbmZvKTtcbiAgICBjaGFpLmFzc2VydC5pc0Fib3ZlKHJlc3VsdEdldFBlZXJJbmZvLmRhdGEucmVzdWx0Lmxlbmd0aCwgMCwgJ25vIGNvbm5lY3Rpb24gdG8gb3RoZXIgbm9kZXMhICcpO1xuICAgIC8vY2hhaS5leHBlY3QocmVzdWx0R2V0UGVlckluZm8uZGF0YS5yZXN1bHQpLnRvLmhhdmUubGVuZ3RoT2YuYXQubGVhc3QoMSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGltcG9ydFByaXZLZXkodXJsLCBhdXRoLCBwcml2S2V5LCByZXNjYW4sIGxvZykge1xuICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdpbXBvcnRQcml2S2V5IGNhbGxlZCcsJycpO1xuICAgICAgICBjb25zdCBkYXRhX2ltcG9ydHByaXZrZXkgPSB7XCJqc29ucnBjXCI6IFwiMS4wXCIsIFwiaWRcIjpcImltcG9ydHByaXZrZXlcIiwgXCJtZXRob2RcIjogXCJpbXBvcnRwcml2a2V5XCIsIFwicGFyYW1zXCI6IFtwcml2S2V5XSB9O1xuICAgICAgICBjb25zdCByZWFsZGF0YV9pbXBvcnRwcml2a2V5ID0geyBhdXRoOiBhdXRoLCBkYXRhOiBkYXRhX2ltcG9ydHByaXZrZXksIGhlYWRlcnM6IGhlYWRlcnMgfTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0SHR0cFBPU1QodXJsLCByZWFsZGF0YV9pbXBvcnRwcml2a2V5KTtcbiAgICAgICAgaWYobG9nKSB0ZXN0TG9nZ2luZygncmVzdWx0OicscmVzdWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5ld0FkZHJlc3ModXJsLCBhdXRoLCBsb2cpIHtcblxuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2dldE5ld0FkZHJlc3MgY2FsbGVkJyk7XG4gICAgY29uc3QgZGF0YUdldE5ld0FkZHJlc3MgPSB7XCJqc29ucnBjXCI6IFwiMS4wXCIsIFwiaWRcIjpcImdldG5ld2FkZHJlc3NcIiwgXCJtZXRob2RcIjogXCJnZXRuZXdhZGRyZXNzXCIsIFwicGFyYW1zXCI6IFtdIH07XG4gICAgY29uc3QgcmVhbGRhdGFHZXROZXdBZGRyZXNzID0geyBhdXRoOiBhdXRoLCBkYXRhOiBkYXRhR2V0TmV3QWRkcmVzcywgaGVhZGVyczogaGVhZGVycyB9O1xuICAgIGNvbnN0IHJlc3VsdEdldE5ld0FkZHJlc3MgPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhR2V0TmV3QWRkcmVzcyk7XG4gICAgY29uc3Qgc3RhdHVzT3B0SW5HZXROZXdBZGRyZXNzID0gcmVzdWx0R2V0TmV3QWRkcmVzcy5zdGF0dXNDb2RlO1xuICAgIGNvbnN0IG5ld0FkZHJlc3MgID0gcmVzdWx0R2V0TmV3QWRkcmVzcy5kYXRhLnJlc3VsdDtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHN0YXR1c09wdEluR2V0TmV3QWRkcmVzcyk7XG4gICAgY2hhaS5leHBlY3QocmVzdWx0R2V0TmV3QWRkcmVzcy5kYXRhLmVycm9yKS50by5iZS5udWxsO1xuICAgIGNoYWkuZXhwZWN0KG5ld0FkZHJlc3MpLnRvLm5vdC5iZS5udWxsO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcobmV3QWRkcmVzcyk7XG4gICAgcmV0dXJuIG5ld0FkZHJlc3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZXRvYWRkcmVzcyh1cmwsYXV0aCx0b2FkZHJlc3MsYW1vdW50LGxvZyl7XG4gICAgY29uc3QgZGF0YUdlbmVyYXRlID0ge1wianNvbnJwY1wiOiBcIjEuMFwiLCBcImlkXCI6XCJnZW5lcmF0ZXRvYWRkcmVzc1wiLCBcIm1ldGhvZFwiOiBcImdlbmVyYXRldG9hZGRyZXNzXCIsIFwicGFyYW1zXCI6IFthbW91bnQsdG9hZGRyZXNzXSB9O1xuICAgIGNvbnN0IGhlYWRlcnNHZW5lcmF0ZXMgPSB7ICdDb250ZW50LVR5cGUnOid0ZXh0L3BsYWluJyAgfTtcbiAgICBjb25zdCByZWFsZGF0YUdlbmVyYXRlID0geyBhdXRoOiBhdXRoLCBkYXRhOiBkYXRhR2VuZXJhdGUsIGhlYWRlcnM6IGhlYWRlcnNHZW5lcmF0ZXMgfTtcbiAgICBjb25zdCByZXN1bHRHZW5lcmF0ZSA9IGdldEh0dHBQT1NUKHVybCwgcmVhbGRhdGFHZW5lcmF0ZSk7XG4gICAgY29uc3Qgc3RhdHVzUmVzdWx0R2VuZXJhdGUgPSByZXN1bHRHZW5lcmF0ZS5zdGF0dXNDb2RlO1xuICAgIGlmKGxvZyl0ZXN0TG9nZ2luZygnc3RhdHVzUmVzdWx0R2VuZXJhdGU6JyxzdGF0dXNSZXN1bHRHZW5lcmF0ZSk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCBzdGF0dXNSZXN1bHRHZW5lcmF0ZSk7XG4gICAgY2hhaS5leHBlY3QocmVzdWx0R2VuZXJhdGUuZGF0YS5lcnJvcikudG8uYmUubnVsbDtcbiAgICBjaGFpLmV4cGVjdChyZXN1bHRHZW5lcmF0ZS5kYXRhLnJlc3VsdCkudG8ubm90LmJlLm51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCYWxhbmNlKHVybCxhdXRoLGxvZyl7XG4gICAgY29uc3QgZGF0YUdldEJhbGFuY2UgPSB7XCJqc29ucnBjXCI6IFwiMS4wXCIsIFwiaWRcIjpcImdldGJhbGFuY2VcIiwgXCJtZXRob2RcIjogXCJnZXRiYWxhbmNlXCIsIFwicGFyYW1zXCI6IFtdIH07XG4gICAgY29uc3QgcmVhbGRhdGFHZXRCYWxhbmNlID0geyBhdXRoOiBhdXRoLCBkYXRhOiBkYXRhR2V0QmFsYW5jZSwgaGVhZGVyczogaGVhZGVycyB9O1xuICAgIGNvbnN0IHJlc3VsdEdldEJhbGFuY2UgPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhR2V0QmFsYW5jZSk7XG4gICAgaWYobG9nKXRlc3RMb2dnaW5nKCdyZXN1bHRHZXRCYWxhbmNlOicscmVzdWx0R2V0QmFsYW5jZS5kYXRhLnJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdEdldEJhbGFuY2UuZGF0YS5yZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGdldF9jb250YWluZXJfaWRfb2ZfbmFtZShuYW1lLGNhbGxiYWNrKSB7XG4gICAgZXhlYyhzdWRvKydkb2NrZXIgcHMgLS1maWx0ZXIgXCJuYW1lPScrbmFtZSsnXCIgLXEnLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICBpZihlIT1udWxsKXtcbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjYW5ub3QgZmluZCAnK25hbWUrJyBub2RlICcrc3Rkb3V0LHN0ZGVycik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBib2JzQ29udGFpbmVySWQgPSBzdGRvdXQudG9TdHJpbmcoKS50cmltKCk7IC8vLnN1YnN0cmluZygwLHN0ZG91dC50b1N0cmluZygpLmxlbmd0aC0xKTsgLy9yZW1vdmUgbGFzdCBjaGFyIHNpbmNlIGlucyBhIGxpbmUgYnJlYWtcbiAgICAgICAgY2FsbGJhY2soc3RkZXJyLCBib2JzQ29udGFpbmVySWQpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzdG9wX2RvY2tlcl9ib2IoY2FsbGJhY2spIHtcbiAgICBjb25zdCBib2JzQ29udGFpbmVySWQgPSBnZXRDb250YWluZXJJZE9mTmFtZSgnYm9iJyk7XG4gICAgdGVzdExvZ2dpbmcoJ3N0b3BwaW5nIEJvYiB3aXRoIGNvbnRhaW5lci1pZDogJytib2JzQ29udGFpbmVySWQpO1xuICAgIHRyeXtcbiAgICAgICAgZXhlYyhzdWRvKydkb2NrZXIgc3RvcCAnK2JvYnNDb250YWluZXJJZCwgKGUsIHN0ZG91dCwgc3RkZXJyKT0+IHtcbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdzdG9wcGluZyBCb2Igd2l0aCBjb250YWluZXItaWQ6ICcse3N0ZG91dDpzdGRvdXQsc3RkZXJyOnN0ZGVycn0pO1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgYm9ic0NvbnRhaW5lcklkKTtcbiAgICAgICAgfSk7XG4gICAgfWNhdGNoIChlKSB7XG4gICAgICAgIHRlc3RMb2dnaW5nKCdjb3VsZG50IHN0b3AgYm9icyBub2RlJyxlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2FkZF9ub2RlKGNvbnRhaW5lcklkLGNhbGxiYWNrKSB7XG4gICAgZXhlYyhzdWRvKydkb2NrZXIgZXhlYyAnK2NvbnRhaW5lcklkKycgZG9pY2hhaW4tY2xpIGFkZG5vZGUgYWxpY2Ugb25ldHJ5JywgKGUsIHN0ZG91dCwgc3RkZXJyKT0+IHtcbiAgICAgICAgdGVzdExvZ2dpbmcoJ2JvYiAnK2NvbnRhaW5lcklkKycgY29ubmVjdGVkPyAnLHtzdGRvdXQ6c3Rkb3V0LHN0ZGVycjpzdGRlcnJ9KTtcbiAgICAgICAgY2FsbGJhY2soc3RkZXJyLCBzdGRvdXQpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRfZG9ja2VyX3N0YXR1cyhjb250YWluZXJJZCxjYWxsYmFjaykge1xuICAgIGxvZ0Jsb2NrY2hhaW4oJ2NvbnRhaW5lcklkICcrY29udGFpbmVySWQrJyBydW5uaW5nPyAnKTtcbiAgICBleGVjKHN1ZG8rJ2RvY2tlciBleGVjICcrY29udGFpbmVySWQrJyBkb2ljaGFpbi1jbGkgLWdldGluZm8nLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICB0ZXN0TG9nZ2luZygnY29udGFpbmVySWQgJytjb250YWluZXJJZCsnIHN0YXR1czogJyx7c3Rkb3V0OnN0ZG91dCxzdGRlcnI6c3RkZXJyfSk7XG4gICAgICAgIGNhbGxiYWNrKHN0ZGVyciwgc3Rkb3V0KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc3RhcnRfZG9ja2VyX2JvYihib2JzQ29udGFpbmVySWQsY2FsbGJhY2spIHtcbiAgICBleGVjKHN1ZG8rJ2RvY2tlciBzdGFydCAnK2JvYnNDb250YWluZXJJZCwgKGUsIHN0ZG91dCwgc3RkZXJyKT0+IHtcbiAgICAgICAgdGVzdExvZ2dpbmcoJ3N0YXJ0ZWQgYm9icyBub2RlIGFnYWluOiAnK2JvYnNDb250YWluZXJJZCx7c3Rkb3V0OnN0ZG91dCxzdGRlcnI6c3RkZXJyfSk7XG4gICAgICAgIGNhbGxiYWNrKHN0ZGVyciwgc3Rkb3V0LnRvU3RyaW5nKCkudHJpbSgpKTsgLy9yZW1vdmUgbGluZSBicmVhayBmcm9tIHRoZSBlbmRcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY29ubmVjdF9kb2NrZXJfYm9iKGJvYnNDb250YWluZXJJZCwgY2FsbGJhY2spIHtcbiAgICBleGVjKHN1ZG8rJ2RvY2tlciBleGVjICcrYm9ic0NvbnRhaW5lcklkKycgZG9pY2hhaW5kIC1yZWd0ZXN0IC1kYWVtb24gLXJlaW5kZXggLWFkZG5vZGU9YWxpY2UnLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICB0ZXN0TG9nZ2luZygncmVzdGFydGluZyBkb2ljaGFpbmQgb24gYm9icyBub2RlIGFuZCBjb25uZWN0aW5nIHdpdGggYWxpY2U6ICcse3N0ZG91dDpzdGRvdXQsc3RkZXJyOnN0ZGVycn0pO1xuICAgICAgICBjYWxsYmFjayhzdGRlcnIsIHN0ZG91dCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0XzNyZF9ub2RlKGNhbGxiYWNrKSB7XG4gICAgZXhlYyhzdWRvKydkb2NrZXIgc3RhcnQgM3JkX25vZGUnLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICB0ZXN0TG9nZ2luZygndHJ5aW5nIHRvIHN0YXJ0IDNyZF9ub2RlJyx7c3Rkb3V0OnN0ZG91dCxzdGRlcnI6c3RkZXJyfSk7XG4gICAgICAgIGlmKHN0ZGVycil7XG4gICAgICAgICAgICBleGVjKHN1ZG8rJ2RvY2tlciBuZXR3b3JrIGxzIHxncmVwIGRvaWNoYWluIHwgY3V0IC1mOSAtZFwiIFwiJywgKGUsIHN0ZG91dCwgc3RkZXJyKT0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXR3b3JrID0gc3Rkb3V0LnRvU3RyaW5nKCkuc3Vic3RyaW5nKDAsc3Rkb3V0LnRvU3RyaW5nKCkubGVuZ3RoLTEpO1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjb25uZWN0aW5nIDNyZCBub2RlIHRvIGRvY2tlciBuZXR3b3JrOiAnK25ldHdvcmspO1xuICAgICAgICAgICAgICAgIGV4ZWMoc3VkbysnZG9ja2VyIHJ1biAtLWV4cG9zZT0xODMzMiAnICtcbiAgICAgICAgICAgICAgICAgICAgJy1lIFJFR1RFU1Q9dHJ1ZSAnICtcbiAgICAgICAgICAgICAgICAgICAgJy1lIERPSUNIQUlOX1ZFUj0wLjE2LjMuMiAnICtcbiAgICAgICAgICAgICAgICAgICAgJy1lIFJQQ19BTExPV19JUD06Oi8wICcgK1xuICAgICAgICAgICAgICAgICAgICAnLWUgQ09OTkVDVElPTl9OT0RFPWFsaWNlICcrXG4gICAgICAgICAgICAgICAgICAgICctZSBSUENfUEFTU1dPUkQ9Z2VuZXJhdGVkLXBhc3N3b3JkICcgK1xuICAgICAgICAgICAgICAgICAgICAnLS1uYW1lPTNyZF9ub2RlICcrXG4gICAgICAgICAgICAgICAgICAgICctLWRucz0xNzIuMjAuMC41ICAnICtcbiAgICAgICAgICAgICAgICAgICAgJy0tZG5zPTguOC44LjggJyArXG4gICAgICAgICAgICAgICAgICAgICctLWRucy1zZWFyY2g9Y2ktZG9pY2hhaW4ub3JnICcgK1xuICAgICAgICAgICAgICAgICAgICAnLS1pcD0xNzIuMjAuMC4xMCAnICtcbiAgICAgICAgICAgICAgICAgICAgJy0tbmV0d29yaz0nK25ldHdvcmsrJyAtZCBkb2ljaGFpbi9jb3JlOjAuMTYuMy4yJywgKGUsIHN0ZG91dCwgc3RkZXJyKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soc3RkZXJyLCBzdGRvdXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY2FsbGJhY2soc3RkZXJyLCBzdGRvdXQpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxufVxuXG5mdW5jdGlvbiBydW5fYW5kX3dhaXQocnVuZnVuY3Rpb24sc2Vjb25kcywgY2FsbGJhY2spe1xuICAgIE1ldGVvci5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcnVuZnVuY3Rpb24oKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCx0cnVlKTtcbiAgICB9LCBzZWNvbmRzKzEwMDApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2FpdFRvU3RhcnRDb250YWluZXIoY29udGFpbmVySWQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMod2FpdF90b19zdGFydF9jb250YWluZXIpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjb250YWluZXJJZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IoKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRlbGV0ZV9vcHRpb25zX2Zyb21fYWxpY2VfYW5kX2JvYik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydDNyZE5vZGUoKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHN0YXJ0XzNyZF9ub2RlKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0b3BEb2NrZXJCb2IoKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHN0b3BfZG9ja2VyX2JvYik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250YWluZXJJZE9mTmFtZShuYW1lKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGdldF9jb250YWluZXJfaWRfb2ZfbmFtZSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnREb2NrZXJCb2IoY29udGFpbmVySWQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoc3RhcnRfZG9ja2VyX2JvYik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNvbnRhaW5lcklkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvaWNoYWluQWRkTm9kZShjb250YWluZXJJZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9hZGRfbm9kZSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNvbnRhaW5lcklkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERvY2tlclN0YXR1cyhjb250YWluZXJJZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhnZXRfZG9ja2VyX3N0YXR1cyk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNvbnRhaW5lcklkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbm5lY3REb2NrZXJCb2IoY29udGFpbmVySWQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoY29ubmVjdF9kb2NrZXJfYm9iKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY29udGFpbmVySWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcnVuQW5kV2FpdChydW5mdW5jdGlvbiwgc2Vjb25kcykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhydW5fYW5kX3dhaXQpO1xuICAgIHJldHVybiBzeW5jRnVuYyhzZWNvbmRzKTtcbn0iLCJpbXBvcnQge2NoYWl9IGZyb20gJ21ldGVvci9wcmFjdGljYWxtZXRlb3I6Y2hhaSc7XG5pbXBvcnQgeyB0ZXN0TG9nIH0gZnJvbSBcIm1ldGVvci9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpXCI7XG5pbXBvcnQge1xuICAgIGRlbGV0ZU9wdEluc0Zyb21BbGljZUFuZEJvYiwgZ2V0QmFsYW5jZSwgaW5pdEJsb2NrY2hhaW5cbn0gZnJvbSBcIi4vdGVzdC1hcGkvdGVzdC1hcGktb24tbm9kZVwiO1xuXG5nbG9iYWwuaW5zaWRlX2RvY2tlciA9IGZhbHNlO1xuXG5jb25zdCBsb2cgPSB0cnVlO1xuY29uc3QgZG5zID0gcmVxdWlyZSgnZG5zJyk7XG5kbnMuc2V0U2VydmVycyhbXG4gICAgJzEyNy4wLjAuMScsXG5dKTsgLy93ZSB1c2Ugb3VyIG93biBkbnMgaW4gb3JkZXIgdG8gcmVzb2x2ZSB0aGUgY2ktZG9pY2hhaW4ub3JnIHRlc3QgZG9tYWluIGluY2x1ZGluZyBpdHMgVFhUIGVudHJ5XG5cbmdsb2JhbC5ub2RlX3VybF9hbGljZSA9ICdodHRwOi8vMTcyLjIwLjAuNjoxODMzMi8nO1xuaWYoIWdsb2JhbC5pbnNpZGVfZG9ja2VyKSBnbG9iYWwubm9kZV91cmxfYWxpY2UgPSAnaHR0cDovL2xvY2FsaG9zdDoxODU0My8nO1xuZ2xvYmFsLm5vZGVfdXJsX2JvYiA9ICAgJ2h0dHA6Ly8xNzIuMjAuMC43OjE4MzMyLyc7XG5pZighZ2xvYmFsLmluc2lkZV9kb2NrZXIpIGdsb2JhbC5ub2RlX3VybF9ib2IgPSAnaHR0cDovL2xvY2FsaG9zdDoxODU0NC8nO1xuZ2xvYmFsLnJwY0F1dGhBbGljZSA9IFwiYWRtaW46Z2VuZXJhdGVkLXBhc3N3b3JkXCI7XG5nbG9iYWwucnBjQXV0aCA9IFwiYWRtaW46Z2VuZXJhdGVkLXBhc3N3b3JkXCI7XG5cbmdsb2JhbC5wcml2S2V5QWxpY2UgPSBcImNORXV2bmFQVmtXN1hwM0pTNDlrOWFTcU1CZTRMU3l3czNhcTFLdkNVMXV0U0RMdFQ5RGpcIjtcbmdsb2JhbC5wcml2S2V5Qm9iID0gXCJjUDNFaWdrenNXdXlLRW14azhjQzZxWFliNFpqd1VvNXZ6dlpwQVBtRFE4M1JDZ1hRcnVqXCI7XG5cbmdsb2JhbC5kYXBwVXJsQWxpY2UgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiO1xuZ2xvYmFsLmRhcHBVcmxCb2IgPSBnbG9iYWwuaW5zZGVfZG9ja2VyP1wiaHR0cDovLzE3Mi4yMC4wLjg6NDAwMFwiOlwiaHR0cDovL2xvY2FsaG9zdDo0MDAwXCI7XG5nbG9iYWwuZEFwcExvZ2luID0ge1widXNlcm5hbWVcIjpcImFkbWluXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn07XG5cbmlmKE1ldGVvci5pc0FwcFRlc3QpIHtcbiAgICBkZXNjcmliZSgnYmFzaWMtZG9pLXRlc3QtMCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0KDApO1xuXG4gICAgICAgIGJlZm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0ZXN0TG9nKFwicmVtb3ZpbmcgT3B0SW5zLFJlY2lwaWVudHMsU2VuZGVyc1wiLCcnKTtcbiAgICAgICAgICAgIGRlbGV0ZU9wdEluc0Zyb21BbGljZUFuZEJvYigpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBhIFJlZ1Rlc3QgRG9pY2hhaW4gd2l0aCBhbGljZSBhbmQgYm9iIGFuZCBzb21lIERvaSAtIGNvaW5zJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW5pdEJsb2NrY2hhaW4oZ2xvYmFsLm5vZGVfdXJsX2FsaWNlLGdsb2JhbC5ub2RlX3VybF9ib2IsZ2xvYmFsLnJwY0F1dGgsZ2xvYmFsLnByaXZLZXlBbGljZSxnbG9iYWwucHJpdktleUJvYix0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGFsaWNlQmFsYW5jZSA9IGdldEJhbGFuY2UoZ2xvYmFsLm5vZGVfdXJsX2FsaWNlLCBnbG9iYWwucnBjQXV0aCwgbG9nKTtcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzQWJvdmUoYWxpY2VCYWxhbmNlLCAwLCAnbm8gZnVuZGluZyEgJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuaW1wb3J0IHtcbiAgICBsb2dpbixcbiAgICBjcmVhdGVVc2VyLFxuICAgIGZpbmRVc2VyLFxuICAgIGV4cG9ydE9wdElucyxcbiAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pLCByZXNldFVzZXJzLCB1cGRhdGVVc2VyLCBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMywgY29uZmlybUxpbmssIGNsaWNrQ29uZmlybUxpbmtcbn0gZnJvbSBcIi4vdGVzdC1hcGkvdGVzdC1hcGktb24tZGFwcFwiO1xuaW1wb3J0IHtcbiAgICB0ZXN0TG9nIGFzIGxvZ0Jsb2NrY2hhaW5cbn0gZnJvbSBcIm1ldGVvci9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpXCI7XG5cbmltcG9ydCB7ZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9ifSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1ub2RlXCI7XG5cbmxldCB0ZW1wbGF0ZVVybEE9XCJodHRwOi8vMTcyLjIwLjAuODo0MDAwL3RlbXBsYXRlcy9lbWFpbHMvZG9pY2hhaW4tYW5tZWxkdW5nLWZpbmFsLURFLmh0bWxcIjtcbmxldCB0ZW1wbGF0ZVVybEI9XCJodHRwOi8vMTcyLjIwLjAuODo0MDAwL3RlbXBsYXRlcy9lbWFpbHMvZG9pY2hhaW4tYW5tZWxkdW5nLWZpbmFsLUVOLmh0bWxcIjtcbmlmKCFnbG9iYWwuaW5zaWRlX2RvY2tlcil7XG4gICAgdGVtcGxhdGVVcmxBPVwiaHR0cDovL2xvY2FsaG9zdDo0MDAwL3RlbXBsYXRlcy9lbWFpbHMvZG9pY2hhaW4tYW5tZWxkdW5nLWZpbmFsLURFLmh0bWxcIjtcbiAgICB0ZW1wbGF0ZVVybEI9XCJodHRwOi8vbG9jYWxob3N0OjQwMDAvdGVtcGxhdGVzL2VtYWlscy9kb2ljaGFpbi1hbm1lbGR1bmctZmluYWwtRU4uaHRtbFwiO1xufVxuXG5jb25zdCBhbGljZUFMb2dpbiA9IHtcInVzZXJuYW1lXCI6XCJhbGljZS1hXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn07XG5jb25zdCBhbGljZUJMb2dpbiA9IHtcInVzZXJuYW1lXCI6XCJhbGljZS1hXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn07XG5cbmNvbnN0IHJlY2lwaWVudF9wb3AzdXNlcm5hbWUgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjtcbmNvbnN0IHJlY2lwaWVudF9wb3AzcGFzc3dvcmQgPSBcImJvYlwiO1xuXG5jb25zdCBsb2cgPSB0cnVlO1xuXG5pZihNZXRlb3IuaXNBcHBUZXN0KSB7XG4gICAgZGVzY3JpYmUoJ2Jhc2ljLWRvaS10ZXN0LTAxJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRpbWVvdXQoMCk7XG5cbiAgICAgICAgYmVmb3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJyZW1vdmluZyBPcHRJbnMsUmVjaXBpZW50cyxTZW5kZXJzXCIpO1xuICAgICAgICAgICAgZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iKCk7XG4gICAgICAgICAgICBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMyhnbG9iYWwuaW5zaWRlX2RvY2tlcj9cIm1haWxcIjpcImxvY2FsaG9zdFwiLCAxMTAsIHJlY2lwaWVudF9wb3AzdXNlcm5hbWUsIHJlY2lwaWVudF9wb3AzcGFzc3dvcmQsIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgYWRMb2cgPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCBnbG9iYWwuZEFwcExvZ2luLCBmYWxzZSk7XG4gICAgICAgICAgICB1cGRhdGVVc2VyKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGFkTG9nLCBhZExvZy51c2VySWQsIHt9LGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFmdGVyRWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc3QgYWRMb2cgPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCBnbG9iYWwuZEFwcExvZ2luLCBmYWxzZSk7XG4gICAgICAgICAgICB1cGRhdGVVc2VyKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGFkTG9nLCBhZExvZy51c2VySWQsIHt9LGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGJhc2ljIERvaWNoYWluIHdvcmtmbG93IGlzIHdvcmtpbmcgd2l0aCBvcHRpb25hbCBkYXRhJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIHN0YW5kYXJkIHRvIG5vdCBjb25mdXNlIHBlb3BsZSFcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZUBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFMb2dpbkFsaWNlID0gbG9naW4oZ2xvYmFsLmRhcHBVcmxBbGljZSwgZ2xvYmFsLmRBcHBMb2dpbiwgZmFsc2UpOyAvL2xvZyBpbnRvIGRBcHBcbiAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2koZ2xvYmFsLm5vZGVfdXJsX2FsaWNlLCBnbG9iYWwucnBjQXV0aEFsaWNlLCBnbG9iYWwuZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgZ2xvYmFsLmRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgeydjaXR5JzogJ0VrYXRlcmluYnVyZyd9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiBiYXNpYyBEb2ljaGFpbiB3b3JrZmxvdyBpcyB3b3JraW5nIHdpdGhvdXQgb3B0aW9uYWwgZGF0YScsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYWxpY2VAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIGFuIGFsZXJuYXRpdmUgd2hlbiBhYm92ZSBzdGFuZGFyZCBpcyBub3QgcG9zc2libGVcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICAvL2xvZ2luIHRvIGRBcHAgJiByZXF1ZXN0IERPSSBvbiBhbGljZSB2aWEgYm9iXG4gICAgICAgICAgICBjb25zdCBkYXRhTG9naW5BbGljZSA9IGxvZ2luKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGdsb2JhbC5kQXBwTG9naW4sIGZhbHNlKTsgLy9sb2cgaW50byBkQXBwXG4gICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKGdsb2JhbC5ub2RlX3VybF9hbGljZSwgZ2xvYmFsLnJwY0F1dGhBbGljZSwgZ2xvYmFsLmRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIGdsb2JhbC5kYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIG51bGwsIFwiYWxpY2VAY2ktZG9pY2hhaW4ub3JnXCIsIFwiYWxpY2VcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY3JlYXRlIHR3byBtb3JlIHVzZXJzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIHJlc2V0VXNlcnMoKTtcbiAgICAgICAgICAgIGNvbnN0IGxvZ0FkbWluID0gbG9naW4oZ2xvYmFsLmRhcHBVcmxBbGljZSwgZ2xvYmFsLmRBcHBMb2dpbiwgZmFsc2UpO1xuICAgICAgICAgICAgbGV0IHVzZXJBID0gY3JlYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgXCJhbGljZS1hXCIsIHRlbXBsYXRlVXJsQSwgdHJ1ZSk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChmaW5kVXNlcih1c2VyQSkpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBsZXQgdXNlckIgPSBjcmVhdGVVc2VyKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGxvZ0FkbWluLCBcImFsaWNlLWJcIiwgdGVtcGxhdGVVcmxCLCB0cnVlKTtcbiAgICAgICAgICAgIGNoYWkuZXhwZWN0KGZpbmRVc2VyKHVzZXJCKSkudG8ubm90LmJlLnVuZGVmaW5lZDtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRlc3QgaWYgRG9pY2hhaW4gd29ya2Zsb3cgaXMgdXNpbmcgZGlmZmVyZW50IHRlbXBsYXRlcyBmb3IgZGlmZmVyZW50IHVzZXJzJywgZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICAgICAgcmVzZXRVc2VycygpO1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjsgLy9cbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsX2FsaWNlX2EgPSBcImFsaWNlLWFAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbF9hbGljZV9iID0gXCJhbGljZS1iQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgY29uc3QgbG9nQWRtaW4gPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCBnbG9iYWwuZEFwcExvZ2luLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGxldCB1c2VyQSA9IGNyZWF0ZVVzZXIoZ2xvYmFsLmRhcHBVcmxBbGljZSwgbG9nQWRtaW4sIFwiYWxpY2UtYVwiLCB0ZW1wbGF0ZVVybEEsIHRydWUpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoZmluZFVzZXIodXNlckEpKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgICAgICAgICAgbGV0IHVzZXJCID0gY3JlYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgXCJhbGljZS1iXCIsIHRlbXBsYXRlVXJsQiwgdHJ1ZSk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChmaW5kVXNlcih1c2VyQikpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvZ1VzZXJBID0gbG9naW4oZ2xvYmFsLmRhcHBVcmxBbGljZSwgYWxpY2VBTG9naW4sIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgbG9nVXNlckIgPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCBhbGljZUJMb2dpbiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaSBjaGVja3MgaWYgdGhlIFwibG9nXCIgdmFsdWUgKGlmIGl0IGlzIGEgU3RyaW5nKSBpcyBpbiB0aGUgbWFpbC10ZXh0XG4gICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKGdsb2JhbC5ub2RlX3VybF9hbGljZSwgZ2xvYmFsLnJwY0F1dGhBbGljZSxnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dVc2VyQSwgZ2xvYmFsLmRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbF9hbGljZV9hLCB7J2NpdHknOiAnRWthdGVyaW5idXJnJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCBcImtvc3Rlbmxvc2UgQW5tZWxkdW5nXCIpO1xuICAgICAgICAgICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShnbG9iYWwubm9kZV91cmxfYWxpY2UsIGdsb2JhbC5ycGNBdXRoQWxpY2UsIGdsb2JhbC5kYXBwVXJsQWxpY2UsIGxvZ1VzZXJCLCBnbG9iYWwuZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsX2FsaWNlX2IsIHsnY2l0eSc6ICdTaW1iYWNoJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCBcImZyZWUgcmVnaXN0cmF0aW9uXCIpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiB1c2VycyBjYW4gZXhwb3J0IE9wdElucyAnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgcmVzZXRVc2VycygpO1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjsgLy9cbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsX2FsaWNlX2EgPSBcImFsaWNlLWV4cG9ydF9hQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWxfYWxpY2VfYiA9IFwiYWxpY2UtZXhwb3J0X2JAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICBjb25zdCBsb2dBZG1pbiA9IGxvZ2luKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGdsb2JhbC5kQXBwTG9naW4sIHRydWUpO1xuICAgICAgICAgICAgY3JlYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLGxvZ0FkbWluLFwiYmFzaWN1c2VyXCIsdGVtcGxhdGVVcmxBLHRydWUpO1xuICAgICAgICAgICAgY29uc3QgbG9nQmFzaWMgPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCB7XCJ1c2VybmFtZVwiOlwiYmFzaWN1c2VyXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn0sIHRydWUpO1xuICAgICAgICAgICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShnbG9iYWwubm9kZV91cmxfYWxpY2UsIGdsb2JhbC5ycGNBdXRoQWxpY2UsIGdsb2JhbC5kYXBwVXJsQWxpY2UsIGxvZ0Jhc2ljLCBnbG9iYWwuZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsX2FsaWNlX2EsIHsnY2l0eSc6ICdNw7xuY2hlbid9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKGdsb2JhbC5ub2RlX3VybF9hbGljZSwgZ2xvYmFsLnJwY0F1dGhBbGljZSwgZ2xvYmFsLmRhcHBVcmxBbGljZSwgbG9nQWRtaW4sIGdsb2JhbC5kYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWxfYWxpY2VfYiwgeydjaXR5JzogJ03DvG5jaGVuJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cG9ydGVkT3B0SW5zID0gZXhwb3J0T3B0SW5zKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGxvZ0FkbWluLCB0cnVlKTtcbiAgICAgICAgICAgIGNoYWkuZXhwZWN0KGV4cG9ydGVkT3B0SW5zKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXhwb3J0ZWRPcHRJbnMpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoZXhwb3J0ZWRPcHRJbnNbMF0pLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChleHBvcnRlZE9wdEluc1swXS5SZWNpcGllbnRFbWFpbC5lbWFpbCkudG8uYmUuZXF1YWwocmVjaXBpZW50X21haWwpO1xuXG4gICAgICAgICAgICBjb25zdCBleHBvcnRlZE9wdEluc0EgPSBleHBvcnRPcHRJbnMoZ2xvYmFsLmRhcHBVcmxBbGljZSwgbG9nQmFzaWMsIHRydWUpO1xuICAgICAgICAgICAgZXhwb3J0ZWRPcHRJbnNBLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgY2hhaS5leHBlY3QoZWxlbWVudC5vd25lcklkKS50by5iZS5lcXVhbChsb2dCYXNpYy51c2VySWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL2NoYWkuZXhwZWN0KGZpbmRPcHRJbihyZXN1bHREYXRhT3B0SW4uX2lkKSkudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGFkbWluIGNhbiB1cGRhdGUgdXNlciBwcm9maWxlcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlc2V0VXNlcnMoKTtcbiAgICAgICAgICAgIGxldCBsb2dBZG1pbiA9IGxvZ2luKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGdsb2JhbC5kQXBwTG9naW4sIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXNlclVwID0gY3JlYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgXCJ1cGRhdGVVc2VyXCIsIHRlbXBsYXRlVXJsQSwgdHJ1ZSk7XG4gICAgICAgICAgICBsb2dCbG9ja2NoYWluKCdjcmVhdGVVc2VyOicsdXNlclVwKTtcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZWREYXRhID0gdXBkYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgdXNlclVwLCB7XCJ0ZW1wbGF0ZVVSTFwiOiB0ZW1wbGF0ZVVybEJ9LCB0cnVlKTtcbiAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oJ2NoYW5nZWREYXRhOicsY2hhbmdlZERhdGEpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoY2hhbmdlZERhdGEpLm5vdC51bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiB1c2VyIGNhbiB1cGRhdGUgb3duIHByb2ZpbGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXNldFVzZXJzKCk7XG4gICAgICAgICAgICBsZXQgbG9nQWRtaW4gPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCBnbG9iYWwuZEFwcExvZ2luLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJVcCA9IGNyZWF0ZVVzZXIoZ2xvYmFsLmRhcHBVcmxBbGljZSwgbG9nQWRtaW4sIFwidXBkYXRlVXNlclwiLCB0ZW1wbGF0ZVVybEEsIHRydWUpO1xuICAgICAgICAgICAgLy9sb2dCbG9ja2NoYWluKCdzaG91bGQgdGVzdCBpZiB1c2VyIGNhbiB1cGRhdGUgb3duIHByb2ZpbGU6dXNlclVwOicsdXNlclVwKTtcbiAgICAgICAgICAgIGNvbnN0IGxvZ1VzZXJVcCA9IGxvZ2luKGdsb2JhbC5kYXBwVXJsQWxpY2UsIHtcInVzZXJuYW1lXCI6IFwidXBkYXRlVXNlclwiLCBcInBhc3N3b3JkXCI6IFwicGFzc3dvcmRcIn0sIHRydWUpO1xuICAgICAgICAgICAgLy9sb2dCbG9ja2NoYWluKCdzaG91bGQgdGVzdCBpZiB1c2VyIGNhbiB1cGRhdGUgb3duIHByb2ZpbGU6bG9nVXNlclVwOicsbG9nVXNlclVwKTtcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZWREYXRhID0gdXBkYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBsb2dVc2VyVXAsIHVzZXJVcCwge1widGVtcGxhdGVVUkxcIjogdGVtcGxhdGVVcmxCfSwgdHJ1ZSk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChjaGFuZ2VkRGF0YSkubm90LnVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGNvRG9pIHdvcmtzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgY29Eb2lMaXN0ID0gW1wiYWxpY2VDbzFAZG9pY2hhaW4tY2kuY29tXCIsIFwiYWxpY2VDbzJAZG9pY2hhaW4tY2kuY29tXCIsIFwiYWxpY2VDbzNAZG9pY2hhaW4tY2kuY29tXCJdO1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gY29Eb2lMaXN0O1xuICAgICAgICAgICAgbGV0IGxvZ0FkbWluID0gbG9naW4oZ2xvYmFsLmRhcHBVcmxBbGljZSwgZ2xvYmFsLmRBcHBMb2dpbiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBjb0RvaXMgPSByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKGdsb2JhbC5ub2RlX3VybF9hbGljZSwgZ2xvYmFsLnJwY0F1dGhBbGljZSwgZ2xvYmFsLmRhcHBVcmxBbGljZSwgbG9nQWRtaW4sIGdsb2JhbC5kYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIHsnY2l0eSc6ICdFa2F0ZXJpbmJ1cmcnfSwgXCJib2JAY2ktZG9pY2hhaW4ub3JnXCIsIFwiYm9iXCIsIHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGZpbmQgdXBkYXRlZCBEYXRhIGluIGVtYWlsJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIHN0YW5kYXJkIHRvIG5vdCBjb25mdXNlIHBlb3BsZSFcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZS11cGRhdGVAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICBjb25zdCBhZExvZyA9IGxvZ2luKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGdsb2JhbC5kQXBwTG9naW4sIGZhbHNlKTtcbiAgICAgICAgICAgIHVwZGF0ZVVzZXIoZ2xvYmFsLmRhcHBVcmxBbGljZSwgYWRMb2csIGFkTG9nLnVzZXJJZCwge1wic3ViamVjdFwiOiBcInVwZGF0ZVRlc3RcIiwgXCJ0ZW1wbGF0ZVVSTFwiOiB0ZW1wbGF0ZVVybEJ9KTtcbiAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2koZ2xvYmFsLm5vZGVfdXJsX2FsaWNlLCBnbG9iYWwucnBjQXV0aEFsaWNlLCBnbG9iYWwuZGFwcFVybEFsaWNlLCBhZExvZywgZ2xvYmFsLmRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgeydjaXR5JzogJ0VrYXRlcmluYnVyZyd9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIix0cnVlLCBcInVwZGF0ZVRlc3RcIik7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdXNlIFVSTCBwYXJhbXMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjsgLy9wbGVhc2UgdXNlIHRoaXMgYXMgc3RhbmRhcmQgdG8gbm90IGNvbmZ1c2UgcGVvcGxlIVxuICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWxfYSA9IFwiYWxpY2UtcGFyYW0tYUBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsX2IgPSBcImFsaWNlLXBhcmFtLWJAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICBjb25zdCBhZExvZyA9IGxvZ2luKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGdsb2JhbC5kQXBwTG9naW4sIGZhbHNlKTtcbiAgICAgICAgICAgIHVwZGF0ZVVzZXIoZ2xvYmFsLmRhcHBVcmxBbGljZSwgYWRMb2csIGFkTG9nLnVzZXJJZCwge1wic3ViamVjdFwiOiBcInBhcmFtVGVzdFwiLCBcInJlZGlyZWN0XCI6IFwiaHR0cHM6Ly93d3cuZG9pY2hhaW4ub3JnXCIsIFwidGVtcGxhdGVVUkxcIjogZ2xvYmFsLmRhcHBVcmxBbGljZStcIi9hcGkvdjEvdGVtcGxhdGVcIn0sdHJ1ZSk7XG4gICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKGdsb2JhbC5ub2RlX3VybF9hbGljZSwgZ2xvYmFsLnJwY0F1dGhBbGljZSwgZ2xvYmFsLmRhcHBVcmxBbGljZSwgYWRMb2csIGdsb2JhbC5kYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWxfYSwgeydyZWRpcmVjdFBhcmFtJzogeydwJzoxfSwndGVtcGxhdGVQYXJhbSc6eydsYW5nJzonZW4nfX0sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLHRydWUsXCJ5b3VyIGZyZWUgcmVnaXN0YXRpb25cIik7XG4gICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKGdsb2JhbC5ub2RlX3VybF9hbGljZSwgZ2xvYmFsLnJwY0F1dGhBbGljZSwgZ2xvYmFsLmRhcHBVcmxBbGljZSwgYWRMb2csIGdsb2JhbC5kYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWxfYiwgeydyZWRpcmVjdFBhcmFtJzogeydwJzoxfSwndGVtcGxhdGVQYXJhbSc6eydsYW5nJzonZGUnfX0sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLHRydWUsXCJJaHJlIGtvc3Rlbmxvc2UgQW5tZWxkdW5nXCIpO1xuICAgICAgICAgICAgdXBkYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBhZExvZywgYWRMb2cudXNlcklkLCB7fSx0cnVlKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB1c2UgdGhlIHRleHQgdmVyc2lvbicsIGZ1bmN0aW9uKGRvbmUpe1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjsgLy9wbGVhc2UgdXNlIHRoaXMgYXMgc3RhbmRhcmQgdG8gbm90IGNvbmZ1c2UgcGVvcGxlIVxuICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWxfYSA9IFwiYWxpY2UtdGV4dEBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IGFkTG9nID0gbG9naW4oZ2xvYmFsLmRhcHBVcmxBbGljZSwgZ2xvYmFsLmRBcHBMb2dpbiwgZmFsc2UpO1xuICAgICAgICAgICAgdXBkYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBhZExvZywgYWRMb2cudXNlcklkLCB7XCJzdWJqZWN0XCI6IFwidGV4dFRlc3RcIiwgXCJyZWRpcmVjdFwiOiBcIlwiLCBcInRlbXBsYXRlVVJMXCI6IHRlbXBsYXRlVXJsQS5yZXBsYWNlKFwiaHRtbFwiLFwidHh0XCIpfSx0cnVlKTtcbiAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2koZ2xvYmFsLm5vZGVfdXJsX2FsaWNlLCBnbG9iYWwucnBjQXV0aEFsaWNlLCBnbG9iYWwuZGFwcFVybEFsaWNlLCBhZExvZywgZ2xvYmFsLmRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbF9hLG51bGwsXCJib2JAY2ktZG9pY2hhaW4ub3JnXCIsIFwiYm9iXCIsdHJ1ZSxcInlvdXIgZnJlZSByZWdpc3RhdGlvblwiKTtcbiAgICAgICAgICAgIHVwZGF0ZVVzZXIoZ2xvYmFsLmRhcHBVcmxBbGljZSwgYWRMb2csIGFkTG9nLnVzZXJJZCwge30sdHJ1ZSk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdXNlIHRoZSBqc29uL211bHRpcGFydCB2ZXJzaW9uJywgZnVuY3Rpb24oZG9uZSl7XG4gICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiOyAvL3BsZWFzZSB1c2UgdGhpcyBhcyBzdGFuZGFyZCB0byBub3QgY29uZnVzZSBwZW9wbGUhXG4gICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbF9hID0gXCJhbGljZS1wYXJhbS1tdWx0aUBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IGFkTG9nID0gbG9naW4oZ2xvYmFsLmRhcHBVcmxBbGljZSwgZ2xvYmFsLmRBcHBMb2dpbiwgZmFsc2UpO1xuICAgICAgICAgICAgdXBkYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBhZExvZywgYWRMb2cudXNlcklkLCB7XCJzdWJqZWN0XCI6IFwibXVsdGlUZXN0XCIsIFwicmVkaXJlY3RcIjogXCJcIiwgXCJ0ZW1wbGF0ZVVSTFwiOiB0ZW1wbGF0ZVVybEEucmVwbGFjZShcImh0bWxcIixcImpzb25cIil9LHRydWUpO1xuICAgICAgICAgICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShnbG9iYWwubm9kZV91cmxfYWxpY2UsIGdsb2JhbC5ycGNBdXRoQWxpY2UsIGdsb2JhbC5kYXBwVXJsQWxpY2UsIGFkTG9nLCBnbG9iYWwuZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsX2EsbnVsbCxcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIix0cnVlLFwieW91ciBmcmVlIHJlZ2lzdGF0aW9uXCIpO1xuICAgICAgICAgICAgdXBkYXRlVXNlcihnbG9iYWwuZGFwcFVybEFsaWNlLCBhZExvZywgYWRMb2cudXNlcklkLCB7fSx0cnVlKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZWRpcmVjdCBpZiBjb25maXJtYXRpb24tbGluayBpcyBjbGlja2VkIGFnYWluJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDM7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiOyAvL3BsZWFzZSB1c2UgdGhpcyBhcyBzdGFuZGFyZCB0byBub3QgY29uZnVzZSBwZW9wbGUhXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWwgPSBcImFsaWNlX1wiK2luZGV4K1wiQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFMb2dpbkFsaWNlID0gbG9naW4oZ2xvYmFsLmRhcHBVcmxBbGljZSwgZ2xvYmFsLmRBcHBMb2dpbiwgZmFsc2UpOyAvL2xvZyBpbnRvIGRBcHBcbiAgICAgICAgICAgICAgICB1cGRhdGVVc2VyKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCBkYXRhTG9naW5BbGljZS51c2VySWQse1wic3ViamVjdFwiOlwibXVsdGljbGlja1Rlc3RcIn0sdHJ1ZSk7XG4gICAgICAgICAgICAgICAgbGV0IHJldHVybmVkRGF0YSA9IHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2koZ2xvYmFsLm5vZGVfdXJsX2FsaWNlLCBnbG9iYWwucnBjQXV0aEFsaWNlLCBnbG9iYWwuZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgZ2xvYmFsLmRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgeydjaXR5JzogJ0VrYXRlcmluYnVyZyd9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbignZG91YmxlIGxpbmsgY2xpY2sgdGVzdCByZXR1cm5lZERhdGE6JyxyZXR1cm5lZERhdGEpXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQubm90RXF1YWwobnVsbCxjbGlja0NvbmZpcm1MaW5rKHJldHVybmVkRGF0YS5jb25maXJtTGluaykubG9jYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0iLCJpbXBvcnQge2NoYWl9IGZyb20gJ21ldGVvci9wcmFjdGljYWxtZXRlb3I6Y2hhaSc7XG5pbXBvcnQge1xuICAgIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzLFxuICAgIGZldGNoQ29uZmlybUxpbmtGcm9tUG9wM01haWwsXG4gICAgZ2V0TmFtZUlkT2ZPcHRJbkZyb21SYXdUeCxcbiAgICBsb2dpbixcbiAgICByZXF1ZXN0RE9JLCB2ZXJpZnlET0ksIGNsaWNrQ29uZmlybUxpbmtcbn0gZnJvbSBcIi4vdGVzdC1hcGkvdGVzdC1hcGktb24tZGFwcFwiO1xuaW1wb3J0IHtcbiAgICB0ZXN0TG9nIGFzIHRlc3RMb2dnaW5nXG59IGZyb20gXCJtZXRlb3IvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaVwiO1xuaW1wb3J0IHtcbiAgICBkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IsXG4gICAgZ2VuZXJhdGV0b2FkZHJlc3MsXG4gICAgZ2V0TmV3QWRkcmVzcyxcbiAgICBzdGFydDNyZE5vZGUsXG4gICAgc3RhcnREb2NrZXJCb2IsXG4gICAgc3RvcERvY2tlckJvYiwgd2FpdFRvU3RhcnRDb250YWluZXJcbn0gZnJvbSBcIi4vdGVzdC1hcGkvdGVzdC1hcGktb24tbm9kZVwiO1xuY29uc3QgZXhlYyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuY29uc3QgcmVjaXBpZW50X3BvcDN1c2VybmFtZSA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiO1xuY29uc3QgcmVjaXBpZW50X3BvcDNwYXNzd29yZCA9IFwiYm9iXCI7XG5cbmNvbnN0IHJwY0F1dGggPSBcImFkbWluOmdlbmVyYXRlZC1wYXNzd29yZFwiO1xuY29uc3QgZEFwcExvZ2luID0ge1widXNlcm5hbWVcIjpcImFkbWluXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn07XG5jb25zdCBsb2cgPSB0cnVlO1xuXG5pZihNZXRlb3IuaXNBcHBUZXN0KSB7XG4gICAgZGVzY3JpYmUoJzAyLWJhc2ljLWRvaS10ZXN0LXdpdGgtb2ZmbGluZS1ub2RlLTAyJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGJlZm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IoKTtcbiAgICAgICAgICAgIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzKGdsb2JhbC5pbnNpZGVfZG9ja2VyP1wibWFpbFwiOlwibG9jYWxob3N0XCIsIDExMCwgcmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgdHJ1ZSk7XG4gICAgICAgICAgICBleGVjKChnbG9iYWwuaW5zaWRlX2RvY2tlcj8nc3Vkbyc6JycpKycgZG9ja2VyIHJtIDNyZF9ub2RlJywgKGUsIHN0ZG91dDIsIHN0ZGVycjIpID0+IHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnZGVsZXRlZCAzcmRfbm9kZTonLCB7c3Rkb3V0OiBzdGRvdXQyLCBzdGRlcnI6IHN0ZGVycjJ9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGV4ZWMoKGdsb2JhbC5pbnNpZGVfZG9ja2VyPydzdWRvJzonJykrJyBkb2NrZXIgc3RvcCAzcmRfbm9kZScsIChlLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnc3RvcHBlZCAzcmRfbm9kZTonLCB7c3Rkb3V0OiBzdGRvdXQsIHN0ZGVycjogc3RkZXJyfSk7XG4gICAgICAgICAgICAgICAgICAgIGV4ZWMoKGdsb2JhbC5pbnNpZGVfZG9ja2VyPydzdWRvJzonJykrJyBkb2NrZXIgcm0gM3JkX25vZGUnLCAoZSwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdyZW1vdmVkIDNyZF9ub2RlOicsIHtzdGRvdXQ6IHN0ZG91dCwgc3RkZXJyOiBzdGRlcnJ9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjb3VsZCBub3Qgc3RvcCAzcmRfbm9kZScsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYmVmb3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZXhlYygoZ2xvYmFsLmluc2lkZV9kb2NrZXI/J3N1ZG8nOicnKSsnIGRvY2tlciBzdG9wIDNyZF9ub2RlJywgKGUsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdzdG9wcGVkIDNyZF9ub2RlOicsIHtzdGRvdXQ6IHN0ZG91dCwgc3RkZXJyOiBzdGRlcnJ9KTtcbiAgICAgICAgICAgICAgICAgICAgZXhlYygoZ2xvYmFsLmluc2lkZV9kb2NrZXI/J3N1ZG8nOicnKSsnIGRvY2tlciBybSAzcmRfbm9kZScsIChlLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3JlbW92ZWQgM3JkX25vZGU6Jywge3N0ZG91dDogc3Rkb3V0LCBzdGRlcnI6IHN0ZGVycn0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2NvdWxkIG5vdCBzdG9wIDNyZF9ub2RlJywpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRlc3QgaWYgYmFzaWMgRG9pY2hhaW4gd29ya2Zsb3cgaXMgd29ya2luZyB3aGVuIEJvYnMgbm9kZSBpcyB0ZW1wb3JhcmlseSBvZmZsaW5lJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIHRoaXMudGltZW91dCgwKTtcbiAgICAgICAgICAgIGdsb2JhbC5hbGljZUFkZHJlc3MgPSBnZXROZXdBZGRyZXNzKGdsb2JhbC5ub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgZmFsc2UpO1xuICAgICAgICAgICAgLy9zdGFydCBhbm90aGVyIDNyZCBub2RlIGJlZm9yZSBzaHV0ZG93biBCb2JcbiAgICAgICAgICAgIHN0YXJ0M3JkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lcklkID0gc3RvcERvY2tlckJvYigpO1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZS10by1vZmZsaW5lLW5vZGVAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICAvL2xvZ2luIHRvIGRBcHAgJiByZXF1ZXN0IERPSSBvbiBhbGljZSB2aWEgYm9iXG4gICAgICAgICAgICBpZiAobG9nKSB0ZXN0TG9nZ2luZygnbG9nIGludG8gYWxpY2UgYW5kIHJlcXVlc3QgRE9JJyk7XG4gICAgICAgICAgICBsZXQgZGF0YUxvZ2luQWxpY2UgPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIGZhbHNlKTsgLy9sb2cgaW50byBkQXBwXG4gICAgICAgICAgICBsZXQgcmVzdWx0RGF0YU9wdEluID0gcmVxdWVzdERPSShnbG9iYWwuZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsLCBudWxsLCB0cnVlKTtcblxuICAgICAgICAgICAgY29uc3QgbmFtZUlkID0gZ2V0TmFtZUlkT2ZPcHRJbkZyb21SYXdUeChnbG9iYWwubm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIHJlc3VsdERhdGFPcHRJbi5kYXRhLmlkLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChsb2cpIHRlc3RMb2dnaW5nKCdnb3QgbmFtZUlkJywgbmFtZUlkKTtcbiAgICAgICAgICAgIHZhciBzdGFydGVkQ29udGFpbmVySWQgPSBzdGFydERvY2tlckJvYihjb250YWluZXJJZCk7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZyhcInN0YXJ0ZWQgYm9iJ3Mgbm9kZSB3aXRoIGNvbnRhaW5lcklkXCIsIHN0YXJ0ZWRDb250YWluZXJJZCk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChzdGFydGVkQ29udGFpbmVySWQpLnRvLm5vdC5iZS5udWxsO1xuICAgICAgICAgICAgd2FpdFRvU3RhcnRDb250YWluZXIoc3RhcnRlZENvbnRhaW5lcklkKTtcblxuICAgICAgICAgICAgLy9nZW5lcmF0aW5nIGEgYmxvY2sgc28gdHJhbnNhY3Rpb24gZ2V0cyBjb25maXJtZWQgYW5kIGRlbGl2ZXJlZCB0byBib2IuXG4gICAgICAgICAgICBnZW5lcmF0ZXRvYWRkcmVzcyhnbG9iYWwubm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIGdsb2JhbC5hbGljZUFkZHJlc3MsIDEsIHRydWUpO1xuICAgICAgICAgICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgKGFzeW5jIGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHJ1bm5pbmcgJiYgKytjb3VudGVyIDwgNTApIHsgLy90cnlpbmcgNTB4IHRvIGdldCBlbWFpbCBmcm9tIGJvYnMgbWFpbGJveFxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gIGdlbmVyYXRldG9hZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBnbG9iYWwuYWxpY2VBZGRyZXNzLCAxLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdzdGVwIDM6IGdldHRpbmcgZW1haWwhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5rMkNvbmZpcm0gPSBmZXRjaENvbmZpcm1MaW5rRnJvbVBvcDNNYWlsKGdsb2JhbC5pbnNpZGVfZG9ja2VyP1wibWFpbFwiOlwibG9jYWxob3N0XCIsIDExMCwgcmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgZGFwcFVybEJvYiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0ZXAgNDogY29uZmlybWluZyBsaW5rJywgbGluazJDb25maXJtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5rMkNvbmZpcm0gIT0gbnVsbCkgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tDb25maXJtTGluayhsaW5rMkNvbmZpcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2NvbmZpcm1lZCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3RyeWluZyB0byBnZXQgZW1haWwgLSBzbyBmYXIgbm8gc3VjY2VzczonLCBjb3VudGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyMDAwKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkoKTtcblxuICAgICAgICAgICAgICAgIGdlbmVyYXRldG9hZGRyZXNzKGdsb2JhbC5ub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdmVyaWZ5RE9JKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCBnbG9iYWwubm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIHNlbmRlcl9tYWlsLCByZWNpcGllbnRfbWFpbCwgbmFtZUlkLCBsb2cpOyAvL25lZWQgdG8gZ2VuZXJhdGUgdHdvIGJsb2NrcyB0byBtYWtlIGJsb2NrIHZpc2libGUgb24gYWxpY2VcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnZW5kIG9mIGdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24gcmV0dXJuaW5nIG5hbWVJZCcsIG5hbWVJZCk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZXhlYygoZ2xvYmFsLmluc2lkZV9kb2NrZXI/J3N1ZG8nOicnKSsnIGRvY2tlciBzdG9wIDNyZF9ub2RlJywgKGUsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnc3RvcHBlZCAzcmRfbm9kZTonLCB7c3Rkb3V0OiBzdGRvdXQsIHN0ZGVycjogc3RkZXJyfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGVjKChnbG9iYWwuaW5zaWRlX2RvY2tlcj8nc3Vkbyc6JycpKycgZG9ja2VyIHJtIDNyZF9ub2RlJywgKGUsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3JlbW92ZWQgM3JkX25vZGU6Jywge3N0ZG91dDogc3Rkb3V0LCBzdGRlcnI6IHN0ZGVycn0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjb3VsZCBub3Qgc3RvcCAzcmRfbm9kZScsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTsgLy9pdFxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuaW1wb3J0IHtcbiAgICBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMywgZmluZE9wdEluLFxuICAgIGxvZ2luLFxuICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2ksIHJlcXVlc3RET0lcbn0gZnJvbSBcIi4vdGVzdC1hcGkvdGVzdC1hcGktb24tZGFwcFwiO1xuaW1wb3J0IHtcbiAgICB0ZXN0TG9nIGFzIGxvZ0Jsb2NrY2hhaW5cbn0gZnJvbSBcIm1ldGVvci9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpXCI7XG5pbXBvcnQge2RlbGV0ZU9wdEluc0Zyb21BbGljZUFuZEJvYiwgZ2VuZXJhdGV0b2FkZHJlc3MsIGdldE5ld0FkZHJlc3N9IGZyb20gXCIuL3Rlc3QtYXBpL3Rlc3QtYXBpLW9uLW5vZGVcIjtcblxuY29uc3QgcmVjaXBpZW50X3BvcDN1c2VybmFtZSA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiO1xuY29uc3QgcmVjaXBpZW50X3BvcDNwYXNzd29yZCA9IFwiYm9iXCI7XG5cbmlmKE1ldGVvci5pc0FwcFRlc3QpIHtcbiAgICBkZXNjcmliZSgnMDMtYmFzaWMtZG9pLXRlc3QtMDMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudGltZW91dCgwKTtcbiAgICAgICAgXG4gICAgICAgIGJlZm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwicmVtb3ZpbmcgT3B0SW5zLFJlY2lwaWVudHMsU2VuZGVyc1wiKTtcbiAgICAgICAgICAgIC8vZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iKCk7XG4gICAgICAgICAgICAvL2RlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzKGdsb2JhbC5pbnNpZGVfZG9ja2VyP1wibWFpbFwiOlwibG9jYWxob3N0XCIsIDExMCwgcmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiBiYXNpYyBEb2ljaGFpbiB3b3JrZmxvdyBydW5uaW5nIDUgdGltZXMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0KDApO1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhTG9naW5BbGljZSA9IGxvZ2luKGdsb2JhbC5kYXBwVXJsQWxpY2UsIGdsb2JhbC5kQXBwTG9naW4sIGZhbHNlKTsgLy9sb2cgaW50byBkQXBwXG4gICAgICAgICAgICBnbG9iYWwuYWxpY2VBZGRyZXNzID0gZ2V0TmV3QWRkcmVzcyhnbG9iYWwubm9kZV91cmxfYWxpY2UsIGdsb2JhbC5ycGNBdXRoQWxpY2UsIGZhbHNlKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjsgLy9wbGVhc2UgdXNlIHRoaXMgYXMgc3RhbmRhcmQgdG8gbm90IGNvbmZ1c2UgcGVvcGxlIVxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZV9cIiArIGkgKyBcIkBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKGdsb2JhbC5ub2RlX3VybF9hbGljZSwgZ2xvYmFsLnJwY0F1dGhBbGljZSxnbG9iYWwuZGFwcFVybEFsaWNlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhTG9naW5BbGljZSxnbG9iYWwuZGFwcFVybEJvYixyZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIHsnY2l0eSc6ICdFa2F0ZXJpbmJ1cmdfJyArIGl9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiBiYXNpYyBEb2ljaGFpbiB3b3JrZmxvdyBydW5zIDIwIHRpbWVzIHdpdGhvdXQgY29uZmlybWF0aW9uLCB2ZXJpZmljYXRpb24gYW5kIG5ldyBibG9jaycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXQoMCk7XG4gICAgICAgICAgICBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMyhnbG9iYWwuaW5zaWRlX2RvY2tlcj9cIm1haWxcIjpcImxvY2FsaG9zdFwiLCAxMTAsIHJlY2lwaWVudF9wb3AzdXNlcm5hbWUsIHJlY2lwaWVudF9wb3AzcGFzc3dvcmQsIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgZGF0YUxvZ2luQWxpY2UgPSBsb2dpbihnbG9iYWwuZGFwcFVybEFsaWNlLCBnbG9iYWwuZEFwcExvZ2luLCBmYWxzZSk7IC8vbG9nIGludG8gZEFwcFxuICAgICAgICAgICAgZ2xvYmFsLmFsaWNlQWRkcmVzcyA9IGdldE5ld0FkZHJlc3MoZ2xvYmFsLm5vZGVfdXJsX2FsaWNlLCBnbG9iYWwucnBjQXV0aEFsaWNlLCBmYWxzZSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDIwOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiOyAvL3BsZWFzZSB1c2UgdGhpcyBhcyBzdGFuZGFyZCB0byBub3QgY29uZnVzZSBwZW9wbGUhXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWwgPSBcImFsaWNlX1wiICsgaSArIFwiQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdERhdGFPcHRJbiA9IHJlcXVlc3RET0koZ2xvYmFsLmRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgY2hhaS5leHBlY3QoZmluZE9wdEluKHJlc3VsdERhdGFPcHRJbi5kYXRhLmlkLCB0cnVlKSkudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGJhc2ljIERvaWNoYWluIHdvcmtmbG93IHJ1bnMgMTAwIHRpbWVzIHdpdGhvdXQgY29uZmlybWF0aW9uIGFuZCB2ZXJpZmljYXRpb24nLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0KDApO1xuICAgICAgICAgICAgZGVsZXRlQWxsRW1haWxzRnJvbVBvcDMoZ2xvYmFsLmluc2lkZV9kb2NrZXI/XCJtYWlsXCI6XCJsb2NhbGhvc3RcIiwgMTEwLCByZWNpcGllbnRfcG9wM3VzZXJuYW1lLCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFMb2dpbkFsaWNlID0gbG9naW4oZ2xvYmFsLmRhcHBVcmxBbGljZSwgZ2xvYmFsLmRBcHBMb2dpbiwgZmFsc2UpOyAvL2xvZyBpbnRvIGRBcHBcbiAgICAgICAgICAgIGdsb2JhbC5hbGljZUFkZHJlc3MgPSBnZXROZXdBZGRyZXNzKGdsb2JhbC5ub2RlX3VybF9hbGljZSwgZ2xvYmFsLnJwY0F1dGhBbGljZSwgZmFsc2UpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIHN0YW5kYXJkIHRvIG5vdCBjb25mdXNlIHBlb3BsZSFcbiAgICAgICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbCA9IFwiYWxpY2VfXCIgKyBpICsgXCJAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0RGF0YU9wdEluID0gcmVxdWVzdERPSShnbG9iYWwuZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsLCBudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBjaGFpLmV4cGVjdChmaW5kT3B0SW4ocmVzdWx0RGF0YU9wdEluLmRhdGEuaWQsIHRydWUpKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGlmIChpICUgMTAwID09PSAwKSBnZW5lcmF0ZXRvYWRkcmVzcyhnbG9iYWwubm9kZV91cmxfYWxpY2UsIGdsb2JhbC5ycGNBdXRoQWxpY2UsIGdsb2JhbC5hbGljZUFkZHJlc3MsIDEsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0iLCJpZihNZXRlb3IuaXNBcHBUZXN0IHx8IE1ldGVvci5pc1Rlc3QpIHtcblxuICAgIHhkZXNjcmliZSgnc2ltcGxlLXNlbGVuaXVtLXRlc3QnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy50aW1lb3V0KDEwMDAwKTtcbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgfSk7XG5cblxuICAgIH0pO1xufVxuIiwiLy8gaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuLy8gaW1wb3J0IHtcbi8vICAgICB0ZXN0TG9nIGFzIGxvZ0Jsb2NrY2hhaW5cbi8vIH0gZnJvbSBcIm1ldGVvci9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpXCI7XG4vL1xuLy8gaW1wb3J0IHtkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IsIGdldEJhbGFuY2UsIGluaXRCbG9ja2NoYWlufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1ub2RlXCI7XG4vLyBpbXBvcnQge2xvZ2luLCByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pfSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1kYXBwXCI7XG4vLyBjb25zdCBub2RlX3VybF9hbGljZSA9ICdodHRwOi8vMTcyLjIwLjAuNjoxODMzMi8nO1xuLy8gY29uc3Qgbm9kZV91cmxfYm9iID0gICAnaHR0cDovLzE3Mi4yMC4wLjc6MTgzMzIvJztcbi8vIGNvbnN0IHJwY0F1dGggPSBcImFkbWluOmdlbmVyYXRlZC1wYXNzd29yZFwiO1xuLy8gY29uc3QgcHJpdktleUJvYiA9IFwiY1AzRWlna3pzV3V5S0VteGs4Y0M2cVhZYjRaandVbzV2enZacEFQbURRODNSQ2dYUXJ1alwiO1xuLy8gY29uc3QgbG9nID0gdHJ1ZTtcbi8vXG4vL1xuLy8gY29uc3QgcnBjQXV0aEFsaWNlID0gXCJhZG1pbjpnZW5lcmF0ZWQtcGFzc3dvcmRcIjtcbi8vIGNvbnN0IGRhcHBVcmxBbGljZSA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCI7XG4vLyBjb25zdCBkYXBwVXJsQm9iID0gXCJodHRwOi8vMTcyLjIwLjAuODo0MDAwXCI7XG4vLyBjb25zdCBkQXBwTG9naW4gPSB7XCJ1c2VybmFtZVwiOlwiYWRtaW5cIixcInBhc3N3b3JkXCI6XCJwYXNzd29yZFwifTtcbi8vXG4vL1xuLy8gaWYoTWV0ZW9yLmlzVGVzdCB8fCBNZXRlb3IuaXNBcHBUZXN0KSB7XG4vL1xuLy8gICAgIHhkZXNjcmliZSgnYmFzaWMtZG9pLXRlc3QtbmljbycsIGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgdGhpcy50aW1lb3V0KDYwMDAwMCk7XG4vL1xuLy8gICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInJlbW92aW5nIE9wdElucyxSZWNpcGllbnRzLFNlbmRlcnNcIik7XG4vLyAgICAgICAgICAgICBkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IoKTtcbi8vICAgICAgICAgfSk7XG4vL1xuLy8gICAgICAgICB4aXQoJ3Nob3VsZCBjcmVhdGUgYSBSZWdUZXN0IERvaWNoYWluIHdpdGggYWxpY2UgYW5kIGJvYiBhbmQgc29tZSBEb2kgLSBjb2lucycsIGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgIGluaXRCbG9ja2NoYWluKG5vZGVfdXJsX2FsaWNlLG5vZGVfdXJsX2JvYixycGNBdXRoLHByaXZLZXlCb2IsdHJ1ZSk7XG4vLyAgICAgICAgICAgICBjb25zdCBhbGljZUJhbGFuY2UgPSBnZXRCYWxhbmNlKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBsb2cpO1xuLy8gICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNBYm92ZShhbGljZUJhbGFuY2UsIDAsICdubyBmdW5kaW5nISAnKTtcbi8vICAgICAgICAgfSk7XG4vL1xuLy8gICAgICAgICB4aXQoJ3Nob3VsZCB0ZXN0IGlmIGJhc2ljIERvaWNoYWluIHdvcmtmbG93IGlzIHdvcmtpbmcgd2l0aCBvcHRpb25hbCBkYXRhJywgZnVuY3Rpb24gKGRvbmUpIHtcbi8vICAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2IrMUBjaS1kb2ljaGFpbi5vcmdcIjsgLy9wbGVhc2UgdXNlIHRoaXMgYXMgc3RhbmRhcmQgdG8gbm90IGNvbmZ1c2UgcGVvcGxlIVxuLy8gICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWwgPSBcImFsaWNlQGNpLWRvaWNoYWluLm9yZ1wiO1xuLy8gICAgICAgICAgICAgY29uc3QgZGF0YUxvZ2luQWxpY2UgPSBsb2dpbihkYXBwVXJsQWxpY2UsIGRBcHBMb2dpbiwgZmFsc2UpOyAvL2xvZyBpbnRvIGRBcHBcbi8vICAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsLCB7J2NpdHknOiAnRWthdGVyaW5idXJnJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCB0cnVlKTtcbi8vICAgICAgICAgICAgIGRvbmUoKTtcbi8vICAgICAgICAgfSk7XG4vLyAgICAgfSk7XG4vL1xuLy8gICAgIHhkZXNjcmliZSgnYmFzaWMtZG9pLXRlc3QtbmljbycsIGZ1bmN0aW9uICgpIHtcbi8vXG4vL1xuLy8gICAgICAgICAvKipcbi8vICAgICAgICAgICogSW5mb3JtYXRpb24gcmVnYXJkaW5nIHRvIGV2ZW50IGxvb3Agbm9kZS5qc1xuLy8gICAgICAgICAgKiAtIGh0dHBzOi8vbm9kZWpzLm9yZy9lbi9kb2NzL2d1aWRlcy9ldmVudC1sb29wLXRpbWVycy1hbmQtbmV4dHRpY2svXG4vLyAgICAgICAgICAqXG4vLyAgICAgICAgICAqIFByb21pc2VzOlxuLy8gICAgICAgICAgKiAtIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvcHJpbWVycy9wcm9taXNlc1xuLy8gICAgICAgICAgKlxuLy8gICAgICAgICAgKiBQcm9taXNlIGxvb3BzIGFuZCBhc3luYyB3YWl0XG4vLyAgICAgICAgICAqIC0gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDAzMjg5MzIvamF2YXNjcmlwdC1lczYtcHJvbWlzZS1mb3ItbG9vcFxuLy8gICAgICAgICAgKlxuLy8gICAgICAgICAgKiBBc3luY2hyb25vdXMgbG9vcHMgd2l0aCBtb2NoYTpcbi8vICAgICAgICAgICogLSBodHRwczovL3doaXRmaW4uaW8vYXN5bmNocm9ub3VzLXRlc3QtbG9vcHMtd2l0aC1tb2NoYS9cbi8vICAgICAgICAgICovXG4vLyAgICAgICAgIC8qICBpdCgnc2hvdWxkIHRlc3QgYSB0aW1lb3V0IHdpdGggYSBwcm9taXNlJywgZnVuY3Rpb24gKGRvbmUpIHtcbi8vICAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInRydXlpbmcgYSBwcm9taXNlXCIpO1xuLy8gICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbi8vICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGltZW91dCA9IE1hdGgucmFuZG9tKCkgKiAxMDAwO1xuLy8gICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncHJvbWlzZTonK2kpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuLy8gICAgICAgICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBDaGFpbiB0aGlzIHByb21pc2UgdG8gdGhlIHByZXZpb3VzIG9uZSAobWF5YmUgd2l0aG91dCBoYXZpbmcgaXQgcnVubmluZz8pXG4vLyAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgZG9uZSgpO1xuLy8gICAgICAgICAgIH0pO1xuLy9cbi8vICAgICAgICAgICBpdCgnc2hvdWxkIHJ1biBhIGxvb3Agd2l0aCBhc3luYyB3YWl0JywgZnVuY3Rpb24gKGRvbmUpIHtcbi8vICAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInRyeWluZyBhc3ljbiB3YWl0XCIpO1xuLy8gICAgICAgICAgICAgICAoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbi8vICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBNYXRoLnJhbmRvbSgpICogMTAwMCkpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhc3luYyB3YWl0JytpKTtcbi8vICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgIGRvbmUoKVxuLy8gICAgICAgICAgICAgICB9KSgpO1xuLy8gICAgICAgICAgIH0pO1xuLy9cbi8vICAgICAgICAgICB4aXQoJ3Nob3VsZCBzYWZlbHkgc3RvcCBhbmQgc3RhcnQgYm9icyBkb2ljaGFpbiBub2RlIGNvbnRhaW5lcicsIGZ1bmN0aW9uIChkb25lKSB7XG4vLyAgICAgICAgICAgICAgIHZhciBjb250YWluZXJJZCA9IHN0b3BEb2NrZXJCb2IoKTtcbi8vXG4vLyAgICAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJzdG9wcGVkIGJvYidzIG5vZGUgd2l0aCBjb250YWluZXJJZFwiLGNvbnRhaW5lcklkKTtcbi8vICAgICAgICAgICAgICAgY2hhaS5leHBlY3QoY29udGFpbmVySWQpLnRvLm5vdC5iZS5udWxsO1xuLy9cbi8vICAgICAgICAgICAgICAgdmFyIHN0YXJ0ZWRDb250YWluZXJJZCA9IHN0YXJ0RG9ja2VyQm9iKGNvbnRhaW5lcklkKTtcbi8vICAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInN0YXJ0ZWQgYm9iJ3Mgbm9kZSB3aXRoIGNvbnRhaW5lcklkXCIsc3RhcnRlZENvbnRhaW5lcklkKTtcbi8vICAgICAgICAgICAgICAgY2hhaS5leHBlY3Qoc3RhcnRlZENvbnRhaW5lcklkKS50by5ub3QuYmUubnVsbDtcbi8vXG4vLyAgICAgICAgICAgICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbi8vICAgICAgICAgICAgICAgd2hpbGUocnVubmluZyl7XG4vLyAgICAgICAgICAgICAgICAgICBydW5BbmRXYWl0KGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICB0cnl7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1c0RvY2tlciA9IEpTT04ucGFyc2UoZ2V0RG9ja2VyU3RhdHVzKGNvbnRhaW5lcklkKSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJnZXRpbmZvXCIsc3RhdHVzRG9ja2VyKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInZlcnNpb246XCIrc3RhdHVzRG9ja2VyLnZlcnNpb24pO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwiYmFsYW5jZTpcIitzdGF0dXNEb2NrZXIuYmFsYW5jZSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJiYWxhbmNlOlwiK3N0YXR1c0RvY2tlci5jb25uZWN0aW9ucyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN0YXR1c0RvY2tlci5jb25uZWN0aW9ucz09PTApe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9pY2hhaW5BZGROb2RlKGNvbnRhaW5lcklkKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgIGNhdGNoKGVycm9yKXtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInN0YXR1c0RvY2tlciBwcm9ibGVtOlwiLGVycm9yKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICB9LDIpO1xuLy8gICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICBkb25lKCk7XG4vLyAgICAgICAgICAgfSk7Ki9cbi8vICAgICB9KTtcbi8vIH1cbiIsImltcG9ydCB7Y2hhaX0gZnJvbSAnbWV0ZW9yL3ByYWN0aWNhbG1ldGVvcjpjaGFpJztcbmlmKE1ldGVvci5pc1Rlc3QpIHtcblxuICAgIHhkZXNjcmliZSgnYmFzaWMtZG9pLXRlc3QtZmxvJywgZnVuY3Rpb24gKCkge1xuICAgIH0pO1xufVxuXG5cbiIsIk1ldGVvci5wdWJsaXNoKCd1c2Vycy51c2VyJywgZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gTWV0ZW9yLnVzZXJzLmZpbmQoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICAnZW1haWxzJzogMSxcbiAgICAgICAgJ3Byb2ZpbGUnOiAxLFxuICAgICAgICAnc2VydmljZXMnOiAxXG4gICAgICB9XG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpXG4gIH1cbn0pXG4iXX0=
