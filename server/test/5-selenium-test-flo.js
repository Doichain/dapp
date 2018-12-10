var sw = require('selenium-webdriver');
const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
let driver = new Builder().forBrowser('chrome').build();
//let driver = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--headless')).build(); //HEADLESS
const basePage="http://localhost:3000";

describe('simple-selenium-test', function () {
    this.timeout(10000);
    beforeEach(function(){
        driver.get(basePage);
        driver.wait(until.elementLocated(By.className("title")));
    });

    it("should login",async function(){
        await logIn("admin","password");
        return;
    });

    it("should display Balance",async function(){
        //await driver.findElement(By.xpath("//a[contains(text(),'admin')]")).should.eventually.exist();
        await logIn("admin","password");
        await driver.findElement(By.linkText("Balance")).click();
        await driver.wait(until.urlContains("balance"));
        await driver.wait(until.elementTextMatches(driver.findElement(By.css("label")),/^[0-9]*\.[0-9]*$/));
        return;
    }
    );


});

async function logIn(username,password){
    await driver.wait(until.elementLocated(By.css("a.btn-secondary")));
    await driver.findElement(By.css("a.btn-secondary")).click();
    await driver.wait(until.urlContains("/signin"));
    await driver.findElement(By.name("usernameOrEmail")).sendKeys(username);
    await driver.findElement(By.name("password")).sendKeys(password);
    await driver.findElement(By.css('button[type="submit"] > div > div > span')).click();
    await driver.wait(until.elementLocated(By.className("title")));
    return;
}

