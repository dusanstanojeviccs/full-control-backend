var mongoRestAdapter = require('../mongo_rest_adapter.js');

module.exports = mongoRestAdapter.create({
	type: 'company', 
	fields: ["_id", "companyId", "name"],

	validate: function(company, db) {
		return [];
	}, 
	
	isAuthorized: function(method, session) {
		return !!session.get('admin');	
	}, 
	
	prepareQueries: function(query, session) {}
})