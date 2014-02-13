var MongoClient = require('mongodb').MongoClient
  , format = require('util').format;


module.exports = function(config) {
  var storage = {};


  var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
  var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;


  //find all memories
  storage.all = function(callback) {
    MongoClient.connect(format("mongodb://%s:%s/test?w=1", host, port), function(err, db) {

      var collection = db.collection('entries');
      collection.find().toArray(function(err, arr) {
        callback(err, arr);
      });
  
    });
  };

  return storage;
};