"use strict";

//multiplayer
var express = require('express')
var http = require('http')
var path = require('path')
var bodyParser = require('body-parser')
var mc = require('mongodb').MongoClient
var dateformat = require('dateformat')
const async = require('async')




var event = require('events');
var eventEmitter = new event.EventEmitter;

 
 // set up ws and monitor
var app = express();
var server = http.createServer(app);

var dburl1 = "mongodb://localhost:27017/test";
var dburl2 = "mongodb://nabooleo:ax31zcm@ds145848.mlab.com:45848/gamedata";



// mongo ds145848.mlab.com:45848/gamedata -u nabooleo -p ax31zcm


 
// var publicDir = path.join(__dirname, 'game')
 
app.set('port', process.env.PORT || 9000);

//app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //parses json, multi-part (file), url-encoded 

mc.connect(dburl1, function(err, db) {

	//debugger
	db.collection('levels').find().sort( { level: 1 }).toArray( function (err, result) {

		mc.connect(dburl2, function(err, db) {
	

			for (var i = 0; i < result.length; i++) {
				var planet2 = 0;
				if ( result[i].planet2 ) { var planet2 = result[i].planet2; }
				debugger
				db.collection('levels').update(
					{ level: result[i].level },
					{
						// just update certain fields next time **********************************
						level: result[i].level,
						planet1: result[i].planet1,
						planet2: planet2,
						drone: result[i].drone,
						dow: result[i].dow,
						ms1: result[i].ms1,
						ms2: result[i].ms2,
						pglowt: result[i].pglowt,
						numofast: result[i].numofast,
						pex_t: result[i].pex_t
					}
				)
			}
			db.close();
		});

	})
	db.close();
	console.log('db updated')
});
