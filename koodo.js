var links = [];
var casper = require('casper').create({verbose: true, logLevel:"debug"});

function getLinks() {
    var links = document.querySelectorAll('h3.r a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

casper.start('https://libreserviceprepaye.koodomobile.com/', function() {
    this.fill('form[action=""]', { 
        'ctl00$FullContent$ContentBottom$LoginControl$UserName': '', 
        'ctl00$FullContent$ContentBottom$LoginControl$Password': '' 
    }, false);

    this.mouseEvent('click', 'input[id="FullContent_ContentBottom_LoginControl_LoginButton"]');
});

casper.then(function() {
    this.wait(2000, function() {
        this.echo("I've waited for a second.");
        this.capture('koodo-s1.png', {
            top: 0,
            left: 0,
            width: 1000,
            height: 1000
        });
    });    
});

casper.thenOpen('https://libreserviceprepaye.koodomobile.com/fr/Apercu/Forfait-de-base-et-a-cotes/Afficher-l-utilisation/', function() {
    this.capture('koodo-s2.png', {
        top: 0,
        left: 0,
        width: 1000,
        height: 1000
    });
});

casper.run(function() {});