var express = require('express');
var app = express(); 
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http); 
var request = require('request');
var querystring = require('querystring');
var mongoose = require('mongoose');

var clientID = "CLIENT-ID";
var clientSecret = "CLIENT-SECRET";  
var redirect_uri = "REDIRECT-URI"; 
var scope = "playlist-modify-public playlist-modify-private";
var userID;
var playlistID; 
var access_token; 
var refresh_token;



/* SCHEMA AND MODEL */
mongoose.connect('mongodb://localhost/wedj');
var Schema = mongoose.Schema;
var trackSchema = new Schema({
	artist: String, 
	song: String, 
	votes: Number
}); 

var Track = mongoose.model('Track', trackSchema);
/* SCHEMA AND MODEL*/




app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/client.html');
});

app.get('/callback', function(req, res){
	res.redirect('https://play.spotify.com/browse'); 
	var code = req.query.code;

	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri: redirect_uri,
			grant_type: 'authorization_code'
		},
		headers: {
			'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
		},
		json: true
	};

	request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {

			access_token = body.access_token;
			refresh_token = body.refresh_token;

			wedj.emit('access/refresh token', {access_token: access_token, refresh_token: refresh_token});
		} else {
			res.redirect('/#' +
				querystring.stringify({
					error: 'invalid_token'
				}));
		}
	});
})

var wedj = io.of('/wedj');
wedj.on('connection', function(socket){
	console.log('a client connected');
	Track.find({}, function(err, tracks) {
		if (!err){ 
			var tracks = tracks.map(function(track) { 
				return {song: track.song, artist: track.artist, votes: track.votes}
			}); 
			wedj.emit('load tracks', tracks); 
		} else {throw err;}
	});

	socket.on('disconnect', function(){
		console.log('a client disconnected');
	});

	socket.on('new track', function(newTrack, callback){
		if(userID == null || playlistID == null){
			callback('failed');
		}else{ 
			wedj.emit('new track', newTrack.trackInfo);
			addTrack(newTrack.trackID);
			addTrackToDB(newTrack.trackInfo);
			callback('success');
		}
	});

	socket.on('authorize', function(callback){
		var url = authorizeApplication(); 
		callback(url);
	});

	socket.on('start', function(userData){
		userID = userData.userID; 
		playlistID = userData.playlistID; 
	}); 
});

var authorizeApplication = function() { 
	var url = 'https://accounts.spotify.com/authorize';
	url += '?response_type=code';
	url += '&client_id=' + encodeURIComponent(clientID);
	url += '&scope=' + encodeURIComponent(scope);
	url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

	return url; 
}

var addTrack = function(trackID) { 
	var url = "https://api.spotify.com/v1/users/";
	url += userID; 
	url += '/playlists/';
	url += playlistID;
	url += '/tracks?uris=spotify:track:';
	url += trackID;

	console.log(url);

	var options = {
		url: url,
		headers: {'Authorization': 'Bearer ' + access_token},
		json: true
	};

	request.post(options, function(error, response, body){
		if(error){
			console.log(error);
		}else{
			console.log('track added');
		}
	});
}


var addTrackToDB = function(trackInfo){
	var newTrack = new Track({
		artist: trackInfo.artist, 
		song: trackInfo.song, 
		votes: 0
	}); 
	newTrack.save( function(error, data){
		if(error){
			console.log('Track could not be added to DB');
		}
		else{
			console.log('Track added to DB');
		}
	});
}

http.listen(3000, function(){ 
	console.log('listening on *:3000');
}); 

