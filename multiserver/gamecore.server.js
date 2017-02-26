
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

  var OIMO = require('../multiserver/oimo');



  var frame_time = 1 / 60  // run the local game at 16.6ms/ 60hz
  if ('undefined' != typeof(global)) frame_time = 1 / 45  //on the server we run at 22ms, 45hz

  ;(function() {

    var lastTime = 0
    var vendors = [ 'ms', 'moz', 'webkit', 'o' ]

    for (var x=0; x<vendors.length && ! window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[ vendors[x] + 'RequestAnimationFrame' ]
      window.cancelAnimationFrame = window[ vendors[x] + 'CancelAnimationFrame' ] || window[ vendors[x] + 'CancelRequestAnimationFrame' ]
    }

    if (! window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback, element) {
        var currTime = Date.now(), timeToCall = Math.max(0, frame_time - (currTime - lastTime))
        var id = window.setTimeout(function() { callback(currTime + timeToCall) }, timeToCall)
        lastTime = currTime + timeToCall
        return id
      }
    }

    if (! window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) { clearTimeout(id) }
    }

  }() )


  // load the shared player class
  //var game_player = require('./multiserver/oimo')


  //  The game_core class

  var game_core = function(game_instance) {

    //Store the instance, if any
    this.instance = game_instance

    console.log('this.instance')
    console.log( this.instance );

    // OIMO world
    this.world;


    //Store a flag if we are the server
    this.server = this.instance !== undefined

    // TODO: collisions are not implemented yet !
    //this.world = { width:800, height:800, depth:800 }

    // Full stack of the connected clients/players.
    this.player_manifest = {}

    // Set up some physics integration values
    this._pdt  = 0.0001                 //The physics update delta time
    this._pdte = new Date().getTime()   //The physics update last delta time
    // A local timer for precision on server and client
    this.local_time = 0.016             //The local timer
    this._dt  = new Date().getTime()    //The local timer delta
    this._dte = new Date().getTime()    //The local timer last frame time

    // Start a physics loop, this is separate to the rendering
    // as this happens at a fixed frequency
    this.create_physics_simulation()

    // Start a fast paced timer for measuring time easier
   // this.create_timer()


    this.server_time = 0
    this.laststate = {}

    this.var = 0;
  }



  //require('../multiserver/common.js')(game_core)

  //

  /**
   *  Helper functions for the game code
   *
   *  Here we have some common maths and game related code to make working with 2d vectors easy,
   *  as well as some helpers for rounding numbers to fixed point.
   */

  /**
   *  Common functions
   *
   *  These functions are shared between client and server, and are generic
   *  for the game state. The client functions are client_* and server functions
   *  are server_* so these have no prefix.
   */

  //  Main update loop

      game_core.prototype.updategame = function(t) {

        //console.log(this.var);
        if(this.var) {
          // console.log(this.lastframetime)
          // console.log('this.lastframetime')
          // console.log(t);
          // console.log('t');
        }
        this.var += 1;

        // Work out the delta time
        //this.dt = this.lastframetime ? ((t - this.lastframetime) / 1000.0).fixed() : 0.016
        this.dt = this.lastframetime ? ((t - this.lastframetime) / 1000.0) : 0.016

        // Store the last frame time
        this.lastframetime = t

        // Update the game specifics
        this.server_update()

        //debugger;
        // schedule the next update
        this.updateid = window.requestAnimationFrame(this.updategame.bind(this), this.viewport);

        // console.log(this.updateid);
        // console.log('the update id')
      }


  /**
   *  Shared between server and client.
   *  In this example, `item` is always of type game_player.
   */

      game_core.prototype.check_collision = function(item) {

        // TODO: collisions not implemented yet !
        /**
        // left
        if (item.pos.x <= item.pos_limits.x_min) {
          item.pos.x = item.pos_limits.x_min
        }

        // right
        if (item.pos.x >= item.pos_limits.x_max) {
          item.pos.x = item.pos_limits.x_max
        }
    
        // floor
        if (item.pos.y <= item.pos_limits.y_min) {
          item.pos.y = item.pos_limits.y_min
        }

        // top
        if (item.pos.y >= item.pos_limits.y_max) {
          item.pos.y = item.pos_limits.y_max
        }

        // front
        if (item.pos.z <= item.pos_limits.z_min) {
          item.pos.z = item.pos_limits.z_min
        }

        // back
        if (item.pos.z >= item.pos_limits.z_max) {
          item.pos.z = item.pos_limits.z_max
        }

        // Fixed point helps be more deterministic
        item.pos.x = item.pos.x.fixed(4)
        item.pos.y = item.pos.y.fixed(4)
        item.pos.z = item.pos.z.fixed(4)
        */
      }

  //


  game_core.prototype.create_physics_simulation = function() {
    var boardphase = 2;
    // The number of iterations for constraint solvers : default 8.
    var Iterations = 8;
    // calculate statistique or not
    var noStat = false;
    var timestep = 1/60; //is 15ms same as set timeout
    var instanceOIMO = new OIMO;
    this.world = new instanceOIMO.World( timestep, boardphase, Iterations, noStat );
    setInterval(function() {

      //debugger;

      this.world.step();
      this._pdt  = (new Date().getTime() - this._pdte) / 1000.0;
      this._pdte = new Date().getTime();
      this.update_physics();
    }.bind(this), 15)
  }

  game_core.prototype.update_physics = function() {


    for (var id in this.player_manifest) {
      // handle players
      this.player_manifest[id].old_state.pos = this.pos(this.player_manifest[id].pos)
      var new_dir = this.process_input(this.player_manifest[id])
      this.player_manifest[id].pos = this.v_add(this.player_manifest[id].old_state.pos, new_dir)

      // TODO: collisions are not implemented !
      // Keep the physics position in the world
      //this.check_collision(this.player_manifest[id])

      // clear buffer
      this.player_manifest[id].inputs = []
    }
  }

  //

  game_core.prototype.server_update = function() {

    this.angle;

    // Update the state of our local clock to match the timer
    this.server_time = this.local_time

    // prepare and send updates.
    var packet = this.server_prepare_update()
    this.server_transmit_update(packet)
  }

  //

  game_core.prototype.server_prepare_update = function() {

    ////debugger;

    var packet = {}

    for (var id in this.player_manifest) {
      packet[id] = {
        pos: this.player_manifest[id].pos,
        idx: this.player_manifest[id].index,
        isq: this.player_manifest[id].last_input_seq || 0
      }
    }

    return packet
  }

  //

  game_core.prototype.server_transmit_update = function(packet) {

    ////debugger;

    this.last_state = {
      vals: packet,
      t:    this.server_time
    }

    for (var id in this.player_manifest) {
      this.last_state.uuid = id
      if (this.player_manifest[id].instance) {
        this.player_manifest[id].instance.emit('onserverupdate', this.last_state)
      }
    }
  }

  game_core.prototype.create_timer = function() {
  setInterval(function() {
    this._dt  = new Date().getTime() - this._dte
    this._dte = new Date().getTime()
    this.local_time += this._dt / 1000.0
  }.bind(this), 4)
  }


  game_core.prototype.physics_movement_vector_from_direction = function(x, y, z) {

  // Must be fixed step, at physics sync speed.
    return {
      x: (x * (this.playerspeed * 0.015)).fixed(3),
      y: (y * (this.playerspeed * 0.015)).fixed(3),
      z: (z * (this.playerspeed * 0.015)).fixed(3)
    }
  }


  game_core.prototype.process_input = function(player) {

    // It's possible to have recieved multiple inputs by now,
    // so we process each one
    var x_dir = 0
    var y_dir = 0
    var z_dir = 0

    var ic = player.inputs.length
    if (ic) {
      for (var j=0; j<ic; ++j) {
        // don't process ones we already have simulated locally
        if (player.inputs[j].seq <= player.last_input_seq) continue

        var input = player.inputs[j].inputs
        var c = input.length

        for (var i=0; i<c; i+=2) {
          x_dir = input[i]
          z_dir = input[i + 1]
        }
      }
    }

    // we have a direction vector now, so apply the same physics as the client
    var resulting_vector = this.physics_movement_vector_from_direction(x_dir, y_dir, z_dir)
    if (player.inputs.length) {
      // we can now clear the array since these have been processed
      player.last_input_time = player.inputs[ic - 1].time
      player.last_input_seq  = player.inputs[ic - 1].seq
    }

    // give it back
    return resulting_vector
  }

  game_core.prototype.player_connect = function(player) {
      // someone entered the game, add them to our list !
      this.playercount++
      var p = new game_player(this, player)

      // spiral spawn location.
      var angle  = 0.5 * this.playercount
      var radius = 30 + 5 * this.playercount
      p.pos.x = radius * Math.cos(angle)
      p.pos.z = radius * Math.sin(angle)
      p.cur_state.pos = this.pos(p.pos)

      // add new player to storage.
      this.player_manifest[player.uuid] = p
  }

  //

  game_core.prototype.player_disconnect = function(uuid) {
    // someone quit the game, delete them from our list !
    delete this.player_manifest[uuid]
  }

  //

  game_core.prototype.handle_server_input = function(client, input, input_time, input_seq) {

    var player_client = this.player_manifest[client.uuid]

    if (player_client && player_client.inputs) {
      if (input.length) {
        // convert string input values back into numeric data
        for (var i=0, l=input.length; i<l; i++) {
          input[i] = parseFloat(input[i].replace(',', '.'))
        }

        // Store the input on the player instance for processing in the physics loop
        player_client.inputs.push({ inputs: input, time: input_time, seq: input_seq })
      }
    }
  }
module.exports = game_core

