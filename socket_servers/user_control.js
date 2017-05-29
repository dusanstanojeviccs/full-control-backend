var globals = require('../globals.js');
var clientControl = require('./client_control.js');
var mconn = require('../webapp/mconn.js');

var userControl = new (require('ws').Server)({port: globals.WEBSOCKET_MASTER_PORT});
userControl.on('connection', function(socket) {
	var params = socket.upgradeReq.url.substr(1).split('/');

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
				socket.on('message', function(data) {
					console.log(username);
					clientControl.broadcast(data, {}, username);
				});
			}
		});
	});
});

module.exports = userControl;