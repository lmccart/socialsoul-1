var MongoClient = require('mongodb').MongoClient
  , format = require('util').format
  , _ = require('underscore')
  , fs = require('fs');


module.exports = function(callback) {
  var storage = {
    default_users: []
  };


  var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
  var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;

  MongoClient.connect(format("mongodb://%s:%s/socialsoul?w=1", host, port), function(err, db) {
    storage.db = db;
	storage.mentors = db.collection('mentors');
    storage.db.createCollection('people', function() {

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

      //reset people collection
      storage.reset = function(callback) {
        storage.db.dropCollection('people', callback);
      };

      storage.updateDefaultUsers = function() {
        // initialize default options
        storage.all(function(err, data) {
          storage.default_users = _.map(data, function(obj) { return obj.user; });
        });
      };

      storage.allMentors = function (callback) {
        storage.mentors.find({}, {sort: "user"}).toArray(callback);
      };

	  // TODO update people collection when adding or removing a mentor
	  storage.addMentor = function (user, callback) {
		  storage.mentors.update({user: user}, {$set: {user: user}}, {upsert: true}, function (err) {
			  if (err) console.error(err);
			  try { generateMentorsTxt(); } catch (err0) {
				  err = err0;
			  }
			  callback(err);
		  });
	  };

	  storage.removeMentor = function (user, callback) {
		  storage.mentors.remove({user: user}, function (err) {
			  if (err) console.error(err);
			  try { generateMentorsTxt(); } catch (err0) {
				  err = err0;
			  }
			  callback(err);
		  });
	  }

	  storage.generateMentorsTxt = function () {
		  console.log('generating public/mentors.txt');
		  storage.allMentors(function (err, mentors) {
			  if (err) console.error(err);
			  var data = mentors.map(function (m) { return m.user; }).sort().join("\n");
			  fs.writeFile('./public/mentors.txt', data, function (err) {
				  if (err) console.error(err);
			  });
		  });
	  }

      storage.updateDefaultUsers();
	  fs.exists('./public/mentors.txt', function (exists) {
		  if (!exists) storage.generateMentorsTxt();
	  });

	  callback(storage);
    });


  });
};
