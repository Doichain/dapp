import {
    httpPOST as getHttpPOST,
    testLog as testLogging,
    testLog as logBlockchain
} from "meteor/doichain:doichain-meteor-api";

import {chai} from 'meteor/practicalmeteor:chai';
import {Meteor} from "meteor/meteor";
const os = require('os');
let sudo = (os.hostname()=='regtest')?'sudo ':''
const headers = { 'Content-Type':'text/plain'  };
const exec = require('child_process').exec;

export function initBlockchain(node_url_alice,node_url_bob,rpcAuth,privKeyAlice,privKeyBob,log) {            //connect nodes (alice & bob) and generate DOI (only if not connected)

    testLogging("importing private key of Alice:"+privKeyAlice);
    importPrivKey(node_url_alice, rpcAuth, privKeyAlice, true, log);

    testLogging("importing private key of Bob:"+privKeyBob);
    importPrivKey(node_url_bob, rpcAuth, privKeyBob, true, log);

    try {
        const aliceContainerId = getContainerIdOfName('alice');
        logBlockchain("aliceContainerId:" + aliceContainerId);
        const statusDocker = JSON.parse(getDockerStatus(aliceContainerId));
        logBlockchain("statusDocker:" + statusDocker);
        logBlockchain("real balance :" + statusDocker.balance, (Number(statusDocker.balance) > 0));
        logBlockchain("connections:" + statusDocker.connections);
        logBlockchain("node_url_alice:" + node_url_alice);
        logBlockchain("rpcAuth:" + rpcAuth);
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
    generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 210);  //110 blocks to new address! 110 blöcke *25 coins

}
function wait_to_start_container(startedContainerId,callback){
    let running = true;
    let counter = 0;

    //here we make sure bob gets started and connected again in probably all possible sitautions
    while(running){
        try{
            const statusDocker = JSON.parse(getDockerStatus(startedContainerId));
            testLogging("getinfo",statusDocker);
            testLogging("version:"+statusDocker.version);
            testLogging("balance:"+statusDocker.balance);
            testLogging("connections:"+statusDocker.connections);
            if(statusDocker.connections===0){
                doichainAddNode(startedContainerId);
            }
            running = false;
        }
        catch(error){
            testLogging("statusDocker problem trying to start Bobs node inside docker container:",error);
            try{
                connectDockerBob(startedContainerId);
            }catch(error2){
                testLogging("could not start bob:",error2);
            }
            if(counter==50)running=false;
        }
        counter++;
    }
    callback(null, startedContainerId);
}

function delete_options_from_alice_and_bob(callback){

    const containerId = getContainerIdOfName('regtest-mongo');
    testLogging('containerId of mongo:',containerId);
    const command = ''+(global.inside_docker?'sudo':'')+'docker exec '+containerId+' bash -c "mongo < /tmp/delete_collections.sh"';
    exec(command, (e, stdout, stderr)=> {
        testLogging(command,{stderr:stderr,stdout:stdout});
        callback(stderr, stdout);
    });

}

export function isNodeAlive(url, auth, log) {
    if(log) testLogging('isNodeAlive called to url',url);
    const dataGetNetworkInfo = {"jsonrpc": "1.0", "id": "getnetworkinfo", "method": "getnetworkinfo", "params": []};
    const realdataGetNetworkInfo = {auth: auth, data: dataGetNetworkInfo, headers: headers};
    const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
    const statusGetNetworkInfo = resultGetNetworkInfo.statusCode;
    chai.assert.equal(200, statusGetNetworkInfo);
    if(log)
        testLogging('resultGetNetworkInfo:',resultGetNetworkInfo); // getnetworkinfo | jq '.localaddresses[0].address'
}

export function isNodeAliveAndConnectedToHost(url, auth, host, log) {
    if(log) testLogging('isNodeAliveAndConnectedToHost called');
    isNodeAlive(url, auth, log);

    const dataGetNetworkInfo = {"jsonrpc": "1.0", "id":"addnode", "method": "addnode", "params": ['alice','onetry'] };
    const realdataGetNetworkInfo = { auth: auth, data: dataGetNetworkInfo, headers: headers };
    const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
    const statusAddNode = resultGetNetworkInfo.statusCode;
    if(log) testLogging('addnode:',statusAddNode);
    chai.assert.equal(200, statusAddNode);


    const dataGetPeerInfo = {"jsonrpc": "1.0", "id":"getpeerinfo", "method": "getpeerinfo", "params": [] };
    const realdataGetPeerInfo = { auth: auth, data: dataGetPeerInfo, headers: headers };
    const resultGetPeerInfo = getHttpPOST(url, realdataGetPeerInfo);
    const statusGetPeerInfo = resultGetPeerInfo.statusCode;
    if(log) testLogging('resultGetPeerInfo:',resultGetPeerInfo);
    chai.assert.equal(200, statusGetPeerInfo);
    chai.assert.isAbove(resultGetPeerInfo.data.result.length, 0, 'no connection to other nodes! ');
    //chai.expect(resultGetPeerInfo.data.result).to.have.lengthOf.at.least(1);

}

export function importPrivKey(url, auth, privKey, rescan, log) {
        if(log) testLogging('importPrivKey called with auth',auth);
        const data_importprivkey = {"jsonrpc": "1.0", "id":"importprivkey", "method": "importprivkey", "params": [privKey] };
        const realdata_importprivkey = { auth: auth, data: data_importprivkey, headers: headers };
        const result = getHttpPOST(url, realdata_importprivkey);
        testLogging('result:',result);
}

export function getNewAddress(url, auth, log) {

    if(log) testLogging('getNewAddress called');
    const dataGetNewAddress = {"jsonrpc": "1.0", "id":"getnewaddress", "method": "getnewaddress", "params": [] };
    const realdataGetNewAddress = { auth: auth, data: dataGetNewAddress, headers: headers };
    const resultGetNewAddress = getHttpPOST(url, realdataGetNewAddress);
    const statusOptInGetNewAddress = resultGetNewAddress.statusCode;
    const newAddress  = resultGetNewAddress.data.result;
    chai.assert.equal(200, statusOptInGetNewAddress);
    chai.expect(resultGetNewAddress.data.error).to.be.null;
    chai.expect(newAddress).to.not.be.null;
    if(log) testLogging(newAddress);
    return newAddress;
}

export function generatetoaddress(url,auth,toaddress,amount,log){
    const dataGenerate = {"jsonrpc": "1.0", "id":"generatetoaddress", "method": "generatetoaddress", "params": [amount,toaddress] };
    const headersGenerates = { 'Content-Type':'text/plain'  };
    const realdataGenerate = { auth: auth, data: dataGenerate, headers: headersGenerates };
    const resultGenerate = getHttpPOST(url, realdataGenerate);
    const statusResultGenerate = resultGenerate.statusCode;
    if(log)testLogging('resultGenerate:',resultGenerate);
    chai.assert.equal(200, statusResultGenerate);
    chai.expect(resultGenerate.data.error).to.be.null;
    chai.expect(resultGenerate.data.result).to.not.be.null;
}

export function getBalance(url,auth,log){
    const dataGetBalance = {"jsonrpc": "1.0", "id":"getbalance", "method": "getbalance", "params": [] };
    const realdataGetBalance = { auth: auth, data: dataGetBalance, headers: headers };
    const resultGetBalance = getHttpPOST(url, realdataGetBalance);
    if(log)testLogging('resultGetBalance:',resultGetBalance.data.result);
    return resultGetBalance.data.result;
}

function get_container_id_of_name(name,callback) {
    exec(sudo+'docker ps --filter "name='+name+'" -q', (e, stdout, stderr)=> {
        if(e!=null){
            testLogging('cannot find '+name+' node '+stdout,stderr);
            return null;
        }
        const bobsContainerId = stdout.toString().trim(); //.substring(0,stdout.toString().length-1); //remove last char since ins a line break
        callback(stderr, bobsContainerId);
    });
}

function stop_docker_bob(callback) {
    const bobsContainerId = getContainerIdOfName('bob');

    testLogging('stopping Bob with container-id: '+bobsContainerId);
    exec(sudo+'docker exec '+bobsContainerId+' doichain-cli stop', (e, stdout, stderr)=> {
        testLogging('bob '+bobsContainerId+' stopped ',{stdout:stdout,stderr:stderr});

        try{
            exec(sudo+'docker stop '+bobsContainerId, (e, stdout, stderr)=> {
                testLogging('stopping Bob with container-id: ',{stdout:stdout,stderr:stderr});
                callback(null, bobsContainerId);
            });
        }catch (e) {
            testLogging('couldnt stop bobs node',e);
            callback(e, null);
        }
    });
}

function doichain_add_node(containerId,callback) {
    exec(sudo+'docker exec '+containerId+' doichain-cli addnode alice onetry', (e, stdout, stderr)=> {
        testLogging('bob '+containerId+' connected? ',{stdout:stdout,stderr:stderr});
        callback(stderr, stdout);
    });
}

function get_docker_status(containerId,callback) {
    logBlockchain('containerId '+containerId+' running? ');
    exec(sudo+'docker exec '+containerId+' doichain-cli -getinfo', (e, stdout, stderr)=> {
        testLogging('containerId '+containerId+' status: ',{stdout:stdout,stderr:stderr});
        callback(stderr, stdout);
    });
}

function start_docker_bob(bobsContainerId,callback) {
    exec(sudo+'docker start '+bobsContainerId, (e, stdout, stderr)=> {
        testLogging('started bobs node again: '+bobsContainerId,{stdout:stdout,stderr:stderr});
        callback(stderr, stdout.toString().trim()); //remove line break from the end
    });
}

function connect_docker_bob(bobsContainerId, callback) {
    exec(sudo+'docker exec '+bobsContainerId+' doichaind -regtest -daemon -reindex -addnode=alice', (e, stdout, stderr)=> {
        testLogging('restarting doichaind on bobs node and connecting with alice: ',{stdout:stdout,stderr:stderr});
        callback(stderr, stdout);
    });
}

function trigger_new_block(url, callback) {
    exec('curl -s -X GET '+url, (e, stdout, stderr)=> {
            callback(stderr, stdout);
        }
    );
}

function run_and_wait(runfunction,seconds, callback){
    Meteor.setTimeout(function () {
        runfunction();
        callback(null,true);
    }, seconds+1000);
}

export function waitToStartContainer(containerId) {
    const syncFunc = Meteor.wrapAsync(wait_to_start_container);
    return syncFunc(containerId);
}

export function deleteOptInsFromAliceAndBob() {
    const syncFunc = Meteor.wrapAsync(delete_options_from_alice_and_bob);
    return syncFunc();
}

export function triggerNewBlock(url) {
    const syncFunc = Meteor.wrapAsync(trigger_new_block);
    return syncFunc(url);
}

export function stopDockerBob() {
    const syncFunc = Meteor.wrapAsync(stop_docker_bob);
    return syncFunc();
}

export function getContainerIdOfName(name) {
    const syncFunc = Meteor.wrapAsync(get_container_id_of_name);
    return syncFunc(name);
}

export function startDockerBob(containerId) {
    const syncFunc = Meteor.wrapAsync(start_docker_bob);
    return syncFunc(containerId);
}

export function doichainAddNode(containerId) {
    const syncFunc = Meteor.wrapAsync(doichain_add_node);
    return syncFunc(containerId);
}

export function getDockerStatus(containerId) {
    const syncFunc = Meteor.wrapAsync(get_docker_status);
    return syncFunc(containerId);
}

export function connectDockerBob(containerId) {
    const syncFunc = Meteor.wrapAsync(connect_docker_bob);
    return syncFunc(containerId);
}

export function runAndWait(runfunction, seconds) {
    const syncFunc = Meteor.wrapAsync(run_and_wait);
    return syncFunc(seconds);
}