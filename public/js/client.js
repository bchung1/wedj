var wedj = io('/wedj');
var tracks = [
		{name: 'We Don\'t talk anymore', votes: 0},
		{name: 'One Dance', votes: 0}
		];
var access_token, 
	refresh_token,
	userID, 
	playlistID; 

wedj.on('new track', function(track){
	tracks.push(track);
});

wedj.on('access/refresh token', function(tokens){
	access_token = tokens.access_token; 
	refresh_token = tokens.refresh_token;
}); 

wedj.on('start', function(userData){
	userID = userData.userID; 
	playlistID = userData.playlistID; 
	console.log(userID); 
	console.log(playlistID);
}); 

var app = new Vue({ 
	el:'#app',
	data: {
		trackName:'', 
		artistName:'',
		tracks: tracks
	},
	methods:{
		addTrack: function(){ 
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
			var query = songName + ' artist:' + artistName;
			var vue = this; 
			$.ajax({ 
				url: 'http://api.spotify.com/v1/search',
				data: { 
					q: query, 
					type: 'track'
				}, 
				success: function(response){
					if(response.tracks.items.length){
						var song = response.tracks.items[0].name; 
						var artist = response.tracks.items[0].artists[0].name; 
						var trackID = response.tracks.items[0].id; 
						var newTrack = {trackID: trackID, trackInfo: {name: song + ' by ' + artist, votes: 0}};
						console.log(newTrack);
						wedj.emit('new track', newTrack, function(msg){
							console.log("Track added:" + msg);
						});
					}
				}
			}); 
		}
	}
}); 

