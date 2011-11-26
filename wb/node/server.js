var express = require('express'),
    app = express.createServer();   //Create web server

var io = require('socket.io').listen(app);

//Serve up static resources
app.use(express.static(__dirname + "/.."));

//Configure Socket.IO
io.configure('development', function(){
	io.enable('browser client etag');
	io.set('log level', 1);
	io.set('transports', [
		  'websocket'
		, 'flashsocket'
		, 'htmlfile'
		, 'xhr-polling'
		, 'jsonp-polling'
	]);
});

//Listen for connections
io.sockets.on('connection', function (socket) {
	console.log('Connection Made', socket.id);

    socket.emit('ack', { message: 'You are connected.' });

    // todo: add listener for release messages
});


//Start app
app.listen(3008);
console.log("Server started...");