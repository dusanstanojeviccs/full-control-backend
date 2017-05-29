var mongoRestAdapter = require('../mongo_rest_adapter.js');
var utils = require('../util.js');

module.exports = mongoRestAdapter.create({
	type: 'client', 
	fields: ["_id", "companyId", "name", "username", "password"],

	validate: function(client, db) {
		var errors = [];

		if (!client.companyId) {
			errors.push(utils.err("companyId", "Molim Vas odaberite kompaniju"));
		}

		return errors;
	}, 
	
	isAuthorized: function adminAccessValidator(method, session) {
		if (method === "GET") {
			return !!session.get('admin') || !!session.get('user');	
		}
		return !!session.get('admin');	
	}, 
	
	prepareQueries: function(query, session) {
		if (session.get('user')) {
			query["companyId"] = session.get('user').companyId;
		}
	}
})
