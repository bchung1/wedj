var express = require('express');
var app = express(); 
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http); 

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/client.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	socket.on('new track', function(track){
		 io.emit('new track', track);
	});
});

http.listen(3000, function(){ 
	console.log('listening on *:3000');
}); 

