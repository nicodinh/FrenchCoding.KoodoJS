var links = [];
var casper = require('casper').create({verbose: false, logLevel:"log"});
var fs = require('fs');

casper.start('https://libreserviceprepaye.koodomobile.com/', function() {
    this.echo("Job started");
    var configFile = fs.read("config/config.json");
    var config = JSON.parse(configFile);
    this.echo("Config ready");
    this.fill('form[action=""]', { 
        'ctl00$FullContent$ContentBottom$LoginControl$UserName': config.username, 
        'ctl00$FullContent$ContentBottom$LoginControl$Password': config.password 
    }, false);

    this.mouseEvent('click', 'input[id="FullContent_ContentBottom_LoginControl_LoginButton"]');
    this.echo("Form POST done");
});

casper.then(function() {
    this.echo("Waiting for postback... (2 seconds)")
    this.wait(2000, function() {
        // this.capture('koodo-s1.png', {
        //     top: 0,
        //     left: 0,
        //     width: 1000,
        //     height: 1000
        // });
    });
});

casper.thenOpen('https://libreserviceprepaye.koodomobile.com/fr/Apercu/Forfait-de-base-et-a-cotes/Afficher-l-utilisation/', function() {
    this.echo("We're in!")
    // this.capture('koodo-s2.png', {
    //     top: 0,
    //     left: 0,
    //     width: 1000,
    //     height: 1000
    // });

    var dataRemaining = this.evaluate(function () {
        var usage = { 
            data : {
                dataBundleName : $('.data-panel .table-data.bundleName').text().trim(),
                dataAllowance : $('#DataAllowanceLiteral').text().trim(),
                dataUsed : $('#DataUsedLiteral').text().trim(),
                dataRemaining : $('#DataRemainingLiteral').text().trim(),
                startDate : $('.data-panel .table-data.startDate').text().trim()
            },
            Minutes1 : {
                serviceName : $('.crossservice-panel tr:eq(1) .bundleName').text().trim(),
                totalMinutes : $('.crossservice-panel tr:eq(1) .allowance span').text().trim(),
                usedMinutes : $('.crossservice-panel tr:eq(1) .used span').text().trim(),
                remainingMinutes : $('.crossservice-panel tr:eq(1) .remaining span').text().trim(),
                startDate : $('.crossservice-panel tr:eq(1) .startDate').text().trim(),
            },
            Minutes2 : {
                serviceName : $('.crossservice-panel tr:eq(2) .bundleName').text().trim(),
                totalMinutes : $('.crossservice-panel tr:eq(2) .allowance span').text().trim(),
                usedMinutes : $('.crossservice-panel tr:eq(2) .used span').text().trim(),
                remainingMinutes : $('.crossservice-panel tr:eq(2) .remaining span').text().trim(),
                startDate : $('.crossservice-panel tr:eq(2) .startDate').text().trim(),
            },
            meta : {
                timestamp: new Date().toString()
            }

        };
        return usage;
    });
    
    var jsonobject = JSON.stringify(dataRemaining);
    var date = new Date();
    fs.write('results/usage-'+ date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() + "." + date.getHours() + "." + date.getMinutes() + "." + date.getSeconds() + '.json', jsonobject);
    this.echo("usage saved to disk");
    this.echo("done!");
});

casper.run(function() {});

/*
=Data=

bundleName 
    $('.data-panel .table-data.bundleName')
DataAllowanceLiteral
    $('#DataAllowanceLiteral')
DataUsedLiteral
    $('DataUsedLiteral')
DataRemainingLiteral
    $('DataRemainingLiteral')
Start Date
    $('.data-panel .table-data.startDate')

Minutes #1
Nom du service
    $('.crossservice-panel tr:eq(1) .bundleName')
Minutes
    $('.crossservice-panel tr:eq(1) .allowance span').text()
Minutes utilisées
    $('.crossservice-panel tr:eq(1) .used span').text()
Minutes restantes
    $('.crossservice-panel tr:eq(1) .remaining span').text()
Date de début
    $('.crossservice-panel tr:eq(1) .startDate')

Minutes #2
Nom du service
    $('.crossservice-panel tr:eq(2) .bundleName')
Minutes
    $('.crossservice-panel tr:eq(2) .allowance span').text()
Minutes utilisées
    $('.crossservice-panel tr:eq(2) .used span').text()
Minutes restantes
    $('.crossservice-panel tr:eq(2) .remaining span').text()
Date de début
    $('.crossservice-panel tr:eq(2) .startDate')




*/