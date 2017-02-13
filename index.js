
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
const async = require('async');

var event = require('events');
var eventEmitter = new event.EventEmitter;

var hc = require('./handleComments');

// pass comment to the client
var cp = new hc();


var watch = require('node-watch');
 
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

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
	        			laserfs: app.locals.shaders.laserfs
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
var gameDataSchema = new Schema  ({gameUUID: String, player1: String, player2: String });
var Multi = mongoose.model('Multi', gameDataSchema);

cp.scd(app.locals.gameData);
var numberOfGame = 0;

// io.on('connection', function (socket) {

// 	cp.scd(socket.id); 
// 	console.log(Multi);
// 	//cp.scd( socket.nsp );

// 	var gameUUID = uuid.v1();
// 	app.locals.gameData[numberOfGame] = new Multi( { gameUUID: gameUUID, player1: socket.id, player2: 'player2' } );
// 	numberOfGame += 1;
// 	host = true;

// 	// if(app.locals.ids.length > 2) {
// 	// 	console.log(' 3 hosts emitting send');
// 	// 	socket.broadcast.to(app.locals.ids[2]).emit('sendto3', 'hello 3');
// 	// }

   
//    socket.emit('gamestart', { id: gameUUID, host: host });

//    socket.emit('stc', {data: app.locals.gameData } );


//     socket.on('getgd', function(gameUUID){
//     	console.log('game uuid is '); 
//         console.log(gameUUID);
//         var gdarr = [];
//     });


//     socket.on('setgd', function (gd) {

//     });
//     socket.on('disconnect', function(data) {

//     });
// });

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

