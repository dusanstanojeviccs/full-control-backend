var globals = require('./globals.js');

// Define sockets
require("./socket_servers/user_stream.js");
require("./socket_servers/client_control.js");
require("./socket_servers/user_control.js");
require("./socket_servers/client_stream.js");

// Define webapp server (static files + rest services)
require('./webapp/server.js');

console.log('Listening for MPEG Stream on http://127.0.0.1:'+globals.STREAM_PORT+'/<secret>/<width>/<height>');
console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+globals.WEBSOCKET_PORT+'/');
