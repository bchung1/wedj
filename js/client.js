// Initialize Firebase
var config = {
	apiKey: "AIzaSyAsn9C7nSumjDhg1P0mhwJ7A4E-ECxEuJs",
	authDomain: "wedj-b6fda.firebaseapp.com",
	databaseURL: "https://wedj-b6fda.firebaseio.com",
	storageBucket: "",
};
firebase.initializeApp(config);

var database = firebase.database(); 


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
			$.ajax({ 
				url: 'http://api.spotify.com/v1/search',
				data: { 
					q: query, 
					type: 'track'
				}, 
				success: function(response){
					if(response.tracks.items.length){
						var trackID = response.tracks.items[0].id; 
						console.log(trackID);
					}
				}
			}); 
		}
	}
}); 







