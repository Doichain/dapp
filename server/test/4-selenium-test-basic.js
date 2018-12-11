import assert from "assert";
import {chai} from 'meteor/practicalmeteor:chai';
var webdriver = require('selenium-webdriver');

var By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    firefox = require('selenium-webdriver/firefox'),
    chrome = require('selenium-webdriver/chrome');

let driver;
const mochaTimeOut = 30000;
const doichainLoginURL="http://localhost:3001";

if(Meteor.isAppTest || Meteor.isTest) {

    describe("meteor-1.8.1-selenium-mocha", function () {
        before(async  function () {
            this.timeout(10000);

            let options = new chrome.Options();
           // options.addArguments('--headless');
            const chromeCapabilities = webdriver.Capabilities.chrome();
            //chromeCapabilities.set('chromeOptions', {
              //  'args': ['--headless', '--disable-gpu', '--no-sandbox','--disable-dev-shm-usage']
            //});
           driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
        });

        after(async function () {
            driver.quit();
        });

        it("should login", async function () {
            this.timeout(mochaTimeOut);
            await logIn("admin", "password");
        });

        it("should should click on balance and show balance 0", async function (done) {
            this.timeout(mochaTimeOut);
            //await driver.findElement(By.xpath('/html/body/div#app/div#container/section#menu/div.page-menu/a[2]')).click();
            await driver.findElement(By.linkText("Balance")).click();
            await driver.wait(until.urlContains("/balance"));
            await driver.wait(until.elementLocated(By.id("balanceAmount")));
           // await driver.wait(until.elementTextIs(driver.wait(until.elementLocated(buttonLogin)), 'Sign Up'), 80000);

            await driver.wait(until.elementTextIs(driver.findElement(By.id("balanceAmount")), '0'));
            chai.expect(await driver.findElement(By.id("balanceAmount")).getText()).to.be.equal('0');
            //console.log(await driver.findElement(By.id("balanceAmount")).getText());
           // chai.expect(By.xpath('//*[@id="content-container"]/span/div/div/div/label').value).to.be.equal(0);

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