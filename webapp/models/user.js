var mongoRestAdapter = require('../mongo_rest_adapter.js');
var utils = require('../util.js');

module.exports = mongoRestAdapter.create({
	type: 'user', 
	fields: ["_id", "companyId", "name", "phone", "email", "username", "password"],

	validate: function(user, db) {
		var errors = [];

		if (!user.companyId) {
			errors.push(utils.err("companyId", "Molim Vas odaberite kompaniju"));
		}

		return errors;
	}, 
	
	isAuthorized: function(method, session) {
		return !!session.get('admin');	
	}, 
	
	prepareQueries: function(query, session) {}
})