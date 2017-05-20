
  // gamecore.js v.2

define(['socket_io','oimo'], function(SOCKET_IO,OIMO) {

"use strict";


   var Player = function() {

      this.index = Math.random() < 0.5 ? 0 : 1;

      // Set up initial values for our state information
      this.pos = new OIMO.Vec3();
      this.ghostpos = new OIMO.Vec3();
      this.destpos  = new OIMO.Vec3();
      this.state = 'new player'

      // These are used in moving meshs around later
      this.old_state = new OIMO.Vec3();
      this.cur_state = new OIMO.Vec3(); // spawn here!
      this.state_time = new Date().getTime()

      // Our local history of inputs
      this.inputs = []
  }
    

  function game_core() { 

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

      this.droneprev = new OIMO.Vec3();
      this.dronetarget = new OIMO.Vec3();
      this.bodys;
      this.ms1y = { y: 0, t: 0 };
      this.ms2y = { y: 0, t: 0 };

      this.firstStream = 1;
      this.respawn = { restart: 0, firepx: 0 };
      this.respawning = 0;
      this.subvec = new OIMO.Vec3();

      // const
      this.ply1;
      this.ply2;
      this.ply2mesh;
      this.client_smooth = 20;     // amount of smoothing to apply to client update dest    smooth out drones and ship
   //   this.firepx = 0;


    }

    game_core.prototype.v_lerp = function(v, tv, t) {
      return { x:this.lerp(v.x, tv.x, t), y:this.lerp(v.y, tv.y, t), z:this.lerp(v.z, tv.z, t) } 
    }
    game_core.prototype.lerp = function(p, n, t) { 
      var _t = Number(t); 
      _t = (Math.max(0, Math.min(1, _t))); 
      return (p * (1 - _t) + n * _t);
    }

    game_core.prototype.setply1ply2 = function( ply1, ply2, ply2mesh, bodys ) {

      this.ply1 = ply1;
      this.ply2 = ply2;
      this.ply2mesh = ply2mesh;
      this.player_self.pos.set( this.ply1.body.position.x, this.ply1.body.position.y, ply1.body.position.z  )
      this.add_player ( this.player_self.id, [ this.ply1.body.position.x, this.ply1.body.position.y, ply1.body.position.z ], 10 ) 
      this.bodys = bodys;
    }

    game_core.prototype.start = function( ) {
      var self  = this

      this.client_create_configuration();
      this.client_connect_to_server();
      this.create_timer()
      this.client_create_ping_timer()

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
       // handle player respawn
      this.socket.on('respawnply', this.respawnply.bind(this));
      // Handle when we connect to the server, showing state and storing id's.
      this.socket.on('gamestart', this.ongamestart.bind(this));
      // On message from the server, we parse the commands and send it to the handlers
      this.socket.on('setlatency', this.client_onnetmessage.bind(this));
    }

    game_core.prototype.client_ondisconnect = function(data) {
      // Perform any cleanup required when we disconnect.
    }

    game_core.prototype.respawnply = function(data) {

        if ( !this.respawning ) {
          this.respawn.restart = 1;
          this.respawn.firepx = data.firepx;
        }
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

    game_core.prototype.setdrone = function( data ) {
      
      if ( this.bodys && this.firstStream ){
        this.host ? document.getElementById( 'respawntxt' ).innerHTML = 'Player 2 Joined' : document.getElementById( 'respawntxt' ).innerHTML = 'loading game';
        var currpos = 0;
        var ddata = new Float32Array( data[ this.player_self.id ].pldata );
       
        for (var i = this.bodys.length - 1; i >= 0; i--) {
          if( this.bodys[i].name == 'drone' ) {

            this.bodys[i].body.position.x = ddata[ currpos ];      
            this.bodys[i].body.position.y = ddata[ currpos +1 ];   
            this.bodys[i].body.position.z = ddata[ currpos +2 ];  
            this.bodys[i].id  = ddata[ currpos +3 ];   
            this.bodys[i].ld = ddata[ currpos +4 ]; 
            if ( this.bodys[i].ld ) { this.bodys[i].nrtm = 1; }
            currpos += 5;

          }
        }
        this.socket.emit( 'dataload1', { id: this.player_self.id, gid: this.gameid });
        this.firstStream = 0;
      }



    }
    game_core.prototype.client_onserverupdate_received = function(data) {

     // if( this.startgame === 1) {
      if ( this.firstStream == 0 ){
          this.startgame = 1;
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
      }
      else {
        this.server_updates = [];
        this.ms1y = { y: 0, t: 1 };
        this.ms2y = { y: 0, t: 1 };
      }

       
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




    game_core.prototype.update = function( pos, lv, rot, phaser, dronebodys, ms1y, ms2y ) {

      // delta time
      var t = new Date().getTime();
      //this.dt = this.lastframetime ? ((t - this.lastframetime) / 1000.0).fixed() : 0.016;
      this.pdt = this.lastframetime ? ((t - this.lastframetime) / 1000.0) : 0.016;

      this.lastframetime = t;

       // Set actual player positions from the server update.
      
      this.client_process_net_updates()


      this.client_handle_input( pos, lv, rot, phaser, dronebodys, ms1y, ms2y );
  
      // Set actual player positions from the server update.
     
      // check this
      //this.client_update_local_position();
      this.client_refresh_fps();

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
        // if (isNaN(time_point)) time_point = 0
        // if (time_point == -Infinity) time_point = 0
        // if (time_point == Infinity) time_point = 0


        // go update the drones and the ms
        this.updatedrones( target, previous, time_point );
        this.updatems( target );


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

      var updatepos = 0;
      //var tpos = 13;
      // update if change to player and ms data
      var tpos = 15;
      // var i = this.bodys.length;
      for ( var i = 0; i < this.bodys.length; i++) {
        if ( this.bodys[i].id === target.vals.pldata[tpos] ) {
            if ( !this.bodys[i].body.sleeping) {
              this.bodys[i].body.sleep();
            }

  
            this.droneprev.copy( this.bodys[i].body.position );
            this.dronetarget.set( target.vals.pldata[ tpos -3 ], target.vals.pldata[ tpos -2 ], target.vals.pldata[ tpos-1 ]  );

            this.subvec.sub( this.dronetarget, this.droneprev );

            // set an array of ids of drones just expart then exluded from lerp
            var numpos = this.expartarr.indexOf( this.bodys[i].id );
            if ( numpos == -1) {
              if ( (this.subvec.x > 0.01 || this.subvec.x < -0.01) || ( this.subvec.y >  0.01 || this.subvec.y < -0.01 ) || ( this.subvec.z >  0.01 || this.subvec.z < -0.01) ) {
                this.bodys[i].body.sleepPosition.copy( this.v_lerp( this.droneprev, this.dronetarget, time_point) );
                this.bodys[i].body.position.copy( this.bodys[i].body.sleepPosition );
              }
            }
            else {
                this.bodys[i].body.sleepPosition.copy( this.dronetarget );
                this.bodys[i].body.position.copy( this.bodys[i].body.sleepPosition );
                this.expartarr.splice( numpos, 1 );
            }
            updatepos = 1;
            if ( this.bodys[i].ld != target.vals.pldata[tpos+1] ) {
              this.bodys[i].ld = target.vals.pldata[tpos+1];
            }
        }
        var num = target.vals.pldata[tpos] + ''; 
        var droneid = ~~num.substr( 0, num.length-4 );
        if ( num.match('9999') && droneid == this.bodys[i].id ) {
          this.bodys[i].tbd = 1
          this.expartarr.push( ~~num.substr( 0, num.length-4 ) )
          updatepos = 1;
        }
        if ( num.match('8888') && droneid == this.bodys[i].id  && !this.bodys[i].rtm ) { 
          this.bodys[i].rtm = 1;
          this.host ? this.bodys[i].ld = 1 : this.bodys[i].ld = 2;
          updatepos = 1;
        }
        if( updatepos ) { tpos += 5; ;updatepos = 0;  }
        if ( tpos > target.vals.pldata.length ) { break; }

      }
    }

    game_core.prototype.updatems = function ( target ) {


      this.ms1y.y = target.vals.pldata[8];
      this.ms1y.t = target.vals.pldata[9];
      this.ms2y.y = target.vals.pldata[10];
      this.ms2y.t = target.vals.pldata[11];

      // console.log('ms1y.y: ' + this.ms1y.y + 'ms1y.t: ' + this.ms1y.t);
      // console.log('ms2y.y: ' + this.ms2y.y + 'ms1y.t: ' + this.ms1y.t);

    }

    game_core.prototype.client_handle_input = function ( inptpos, inptlv, rot, phaser, dronebodys, ms1y, ms2y ) {

        // update if change to player and ms data
        if ( this.numofdrones != dronebodys.length ) {
          this.pldata = new Float32Array( (dronebodys.length * 8) + 14);
          this.numofdrones = dronebodys.length;
        }


        //this.pldata[0]  = inptpos.x;
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
        this.pldata[12] = ms1y.y;
        this.pldata[13] = ms2y.y;

        // drone data
        var i = dronebodys.length;
        this.currpos = 14;
        while(i--){
         
            this.pldata[this.currpos]    = dronebodys[i].body.position.x;
            this.pldata[this.currpos+1]  = dronebodys[i].body.position.y;
            this.pldata[this.currpos+2]  = dronebodys[i].body.position.z;
            this.pldata[this.currpos+3]  = dronebodys[i].body.linearVelocity.x;
            this.pldata[this.currpos+4]  = dronebodys[i].body.linearVelocity.y;
            this.pldata[this.currpos+5]  = dronebodys[i].body.linearVelocity.z;
            this.pldata[this.currpos+6]  = dronebodys[i].id; 
            this.pldata[this.currpos+7]  = dronebodys[i].ld; 
            this.currpos += 8;   

        }


        var dataarr = [ this.pldata.buffer, this.player_self.id, this.gameid ];
        this.socket.emit( 'setgd', dataarr );

    }

    game_core.prototype.levelGen = function( data ) {

      this.socket.emit( 'levelgen', { x982y: data, gid: this.gameid, id: this.player_self.id, firepx: this.respawn.firepx } );

    }

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

      // if (id == this.player_self.uuid && this.colorcontrol != undefined) {
      //   this.colorcontrol.setValue(this.player_set[id].color)
      // }


      // add player mesh into 3d scene.
     // this.emit('add_mesh', this.player_set[id])

      console.log('Player joined: ' + this.playercount + ' total')
    }

    game_core.prototype.gcd = function( data ) {

      if ( data == 'host' ) {
        return this.host;
      }
      if ( data == 'ms1y') {
        return this.ms1y;
      }
      if ( data == 'ms2y') {
        return this.ms2y;
      }
    }


  return game_core;


});



