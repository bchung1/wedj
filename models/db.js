// Initialize Firebase
var config = {
	apiKey: "AIzaSyAsn9C7nSumjDhg1P0mhwJ7A4E-ECxEuJs",
	authDomain: "wedj-b6fda.firebaseapp.com",
	databaseURL: "https://wedj-b6fda.firebaseio.com",
	storageBucket: "",
};
firebase.initializeApp(config);
module.exports = firebase.database(); 