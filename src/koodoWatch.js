var watch = require('watch');
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var fs = require('fs');

watch.createMonitor('results', function (monitor) {
    monitor.files['results/'] // Stat object for my zshrc.
    monitor.on("created", function (f, stat) {
        console.log("new file - " + f);
        fs.readFile(f, function (err, data) {
            if (err) throw err;
            var data = JSON.parse(data)
            var url = 'mongodb://localhost:27017/koodo';
            MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                console.log("Connected correctly to server");
                //db.close();
                insertDocuments(db, function() {
                    db.close();
                });
            });

            var insertDocuments = function(db, callback) {
                // Get the documents collection
                var collection = db.collection('documents');
                // Insert some documents
                collection.insert(data, function(err, result) {
                    console.log("Inserted document into the document collection");
                    callback(result);
                });
            }
        });
    })
});