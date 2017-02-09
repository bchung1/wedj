var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var applescript = require('applescript');

var queue = [];

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/client.html');
});

app.post('/', function(req, res){
  addTrack(req.body.uri);
  res.send();
});

app.listen('3000', function(){
  console.log('Listening on port 3000');
  startDetectingEndOfTrack();
});

function addTrack(uri){
  queue.push(uri);
}



var detectEndOfTrack = 'tell application "Spotify"\nset d to ((duration of current track)/1000)\nrepeat until (player position + 1) as integer is equal to d as integer\nend repeat\nreturn "End Track"\nend tell';
var playScript = 'tell application "Spotify"\nplay track ';


function startDetectingEndOfTrack(){
  applescript.execString(detectEndOfTrack, function(err, rtn){
    playTrack();
  });
}

function playTrack(){
  var nextTrack = queue.shift();
  var script = playScript + "\"" + nextTrack + "\"\nend tell";
  applescript.execString(script, function(err, rtn){
    startDetectingEndOfTrack();
  });
}
