
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
    const uuid = require('node-uuid')

    // Since we are sharing code with the browser, we
    // are going to include some values to handle that.
     global.window = global.document = global

    // Import shared game library code.
    var game_core = require('./gamecore.server.js')

  //


  //
  function game_server ( levels ) {
      this.fake_latency = 0;
      this.local_time = 0;
      this._dt  = new Date().getTime();
      this._dte = new Date().getTime();
      this.levels = levels;
      this.game_count = 0;
      this.games = {};

      // a local queue of messages we delay if faking latency
      this.messages = [];

      setInterval(function() {
        this._dt  = new Date().getTime() - this._dte
        this._dte = new Date().getTime()
        this.local_time += game_server._dt / 1000.0
      }, 4)

    }

  //

     // game_server.setgd = function(client, message) {

        // if (this.fake_latency && message.split('.')[0].substr(0, 1) == 'i') {

        //   // store all input message
        //   game_server.messages.push({ client: client, message: message })

        //   // setTimeout(function() {
        //   //   if (game_server.messages.length) {
        //   //     game_server._onMessage(game_server.messages[0].client, game_server.messages[0].message)
        //   //     game_server.messages.splice(0, 1)
        //   //   }
        //   // }.bind(this), this.fake_latency)

        // } else {
        //   game_server._onMessage(client, message)
        // }
    //  }

  //
    
      game_server.prototype.setgd = function( data ) {

        var b = data[0];

        var ab = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength );
        var pldata = new Float32Array( ab );
        
        var input_commands = [];
        var droneData = [];
        for (var i = 0; i < pldata.length; i++) {
            if( i < 11 ){
              input_commands.push(  pldata[i] );
            }
            if ( i == 11 ) { 
              var input_time = pldata[i];
            }
            if ( i > 11) {
              droneData.push ( pldata[i] );
            }
        }
        var pl_uuid = data[1];
        var gid = data[2];
        try {
          this.games[ gid ].handle_server_input( input_commands, droneData, input_time, pl_uuid );
        }
        catch (err) {
          debugger
        }
          // if ( data_type == 'l' ) {
          //   // A client is asking for lag simulation
          //   this.fake_latency = parseFloat(message_parts[1])
          // }
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

  //

      game_server.prototype.join_game = function( game, client ) {

        //console.log(client);

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
           // this.games[ game.id ].server_update(new Date().getTime());
        }
      }


      game_server.prototype.dataload1 = function( data ) {

        if ( this.games[data.gid].firststream > 0 ) {
          this.games[data.gid].firststream -=1;
        }

      } 








