module.exports = {
	handle: function(method, params, response, body, query, session) {
		if (method === "GET") {
			response.write(JSON.stringify(session.all()));
			response.end();
		} else {
   			response.end();
		}
	}
}