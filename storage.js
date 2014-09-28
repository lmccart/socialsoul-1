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
		storage.people = db.collection('people');

		//find all people
		storage.all = function(callback) {
			storage.people.find().toArray(function(err, arr) {
				callback(err, arr);
			});
		};

		//insert person
		storage.insert = function(doc) {
			storage.people.update({user: doc.user}, {$set: doc}, {upsert: true}, function(err) {
				if (err) console.log(err);
			});
		};

		//reset people collection
		storage.reset = function(callback) {
			storage.db.dropCollection('people', callback);
		};

		storage.updateDefaultUsers = function() {
			console.log('updating default users');
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
				try {
					storage.updateDefaultUsers();
					storage.generateMentorsTxt();
				} catch (err0) {
					err = err0;
				}
				callback(err);
			});
		};

		storage.removeMentor = function (user, callback) {
			console.log('removing %s from the mentors collection', user);
			storage.mentors.remove({user: user}, function (err) {
				if (err) {
					console.error(err);
					callback(err);
				} else {
					console.log('removing %s from the people collection', user);
					storage.people.remove({user: user}, function (err) {
						try {
							storage.updateDefaultUsers();
							storage.generateMentorsTxt();
						} catch (err0) {
							err = err0;
						}
						if (err) console.error(err);
						callback(err);
					});
				}
			});
		}

		// This method is used to generate the mentors.txt file
		// whenever there is an update to the mentors collection.
		// Were the collection large, this would not be a good idea.
		// However, since it is not likely to grow beyond the order
		// of thousands, this is reasonable.
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
		storage.generateMentorsTxt();

		callback(storage);

	});
};
