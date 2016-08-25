'use strict';
require('chai').should();

let webdriver = require('selenium-webdriver');
let By = webdriver.By;

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

            var form;
            d.findElement(By.id('searchAskForm'))
                .then(function(_form_) {
                    form = _form_;
                    return d.findElement(By.id('searchAskInput'));
                })
                .then(function(element) {
                    element.sendKeys('BobbyFisher');
                    return form.submit();
                })
                .then(function() {
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
            var form;
            d.findElement(By.id('searchAskForm'))
                .then(function(_form_) {
                    form = _form_;
                    return d.findElement(By.id('searchAskInput'));
                })
                .then(function(element) {
                    element.sendKeys('event')
                    return form.submit();
                })
                .then(function() {
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
    describe('Searching for a word under three character', function() {
        it('should trigger an alert box with the text \'Search string must be at least 3 characters long\'', function(done) {

            d.findElement(By.id('searchAskInput'))
                .then(function(element) {
                    if(element.sendKeys.length < 3) {
                        
                    }
                })
        });
    });


});
