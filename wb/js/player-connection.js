var socket,
	server = 'http://127.0.0.1:3008';  //todo: Be sure to use your servers ip address and port (L2.1 a)


var connect = function(callback) {
	console.log("Attempting to connect to " + server);

    //Connect to server
	socket = io.connect(server);

    //Listen for ack from server that we have connected
    //todo:  Add listener for ack messages (L2.1 b)
};