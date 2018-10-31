import {Meteor} from "meteor/meteor";
chai.use(require('chai-datetime'));
chai.use(require('chai-date-string'));
import {chai} from 'meteor/practicalmeteor:chai';
import {
    confirmLink,
    fetchConfirmLinkFromPop3Mail,
    getNameIdOfOptInFromRawTx,
    login,
    requestDOI, verifyDOI
} from "./test-api/test-api-on-dapp";
import {logBlockchain, logError} from "../imports/startup/server/log-configuration";
import {generatetoaddress} from "./test-api/test-api-on-node";
const exec = require('child_process').exec;

const node_url_alice = 'http://172.20.0.6:18332/';
const rpcAuth = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {"username":"admin","password":"password"};
const log = true;
var bobsContainerId;

describe('basic-doi-test-with-offline-node', function () {
    this.timeout(600000);

    before(function(){
            exec('sudo docker rm 3rd_node', (e, stdout2, stderr2)=> {
                logBlockchain('deleted 3rd_node:',{stdout:stdout2,stderr:stderr2});
            });
    });

    after(function(){
        exec('sudo docker stop 3rd_node', (e, stdout, stderr)=> {
            logBlockchain('stopped 3rd_node:',{stdout:stdout,stderr:stderr});
        });
    });

    it('should test if basic Doichain workflow is working when Bobs node is temporarily offline', function(done) {
        //aliceAddress = getNewAddress(node_url_alice,rpcAuth,false);
        //shutdown Bob
        start3rdNode();
        stopDockerBob();
        const recipient_mail = "bob@ci-doichain.org";
        const sender_mail  = "alice-to-offline-node@ci-doichain.org";
        const recipient_pop3username = "bob@ci-doichain.org";
        const recipient_pop3password = "bob";

        //login to dApp & request DOI on alice via bob
        let dataLoginAlice = {};
        let resultDataOptIn = {};

        if(log) logBlockchain('logging in alice and request DOI');
        dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp
        resultDataOptIn = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, false);

        if(log) logBlockchain('waiting seconds before get NameIdOfOptIn',10);
        Meteor.setTimeout(function () {
            generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, false); //need to generate a block because bob is not in the current mempool when offline
            const nameId = getNameIdOfOptInFromRawTx(node_url_alice,rpcAuth,resultDataOptIn.data.id,true);
            startDockerBob();
            if(log) logBlockchain('waiting seconds before connecting nodes again:');
            connectDockerBob();
            //generating a block so transaction gets confirmed and delivered to bob.
            if(log) logBlockchain('waiting seconds before fetching email:',16);
            Meteor.setTimeout(function () {
                const link2Confirm = fetchConfirmLinkFromPop3Mail("mail", 110, recipient_pop3username, recipient_pop3password, dappUrlBob, false);
                confirmLink(link2Confirm);
                generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, false);
                if (log) logBlockchain('waiting 10 seconds to update blockchain before generating another block:');
                Meteor.setTimeout(function () {
                    generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, false);
                    if (log) logBlockchain('waiting 10 seconds before verifying DOI on alice:');
                    Meteor.setTimeout(function () {
                        verifyDOI(dappUrlAlice, sender_mail, recipient_mail, nameId, dataLoginAlice, log); //need to generate two blocks to make block visible on alice
                        done();
                    }, 10000); //verify
                }, 10000); //generatetoaddress
            },16000); //connect to pop3
        },10000); //find transaction on bob
    }); //it
});


export function stopDockerBob(client) {
    const syncFunc = Meteor.wrapAsync(stop_docker_bob);
    return syncFunc(client);
}

function stop_docker_bob(callback) {

    exec('sudo docker ps --filter "name=bob" | cut -f1 -d" " | sed \'1d\'', (e, stdout, stderr)=> {
        bobsContainerId = stdout.toString().substring(0,stdout.toString().length-1);
        logBlockchain('stopping Bob with container-id: '+bobsContainerId);

        exec('sudo docker stop '+bobsContainerId, (e, stdout, stderr)=> {
            callback(stderr, stdout);
        });
    });

}

export function start3rdNode(client) {
    const syncFunc = Meteor.wrapAsync(start_3rd_node);
    return syncFunc(client);
}

export function startDockerBob(client) {
    const syncFunc = Meteor.wrapAsync(start_docker_bob);
    return syncFunc(client);
}

function start_docker_bob(callback) {

    exec('sudo docker start '+bobsContainerId, (e, stdout, stderr)=> {
        callback(stderr, stdout);
    });
}

export function connectDockerBob(client) {
    const syncFunc = Meteor.wrapAsync(connect_docker_bob);
    return syncFunc(client);
}

function connect_docker_bob(callback) {

    exec('sudo docker exec -d '+bobsContainerId+' doichaind -regtest -reindex -addnode=alice', (e, stdout, stderr)=> {
        callback(stderr, stdout);
    });
}

function start_3rd_node(callback) {

    exec('sudo docker network ls |grep doichain | cut -f9 -d" "', (e, stdout, stderr)=> {
        const network = stdout.toString().substring(0,stdout.toString().length-1);
        logBlockchain('connecting 3rd node to docker network: '+network);

        exec('sudo docker run --expose=18332 ' +
            '-e REGTEST=true ' +
            '-e DOICHAIN_VER=0.0.6 ' +
            '-e RPC_ALLOW_IP=::/0 ' +
            '-e CONNECTION_NODE=alice '+
            '-e RPC_PASSWORD=generated-password ' +
            '--name=3rd_node '+
            '--dns=172.20.0.5  ' +
            '--dns=8.8.8.8 ' +
            '--dns-search=ci-doichain.org ' +
            '--ip=172.20.0.9 ' +
            '--network='+network+' -d doichain/core:0.0.6', (e, stdout, stderr)=> {
            callback(stderr, stdout);
        });
    });
}
