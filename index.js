//multiplayer
var express = require('express')
var http = require('http')
var lc = require('./logtoclient');
var logger = require('morgan')
var path = require('path')
var reload = require('reload')
var bodyParser = require('body-parser')
var fs = require('fs')
var mc = require('mongodb').MongoClient
var mongoose = require('mongoose')
var uuid = require('node-uuid')
var dateformat = require('dateformat')
const async = require('async')
const game_server = require('./multiserver/registry')



var event = require('events');
var eventEmitter = new event.EventEmitter;


// pass comment to the client
var cp = new lc();


var watch = require('node-watch');
 
var app = express();
var server = http.createServer(app);
const io = require('socket.io')(server);

// var multiserver = http.createServer(app);
// var io = require('socket.io')( multiserver );

// change to live
var dburl = "mongodb://nabooleo:ax31zcm@ds145848.mlab.com:45848/gamedata";
//var dburl = 'mongodb://localhost:27017/test';


// mc.connect( dburl, function(err, db) {
//   if(err) throw err;
//   db.listCollections().toArray( function( err, col) {
//   	console.log(col);
//   })
//   db.close();
// });

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

app.locals.shaders = { };
fs.readdir(__dirname + '/shaders/', function (err, filesPath) {
    if (err) throw err;
    filesPath = filesPath.map(function(filePath){ //generating paths to file
        return __dirname + '/shaders/' + filePath;
    });
    async.map(filesPath, function(filePath, cb){ //reading files or dir
        fs.readFile(filePath, 'utf8', cb);
    }, function(err, results) {
        for ( var i in results) {
        	if ( results[i].match('laservs') ) {
        		app.locals.shaders.laservs = results[i];
        	}
        	if ( results[i].match('laserfs') ) {
        		app.locals.shaders.laserfs = results[i];
        	}
        	if ( results[i].match('planet1vs') ) {
	        	app.locals.shaders.planet1vs = results[i];
	        }
	        if ( results[i].match('planet1fs') ) {
	        	app.locals.shaders.planet1fs = results[i];
	        }
        	if ( results[i].match('planetGlowfs') ) {
        		app.locals.shaders.planetGlowfs = results[i];
        	}
        	if ( results[i].match('planetGlowvs') ) {
        		app.locals.shaders.planetGlowvs = results[i];
        	}
        	if ( results[i].match('starfs') ) {
        		app.locals.shaders.starfs = results[i];
        	}
        	if ( results[i].match('starvs') ) {
        		app.locals.shaders.starvs = results[i];
        	}
        }
    })
})


app.locals.comments = 0;
app.get('/', function (req, res) {
		mc.connect(dburl, function(err, db) {
		    if(!err) {
		          db.collection('comments').find().toArray(function (err, result) {
		    		if (err) throw err
		    		app.locals.comments = result;
		    		app.locals.cd = cp.gcd();
		    		res.render( 'index', { 
		    			title: 'Drone War 1',
		    			laservs: app.locals.shaders.laservs,
	        			laserfs: app.locals.shaders.laserfs,
	        			planet1vs: app.locals.shaders.planet1vs,
	        			planet1fs: app.locals.shaders.planet1fs,
	        			planetGlowvs: app.locals.shaders.planetGlowvs,
	        			planetGlowfs: app.locals.shaders.planetGlowfs,
	        			starvs: app.locals.shaders.starvs,
	        			starfs: app.locals.shaders.starfs,
	        		})
			  	  })
				  db.close();
		    }
		});

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

		//console.log(req.body);
		mc.connect(dburl, function(err, db) {

		//	console.log(db);

			if(!err) {
				db.collection('levels').findOne( { level: ~~req.body.l }, function (err, result) {

					//console.log(result);

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



var Schema = mongoose.Schema;
var gameDataSchema = new Schema  ({ player1: String, player2: String, bodys: { Buffer } });
var Multi = mongoose.model('Multi', gameDataSchema);

var numberOfGame = 0;


io.use(function(socket, next) {
  var handshakeData = socket.request;
  // make sure the handshake data looks good as before
  // if error do this:
    // next(new Error('not authorized');
  // else just call next
  next();
});



io.on('connection', (socket) => {

	console.log('connection');

	// cp.scd(socket.id); 
	// console.log(Multi);
	// cp.scd( socket.nsp );

	var lastRec = Multi.find().sort({_id:1}).limit(1);

	lastRec.exec( (err, lastRec) => {

		console.log(lastRec.player2);

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


    socket.on('getgd', (gameUUID) => {
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
reload(server, app).reload();
 
server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port') + " Date: " + new Date())
});

