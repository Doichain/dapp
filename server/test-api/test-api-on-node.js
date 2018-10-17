import {getHttpPOST} from "../api/http";
import {logBlockchain} from "../../imports/startup/server/log-configuration";
import {chai} from 'meteor/practicalmeteor:chai';

const headers = { 'Content-Type':'text/plain'  };


export function isNodeAlive(url, auth, log) {
    if(log) logBlockchain('isNodeAlive called');
    const dataGetNetworkInfo = {"jsonrpc": "1.0", "id": "getnetworkinfo", "method": "getnetworkinfo", "params": []};
    const realdataGetNetworkInfo = {auth: auth, data: dataGetNetworkInfo, headers: headers};
    const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
    const statusGetNetworkInfo = resultGetNetworkInfo.statusCode;
    chai.assert.equal(200, statusGetNetworkInfo);
    if(log)
    logBlockchain('resultGetNetworkInfo:',resultGetNetworkInfo); // getnetworkinfo | jq '.localaddresses[0].address'
}

export function isNodeAliveAndConnectedToHost(url, auth, host, log) {
    if(log) logBlockchain('isNodeAliveAndConnectedToHost called');
    isNodeAlive(url, auth, log);

    const dataGetNetworkInfo = {"jsonrpc": "1.0", "id":"addnode", "method": "addnode", "params": ['alice','onetry'] };
    const realdataGetNetworkInfo = { auth: auth, data: dataGetNetworkInfo, headers: headers };
    const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
    const statusGetNetworkInfo = resultGetNetworkInfo.statusCode;
    chai.assert.equal(200, statusGetNetworkInfo);
    if(log) logBlockchain('resultGetNetworkInfo:',resultGetNetworkInfo);

    const dataGetPeerInfo = {"jsonrpc": "1.0", "id":"getpeerinfo", "method": "getpeerinfo", "params": [] };
    const realdataGetPeerInfo = { auth: auth, data: dataGetPeerInfo, headers: headers };
    const resultGetPeerInfo = getHttpPOST(url, realdataGetPeerInfo);
    const statusGetPeerInfo = resultGetPeerInfo.statusCode;
    chai.assert.equal(200, statusGetPeerInfo);
    chai.expect(resultGetPeerInfo.data.result).to.have.lengthOf(1);
    if(log) logBlockchain('resultGetPeerInfo:',resultGetPeerInfo);
}

export function importPrivKey(url, auth, privKey, rescan, log) {
        if(log) logBlockchain('importPrivKey called','');
        const data_importprivkey = {"jsonrpc": "1.0", "id":"importprivkey", "method": "importprivkey", "params": [privKey] };
        const realdata_importprivkey = { auth: auth, data: data_importprivkey, headers: headers };
        const result = getHttpPOST(url, realdata_importprivkey);
        if(log) logBlockchain('result:',result);
}

export function getNewAddress(url, auth, log) {

    if(log) logBlockchain('getNewAddress called');
    const dataGetNewAddress = {"jsonrpc": "1.0", "id":"getnewaddress", "method": "getnewaddress", "params": [] };
    const realdataGetNewAddress = { auth: auth, data: dataGetNewAddress, headers: headers };
    const resultGetNewAddress = getHttpPOST(url, realdataGetNewAddress);
    const statusOptInGetNewAddress = resultGetNewAddress.statusCode;
    const newAddress  = resultGetNewAddress.data.result;
    chai.assert.equal(200, statusOptInGetNewAddress);
    chai.expect(resultGetNewAddress.data.error).to.be.null;
    chai.expect(newAddress).to.not.be.null;
    if(log) logBlockchain(newAddress);
    return newAddress;
}

export function generatetoaddress(url,auth,toaddress,amount,log){
    const dataGenerate = {"jsonrpc": "1.0", "id":"generatetoaddress", "method": "generatetoaddress", "params": [amount,toaddress] };
    const headersGenerates = { 'Content-Type':'text/plain'  };
    const realdataGenerate = { auth: auth, data: dataGenerate, headers: headersGenerates };
    const resultGenerate = getHttpPOST(url, realdataGenerate);
    const statusResultGenerate = resultGenerate.statusCode;
    if(log)logBlockchain('statusResultGenerate:',statusResultGenerate);
    chai.assert.equal(200, statusResultGenerate);
    chai.expect(resultGenerate.data.error).to.be.null;
    chai.expect(resultGenerate.data.result).to.not.be.null;
}

export function getBalance(url,auth,log){
    const dataGetBalance = {"jsonrpc": "1.0", "id":"getbalance", "method": "getbalance", "params": [] };
    const realdataGetBalance = { auth: auth, data: dataGetBalance, headers: headers };
    const resultGetBalance = getHttpPOST(url, realdataGetBalance);
    if(log)logBlockchain('resultGetBalance:',resultGetBalance);
    return resultGetBalance.data.result;
}