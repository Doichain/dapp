import {doichainAddNode, getDockerStatus, startDockerBob, stopDockerBob} from "./2-basic-doi-test.2";
import {chai} from 'meteor/practicalmeteor:chai';

xdescribe('basic-doi-test-nico', function () {
    this.timeout(600000);

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
