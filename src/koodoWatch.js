var watch = require('watch');
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var fs = require('fs');

watch.createMonitor('results', function (monitor) {
    monitor.files['/results/']
    monitor.on("created", function (f, stat) {
        console.log("new file - " + f);
        fs.readFile(f, function (err, data) {
            if (err) throw err;
            var data = JSON.parse(data)
            var url = 'mongodb://localhost:27017/koodo';
            MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                console.log("Connected correctly to server");

                insertDocuments(db, data, function() {
                    db.close();

                    // fs.unlink(f, function (err) {
                    //   if (err) throw err;
                    //   console.log('successfully deleted ' + f);
                    // });
                });
            });

            var insertDocuments = function(db, dataToInsert, callback) {
                var collection = db.collection('documents');
                collection.insert(dataToInsert, function(err, result) {
                    console.log(new Date().toString() + " - Inserted document into the document collection");
                    callback(result);
                });
            }
        });
    })
});