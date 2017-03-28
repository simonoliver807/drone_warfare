
  // gamecore.server.js
  // by joates (Aug-2013)

  /**
   *  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström
   *  written by : http://underscorediscovery.com
   *  written for : http://buildnewgames.com/real-time-multiplayer/
   *
   *  MIT Licensed.
   */

  //  The main update loop runs on requestAnimationFrame,
  //  Which falls back to a setTimeout loop on the server
  //  Code below is from Three.js, and sourced from links below

  //  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  //  http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

  //  requestAnimationFrame polyfill by Erik Möller
  //  fixes from Paul Irish and Tino Zijdel

var gameinitserver = require('../multiserver/gameinitserver');

//change to live
var fs = require('fs');



  //var frame_time = 1 / 60  // run the local game at 16.6ms/ 60hz
  //if ('undefined' != typeof(global)) frame_time = 1 / 45  //on the server we run at 22ms, 45hz

  // (function() {

  //   var lastTime = 0
  //   // var vendors = [ 'ms', 'moz', 'webkit', 'o' ]

  //   // for (var x=0; x<vendors.length && ! window.requestAnimationFrame; ++x) {
  //   //   window.requestAnimationFrame = window[ vendors[x] + 'RequestAnimationFrame' ]
  //   //   window.cancelAnimationFrame = window[ vendors[x] + 'CancelAnimationFrame' ] || window[ vendors[x] + 'CancelRequestAnimationFrame' ]
  //   // }

  //   if (! window.requestAnimationFrame) {
  //     window.requestAnimationFrame = function ( callback ) {
  //       var currTime = Date.now(), timeToCall = Math.max(0, frame_time - (currTime - lastTime))

  //       var id = window.setTimeout(function() { callback(currTime + timeToCall) }, timeToCall)
  //       lastTime = currTime + timeToCall
  //       return id
  //     }
  //   }

  //   if (! window.cancelAnimationFrame) {
  //     window.cancelAnimationFrame = function (id) { clearTimeout(id) }
  //   }

  // }() )


  // load the shared player class
  //var game_player = require('./multiserver/oimo')


  //  The game_core class

  var game_core = function(game_instance, client, levels) {

    // this.x = 1;
    // this.y = 0;
    this.il = 0;

    this.gid = game_instance.id;
    this.gi = new gameinitserver;
    this.levels = levels;
    this.clients = {};
    this.clients['player1'] = client;
    console.log(game_instance);


    //Store a flag if we are the server
    this.server = game_instance !== undefined;
    this.roomid = game_instance.player1;

    // Full stack of the connected clients/players.
    this.player_manifest = {};
    this.player_client;

    // Set up some physics integration values
    this._pdt  = 0.0001;            //The physics update delta time
    this.pdtfps = [];
    this._pdte = new Date().getTime();   //The physics update last delta time
    // A local timer for precision on server and client
    this.local_time = 0.016;            //The local timer
    this._dt  = new Date().getTime();    //The local timer delta
    this._dte = new Date().getTime();    //The local timer last frame time

    this._sdt = new Date().getTime();
    this._sdte = new Date().getTime();

    this.server_time = 0;
    this.laststate = {};
    this.pldata = {};
    this.firststream = 2;
    this.tempexpart = [];
    this.idexcl = [];

    //this.pldata[ game_instance.player1 ] = new Float32Array( 8 );


    console.log( game_instance.player1 );
    console.log('player 1 on server_update');

    this.droneloop;
    this.dronearr = {};
    this.dronearr[ game_instance.player1 ] = [] ;


    // start up OIMO rendering at 1/60 fps
    this.bodys = this.create_physics_simulation();
    this.numofdrone = this.gi.getnumofdrone();
    this.player_manifest[ game_instance.player1 ] = this.bodys[0];
    this.player_manifest[ game_instance.player1 ].rot = [0,0,0,0];
    this.player_manifest[ game_instance.player1 ].phaser = 0;
    this.player_manifest[ game_instance.player1].numofdrone = 0;
    this.player_manifest[ game_instance.player1].ms1y =  { y: 0 };
    this.t = 0;
    this.id1 = game_instance.player1;
    this.id2 = 0;
    this.currpos = [];
   
    // Start a fast paced timer for measuring time easier
     this.create_timer()
  }



  game_core.prototype.create_physics_simulation = function() {

    this.gi.createWorld( this.levels );
    var player1 = this.gi.populate(this.levels);

    setInterval(function() {
      this.gi.render();
      this._pdt  = (new Date().getTime() - this._pdte) / 1000.0;
      this.pdtfps.push( this._pdt );
      this._pdte = new Date().getTime();
      this.update_physics();
    }.bind(this), 16)

    return player1;

  }

  game_core.prototype.update_physics = function() {

    var x = 1;

    for (var id in this.player_manifest) {

      if( this.player_manifest[id].inputs.length ) { 

        // if( this.player_manifest[id].inputs[10] < 0.000001 ){
        //   console.log(this.player_manifest[id].inputs);
        //    debugger; 
        // }

        this.player_manifest[id].body.position.set( this.player_manifest[id].inputs[0].pos[0], this.player_manifest[id].inputs[0].pos[1], this.player_manifest[id].inputs[0].pos[2] );
        this.player_manifest[id].body.linearVelocity.set( this.player_manifest[id].inputs[0].lv[0], this.player_manifest[id].inputs[0].lv[1], this.player_manifest[id].inputs[0].lv[2] );
        this.player_manifest[id].rot = this.player_manifest[id].inputs[0].rot;
        this.player_manifest[id].phaser = this.player_manifest[id].inputs[0].phaser;


        var pos = 0;
        var updatepos;
        // loop through the drones lowest id first both in bodys array and dronearr
        for( var i = 0; i < this.bodys.length; i++ ) {

          try {

            if ( this.dronearr[id][pos] ) {
              if ( this.bodys[i].name == 'drone' && this.bodys[i].id == this.dronearr[id][pos][6]){

                this.bodys[i].body.position.set( this.dronearr[id][pos][0], this.dronearr[id][pos][1], this.dronearr[id][pos][2]  );
                this.bodys[i].body.linearVelocity.set( this.dronearr[id][pos][3], this.dronearr[id][pos][4], this.dronearr[id][pos][5] )
                updatepos = 1;
                
              }
              var num = this.dronearr[id][pos][6] + ''; 
              if ( num.substr(-4, num.length) == '9999' ) {        
                this.idexcl.push( ~~num.substr(0 , num.length - 4) );
                this.tempexpart.push ( { id: id, body: { position: { x: this.dronearr[id][pos][0], y: this.dronearr[id][pos][1], z: this.dronearr[id][pos][2] }, id: this.dronearr[id][pos][6] } } )

                updatepos = 1;
                //reload last drone again if ex drone
                i-- 
              }
              if ( updatepos ) { pos ++ };
            }
            else {
              break;
            }

          }
          catch (err) {
            debugger
          }
        }
        // clear buffer
      this.player_manifest[id].inputs = []


      x++;

      }
    }
  }

  //

  game_core.prototype.server_update = function() {

    var t = new Date().getTime(); 
    this.dt = (t - this.lastframetime) / 1000.0 ;

    // Store the last frame time
    this.lastframetime = t

    // Update the game specifics
    //this.server_update()

    // Update the state of our local clock to match the timer
    this.server_time = this.local_time

    // prepare and send updates.
    var packet = this.server_prepare_update()

    // console.log(packet);
    // console.log('packet');

    this.server_transmit_update(packet)
  }
  //

  game_core.prototype.server_prepare_update = function() {

    var ld = 0;

    var packet = {};

    var ply1nod = 0;
    var ply2nod = 0;


    for ( var i = 0; i < this.bodys.length; i++ ) {

      if ( this.bodys[i].ld == 1 && this.idexcl.indexOf( this.bodys[i].id ) === -1  ) {

        ply1nod ++;

      }
      if ( this.bodys[i].ld == 2 && this.idexcl.indexOf( this.bodys[i].id ) === -1  ) {

        ply2nod ++;

      }  
    }

    for (var id in this.player_manifest) {
      var numofdrone = 0;

      for ( var i = 0; i < this.tempexpart.length; i++ ) {
        if ( this.tempexpart[i].id == id ) {
          numofdrone ++;
        }
      }

      if ( this.player_manifest[id].name == 'player1') {
        this.pldata[id] = new Float32Array(  10 + ( ( ply1nod + numofdrone) * 4 ) );
      }
      if ( this.player_manifest[id].name == 'player2') {
        this.pldata[id] = new Float32Array(  10 + ( ( ply2nod + numofdrone) * 4 ) );
      }


      try {

        this.pldata[id][0] = this.player_manifest[id].body.position.x;
        this.pldata[id][1] = this.player_manifest[id].body.position.y;
        this.pldata[id][2] = this.player_manifest[id].body.position.z;
        this.pldata[id][3] = this.player_manifest[id].rot[0];
        this.pldata[id][4] = this.player_manifest[id].rot[1];
        this.pldata[id][5] = this.player_manifest[id].rot[2];
        this.pldata[id][6] = this.player_manifest[id].rot[3];
        this.pldata[id][7] = this.player_manifest[id].phaser;
        this.pldata[id][8] = this.player_manifest[id].ms1y.y;
        this.pldata[id][9] = this.t;

      }
      catch (err) {
        console.log(err)
        debugger
      }

    }
    // if ( this.ms1y.y ) {
    // console.log(this.ms1y)
    // console.log('y: ' + this.pldata[id][8]);
    // console.log('t: ' + this.pldata[id][9]);
    // }

    // prepare drone drone data
    // offset currpos so the pos matches the player id
    this.currpos = [ 0, 10, 10 ];
    var id;
    var i = this.bodys.length;
    var pl;

    // use this loop for first stream so all drone positions can set at first
    // for (var i = this.bodys.length - 1; i >= (this.bodys.length - this.numofdrone); i--) {
    //     this.bodys[i].ld == 1 ? id = this.id1 : id = this.id2;
    //     pl = this.bodys[i].ld;
    //     if ( id && this.idexcl.indexOf( this.bodys[i].id ) === -1 ) {
    //       this.pldata[id][this.currpos[pl]]    = this.bodys[i].body.position.x;
    //       this.pldata[id][this.currpos[pl]+1]  = this.bodys[i].body.position.y;
    //       this.pldata[id][this.currpos[pl]+2]  = this.bodys[i].body.position.z;
    //       // this.pldata[id][this.currpos[pl]+3]  = this.bodys[i].body.linearVelocity.x;
    //       // this.pldata[id][this.currpos[pl]+4]  = this.bodys[i].body.linearVelocity.y;
    //       // this.pldata[id][this.currpos[pl]+5]  = this.bodys[i].body.linearVelocity.z;
    //       this.pldata[id][this.currpos[pl]+3]  = this.bodys[i].id; 
    //       this.currpos[ pl ] += 4;      
    //     }
    //     id = 0;
    // }


    // seperate first stream in seperate function

    // then use
    for ( var i = 0; i < this.bodys.length; i++){

      if ( this.bodys[i].ld == 1) {

      }
      if ( this.bodys[i]. =)
      pl = this.bodys[i].ld;


    }

   debugger
    for ( var i = 0; i < this.tempexpart.length; i++ ) {

        var id = this.tempexpart[i].id;
        this.player_manifest[id].name == 'player1' ? pl = 1 : pl = 2; 
        this.pldata[id][this.currpos[pl]]    = this.tempexpart[i].body.position.x;
        this.pldata[id][this.currpos[pl]+1]  = this.tempexpart[i].body.position.y;
        this.pldata[id][this.currpos[pl]+2]  = this.tempexpart[i].body.position.z;
        this.pldata[id][this.currpos[pl]+3]  = this.tempexpart[i].body.id; 
        this.currpos[ pl ] += 4;   

    }

    // change to live
    if ( this.tempexpart.length ) {
      this.tempexpart = [];
      this.idexcl = [];
    }


      packet[this.id1] = {
        pldata: this.pldata[ this.id1 ].buffer,
        playerid: this.id1,
      }
      if ( this.id2 ) {




        packet[this.id2] = {
          pldata: this.pldata[ this.id2 ].buffer,
          playerid: this.id2,
        }
      }
    return packet
  }

  //

  game_core.prototype.server_transmit_update = function(packet) {

    var x = 0;
    var i = this.pdtfps.length;
    var fps = 0;
    while(i--) {
      fps += this.pdtfps[i];
    }
    fps = fps/this.pdtfps.length;

    if ( this.firststream ) {
      for (var id in this.player_manifest) {

        if( this.clients.player2 ) {
          if( id == this.clients.player1.id ){
            this.clients['player2'].emit('setdrone', packet);
          }
          if( id == this.clients.player2.id ){
            this.clients['player1'].emit('setdrone', packet ); 
          }
        }
      }

    }
    if ( !this.firststream ) {

      for (var id in this.player_manifest) {
        this.last_state = {
          gid: this.gid,
          vals: packet[id],
          t:    this.server_time,
          fps: fps
        }

       // console.log(packet);

       //change to live
       if ( x == 1) { 
       // debugger
       }
       x ++;

        if( this.clients.player2 ) {
          if( id == this.clients.player1.id ){
            this.clients['player2'].emit('onserverupdate', this.last_state );
          }
          if( id == this.clients.player2.id ){
            this.clients['player1'].emit('onserverupdate', this.last_state ); 
          }
        }
      }
    }
     this.pdtfps = [];

  }

  game_core.prototype.create_timer = function() {
    setInterval(function() {
      this._dt  = new Date().getTime() - this._dte
      this._dte = new Date().getTime()
      this.local_time += this._dt / 1000.0
    }.bind(this), 4)
  }


  game_core.prototype.player_connect = function( game, client ) {

      var newplayer = this.gi.addpl()

      this.clients['player2'] = client;
      this.dronearr[game.player2] = [] ;
      // add new player to storage.
      this.player_manifest[ game.player2 ] = newplayer;
      this.player_manifest[ game.player2 ].rot = [0,0,0,0];
      this.player_manifest[ game.player2 ].phaser = 0;
      this.player_manifest[ game.player2 ].numofdrone = 0;
      this.player_manifest[ game.player2 ].ms1y =  { y: 0, t: 0 };
      this.id2 = game.player2;

      // start the server creating and sending packets to both the clients
      setInterval( function() {
        this._sdt = (new Date().getTime() - this._sdte) / 1000.0;
        this._sdte = new Date().getTime(); 
        this.server_update();
      }.bind(this), 22)

      // this.pldata[game.player2] = new Float32Array( 8 );
  }


  game_core.prototype.player_disconnect = function( uuid ) {
    // someone quit the game, delete them from our list !
    delete this.player_manifest[uuid];
  }

  game_core.prototype.handle_server_input = function( input, ms1y, drone, input_time, pl_uuid ) { 

    try {
      this.il = input.length;
      this.dronearr[pl_uuid] = [];
      while( this.il-- ) {
        input[ this.il ] = parseFloat( input[ this.il ] );
      }
      // Store the input on the player instance for processing in the physics loop
      this.player_manifest[ pl_uuid ].inputs.push({ pos: [input[0],input[1],input[2]], lv: [input[3],input[4],input[5]], rot: [input[6],input[7],input[8],input[9]], phaser: input[10], time: input_time });
      this.player_manifest[ pl_uuid ].ms1y.y = ms1y;
      if( ms1y ) {
        this.t ++;
      }
      this.droneloop = drone.length / 7;
      this.dlcurrps = 0;
      while( this.droneloop-- ) {
        this.dronearr[pl_uuid].push ( [ drone[this.dlcurrps], drone[ this.dlcurrps+1 ], drone[ this.dlcurrps+2 ], drone[ this.dlcurrps+3 ], drone[ this.dlcurrps+4 ], drone[ this.dlcurrps+5 ], drone[ this.dlcurrps+6 ] ]);
        this.dlcurrps += 7;
      }
    }
    catch (err) {
      console.log(err);
    }
  }



module.exports = game_core









