var mconn = require('./mconn.js');
var mongodb = require('mongodb');

function formatedResponse(type, value) {
	var obj = {};
	
	obj[type] = value;

	return JSON.stringify(obj);
}

function cleanObject(obj, fields) {
	var cleaned = {};
	if (fields) {
		for (var i = 0; i < fields.length; i++) {
			cleaned[fields[i]]  = obj[fields[i]];
		}	
	}
	return cleaned;
}

module.exports = {
	create: function(params) {
		let type = params.type, 
			validate = params.validate, 
			isAuthorized = params.isAuthorized, 
			fields = params.fields
			prepareQueries = params.prepareQueries;

		return {
			doesAuth: true,
			handle: function(method, params, response, body, query, session) {
				query = cleanObject(query);
				prepareQueries(query, session);

				if (!isAuthorized(method, session)) {
					response.writeHead(401);
					response.end();
					return;
				}

				mconn.connect(function(err, db) {
					if (method === "GET") {
						response.writeHead(200);
						db.collection(type).find(query).toArray(function(err, arr) {
							response.write(formatedResponse(type, arr));
							response.end();
						});
					} else if (method === "POST") {
						var errors = validate(body[type], db);

						if (errors.length > 0) {
							response.writeHead(422);
							response.write(formatedResponse("errors", errors));
							response.end();
						} else {
							response.writeHead(200);
			   				db.collection(type).insert(body[type], function(err, res) {
			   					response.write(formatedResponse(type, res.ops[0]));
								response.end();
							});
						}
					} else if (method === "PUT") {
						var errors = validate(body[type], db);

						if (errors.length > 0) {
							response.writeHead(422);
							response.write(formatedResponse("errors", errors));
						} else {
							response.writeHead(200);

							body[type]["_id"] = new mongodb.ObjectID(body[type]["_id"]);
							query["_id"] = new mongodb.ObjectID(body[type]["_id"]);
							
							db.collection(type).save(body[type]);
							response.write(JSON.stringify(body));
						}
						response.end();
					} else if (method === "DELETE") {
						var removing = {"_id": new mongodb.ObjectID(params[params.length - 1])};
						db.collection(type).remove(removing);

						response.writeHead(200);
						response.write("{}");
						response.end();
					}
				});	
			}
		}
	}
}