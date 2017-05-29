var mconn = require('../mconn.js');

module.exports = {
	handle: function(method, params, response, body, query, session) {
		session.flush();
		
		response.write("{}");
   		response.end();
	}
}