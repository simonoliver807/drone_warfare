
  // gamecore.js
  // by joates (Sep-2013)

  /**
   *  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström
   *  written by:  http://underscorediscovery.com
   *  written for: http://buildnewgames.com/real-time-multiplayer/
   *
   *  MIT Licensed.
   */

  // var EventEmitter = require('events').EventEmitter
  //   , Controller = require('n3d-controller')
  //   , domready = require('domready')
  //   , util   = require('util')
  //   , io     = require('socket.io-browserify')
  //   , Player = require('../shared/Player.js')
  //   , golden_ratio = 1.6180339887
define(['socket_io','OIMO'], function(SOCKET_IO,OIMO) {

"use strict";


   var Player = function() {

    // Store the instance, if any
   // this.instance = player_instance
    //this.game = game_instance
    this.index = Math.random() < 0.5 ? 0 : 1;

    // Set up initial values for our state information
    this.pos = new OIMO.Vec3();
    this.ghostpos = new OIMO.Vec3();
    this.destpos  = new OIMO.Vec3();
    this.state = 'new player'
    // this.color = 'rgba(240,240,240,1.0)'
    // this.color_2d = 'rgba(240,240,240,1.0)'
    // this.info_color = 'rgba(220,240,220,0.8)'

    // These are used in moving us around later
    this.old_state = new OIMO.Vec3();
    this.cur_state = new OIMO.Vec3(); // spawn here!
    this.state_time = new Date().getTime()

    // Our local history of inputs
    this.inputs = []
  }
    

  function game_core() { 

            // ********** mulit   change to live
        this.socket = SOCKET_IO.connect(url);
        this.startgame = 2;
        this.player_self = new Player();    
        this.player_set  = {};
        this.playercount = 0;
        this.server_updates = [];
        // A local timer for precision on server and client
        this.local_time = 0.016;               //The local timer
        this.host = 0;
        this.gameid;

        this.tvec3 = new OIMO.Vec3();
        this.pvec3 = new OIMO.Vec3();
        this.tquat = new OIMO.Quaternion();
        this.pquat = new OIMO.Quaternion();

        this.bodys;

        this.firstStream = 1;

        // const
        this.ply1;
        this.ply2;
        this.ply2mesh;
        this.client_smooth = 8;     // amount of smoothing to apply to client update dest    



    }

    game_core.prototype.v_lerp = function(v, tv, t) {
      return { x:this.lerp(v.x, tv.x, t), y:this.lerp(v.y, tv.y, t), z:this.lerp(v.z, tv.z, t) } 
    }
    game_core.prototype.lerp = function(p, n, t) { 
      var _t = Number(t); 
      _t = (Math.max(0, Math.min(1, _t))); 
      return (p * (1 - _t) + n * _t);
    }

    // game_core.prototype.lerpVectors = function ( v1, v2, alpha ) {

    //   var retv = new OIMO.Vec3();
    //   return retv.sub( v1, v2).multiplyScalar( alpha ).addEqual( v1 ); 

    // },

    game_core.prototype.setply1ply2 = function( ply1, ply2, ply2mesh, bodys ) {

      this.ply1 = ply1;
      this.ply2 = ply2;
      this.ply2mesh = ply2mesh;
      this.player_self.pos.set( this.ply1.body.position.x, this.ply1.body.position.y, ply1.body.position.z  )
      this.add_player ( this.player_self.id, [ this.ply1.body.position.x, this.ply1.body.position.y, ply1.body.position.z ], 10 ) 
      this.bodys = bodys;
    }
    game_core.prototype.getdata = function() {

      var data = { ply1id: this.player_self.id, time: this.client_time };

      return data;

    }

    game_core.prototype.start = function( ) {
      var self  = this

      this.client_create_configuration();
      this.client_connect_to_server();
      this.create_timer()
     // this.client_create_ping_timer()

      // var data = { vals: 
      //                  { OVY4m6qvh1cTm0CFAAAA: 
      //                     { pos: new OIMO.Vec3(),
      //                       playerid: 'OVY4m6qvh1cTm0CFAAAA',
      //                       idx: 0,
      //                       isq: 0 } },
      //                     t: 14.336,
      //                     uuid: 'OVY4m6qvh1cTm0CFAAAA'
      //                   }
      // this.client_onserverupdate_received(data);
      // this.player_self = data.vals.uuid;
      //  var data = { vals: 
      //                  { OVY4m6qvh1cTm0CFAAAb: 
      //                     { pos: new OIMO.Vec3(100,0,100),
      //                       playerid: 'OVY4m6qvh1cTm0CFAAAb',
      //                       idx: 0,
      //                       isq: 0 } },
      //                     t: 14.336,
      //                     uuid: 'OVY4m6qvh1cTm0CFAAAb' }
      //this.client_onserverupdate_received(data);



      //this.client_create_configuration()

      //Connect to the socket.io server!
       //this.client_create_ping_timer()

      setTimeout(function() {

          // Make this only if requested
          if (String(window.location).indexOf('debug') != -1) {
            self.client_create_debug_gui()
          }
          // Now actually start the game loop running.
          //self.update(new Date().getTime())

        }, 0);

    }

    game_core.prototype.client_create_configuration = function() {

        this.heading = 0

        // this.show_server_pos = false    // Whether or not to show the server position
        // this.show_dest_pos = false      // Whether or not to show the interpolation goal
        // this.client_predict = true      // Whether or not the client is predicting input
        //this.input_seq = 0              // When predicting client inputs, we store the last input as a sequence number
       // this.client_smoothing =     // Whether or not the client side prediction tries to smooth things out
        //this.client_smooth = 8          // amount of smoothing to apply to client update dest

        this.net_latency = 0.001        // the latency between the client and the server (ping/2)
        this.net_ping = 0.001           // The round trip time from here to the server,and back
        this.last_ping_time = 0.001     // The time we last sent a ping
        this.fake_lag = 0               // If we are simulating lag, this applies only to the input client (not others)
        this.fake_lag_time = 0

        this.net_offset = 100           // 100 ms latency between server and client interpolation for other clients
        this.buffer_size = 2            // The size of the server history to keep for rewinding/interpolating.
        this.target_time = 0.01         // the time where we want to be in the server timeline
        this.oldest_tick = 0.01         // the last time tick we have available in the buffer

        this.client_time = 0.01         // Our local 'clock' based on server time - client interpolation(net_offset).
        this.server_time = 0.01         // The time the server reported it was at, last we heard from it

        this.dt = 0.001;                 // The time that the last frame took to run
        this.dte = 0;
        this.pdt = 0.16;
        this.fps = 0;                    // The current instantaneous fps (1/this.dt)
        this.fps_avg_count = 0;          // The number of samples we have taken for fps_avg
        this.fps_avg = 0;                // The current average fps displayed in the debug UI
        this.fps_avg_acc = 0;            // The accumulation of the last avgcount fps samples
        this.serverfps = 0;
        this.fpsamplerate = 0;

        this.lit = 0;
        this.llt = new Date().getTime();

        this.pldata;
        this.currpos; 
        this.numofdrones;
        this.dronebodys;
        this.pl2dronesarr = [];
        this.expartarr = [];
    }

    game_core.prototype.client_connect_to_server = function() {


      // Sent when we are disconnected (network, server down, etc)
      this.socket.on('disconnect', this.client_ondisconnect.bind(this));
      // Sent each tick of the server simulation. This is our authoritive update
      this.socket.on('onserverupdate', this.client_onserverupdate_received.bind(this));
      // handle initial drone pos and id
      this.socket.on('setdrone', this.setdrone.bind(this));
      // Handle when we connect to the server, showing state and storing id's.
      this.socket.on('gamestart', this.ongamestart.bind(this));
      // On message from the server, we parse the commands and send it to the handlers
      this.socket.on('setlatency', this.client_onnetmessage.bind(this));
    }

    game_core.prototype.client_ondisconnect = function(data) {
      // Perform any cleanup required when we disconnect.
    }

    game_core.prototype.ongamestart = function(data) {
      // The server responded with our unique identity.
        this.player_self.id = data.playerid;
        this.gameid = data.id;
        //   socket.emit('getgd', gameUUID);
        if(data.host){
          this.host = 1;
        }
        console.log(data);

    }
    game_core.prototype.setdrone = function(data) {
      
      if ( this.bodys && this.firstStream ){
          var pl = 0;
          var ddata = [];
          for ( var id in data ) {
            ddata[pl] = new Float32Array( data[id].pldata );
            pl ++;
          }
          pl = 0;
          var pl1data = ddata[pl].length-1;
          var pl2data = ddata[pl].length-1;
          for (var i = this.bodys.length - 1; i >= 0; i--) {
            if( this.bodys[i].name == 'drone' ) {
              if(!pl){
                this.bodys[i].id = ddata[pl][pl1data];
                this.bodys[i].ld = pl + 1; 
                this.bodys[i].body.position.set( ddata[pl][pl1data-3], ddata[pl][pl1data-2], ddata[pl][pl1data-1]  );
                pl1data -= 4;
              }
              if(pl){
                this.bodys[i].id = ddata[pl][pl2data];
                this.bodys[i].ld = pl + 1; 
                this.bodys[i].body.position.set( ddata[pl][pl2data-3], ddata[pl][pl2data-2], ddata[pl][pl2data-1]  );
                pl2data -= 4;
              }
              pl ? pl = 0 : pl = 1;
            }
          }
        this.socket.emit( 'dataload1', { id: this.player_self.id, gid: this.gameid });
        this.firstStream = 0;
        this.startgame = 1 ;
      }



    }
    game_core.prototype.client_onserverupdate_received = function(data) {

        data.vals.pldata = new Float32Array( data.vals.pldata );

        this.server_time = data.t;
        if( this.fpsamplerate == 10 ) {
          this.serverfps = Math.floor(1 / data.fps); 
          this.fpsamplerate = 0;
        } 
        else { this.fpsamplerate ++; }
        this.client_time = this.server_time - (this.net_offset / 1000);


        // player must exist before it can be updated.
        if (this.player_set[ data.vals.playerid ] === undefined) {

          this.add_player( data.vals.playerid, [ data.vals.pldata[0], data.vals.pldata[1], data.vals.pldata[2] ], 20 );

        }
        this.server_updates.push(data)

        if (this.server_updates.length >= (60 * this.buffer_size)) {
          this.server_updates.splice(0, 1);
        }

        this.oldest_tick = this.server_updates[0].t;

       
        // check this
       // this.client_process_net_prediction_correction()
      
    }

    game_core.prototype.client_create_ping_timer = function() {
      // Set a ping timer to 1 second, to maintain the ping/latency between
      // client and server and calculated roughly how our connection is doing

      setInterval(function() {
       this.last_ping_time = new Date().getTime() - this.fake_lag
       // this.socket.send('p.' + (this.last_ping_time))
       this.socket.emit( 'sendlatency', { latency: this.last_ping_time })
      }.bind(this), 1000)
    }

    game_core.prototype.create_timer = function() {
      setInterval(function() {
        this.dt  = new Date().getTime() - this.dte;
        this.dte = new Date().getTime();
        this.local_time += this.dt / 1000.0;
      }.bind(this), 4)
    }


    game_core.prototype.client_create_debug_gui = function() {
      this.gui = new dat.GUI({ width: 200 })

      var _playersettings = this.gui.addFolder('Your settings')
     


      _playersettings.add(this, 'heading').listen()
      _playersettings.open()

      // var _othersettings = this.gui.addFolder('Methods')

      // _othersettings.add(this, 'naive_approach').listen()
      // _othersettings.add(this, 'client_smooth').listen()
      // _othersettings.add(this, 'client_predict').listen()

      var _debugsettings = this.gui.addFolder('Debug view')
          
      _debugsettings.add(this, 'fps_avg').listen()
    //  _debugsettings.add(this, 'show_server_pos').listen()
    //  _debugsettings.add(this, 'show_dest_pos').listen()
      _debugsettings.add(this, 'local_time').listen()

      _debugsettings.open()

      var _consettings = this.gui.addFolder('Connection')
      _consettings.add(this, 'net_latency').step(0.001).listen()
      _consettings.add(this, 'net_ping').step(0.001).listen()

      // When adding fake lag, we need to tell the server about it.
      var lag_control = _consettings.add(this, 'fake_lag').min(0.0).step(0.001).listen()
      lag_control.onChange(function(value) {
        this.socket.send('l.' + value)
      }.bind(this))

      _consettings.open()

      var _netsettings = this.gui.addFolder('Networking')
          
      _netsettings.add(this, 'net_offset').min(0.01).step(0.001).listen()
      _netsettings.add(this, 'server_time').step(0.001).listen()
      _netsettings.add(this, 'client_time').step(0.001).listen();
      _netsettings.add(this, 'serverfps').step(0.001).listen()

      _netsettings.open()
    }




    game_core.prototype.update = function( pos, lv, rot, phaser, dronebodys, pl2dronesarr ) {


      this.pl2dronesarr = pl2dronesarr;
      // delta time
      var t = new Date().getTime();
      //this.dt = this.lastframetime ? ((t - this.lastframetime) / 1000.0).fixed() : 0.016;
      this.pdt = this.lastframetime ? ((t - this.lastframetime) / 1000.0) : 0.016;

      this.lastframetime = t;

       // Set actual player positions from the server update.
      
      this.client_process_net_updates()


      this.client_handle_input( pos, lv, rot, phaser, dronebodys );
  
      // Set actual player positions from the server update.
     
      // check this
      //this.client_update_local_position();
      this.client_refresh_fps();



      // this.client_update()
      //this.emit('update')


      //this.updateid = requestAnimationFrame(this.update.bind(this), this.viewport)
    }




    game_core.prototype.client_process_net_updates = function() {
      // No updates...
      if (! this.server_updates.length) return

      // First:
      // Find the position in the updates, on the timeline
      // We call this current_time, then we find the past_pos
      // and the target_pos using this, searching throught the
      // server_updates array for current_time in between 2 other times.
      // Then:
      // other player position = lerp(past_pos, target_pos, current_time)

      // Find the position in the timeline of updates we stored.
      var current_time = this.client_time
        , count = this.server_updates.length - 1
        , target = null
        , previous = null

      // We look from the 'oldest' updates, since the newest ones are at the
      // end (list.length-1 for example). This will be expensive only when
      // our time is not found on the timeline, since it will run all samples.
      // Usually this iterates very little before breaking out with a target.
      for (var i=0; i<count; i++) {

        var point = this.server_updates[i]
        var next_point = this.server_updates[i + 1]

        // Compare our point in time with the server times we have
        if (current_time > point.t && current_time < next_point.t) {
          target = next_point
          previous = point
          break
        }
      }

      // With no target we store the last known
      // server position and move to that instead
      if (! target) {
        target = this.server_updates[0]
        previous = this.server_updates[0]
      }

      // Now that we have a target and a previous destination,
      // We can interpolate between them based on 'how far in between' we are.
      // This is simple percentage maths, value/target = [0,1] range of numbers.
      // lerp requires the 0,1 value to lerp to? thats the one.

      if (target && previous) {

        this.target_time = target.t

        var difference = this.target_time - current_time;
        var max_difference = (target.t - previous.t);
        var time_point = (difference / max_difference);

        // Because we use the same target and previous in extreme cases
        // It is possible to get incorrect values due to division by 0 difference
        // and such. This is a safe guard and should probably not be here. lol.
        if (isNaN(time_point)) time_point = 0
        if (time_point == -Infinity) time_point = 0
        if (time_point == Infinity) time_point = 0


        // go update the drones
        this.updatedrones( target, previous, time_point );


        if ( target.vals.playerid != this.player_self.id) {
          var id = target.vals.playerid;


          // The other players positions in this timeline, behind us and in front of us
          var other_target_pos = (target.vals) ? this.tvec3.set(target.vals.pldata[0], target.vals.pldata[1], target.vals.pldata[2]) : new OIMO.Vec3();
          var other_past_pos = (previous.vals) ? this.pvec3.set(previous.vals.pldata[0], previous.vals.pldata[1],previous.vals.pldata[2] ) : other_target_pos;  //set to target if this guy is new

          this.ply2mesh.userData.tquat.set( target.vals.pldata[3], target.vals.pldata[4], target.vals.pldata[5], target.vals.pldata[6] );
          this.ply2mesh.userData.pquat.set( previous.vals.pldata[3], previous.vals.pldata[4], previous.vals.pldata[5], previous.vals.pldata[6] );  //set to target if this guy is new
          if( target.vals.pldata[7] ){ this.ply2mesh.children[5].material.visible = true; }
          else { this.ply2mesh.children[5].material.visible = false; }

          //this.ply2mesh.userData.multiq.slerp( this.tquat, time_point );
          //this.ply2mesh.quaternion.slerp( this.tquat, time_point );

          if (this.player_set[id]) {
            // update the dest block, this is a simple lerp
            // to the target from the previous point in the server_updates buffer
            this.player_set[id].destpos  = this.v_lerp(other_past_pos, other_target_pos, time_point);
            // do the same for the quaternion
            this.ply2mesh.userData.tquat.slerp( this.ply2mesh.userData.pquat, time_point);
            this.ply2mesh.quaternion.set( this.ply2mesh.userData.tquat.x, this.ply2mesh.userData.tquat.y, this.ply2mesh.userData.tquat.z, this.ply2mesh.userData.tquat.w );

            
            //apply smoothing from current pos to the new destination pos
            if (this.client_smooth) {
              //this.player_set[id].pos = this.lerpVectors(this.player_set[id].pos, this.player_set[id].destpos, this.pdt * this.client_smooth);
              this.player_set[id].pos = this.v_lerp(this.player_set[id].pos, this.player_set[id].destpos,  this.pdt * this.client_smooth );
              var subvec = new OIMO.Vec3();
              subvec.sub( this.ply2.body.position , this.player_set[id].pos );
              if ( (subvec.x > 0.01 || subvec.x < -0.01) || ( subvec.y >  0.01 || subvec.y < -0.01 ) || ( subvec.z >  0.01 || subvec.z < -0.01) ) {
                this.ply2.body.position.set( this.player_set[id].pos.x, this.player_set[id].pos.y, this.player_set[id].pos.z );
                this.ply2.body.sleepPosition.set( this.player_set[id].pos.x, this.player_set[id].pos.y, this.player_set[id].pos.z );
                this.ply2mesh.position.set( this.player_set[id].pos.x * 100, this.player_set[id].pos.y * 100, this.player_set[id].pos.z * 100 ); 
              }
              else { this.player_set[id].pos.x = this.ply2.body.position.x;
                     this.player_set[id].pos.y = this.ply2.body.position.y;
                     this.player_set[id].pos.z = this.ply2.body.position.z; 
                   }
            }
            else {
              this.ply2.body.position.set( this.player_set[id].destpos.x, this.player_set[id].destpos.y, this.player_set[id].destpos.z );
            }
          }
        }
      }
    }
    
    game_core.prototype.updatedrones = function( target, previous, time_point  ) {

      // if ( this.firstStream) {
      //   for (var i = this.bodys.length -1; i >= 0; i--) {
      //     if( this.bodys[i].name == 'drone') {
      //       this.bodys[i].id = i + 1;
      //     }
      //   }
      //   this.firstStream = 0;
      // }

      var tpos = target.vals.pldata.length -1;
      var i = this.pl2dronesarr.length;
      while( i-- ){
          if ( this.pl2dronesarr[i].id === target.vals.pldata[tpos] ) {
            if ( !this.pl2dronesarr[i].body.sleeping) {
              this.pl2dronesarr[i].body.sleep();
            }
            this.pl2dronesarr[i].body.sleepPosition.set( target.vals.pldata[tpos-3], target.vals.pldata[tpos-2], target.vals.pldata[tpos-1] );
            this.pl2dronesarr[i].body.position.set( target.vals.pldata[tpos-3], target.vals.pldata[tpos-2], target.vals.pldata[tpos-1] );
            tpos -= 4;
          }
          if ( target.vals.pldata[tpos] == 9999 ) {
            this.expartarr.push( {x: target.vals.pldata[tpos-3] * 100, y: target.vals.pldata[tpos-2] * 100, z: target.vals.pldata[tpos-1] * 100 })
            tpos -= 4;
          }
        }



    }

    game_core.prototype.client_handle_input = function(inptpos,inptlv,rot, phaser, dronebodys) {

        if ( this.numofdrones != dronebodys.length ) {
          this.pldata = new Float32Array( (dronebodys.length * 7) + 12);
          this.numofdrones = dronebodys.length;
        }


        this.pldata[0]  = inptpos.x;
        this.pldata[1]  = inptpos.y;
        this.pldata[2]  = inptpos.z;
        this.pldata[3]  = inptlv.x;
        this.pldata[4]  = inptlv.y;
        this.pldata[5]  = inptlv.z;
        this.pldata[6]  = rot.x;
        this.pldata[7]  = rot.y;
        this.pldata[8]  = rot.z;
        this.pldata[9]  = rot.w;
        this.pldata[10] = phaser;
        this.pldata[11] = this.local_time;

        // drone data
        var i = dronebodys.length;
        var meshpos;
        this.currpos = 12;
        while(i--){
          // if( dronebodys[i].ld == 1 ) {
            //meshpos = i + 1;
            this.pldata[this.currpos]    = dronebodys[i].body.position.x;
            this.pldata[this.currpos+1]  = dronebodys[i].body.position.y;
            this.pldata[this.currpos+2]  = dronebodys[i].body.position.z;
            this.pldata[this.currpos+3]  = dronebodys[i].body.linearVelocity.x;
            this.pldata[this.currpos+4]  = dronebodys[i].body.linearVelocity.y;
            this.pldata[this.currpos+5]  = dronebodys[i].body.linearVelocity.z;
            this.pldata[this.currpos+6]  = dronebodys[i].id; 
            this.currpos += 7;   
         // }     
        }


        var dataarr = [ this.pldata.buffer, this.player_self.id, this.gameid ];
        this.socket.emit('setgd', dataarr );

    }



    game_core.prototype.client_process_net_prediction_correction = function() {
      // No updates...
      if (! this.server_updates.length) return

      // The most recent server update
      var latest_server_data = this.server_updates[this.server_updates.length - 1]

      // Our latest server position
      var my_server_pos = latest_server_data.vals[latest_server_data.uuid].pos

      // here we handle our local input prediction,
      // by correcting it with the server and reconciling its differences

      var my_last_input_on_server = latest_server_data.vals[latest_server_data.uuid].isq
      if (my_last_input_on_server) {
        // The last input sequence index in my local input list
        var lastinputseq_index = -1
        // Find this input in the list, and store the index
        for (var i=0, l=this.player_self.inputs.length; i<l; ++i) {
          if (this.player_self.inputs[i].seq == my_last_input_on_server) {
            lastinputseq_index = i
            break
          }
        }

        // Now we can crop the list of any updates we have already processed
        if (lastinputseq_index != -1) {

          // remove the rest of the inputs we have confirmed on the server
          var number_to_clear = Math.abs(lastinputseq_index - (-1))
          this.player_self.inputs.splice(0, number_to_clear)
          // The player is now located at the new server position, authoritive server
          this.player_self.cur_state.pos = this.pos(my_server_pos)
          this.player_self.last_input_seq = lastinputseq_index
          // Now we reapply all the inputs that we have locally that
          // the server hasn't yet confirmed. This will 'keep' our position the same,
          // but also confirm the server position at the same time.
          //this.update_physics()
          this.client_update_local_position()
        }
      }
    }

    // game_core.prototype.update_physics = function() {
    //   if (this.client_predict) {
    //     this.player_self.old_state.pos = this.pos(this.player_self.cur_state.pos)
    //     var nd = this.process_input(this.player_self)
    //     this.player_self.cur_state.pos = this.v_add(this.player_self.old_state.pos, nd)
    //     this.player_self.state_time = this.local_time
    //   }
    // }

    game_core.prototype.client_update_local_position = function() {
      if (this.client_predict) {
        // Work out the time we have since we updated the state
        var t = (this.local_time - this.player_self.state_time) / this._pdt

        // Then store the states for clarity,
        var old_state = this.player_self.old_state.pos
        var current_state = this.player_self.cur_state.pos

        // Make sure the visual position matches the states we have stored
        //this.player_self.pos = this.v_add(old_state, this.v_mul_scalar(this.v_sub(current_state,old_state), t))

      // TODO this.player_self.pos = body.linearVelocity.addTime( old_state , 'this.timeStep or t'  );
        this.player_self.pos = current_state

        // TODO: collisions are not implemented yet !
        // We handle collision on client if predicting.
        //this.check_collision( this.player_self )
      }
    }

    // game_core.prototype.client_update = function() {
    //   // Check for client movement (if any).
    //   // Values are transmitted to the server and also
    //   // stored locally and get processed on next physics tick.

    //   var input_coords = this.client_get_inputs()
    //   if (input_coords) this.client_handle_input(input_coords)

    //   // Set actual player positions from the server update.
    //   this.client_update_local_position()

    //   // if (this.show_3D) this.emit('render')

    //   // if (this.show_2D) {
    //   //   // need the client players current position to use
    //   //   // when calculating relative positions on the map view.
    //   //   var map_offset_pos = this.player_self.pos

    //   //   // Clear 2D viewport (player map)
    //   //   this.ctx.clearRect(0, 0, this.viewport.width, this.viewport.height)

    //   //   for (var id in this.player_set) {

    //   //     if (this.player_self.uuid != id || this.fake_lag > 0) {
    //   //       // only showing _other_ players on the 2d map
    //   //       // (rendering them in reverse opacity order)
    //   //       //
    //   //       // unless we are simulating network lag on client !!

    //   //       // destination ghost?
    //   //       if (this.show_dest_pos && !this.naive_approach) {
    //   //         this.player_set[id].render_2d({ lerp: true, pos: map_offset_pos }, this)
    //   //       }

    //   //       // server ghost?
    //   //       if (this.show_server_pos && ! this.naive_approach) {
    //   //         this.player_set[id].render_2d({ ghost: true, pos: map_offset_pos }, this)
    //   //       }

    //   //       // player
    //   //       this.player_set[id].render_2d({ player: true, pos: map_offset_pos }, this)

    //   //     }
    //   //   }
    //   // }
      
    //   // Work out the fps average
    //   this.client_refresh_fps()
    // }


    // game_core.prototype.client_onping = function(data) {
    //   this.net_ping = new Date().getTime() - parseFloat(data)
    //   this.net_latency = this.net_ping / 2
    // }

    game_core.prototype.client_onnetmessage = function(data) {
      // var commands = data.split('.')
      //   , command = commands[0]
      //   , subcommand  = commands[1] || null
      //   , commanddata = commands[2] || null

      // if (command === 's' && subcommand === 'p')
      //   this.client_onping(commanddata)

      this.net_ping = new Date().getTime() - parseFloat(data.latency)
      this.net_latency = this.net_ping / 2
    }

    game_core.prototype.client_refresh_fps = function() {
      // We store the fps for 10 frames, by adding it to this accumulator
      this.fps = 1 / this.pdt
      this.fps_avg_acc += this.fps
      this.fps_avg_count++

      // When we reach 10 frames we work out the average fps
      if (this.fps_avg_count >= 10) {
        this.fps_avg = this.fps_avg_acc / 10
        this.fps_avg_count = 1
        this.fps_avg_acc = this.fps
      }
    }

    game_core.prototype.remove_player = function(id) {
      // Note: at some point we may need to cleanup player_set
      // removing out-of-range players with no recent updates.
      this.playercount--
      //this.emit('remove_mesh', id)
      delete this.player_set[id]
      console.log('Player quit: ' + this.playercount + ' remaining')
    }

    game_core.prototype.add_player = function(id, pos, idx) {
      // player must exist so that we can apply the update.
      this.playercount++
      this.player_set[id] = new Player(this)
      this.player_set[id].id = id
      this.player_set[id].cur_state.set( pos[0], pos[1], pos[2] );
      this.player_set[id].pos.set( pos[0], pos[1], pos[2] );


      // need to override these values obtained from server.
      this.player_set[id].index = parseInt(idx)
      // this.player_set[id].state = this.player_set[id].index ? 'orange' : 'lemon'
      // this.player_set[id].color = this.player_set[id].index ? '#EE9000' : '#EEEE00'
      // this.player_set[id].color_2d = this.player_set[id].index ? '#EE9000' : '#EEEE00'

      // if (id == this.player_self.uuid && this.colorcontrol != undefined) {
      //   this.colorcontrol.setValue(this.player_set[id].color)
      // }


      // add player mesh into 3d scene.
     // this.emit('add_mesh', this.player_set[id])

      console.log('Player joined: ' + this.playercount + ' total')
    }
    game_core.prototype.gethost = function() {

      return this.host;

    }


  return game_core;


});



