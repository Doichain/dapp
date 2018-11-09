import {doichainAddNode, getDockerStatus, startDockerBob, stopDockerBob} from "./2-basic-doi-test.2";
import {chai} from 'meteor/practicalmeteor:chai';
import {logBlockchain} from "../imports/startup/server/log-configuration";

xdescribe('basic-doi-test-nico', function () {
    this.timeout(600000);

    it('should safely stop and start bobs doichain node container', function (done) {
        var containerId = stopDockerBob();

        logBlockchain("stopped bob's node with containerId",containerId);
        chai.expect(containerId).to.not.be.null;

        var startedContainerId = startDockerBob(containerId);
        logBlockchain("started bob's node with containerId",startedContainerId);
        chai.expect(startedContainerId).to.not.be.null;

        let running = true;
        while(running){
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
        }

        done();
    });
});
