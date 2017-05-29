var globals = require('../globals.js');
var mconn = require('../webapp/mconn.js');

var userStream = new (require('ws').Server)({port: globals.WEBSOCKET_PORT});

userStream.on('connection', function(socket) {
	var params = socket.upgradeReq.url.substr(1).split('/');

	var streamHeader = new Buffer(8);
	streamHeader.write(globals.STREAM_MAGIC_BYTES);
	streamHeader.writeUInt16BE(globals.width, 4);
	streamHeader.writeUInt16BE(globals.height, 6);
	socket.send(streamHeader, {binary:true});

	var username = params[0];
	var userUsername = params[1];
	var userPassword = params[2];
	
	mconn.connect(function(err, db) {
		db.collection('user').find({
			username: userUsername,
			password: userPassword
		}).toArray(function(err, arr) {
			if (err || !arr || arr.length == 0) {
				socket.close();
			} else {
				socket.username = username;
			}
		});
	});

});

userStream.broadcast = function(data, opts, username) {

	this.clients.forEach(function(socket) {
		if (!!(socket.username == username) && socket.readyState == 1) {
			socket.send(data, opts);
		}
	});
};

module.exports = userStream;