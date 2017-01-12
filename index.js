
var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('reload')
var bodyParser = require('body-parser')
var logger = require('morgan')
var fs = require('fs')
var mc = require('mongodb').MongoClient;

var watch = require('node-watch')
 
var app = express()
 
// var publicDir = path.join(__dirname, 'game')
 
app.set('port', process.env.PORT || 9000)
app.set('view engine', 'pug')



app.use(logger('dev'))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json()) //parses json, multi-part (file), url-encoded 
app.use(express.static('game'))



// // Connect to the db
mc.connect("mongodb://localhost:27017/gamedata", function(err, db) {
    if(!err) {
          db.collection('comments').find().toArray(function (err, result) {
    if (err) throw err
	    app.locals.comments = result;

	  })
    }
});

app.locals.comments = [{name:'a', comment:'comment 1'},{name:'b', comment:'comment 2'}]

app.get('/', function (req, res) {
  res.render('index', { title: 'Drone Warfare'})
})
app.post('/', function (req, res) {

	console.log(req.body.textarea_9166f4d); 
	console.log('deal with post')

	if ( req.body.textarea_9166f4d != '') {
		app.locals.pcon_gcom = 'thanks for you comments'
	}

	res.render('index', { title: 'Drone Warfare' })

})

// app.get('/', function( req, res ) {

var server = http.createServer(app);

// reloadServer = reload(server, app);
// watch('.rebooted', function (f, curr, prev) {
//     // Fire server-side reload event 
//     reloadServer.reload();
// });
// fs.writeFile('.rebooted', 'rebooted')
 
// Reload code here 
//reload(server, app).reload();
 
server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port') + " Date: " + new Date())
});


