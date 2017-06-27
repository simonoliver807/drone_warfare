
//  game_server.prototype.js
//  by joates (Aug-2013)

/**
*  Copyright (c) 2013 Asad Memon
*  Forked and updated.
*
*  MIT Licensed.
*/

/**
*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström
*  written by : http://underscorediscovery.com
*  written for: http://buildnewgames.com/real-time-multiplayer/
*
*  MIT Licensed.
*/

//var game_server = module.exports = { games: {}, game_count: 0 }
module.exports = exports = game_server;
const uuid = require('node-uuid');

// Import shared game library code.
var game_core = require('./gamecore.server.js')



function game_server ( levels ) {
    this.fake_latency = 0;
    this.local_time = 0;
    this._dt  = new Date().getTime();
    this._dte = new Date().getTime();
    this.levels = levels;
    this.game_count = 0;
    this.games = {};
    this.b = 0;
    this.ms1y = 0;
    this.ms2y = 0;   
    this.ab = 0;
    this.pldata = 0;
    this.input_commands = 0;
    this.droneData = 0;
    this.input_time = 0;
    this.gid = 0;
    this.pl_uuid = 0;
    // a local queue of messages we delay if faking latency
    this.messages = [];

    this.droneCount = 0;
    this.tmpDronearr = [];
    this.droneExplnum = 0;

    setInterval(function() {
      this._dt  = new Date().getTime() - this._dte
      this._dte = new Date().getTime()
      this.local_time += game_server._dt / 1000.0
    }, 4)

  }

  game_server.prototype.setgd = function( data ) {


    this.b = data[0];
    this.ms1y = 0;
    this.ms2y = 0;

    this.ab = this.b.buffer.slice( this.b.byteOffset, this.b.byteOffset + this.b.byteLength );
    this.pldata = new Float32Array( this.ab );
    
    this.input_commands = [];
    this.droneData = [];
    this.droneCount = 0;
    this.tmpDronearr = [];

    this.pl_uuid = data[1];
    this.gid = data[2];


    for (var i = 0; i < this.pldata.length; i++) {
        if( i < 11 ){
          this.input_commands.push(  this.pldata[i] );
        }
        if ( i == 11 ) { 
          this.input_time = this.pldata[i];
        }
        if( i == 12 ) {
          this.ms1y = this.pldata[i];
        }
         if( i == 13 ) {
          this.ms2y = this.pldata[i];
        }
        if ( i > 13) {

          if ( this.droneCount <= 7 ) {
            this.tmpDronearr.push( this.pldata[i] );  
            this.droneCount ++;
          }
          //this.droneData.push ( this.pldata[i] );
        }
        if ( this.droneCount === 8 ){

          this.droneExplnum = this.tmpDronearr[6] + '';
          if ( this.droneExplnum.match('9999') ) {

            debugger

            this.tmpDronearr = [ this.tmpDronearr[0], this.tmpDronearr[1], this.tmpDronearr[2], this.tmpDronearr[6], this.tmpDronearr[7] ]
            this.games[ this.gid ].explarr[ this.pl_uuid ] = this.games[ this.gid ].explarr[ this.pl_uuid ].concat( this.tmpDronearr );
          }
          else {
            this.droneData = this.droneData.concat( this.tmpDronearr );
          }
          this.droneCount = 0;
          this.tmpDronearr = [];
        }
    }

    // for ( var i = 0; i < this.droneData.length; i++ ) {

    //   var num = this.droneData[i] + '';
    //   if ( num.match('9999') && num.length <= 8 ) {
    //     console.log( 'drone ex ' +  this.droneData[i] );
    //   }

    // }

    try {
      this.games[ this.gid ].handle_server_input( this.input_commands, this.ms1y, this.ms2y, this.droneData, this.input_time, this.pl_uuid );
    }
    catch (err) {
      debugger
      console.log( err );
    }
  }

  // A simple wrapper for logging so we can toggle it,
  // and augment it for clarity.
  game_server.prototype.log = function() {
    var d = new Date()
      , dTime    = d.toTimeString().substr(0, 8)
      , dparts   = d.toDateString().split(' ')
      , ts = '  ' + dTime + ' ' +
             Array(dparts[2], dparts[1], dparts[3]).join('-')
    console.log.apply(this, new Array(arguments[0] + ts))
  }

  game_server.prototype.leave_game = function(game_uuid, client_uuid) {

    var thegame = this.games[game_uuid]

    if (thegame) {

      if (thegame.player_count > 1) {
        // not the last player, remove one & let the game continue.
        thegame.player_count--
        thegame.gamecore.player_disconnect(client_uuid)
        return
      }

      // no players, stop the game updates
      thegame.gamecore.stop_update()

      // remove the game.
      delete this.games[game_uuid]
      this.game_count--

      this.log('   Game ended: ' + color.red + game_uuid + color.reset + '   ' )

    } else {
        this.log(color.red + '!! ## Error: Game was not found ## !!' + color.reset + '  ' + game_uuid)
    }
  }

  game_server.prototype.join_game = function( game, client ) {

    if ( game.player2 != 'player2' ) {        
      this.games[ game.id ].player_connect(game, client)
    } 
    else {
        // create game
        this.log('   Game start: '+ game.id);
        this.game_count++
        var gamecore = new game_core(game, client, this.levels);
        this.games[ game.id ] = gamecore;
        this.games[ game.id ].server = client;
    }
  }


  game_server.prototype.dataload1 = function( data ) {

    if ( this.games[data.gid].firststream > 0 ) {
      this.games[data.gid].firststream --;
      //this.games[data.gid].levelloaded = 0;
    }

  } 

 game_server.prototype.levelgen = function( data ) {

  //console.log( this.games[data.gid].lastlevelchange + ' lastlevelchange' )
  if( typeof this.games[data.gid].lastlevelchange != 'undefined' ) {
    if ( this.games[data.gid].lastlevelchange === 0 || ( this.games[data.gid].local_time - this.games[data.gid].lastlevelchange ) > 5 ) {
      this.games[data.gid].lastlevelchange = this.games[data.gid].local_time;
      if ( !this.games[data.gid].firststream ) {

        this.games[data.gid].firststream = 2;
        if ( data.x982y == 1 ) {
          this.games[data.gid].levelloaded = 0;
          this.games[data.gid].respawn( data );
        }
        if ( data.x982y != 1 ) {
          this.games[data.gid].levelloaded = 2;
        }

      }
    }
  }
  else {
    //console.log('lastlevelchange ' + this.games[data.gid].lastlevelchange)
  }
 }






