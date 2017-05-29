var mconn = require('../mconn.js');

module.exports = {
	handle: function(method, params, response, body, query, session) {
		if (method === "GET") {
			mconn.connect(function(err, db) {
				session.flush();

				db.collection('user').find({
					username: query.username, 
					password: query.password
				}).toArray(function(err, arr) {
					if (arr.length > 0) {
						for (var i = 0; i < arr.length; i++) {
							arr[i].role = "user";
						}

						session.put('user', arr[0]);

						response.write(JSON.stringify(arr[0]));
						response.end();	
					} else {
						db.collection('admin').find({
							username: query.username, 
							password: query.password
						}).toArray(function(err, arr) {
							if (arr.length > 0) {
								for (var i = 0; i < arr.length; i++) {
									arr[i].role = "admin";
								}
								session.put('admin', arr[0]);
								response.write(JSON.stringify(arr[0]));
								response.end();
							} else {
								response.write("{}");
								response.end();
							}
						});	
					}
					
				});
			});	
		} else {
   			response.end();
		}
	}
}