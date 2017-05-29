var clientControl = require('../../socket_servers/client_control.js');

module.exports = {
	handle: function(method, params, response) {
		var arr = [];
		clientControl.clients.forEach(function(socket) {
			var contains = false;

			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == socket.username) {
					contains = true;
				}
			}

			if (!contains && socket.username) {
				arr.push(socket.username);	
			}
		});

		response.write(JSON.stringify(arr));
		response.end();
	}
}