var express = require('express');
var app = express(); 
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http); 

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/client.html');
});

app.get('/host', function(req, res) { 
	res.sendFile(__dirname + '/public/host.html')
}); 

var client = io.of('/client');
client.on('connection', function(socket){
	console.log('a client connected');
	socket.on('disconnect', function(){
		console.log('a client disconnected');
	});

	socket.on('new track', function(track){
		 client.emit('new track', track);
	});
});

var host = io.of('/host');
host.on('connection', function(socket){
	console.log('a host connected');
	socket.on('disconnect', function(){
		console.log('a host disconnected');
	});
	socket.on('add TrackID', function(trackID){ 
		console.log(trackID);
		host.emit('add TrackID', trackID);
	}); 
});

http.listen(3000, function(){ 
	console.log('listening on *:3000');
}); 

