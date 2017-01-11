
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// var express = require('express')
// var http = require('http')
// var path = require('path')
// var reload = require('reload')
// var bodyParser = require('body-parser')
// var logger = require('morgan')
 
// var app = express()
 
// var publicDir = path.join(__dirname, 'game')
 
// app.set('port', process.env.PORT || 9000)
// app.use(logger('dev'))
// app.use(bodyParser.json()) //parses json, multi-part (file), url-encoded 
 
// app.get('/', function(req, res) {
//   //res.sendFile(path.join(publicDir, 'index.html'))
//   res.render('game/index')
// })
 
// var server = http.createServer(app)
 
// // Reload code here 
// reload(server, app)
 
// server.listen(app.get('port'), function(){
//   console.log("Web server listening on port " + app.get('port'));
// });
