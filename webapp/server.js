var fs = require('fs');
var globals = require('../globals.js');
var url = require('url');
var endpointRegistry = require('./endpoint_registry.js');
var NodeSession = require('node-session');
var session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD', driver: 'memory'});


function handleRest(method, params, response, body, query, session) {
	response.setHeader('Content-Type', 'application/json');
	
	try {
		var file = params[1] + ".js";

		var fullPath = "webapp/rest/" + file;

		var handler = null;

		if (fs.existsSync(fullPath) && !fs.lstatSync(fullPath).isDirectory()) {
			handler = require("./rest/" + file);
		} else if (endpointRegistry.contains(params[1])) {
			handler = endpointRegistry.getHandler(params[1]);
		}

		if (handler) {
			if (body && body !== "") {
				body = JSON.parse(body);	
			}
			if (!handler.doesAuth) {
				response.writeHead(200);
			}
			handler.handle(method, params, response, body, query, session);
		} else {
			response.writeHead(400);
			response.end();
		}
	} catch (e) {
		console.log(e);
		response.end();
	}
}

function handleFile(method, params, response) {
	var file = "webapp/pages/" + (params[params.length - 1] || "index.html");

	var done = false;

	try {
		if (fs.existsSync(file) && !fs.lstatSync(file).isDirectory()) {
			response.writeHead(200);
			done = true;
			fs.createReadStream(file).pipe(response);		
		}
	} catch(e) {}
   			
   	if (!done) {
   		response.writeHead(400);
   		response.end();
   	}
}

var server = require('http').createServer( function(request, response) {
	response.setHeader('Access-Control-Allow-Origin', '*');

	var urlParsed = url.parse(request.url, true);

	var params = urlParsed.pathname.substring(1).split('/');

	session.startSession(request, response, function() {	
		if (params[0] === "rest") {
			var body = "";
		    request.on('readable', function() {
		        body += (request.read() || "");
		    });
		    request.on('end', function() {
		        handleRest(request.method, params, response, body, urlParsed.query, request.session);
		    });
		} else {
			handleFile(request.method, params, response);
		}
	});

}).listen(globals.REGULAR_SERVER_PORT);	

module.exports = server;