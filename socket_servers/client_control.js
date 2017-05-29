var globals = require('../globals.js');
var mconn = require('../webapp/mconn.js');

var clientControl = new (require('ws').Server)({port: globals.WEBSOCKET_CLIENT_PORT});

clientControl.on('connection', function(socket) {
	var params = socket.upgradeReq.url.substr(1).split('/');

	var username = params[0];
	var password = params[1];
	
	mconn.connect(function(err, db) {
		db.collection('client').find({
			username: username,
			password: password
		}).toArray(function(err, arr) {
			if (err || !arr || arr.length == 0) {
				socket.close();
			} else {
				socket.username = username;
			}
		});
	});
});

clientControl.broadcast = function(data, opts, username) {
	this.clients.forEach(function(socket) {
	  	if (socket.username == username && socket.readyState == 1) {
			socket.send(data, opts);
		}
	});
};

module.exports = clientControl;