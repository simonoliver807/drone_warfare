"use strict";

//multiplayer
const express = require('express')
const http = require('http')
const lc = require('./logtoclient');
const nodemailer = require('nodemailer');
const logger = require('morgan')
const path = require('path')
const reload = require('reload')
const bodyParser = require('body-parser')
const fs = require('fs')
const mc = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const mongoose = require('mongoose')
const uuid = require('node-uuid')
const dateformat = require('dateformat')
const async = require('async')
const game_server = require('./multiserver/game_server')
const EventEmitter = require('events');


class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter();

// pass comment to the client
let cp = new lc();
 // set up ws and monitor
let app = express();
let server = http.createServer(app);
const io = require('socket.io')(server);
let gameserver;

let email_prev_client = 0;
let email_prev_server = 0;
let email_prev_DB = 0;
let sendTimeClient = 0;
let sendTimeServer = 0;
let sendTimeDB = 0;


myEmitter.on('error', (err) => {
  	var htmlString = '<b>error message: ' + err + '</b>';
	var textString = 'error message: ' + err;
  	sendEmail( 'server error', htmlString, textString );
});
process.on('uncaughtException', function ( err ) {
	var htmlString = '<b>error message: ' + err + '<br> error stack: ' + err.stack + '</b>';
	var textString = 'error message: ' + err + 'error stack: ' + err.stack ;
	sendEmail( 'server error', htmlString, textString );
	process.exit(1);
});



let transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 465,
    secure: false, // secure:true for port 465, secure:false for port 587
    auth: {
        user: '5edbb6bbda70a2',
        pass: '6627be1dd9a82c'
    }
});

//let monitorio = require('monitor.io');





// mc.connect( dburl, function(err, db) {
//   if(err) throw err;
//   db.listCollections().toArray( function( err, col) {
//   	console.log(col);
//   })
//   db.close();
// });
// change to live
// let dburl = "mongodb://nabooleo:ax31zcm@ds145848.mlab.com:45848/gamedata";
let dburl = "mongodb://localhost:27017/test";

mongoose.connect(dburl);
mongoose.Promise = global.Promise;
let Schema = mongoose.Schema;


// mongo ds145848.mlab.com:45848/gamedata -u nabooleo -p ax31zcm


 
// let publicDir = path.join(__dirname, 'game')
 
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
        for ( let i in results) {
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
        	if ( results[i].match('mtrfs') ) {
        		app.locals.shaders.mtrfs = results[i];
        	}
        	if ( results[i].match('mtrvs') ) {
        		app.locals.shaders.mtrvs = results[i];
        	}
        	if ( results[i].match('engineGlowfs') ) {
        		app.locals.shaders.engineGlowfs = results[i];
        	}
        	if ( results[i].match('engineGlowvs') ) {
        		app.locals.shaders.engineGlowvs = results[i];
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

		    	//	debugger
		    		let cookies = res.req.headers.cookie;
		    		let username = 0;
			    	let password = 0;
		    		if ( cookies !== undefined ) {
		    			cookies = cookies.split(';');
			    		let i = cookies.length;
			    		while( i-- ){

			    			let currcookie = cookies[i].split('=');
			    			if( currcookie[0].replace(/\s+/g, '') == 'username' ) {
			    				username = currcookie[1];
			    			}
			    		}
			    	}

		    		db.collection('players').findOne( { username: username }, function (err, result) {

		    			debugger
		    			let user = 0;
		    			if ( result ) {  user = '{ "id": "' + result._id.toString() + '", "username": "' + result.username + '", "password": "' + result.password + '", "settings":"' + result.settings +'"}' }

		    		//	debugger
		    			res.set( 'Cache-Control', 'no-cache' );

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
		        			mtrvs: app.locals.shaders.mtrvs,
		        			mtrfs: app.locals.shaders.mtrfs,
		        			engineGlowvs: app.locals.shaders.engineGlowvs,
		        			engineGlowfs: app.locals.shaders.engineGlowfs,
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
				    	let settingsarr = result.settings.split(','); 
				    	if ( ~~settingsarr[5]) {
				    		res.set( 'Set-Cookie', 'username=' + req.body.username + ';max-age='+259200+';HttpOnly');
						}
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
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
								last_login: new Date() }, 
								function ( err, result ){
									res.json( { id: result.insertedId.toString(), username: req.body.username, password: req.body.password, settings: req.body.settings  } );
									db.close();
								}
							);
						}
						else {
							let sent = 0;
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
			// if( req.body.settings.slice(-1) == 1 ) {
			// 	let ip = req.ip
			// }
			// else {
			// 	let ip = ''
			// }
			db.collection('players').update( 
				{ _id: ObjectId( req.body.id ) },
	    		{ $set:
	    			{ settings: req.body.settings }
	    		},	
				function (err, result) {
					if ( err ) {
						res.send( 'there has been a problem with the settings update' );
					}
					else {
						debugger
						let settingsarr = req.body.settings.split(','); 
				    	if ( ~~settingsarr[5]) {
				    		res.set( 'Set-Cookie', 'username=' + req.body.username + ';max-age='+259200+';HttpOnly');
						}
						if( !~~settingsarr[5] ) {
							res.clearCookie('username');
						}
						res.json( { settings: req.body.settings } );
					}
					db.close();
				}
			);
		});
	}
	if ( req.body.errormsg ) {
		 var htmlString = '<b>error message: ' + req.body.errormsg + '<br> url: ' + req.body.url_e + '<br> line number: ' + req.body.l_no + '<br> user data: ' + req.body.userdata + '</b>';  // html body
		 var textString = 'error message: ' + req.body.errormsg + ' url: ' + req.body.url_e + ' line number: ' + req.body.l_no + ' user data: ' + req.body.userdata; // plain text body
		 sendEmail( 'client error', htmlString, textString );
	}
})
app.on('error', function(err) {
 console.log('err'); 
  // This prints the error message and stack trace to `stderr`.
  console.error(err.stack);
});


let gameDataSchema = new Schema  ({ 
									player1: String,
									player2: String, 
									bodys: { Buffer },
									gamecore: Number
								  },
								  {
									timestamps: { createdAt: 'created_at' }	 
								  });
let Multi = mongoose.model('Multi', gameDataSchema);

mc.connect(dburl, function(err, db) {

//	console.log(db);
	if( !app.locals.levels ) {

		db.collection('levels').find({}).sort({ level: 1 }).toArray( function(err, result) {
		
			if (err) throw err
			app.locals.levels = result;
			gameserver = new game_server( app.locals.levels );

		})

	}
});



//io.use( monitorio({ port: undefined }) );
io.use(function(socket, next) {

  let handshakeData = socket.request;
  ///cp.scd(handshakeData);

  // make sure the handshake data looks good as before
  // if error do this:
    // next(new Error('not authorized');
  // else just call next
  next();
});

app.locals.host = 1;
let numberOfGame = 0;
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
				if( err ) {
					var htmlString = '<b>error message: ' + err + '<br> error stack: ' + err.stack + '</b>';
					var textString = 'error message: ' + err + 'error stack: ' + err.stack ;
					( 'DB error', htmlString, textString );
				}
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
		var htmlString = '<b>error message: ' + err + '<br> error stack: ' + err.stack + '</b>';
		var textString = 'error message: ' + err + 'error stack: ' + err.stack ;
		sendEmail( 'DB error', htmlString, textString );
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

function sendEmail( sub, htmlString, textString){

	var sendTime, email_prev;
	if ( sub == 'client error' ) {
		sendTime = sendTimeClient;
		email_prev = email_prev_client;
	}
	if ( sub == 'server error' ) {
		sendTime = sendTimeServer;
		email_prev = email_prev_server;	
	}
	if ( sub == 'DB error' ) {
		sendTime = sendTimeDB;
		email_prev = email_prev_DB;	
	}

	let mailOptions = {
	    from: '<5122715109-1d5d4b@inbox.mailtrap.io>', // sender address
	    to: '5122715109-1d5d4b@inbox.mailtrap.io', // list of receivers
	    subject: sub, // Subject line
	    text: textString, // plain text body
	    html: htmlString // html body
	};
	var time_now = new Date();
	if ( (time_now - email_prev)/1000 < 1 ) {

		sendTime += 1000;

	}
	else {
		sendTime = 0;
	}
	email_prev = time_now; 
	setTimeout( function () {

		transporter.sendMail(mailOptions, (error, info) => {

			debugger;

		    if (error) {
		        return console.log(error);
		    }
		    console.log('Message %s sent: %s', info.messageId, info.response);
		});

	}, sendTime )
	if ( sub == 'client error' ) {
		sendTimeClient = sendTime;
		email_prev_client = email_prev;
	}
	if ( sub == 'server error' ) {
		sendTimeServer = sendTime;
		email_prev_server = email_prev;
	}
	if ( sub == 'DB error' ) {
		sendTimeDB = sendTime;
		email_prev_DB = email_prev;	}

}
 
// change to live
reload(server, app).reload();
 
server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port') + " Date: " + new Date())
});

