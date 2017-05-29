var globals = require('../globals.js');
var userStream = require('./user_stream.js');
var mconn = require('../webapp/mconn.js');

var clientStream = require('http').createServer( function(request, response) {
	var params = request.url.substr(1).split('/');

	var username = params[0];
	var password = params[1];
	
	mconn.connect(function(err, db) {
		db.collection('client').find({
			username: username,
			password: password
		}).toArray(function(err, arr) {
			if (err || !arr || arr.length == 0) {
				request.end();
			} else {
				request.on('data', function(data) {
					userStream.broadcast(data, {binary:true}, username);
				});
			}
		});
	});

}).listen(globals.STREAM_PORT);

module.exports = clientStream;