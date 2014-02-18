var MongoClient = require('mongodb').MongoClient
  , format = require('util').format;


module.exports = function(config) {
  var storage = {};


  var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
  var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;

  MongoClient.connect(format("mongodb://%s:%s/TED?w=1", host, port), function(err, db) {
    storage.db = db;
  });

  //find all people
  storage.all = function(callback) {
    var collection = storage.db.collection('people');
    collection.find().toArray(function(err, arr) {
      callback(err, arr);
    });
  };

  //insert person
  storage.insert = function(doc) {
    var collection = storage.db.collection('people');
    collection.update({user: doc.user}, {$set: doc}, {upsert: true}, function(err) {
      if (err) console.log(err);
    });
  };

  return storage;
};