"use strict";

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
var ObjectId = require('mongodb').ObjectId
var mongoose = require('mongoose')
var uuid = require('node-uuid')
var dateformat = require('dateformat')
const async = require('async')
const game_server = require('./multiserver/game_server')




var event = require('events');
var eventEmitter = new event.EventEmitter;


// pass comment to the client
var cp = new lc();

var watch = require('node-watch');
 
 // set up ws and monitor
var app = express();
var server = http.createServer(app);
const io = require('socket.io')(server);
var gameserver;
//var monitorio = require('monitor.io');





// mc.connect( dburl, function(err, db) {
//   if(err) throw err;
//   db.listCollections().toArray( function( err, col) {
//   	console.log(col);
//   })
//   db.close();
// });
// change to live
var dburl = "mongodb://nabooleo:ax31zcm@ds145848.mlab.com:45848/gamedata";
// var dburl = "mongodb://localhost:27017/test";

mongoose.connect(dburl);
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;


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
		    		db.collection('players').findOne( { ip: req.ip }, function (err, result) {
		    			var user = 0;
		    			if ( result ) {  user = '{ "id": "' + result._id.toString() + '", "username": "' + result.username + '", "password": "' + result.password + '", "settings":"' + result.settings +'"}' }

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
		        			user: user
		        		})
				  	  })
					  db.close();
					});
		    }
		});

})

app.locals.levels = 0;
app.post('/', function (req, res) {
	//console.log('deal with post')
	//console.log(req.body);
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
	if ( req.body.username && req.body.password && !req.body.email ) {

		mc.connect(dburl, function(err, db) {
			if ( err ) throw err
			db.collection('players').findOne( { 
				username: req.body.username,
				password: req.body.password, }, 
				function (err, result) {

			    	if (err) throw err
			    	if ( result ) {
				    	db.collection('players').update(
				    		{ _id: result.id },
				    		{ $set:
				    			{ last_login: new Date() }
				    		}				    		
				    	)
				    	res.json( { id: result._id.toString(), username: req.body.username, password: req.body.password, settings: result.settings  } );
				    }
				    else {
				    	res.send(' login details not found ')
				    }
					db.close();
				}
			);
		});	

	}
	if ( req.body.username && req.body.password && req.body.email ) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if ( req.body.email.match( re ) ) {
			mc.connect(dburl, function(err, db) {
				if ( err ) throw err
				db.collection('players').findOne(

					{ $or: [ { username: req.body.username}, { email: req.body.email } ] },
					function( err, plyresult) {

						if ( !plyresult ) {
							db.collection('players').insertOne({
								username: req.body.username,
								password: req.body.password,
								email: req.body.email,
								settings: req.body.settings,
								ip: '',
								last_login: new Date() }, 
								function ( err, result ){
									res.json( { id: result.insertedId.toString(), username: req.body.username, password: req.body.password, settings: req.body.settings  } );
									db.close();
								}
							);
						}
						else {
							var sent = 0;
							if ( plyresult.username == req.body.username && plyresult.email == req.body.email ) { sent = 1; res.send(' The username and email address have already been used')};
							if ( plyresult.email == req.body.email && !sent ) { sent = 1; res.send('The email address has already been used')};
							if ( plyresult.username == req.body.username && !sent) { res.send(' The username has already been used')};
						}
					}
				);

			});
		}
		else {
			res.send(' email is invalid ');
		}
	}
	if ( req.body.id) {
		mc.connect(dburl, function(err, db) {
			if ( err ) throw err
			if( req.body.settings.slice(-1) == 1 ) {
				var ip = req.ip
			}
			else {
				var ip = ''
			}
			db.collection('players').update( 
				{ _id: ObjectId( req.body.id ) },
	    		{ $set:
	    			{ settings: req.body.settings, ip: ip }

	    		},	
				function (err, result) {
					if ( err ) {
						res.send( 'there has been a problem with the settings update' );
					}
					else {
						res.json( { settings: req.body.settings } );
					}
					db.close();
				}
			);
		});
	}
})
app.on('error', function(err) {
 console.log('err'); 
  // This prints the error message and stack trace to `stderr`.
  console.error(err.stack);
});


var gameDataSchema = new Schema  ({ 
									player1: String,
									player2: String, 
									bodys: { Buffer },
									gamecore: Number
								  },
								  {
									timestamps: { createdAt: 'created_at' }	 
								  });
var Multi = mongoose.model('Multi', gameDataSchema);

mc.connect(dburl, function(err, db) {

//	console.log(db);
	if( !app.locals.levels ) {

		db.collection('levels').find({}).toArray( function(err, result) {
		
			if (err) throw err
			app.locals.levels = result;
			gameserver = new game_server( app.locals.levels );

		})

	}
});



//io.use( monitorio({ port: undefined }) );
io.use(function(socket, next) {

  var handshakeData = socket.request;
  ///cp.scd(handshakeData);

  // make sure the handshake data looks good as before
  // if error do this:
    // next(new Error('not authorized');
  // else just call next
  next();
});

app.locals.host = 1;
var numberOfGame = 0;
io.on('connection', (client) => {

	console.log( 'connection ');

	// cp.scd(socket.id); 
	// console.log(Multi);
	// cp.scd( socket.nsp );


	//client.ip = client.handshake.address.address;

	Multi.findOne().sort({_id:-1}).limit(1).then( ( game ) => {

		console.log(' app locals host ');
		console.log( app.locals.host);

		if ( app.locals.host ) {
			Multi.create( { player1: client.id, player2: 'player2', bodys: {} }, ( err, multi ) => {
				if( err ) console.log('error starting game');
				// send the game id to the client
				client.emit('gamestart', { id: multi.id , host: 1, playerid: client.id });
				gameserver.join_game( multi, client );
				
			});
			numberOfGame += 1;
		}
		if ( !app.locals.host ) {
			if ( game === null || game.player2 != 'player2'){
				setImmediate( function() {
					handlePl2(client);
				});
			}
			else {
			
				game.player2 = client.id;
				game.save();
				client.emit('gamestart', { id: game.id, host: 0, playerid: client.id });
				gameserver.join_game( game, client );
			}
		}
		app.locals.host ? app.locals.host = 0 : app.locals.host = 1 ;
	}).catch( (err) => {
		console.log('there is a db error');
		console.log(err);
	});

    client.on('setgd', function ( data ) {
    	try {
    		gameserver.setgd( data );
    	}
    	catch (err) {
    		debugger
    		console.log( err )
    	}

    });
   	client.on('sendlatency', function( data ) {
	
		client.emit('setlatency', { latency: data.latency });
	});
   	client.on('dataload1', function( data ) {
   		gameserver.dataload1(data);
   	});
   	client.on('levelgen', function( data ) {
   		gameserver.levelgen( data );
   	});
    client.on('disconnect', function( data ) {
    	console.log('disconnect');
    });

    function handlePl2 (client) {

    	// change to live
		Multi.findOne().sort({_id:-1}).limit(1).then( ( game ) => {
			game.player2 = client_id;
			game.save();
			client.emit('gamestart', { id: game.id, host: 0, playerid: client.id  });
		 	//client.join(game.player1);
			gameserver.join_game( game );
		});
 		app.locals.host = 1;
		
	}





});
 
// // Reload code here 
// change to live
//reload(server, app).reload();
 
server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port') + " Date: " + new Date())
});

