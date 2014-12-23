var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

var _ = require('underscore');

var url = 'mongodb://localhost:27017/koodo';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    var collection = db.collection('documents');
    collection.find().toArray(function (err, docs) {
    	_.each(docs, function(doc) {
    		console.log(doc.Minutes1.serviceName);
		    // update student pulling the homework-score with the found lowest score
		    /*collection.update({ "_id":doc._id }, { "safe":true }, function( err, result ) {
					if (err) {
						console.log(err);
					}


				}
			);*/
		});
    });
});