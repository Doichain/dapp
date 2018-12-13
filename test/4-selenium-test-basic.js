import assert from "assert";
import {chai} from 'meteor/practicalmeteor:chai';
import {generatetoaddress, getBalance, getNewAddress, initBlockchain} from "./test-api/test-api-on-node";
import {login, requestConfirmVerifyBasicDoi} from "./test-api/test-api-on-dapp";
var webdriver = require('selenium-webdriver');

var By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    firefox = require('selenium-webdriver/firefox'),
    chrome = require('selenium-webdriver/chrome');

let driver;
const mochaTimeOut = 80000;
const doichainLoginURL="http://localhost:3000"; //use from outside and inside docker!

//Node URL
const node_url_alice = 'http://localhost:18543/'; //use from outside docker!
const node_url_bob =   'http://localhost:18544/'; //use from outside docker!
//const node_url_alice = 'http://alice:18332/'; //use from inside docker! (inside docker doesn't work right)
//const node_url_bob =   'http://bob:18332/'; //use from inside docker! (inside docker doesn't work right)

//dApp URL
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://localhost:4000";
const dAppLogin = {"username":"admin","password":"password"};
const rpcAuthAlice = "admin:generated-password";

const rpcAuth = "admin:generated-password";

const os = require('os');
const dns = require('dns');

if(Meteor.isAppTest || Meteor.isTest) {

    describe("meteor-1.8.1-selenium-mocha", function () {

        before(async  function () {
            this.timeout(mochaTimeOut);
            (os.hostname()=='regtest')?dns.setServers(['172.20.0.5']):dns.setServers(['127.0.0.1']); //TODO clean-up this dirty hack is necessary when starting from outside docker!
            console.log(dns.getServers());
            let headless = true;
            let options = new chrome.Options();
            const chromeCapabilities = webdriver.Capabilities.chrome();
            if(headless){
                options.addArguments('--headless');
                options.addArguments('--no-sandbox');
                options.addArguments('--disable-dev-shm-usage');
                chromeCapabilities.set('chromeOptions', {
                     'args': ['--headless', '--disable-gpu', '--no-sandbox','--disable-dev-shm-usage']
                });
            }
            //https://nehalist.io/selenium-tests-with-mocha-and-chai-in-javascript/
            driver = new webdriver.Builder().forBrowser('chrome')
                .setChromeOptions(options)
                .build();
           // driver = new webdriver.Builder()
           //    .withCapabilities(chromeCapabilities)
           //    .setChromeOptions(options)
           //    .build();
        });

        after(async function () {
            driver.quit();
        });

        it("should initialize the blockchain with two nodes", async function (done) {
            this.timeout(mochaTimeOut);
            await initBlockchain(node_url_alice,node_url_bob,rpcAuth,global.privKeyBob,true);
            const aliceBalance = getBalance(node_url_alice, rpcAuth, false);
            chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
            done();
        });

        it("should login", async function (done) {
            this.timeout(mochaTimeOut);
            await logIn("admin", "password");
            done()
        });

        xit("should should click on balance and show current balance", async function (done) {
            this.timeout(mochaTimeOut);
            const aliceBalance = await getBalance(node_url_alice, rpcAuth, true);
            console.log('aliceBalance:'+aliceBalance);
            await driver.findElement(By.linkText("Balance")).click();
            await driver.wait(until.urlContains("/balance"));
            await driver.wait(until.elementLocated(By.id("balanceAmount")));
            //await driver.wait(until.elementTextIs(driver.findElement(By.id("balanceAmount")), '0'));
            chai.expect(await driver.findElement(By.id("balanceAmount")).getText()).to.be.equal(aliceBalance.toString());
            done();
        });

        xit("should generate some coins and should check updated balance ", async function (done) {
            this.timeout(mochaTimeOut);

            global.aliceAddress = await getNewAddress(node_url_alice, rpcAuth, true);
            await generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1,true);
            //await driver.manage().timeouts().implicitlyWait(3000);
            //await driver.manage().setTimeouts({implicit: 3000});
            await driver.sleep(3000);

            await driver.findElement(By.linkText("Home")).click(); //click to another menu in order to refresh the amount.
            await driver.wait(until.elementTextIs(driver.findElement(By.className("title")), 'doichain'));
            const aliceBalance = await getBalance(node_url_alice, rpcAuth, true);
            console.log('balance:'+aliceBalance);
            //await driver.manage().setTimeouts({implicit: 3000});
            await driver.sleep(3000);

            await driver.findElement(By.linkText("Balance")).click(); //so balance gets updated
            await driver.wait(until.urlContains("/balance"));

            chai.expect(await driver.findElement(By.id("balanceAmount")).getText()).to.be.equal(aliceBalance.toString());
            done();
        });

        it("should request a doi and check if it appears in opt-ins", async function (done) {
            this.timeout(mochaTimeOut);
            const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!
            const sender_mail = "alice-over-selenium"+Date.now()+"@ci-doichain.org";
            const dataLoginAlice = login(dappUrlAlice, dAppLogin, true); //log into dApp
            console.log("current DNS-Servers:"+dns.getServers());
            await requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, {'city': 'Ekaterinburg'}, "bob@ci-doichain.org", "bob", true);
            done();
        });

        async function logIn(username, password) {
            await driver.get(doichainLoginURL);
            await driver.wait(until.elementLocated(By.css("a.btn-secondary")));
            await driver.findElement(By.css("a.btn-secondary")).click();
            await driver.wait(until.urlContains("/signin"));
            await driver.findElement(By.name("usernameOrEmail")).sendKeys(username);
            await driver.findElement(By.name("password")).sendKeys(password);
            await driver.findElement(By.css('button[type="submit"] > div > div > span')).click();
            await driver.wait(until.elementLocated(By.className("title")));
            return;
        }

        xit('should append query to title', async function () {
            this.timeout(mochaTimeOut);
            await driver.get('http://www.google.com/ncr');
            await driver.findElement(By.name('q')).sendKeys('webdriver');
            await driver.findElement(By.name('q')).sendKeys(webdriver.Key.ENTER);
            await driver.wait(until.titleIs('webdriver - Google Search'), 3000);
        });

        xit("package.json has correct name", async function () {
            const {
                name
            } = await
                import ("../../package.json");
            assert.strictEqual(name, "doichain");
        });

    });
}