var handlerMap = {};

handlerMap['user'] = require('./models/user.js');

handlerMap['company'] = require('./models/company.js');

handlerMap['client'] = require('./models/client.js');

module.exports = {
	contains: function(key) {
		return !!handlerMap[key];
	},
	getHandler: function(key) {
		return handlerMap[key];
	}
}