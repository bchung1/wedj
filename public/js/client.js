// var wedj = io('/wedj');
var tracks = [];
// var access_token,
// refresh_token,
// userID,
// playlistID;
var tracks_loaded = false;

// wedj.on('new track', function(track){
// 	var newTrack = {name: track.song + ' by ' + track.artist, votes: track.votes}
// 	tracks.push(newTrack);
// });
//
// wedj.on('load tracks', function(dbTracks){
// 	if(!tracks_loaded){
// 		for(var i = 0; i < dbTracks.length; i++){
// 			var newTrack = {name: dbTracks[i].song + ' by ' + dbTracks[i].artist, votes: dbTracks[i].votes};
// 			tracks.push(newTrack);
// 		}
// 		tracks_loaded = true;
// 	}
// });

// wedj.on('access/refresh token', function(tokens){
// 	access_token = tokens.access_token;
// 	refresh_token = tokens.refresh_token;
// });
//
// wedj.on('start', function(userData){
// 	userID = userData.userID;
// 	playlistID = userData.playlistID;
// 	console.log(userID);
// 	console.log(playlistID);
// });

var app = new Vue({
	el:'#app',
	data: {
		trackName:'',
		artistName:'',
		tracks: tracks
	},
	methods:{
		parseTrack: function(){
			console.log('add Track');
			var trimTrackName = this.trackName.trim();
			var trimArtistName = this.artistName.trim();
			if(trimTrackName != '' && trimArtistName != ''){
				this.searchTrack(trimTrackName, trimArtistName);
			}
			this.trackName = '';
			this.artistName = '';
		},
		searchTrack: function(songName, artistName) {
			console.log(songName, artistName);
			var query = songName + ' artist:' + artistName;
			var _this = this;
			$.ajax({
				url: 'https://api.spotify.com/v1/search',
				data: {
					q: query,
					type: 'track'
				},
				success: function(response){
					console.log(response); 
						// var song = response.tracks.items[0].name;
						// var artist = response.tracks.items[0].artists[0].name;
						// var trackID = response.tracks.items[0].id;
						//var newTrack = {trackID: trackID, trackInfo: {song: song, artist: artist, votes: 0}};
						var trackURI = response.tracks.items[0].uri;
						_this.addTrack(trackURI, songName)
				},
				error: function(error){
					console.log(error);
				}
			});
		},
		addTrack: function(newTrack, track){
			$.ajax({
				type: "POST",
				url: "https://wedj.localtunnel.me",
				data: {uri: newTrack},
				success: function(msg){
					console.log("Track added");
					tracks.push({name: track,votes:0});
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	}
});
