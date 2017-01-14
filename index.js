
var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('reload')
var bodyParser = require('body-parser')
var logger = require('morgan')
var fs = require('fs')
var mc = require('mongodb').MongoClient;
var uuid = require('node-uuid')
var dateformat = require('dateformat')


var watch = require('node-watch')
 
var app = express()

var dburl = "mongodb://nabooleo:ax31zcm@ds145848.mlab.com:45848/gamedata";

// mongo ds145848.mlab.com:45848/gamedata -u nabooleo -p ax31zcm


 
// var publicDir = path.join(__dirname, 'game')
 
app.set('port', process.env.PORT || 9000);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //parses json, multi-part (file), url-encoded 
app.use(express.static( __dirname + '/game'));


app.locals.comments = 0;

app.get('/', function (req, res) {
	console.log('res.locals'); 
	console.log( app.locals); 
	if( !app.locals.comments) {
		// // Connect to the db
		mc.connect(dburl, function(err, db) {
		    if(!err) {
		          db.collection('comments').find().toArray(function (err, result) {
		    		if (err) throw err
		    		app.locals.comments = result;
		    		res.render( 'index', { title: 'Drone Warfare' })
			  	  })
				  db.close();
		    }
		});
	}
	else {

		res.render('index', { title: 'Drone Warfare' })

	}
})



app.post('/', function (req, res) {

	console.log(req.body); 
	console.log(req.body.name)
	console.log('deal with post')

	var now = new Date()
	mc.connect(dburl, function(err, db) {
		if(!err) {
			db.collection('comments').insertOne( {
				'name' 		: req.body.name,
				'comment' 	: req.body.textarea_9166f4d,
				'date'	    : dateformat(now, "mmmm dS, yyyy")
			});	
			if ( req.body.textarea_9166f4d != '') {
				app.locals.pcon_gcom = 'thanks for your comment'
			}
			db.collection('comments').find().toArray(function (err, result) {
		    	if (err) throw err
		    	app.locals.comments = result;
		    	res.render( 'index', { title: 'Drone Warfare' })
			 });
		}
		db.close();
	})
})
app.on('error', function(err) {
 console.log('err'); 
  // This prints the error message and stack trace to `stderr`.
  console.error(err.stack);
});
// app.use(function (err, req, res, next) {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// })


var server = http.createServer(app);

// reloadServer = reload(server, app);
// watch('.rebooted', function (f, curr, prev) {
//     // Fire server-side reload event 
//     reloadServer.reload();
// });
// fs.writeFile('.rebooted', 'rebooted')
 
// Reload code here 
reload(server, app).reload();
 
server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port') + " Date: " + new Date())
});


