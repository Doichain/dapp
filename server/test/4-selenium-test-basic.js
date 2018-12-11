import assert from "assert";
const { expect } = require('chai');

var webdriver = require('selenium-webdriver');

var By = require('selenium-webdriver').By,
    Builder = require('selenium-webdriver').Builder,
    until = require('selenium-webdriver').until,
    firefox = require('selenium-webdriver/firefox');
//  chrome = require('selenium-webdriver/chrome'),
//const puppeteer = require('puppeteer');
// puppeteer options
const opts = {
    headless: true,
    slowMo: 100,
    timeout: 10000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
};

//const args = {args: ['--no-sandbox', '--disable-setuid-sandbox']};


let driver, page;
const mochaTimeOut = 30000;
const doichainLoginURL="http://localhost:3001";

if(Meteor.isAppTest) {

    describe("meteor-1.8.1-selenium-mocha", function () {
        before(async  function () {
            this.timeout(10000);

            let options = new firefox.Options();
            options.addArguments('--headless');
/*            let options = new chrome.Options();

           // options.setChromeBinaryPath("/tmp/chromedriver/chromedriver");
            options.addArguments('--headless');
            options.addArguments('--no-sandbox');
            options.addArguments('--disable-dev-shm-usage');

            //options.setBinary("/tmp/chromedriver/chromedriver");
             */
            //chromeCapabilities.set('chromeOptions', {args: ['--headless']});
           /* const firefoxCapabilities = webdriver.Capabilities.firefox();
            driver = new webdriver.Builder().forBrowser('firefox')
             //   .usingServer('http://localhost:4444/wd/hub')
                 .withCapabilities(firefoxCapabilities)
                 .setChromeOptions(options)
                .build();*/

            const chromeCapabilities = webdriver.Capabilities.chrome();
            chromeCapabilities.set('chromeOptions', {
                'args': ['--headless', '--disable-gpu', '--no-sandbox','--disable-dev-shm-usage']
            });
           driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
            //


           // driver = webdriver.Chrome('/path/to/your_chrome_driver_dir/chromedriver',options=options)
            //headless
                //driver = new Builder().forBrowser('chrome').setChromeOptions(options).build(); //HEADLESS
            //global.browser = await puppeteer.launch(opts);
            //page = await global.browser.newPage();
            //await page.goto('http://www.bitcoin.de');
        });

        after(async function () {
            driver.quit();
           // await page.screenshot({path: 'example.png'});
           // await global.browser.close();

            //global.browser = globalVariables.browser;
        });

        it("package.json has correct name", async function () {
            const {
                name
            } = await
                import ("../../package.json");
            assert.strictEqual(name, "doichain");
        });

        it('should append query to title', async function () {
             this.timeout(mochaTimeOut);
             await driver.get('http://www.google.com/ncr');
             await driver.findElement(By.name('q')).sendKeys('webdriver');
             await driver.findElement(By.name('q')).sendKeys(webdriver.Key.ENTER);
             await driver.wait(until.titleIs('webdriver - Google Search'), 3000);
         });

        it("should login", async function () {
            this.timeout(mochaTimeOut);
            await logIn("admin", "password");
        });

         async function logIn(username, password) {

            //^l driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
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

        it("should should click on balance and show balance 0", async function () {
            this.timeout(mochaTimeOut);
            await logIn("admin", "password");
        });

    });
}