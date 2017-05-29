var MongoClient = require('mongodb').MongoClient;
var globals = require('../globals.js');

module.exports = {
	connect: function(callback) {
		return MongoClient.connect(globals.DB_URL, callback);
	}
}
