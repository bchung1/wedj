var socket = io(); 

socket.on('new track', function(track){
	console.log(track);
});

var app = new Vue({ 
	el:'#app',
	data: {
		trackName:'', 
		artistName:'',
		tracks: [
		{name: 'We Don\'t talk anymore', votes: 0},
		{name: 'One Dance', votes: 0}
		]
	},
	methods:{
		addTrack: function(){ 
			var trimTrackName = this.trackName.trim(); 
			var trimArtistName = this.artistName.trim();
			if(trimTrackName != '' && trimArtistName != ''){
				this.validateTrack(trimTrackName, trimArtistName); 
			}
			this.trackName = '';
			this.artistName = '';
		}, 
		validateTrack: function(songName, artistName) { 
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
						socket.emit('new track', trackID);
						vue.tracks.push({name: song + ' by ' + artist});
					}

				}
			}); 
		}
	}
}); 

