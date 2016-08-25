'use strict';
require('chai').should();

let webdriver = require('selenium-webdriver');
let By = webdriver.By;
let until = webdriver.until;
let key = webdriver.Key;

let d = new webdriver.Builder()
.forBrowser('firefox')
.build();

after(function(done) {
    d.quit().then(done);
});

describe('Social Tables Help Page', function() {

    // increase timeout from 2000ms to account for webdriver load
    this.timeout(30000);

    beforeEach(function(done){
        d.get('http://help.socialtables.com')
        // wait for page to load
        .then(d.wait(d.findElement(By.tagName('title'))))
        .then(done)
    });

    // Test 0
    it('has the correct title', function(done) {
        d.getTitle()
        .then(title => title.should.equal('Social Tables Help - Home'))
        .then(() => done())
        .catch(error => done(error));
    });

    // Test 1
    describe('Logo', function() {
        it('should link to https://www.socialtables.com/', function(done) {

            var logo;

            d.findElement(By.id('logo-grey'))
                .then(function(element) {
                    logo = element;
                    return element.getTagName();
                })
                .then(function(tagName) {
                    tagName.should.equal('a');
                    return logo.getAttribute('href');
                })
                .then(function(href) {
                    href.should.equal('https://www.socialtables.com/');
                    done();
                })
                .catch(error => done(error));
        });

    });

    // Test 2
    describe('Searching for \'Bobby Fisher\'', function() {
        it('should return 0 results', function(done) {
            d.findElement(By.id('searchAskForm'))
                .then(function() {
                    return d.findElement(By.id('searchAskInput'));
                })
                .then(function(element) {
                    element.sendKeys('Bobby Fisher');
                    element.sendKeys(key.RETURN);
                    d.wait(until.elementLocated(By.id('results')), 5000);
                    return d.findElements(By.className('article'));
                })
                .then(function(results) {
                    results.length.should.equal(0);
                    done();
                })
                .catch(error => done(error));

        });
    });

    // Test 3
    describe('Searching for \'event\'', function() {
        it('should return 10 results', function(done) {
            d.findElement(By.id('searchAskForm'))
                .then(function() {
                    return d.findElement(By.id('searchAskInput'));
                })
                .then(function(element) {
                    element.sendKeys('event');
                    element.sendKeys(key.RETURN);
                    d.wait(until.elementLocated(By.id('results')), 5000);
                    return d.findElements(By.className('article'));
                })
                .then(function(results) {
                    results.length.should.equal(10);
                    done();
                })
                .catch(error => done(error));
        });

    });

    // Test 4
    describe('Searching for a word under three characters', function() {
        it('should trigger an alert box with the text \'Search string must be at least 3 characters long\'', function(done) {
            // focus the search box
            // type 2 letters
            // search
            // check for alert
            // check to see if alert box has string

            d.findElement(By.id('searchAskInput'))
                .then(function(element){
                    element.sendKeys('hi');
                    element.sendKeys(key.RETURN);
                    var alert = d.switchTo().alert();
                     return alert.getText();
                })
                .then(function(text){
                    text.should.equal('Search string must be at least 3 characters long');
                    done();
                })
                .catch(error => done(error));
        });
    });

});
