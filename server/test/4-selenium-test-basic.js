import assert from "assert";

var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');

var By = require('selenium-webdriver').By,
    Builder = require('selenium-webdriver').Builder,
    until = require('selenium-webdriver').until,
    firefox = require('selenium-webdriver/firefox'),
    test = require('selenium-webdriver/testing');

const mochaTimeOut = 30000;


    describe("meteor-1.8.1-selenium-mocha", function() {

        it("package.json has correct name", async function() {
            const {
                name
            } = await
                import ("../package.json");
            assert.strictEqual(name, "doichain  ");
        });

        it('should append query to title', async function() {
            var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
            this.timeout(mochaTimeOut);
            await driver.get('http://www.google.com/ncr');
            await driver.findElement(By.name('q')).sendKeys('webdriver');
            await driver.findElement(By.name('q')).sendKeys(webdriver.Key.ENTER);
            await driver.wait(until.titleIs('webdriver - Google Search'), 3000);
            await driver.quit()
        });

        if (Meteor.isClient) {
            it("client is not server", function() {
                assert.strictEqual(Meteor.isServer, false);
            });
        }

        if (Meteor.isServer) {
            it("server is not client", function() {
                assert.strictEqual(Meteor.isClient, false);
            });
        }
    });
