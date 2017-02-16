//multiplayer
var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('reload')
var bodyParser = require('body-parser')
var logger = require('morgan')
var fs = require('fs')
var mc = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var uuid = require('node-uuid')
var dateformat = require('dateformat')

var event = require('events');
var eventEmitter = new event.EventEmitter;

var hc = require('./handleComments');

// pass comment to the client
var cp = new hc();
 


var watch = require('node-watch');
 
var app = express();
var server = http.createServer(app);
const io = require('socket.io')(server);

// var multiserver = http.createServer(app);
// var io = require('socket.io')( multiserver );

var dburl = "mongodb://nabooleo:ax31zcm@ds145848.mlab.com:45848/gamedata";
mongoose.connect(dburl);


// mongo ds145848.mlab.com:45848/gamedata -u nabooleo -p ax31zcm


 
// var publicDir = path.join(__dirname, 'game')
 
app.set('port', process.env.PORT || 9000);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

//app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //parses json, multi-part (file), url-encoded 
app.use(express.static( __dirname + '/game'));


app.locals.comments = 0;

app.get('/', function (req, res) {
	//console.log('res.locals'); 
	//console.log( app.locals); 
	//if( !app.locals.comments) {
		mc.connect(dburl, function(err, db) {
		    if(!err) {
		          db.collection('comments').find().toArray(function (err, result) {
		    		if (err) throw err
		    		app.locals.comments = result;
		    		app.locals.cd = cp.gcd();
		    		res.render( 'index', { title: 'Drone War 1' })
			  	  })
				  db.close();
		    }
		});
	//}
	// else {

	// 	res.render('index', { title: 'Drone Warfare' })

	// }
})



app.post('/', function (req, res) {
	//console.log('deal with post')
	//console.log(req.body);
	var now = new Date();
	if(req.body.name && req.body.comment){
		mc.connect(dburl, function(err, db) {
			if(!err) {
				db.collection('comments').find( { name: req.body.name, comment: req.body.comment } ).toArray(function (err, result) {
			    	if (err) throw err

			    	//cp('send to db');
			    	res.render( 'index', { title: 'Drone War 1' })
			    	if( result.length == 0 ){
				    	db.collection('comments').insertOne( {
							'name' 		: req.body.name,
							'comment' 	: req.body.comment,
							'date'	    : dateformat(now, "mmmm dS, yyyy")
						});	
						db.close();
			    	}
				});
			}
		})
	}
	if(req.body.l){

		//console.log('deal with post')
		//console.log(req.body);
		mc.connect(dburl, function(err, db) {
			if(!err) {
				db.collection('levels').findOne( { level: ~~req.body.l }, function (err, result) {
			    	if (err) throw err
			    	delete result['_id'];
			    	res.send(result);
				});
			}
			else {
				console.log(err);
			}
		})
	}
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


var Schema = mongoose.Schema;
var gameDataSchema = new Schema  ({ player1: String, player2: String, bodys: { Buffer } });
var Multi = mongoose.model('Multi', gameDataSchema);

var numberOfGame = 0;

io.on('connection', (socket) => {

	console.log('connection');

	// cp.scd(socket.id); 
	// console.log(Multi);
	// cp.scd( socket.nsp );

	var lastRec = Multi.find().sort({_id:1}).limit(1);
	lastRec.exec( (err, lastRec) => {

		console.log(lastRec.length);

		if ( lastRec.length === 0 || lastRec.player2 != 'player2') {

			Multi.create( { player1: socket.id, player2: 'player2', bodys: {} }, ( err, multi ) => {
				if( err ) console.log('error starting game');

				socket.emit('gamestart', { id: multi.id , host: true });
				app.locals.gid = multi.id;
			});
			numberOfGame += 1;
		}
		else {

			Multi.update( { _id: lastRec.id} , { $set: { player2: socket.id } });
			socket.emit('gamestart', { id: lastRec.id, host: false });
			app.locals.gid = lastRec.id;
		}




	});
   

  	//socket.emit('stc', {data: app.locals.gid } );


    socket.on('getgd', function(gameUUID){
    	console.log('game uuid is '); 
        console.log(gameUUID);
    });


    socket.on('setgd', function (gd) {

    	Multi.update({ _id: gd.id }, { $set: { bodys: gd.body}} );
    	Multi.find({}).exec( function(err, data) {

    		console.log(data);
    	});

    });
    socket.on('disconnect', function(data) {
    	console.log('disconnect');
    });
});

// reloadServer = reload(server, app);
 
// // Reload code here 
// reload(server, app).reload();
 
server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port') + " Date: " + new Date())
});

