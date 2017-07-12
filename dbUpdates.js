'use strict'

const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const assert = require('assert');


let dburl = "mongodb://nabooleo:ax31zcm@ds145848.mlab.com:45848/gamedata";
//let dburl = "mongodb://localhost:27017/test";

var mongodb;

async.series(
    [
        // Establish Covalent Analytics MongoDB connection
        (callback) => {
            MongoClient.connect( dburl, (err, db) => {
                assert.equal( err, null );
                mongodb = db;
                callback( null );
            });
        },
        // Insert some documents
        (callback) => {
         
		   mongodb.collection('multis').find({}).limit(10).sort( {created_at:1} ).toArray( function ( err, docs ) {

		   		if ( err ) throw err;

		   		else {
		   			var idarr = [];
		   			for ( var i = 0; i < docs.length; i++) {
		   				idarr.push( docs[i]._id );
		   			}
			   		mongodb.collection('multis').remove( { _id: { $in: idarr } } );
			   	}
			   	assert.equal( err, null );
		   		callback( null );
		   	});
        }
    ]
    ,
    () => {
        mongodb.close();
    }
);