var mconn = require('../mconn.js');

module.exports = {
	doesAuth: true,
	handle: function(method, params, response, body, query, session) {
		if (method === "GET") {
			mconn.connect(function(err, db) {
				session.flush();

				console.log(query.username);
				console.log(query.password);

				db.collection('client').find({
					username: query.username, 
					password: query.password
				}).toArray(function(err, arr) {
					if (arr.length > 0) {
						for (var i = 0; i < arr.length; i++) {
							arr[i].role = "client";
						}

						session.put('client', arr[0]);

						response.writeHead(200);
						response.write(JSON.stringify(arr[0]));
						response.end();	
					} else {
						response.writeHead(401);
						response.write("{}");
						response.end();
					}
					
				});
			});	
		} else {
   			response.end();
		}
	}
}