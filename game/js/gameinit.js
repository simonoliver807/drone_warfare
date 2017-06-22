define(['oimo', 'v3d', 'asteroid', 'planetex'], function(OIMO,V3D,ASTEROID,PLANETEX) {

    "use strict";
      
    return function () {   

    //////////////////////////
    //****Three Variables****//
    //////////////////////////
    


    // non physics object to exclude from mesh array
   // var exmesh = ['sight','hemlight','dirlight','containerMesh','points']
    var pause = 0;
    var v3d = new V3D.View();
    var asteroid = new ASTEROID;
    asteroid.initMat();
    var planetex = new PLANETEX;
    planetex.initMat();
    var pex_t = 0;
    
    //////////////////////////
    //****Oimo Variables****//
    //////////////////////////

    // Algorithm used for collision
    // 1: BruteForceBroadPhase  2: sweep and prune  3: dynamic bounding volume tree
    // default is 2 : best speed and lower cpu use.
    var boardphase = 2;

    // The number of iterations for constraint solvers : default 8.
    var Iterations = 8;

    // calculate statistique or not
    var noStat = false;

    var world;
    var worldcount = 0;

    var x982y = 1;      //*************************************
    var startlevel = 1;     //*************************************


    var gameUUID;
    var prs;


    var perf;

    // container to hold oimo objects
    var bodys = [];
    var bodysNum = 0;
    var meshs = [];
    var meshNum = 0;
    

    var containerMesh;
    var sightMesh;
    // radius of the ship
    var shp1r = 50;


    var prevAngle;
    var prevCamVector;
    var camAngle = 0.01;
    var axis = new OIMO.Vec3(0,1,0);
    var canvasCentreX = v3d.w/2;
    var canvasCentreY = v3d.h/2;

    var containerMeshPrev;
    containerMeshPrev = new OIMO.Vec3(0,0,0);
    var canvas = document.getElementById('container');
    var keys = [];
    var pddist = new OIMO.Vec3();

    var perfcont;

    var anibincnt;

    var mapcm = v3d.tvec(0,0,0);
    var mapms = v3d.tvec(0,0,0);
    var mapel1 = document.getElementById('mapms1');
    var mapel2 = document.getElementById('mapms2');
    var mapel;
    var gmap = document.getElementById('gmap');
    var anglems1 = 1;
    var anglems2 = 1;
    var ms1prev = v3d.tvec( 0, 0, 0);
    var ms1diff = v3d.tvec( 0, 0, 0);

    var ms1len = 0;
    var ms2len = 0;
    var msTotal_list = [];

    var numofdrone = 0;
    var numofdroneleft = 0;
    var totaldrones = 0;
    var endsequence = 0;

    var halfdiamplanet = 0;
    var planetlist = [];

    var firstRender = 0;

    var numobj = 0;
    var self;
    
    var dronelaunch = 0;
    var level1imgCnt = 0;
    var pdown;
    var mslist = [];
    var dronelaunchTime = 60;
    var start3render = 1;

    // asteroids
    var numofast = 200;
    var planetexarr = [];
    var rdir = [];
    var planetexname;
    var msrotpct = 0.05;
    var grad = -0.1;

        return {

            createWorld: function(timestep){

                 // create oimo world contains all rigidBodys and joint.

                world = new OIMO.World( timestep, boardphase, Iterations, noStat );
                world.worldscale(100);
                world.gravity = new OIMO.Vec3(0, 0, 0);
                v3d.setWorld(world);
                bodysNum = 0;
                v3d.addPhaser = function(body, phaser) {
                    bodys[bodys.length] = new OIMO.Body(body);
                    meshs[meshs.length] = phaser;
                    return bodys[bodys.length -1];
                }
                containerMesh = 0;
                prs = [{id:'temp1',gameid:12345,posx:0,posy:0,posz:0,rotx:0,roty:0,rotz:0}];


                // change to live
                // perfcont = document.getElementById('perf');


                perf = 0;
                anibincnt = 1;
                endsequence = 100;

                // random directions for the explosion

                for ( var i = 0; i <= 400; i++ ) {
                    var dir = new OIMO.Vec3();
                    if ( i % 2) {
                        var minusarr = [1,1,1];
                        var rand123 = this.randMinMax(0, 2);
                        minusarr[rand123] = -1
                        dir.set( Math.random() * 10 * minusarr[0], Math.random() * 10 * minusarr[1], Math.random() * 10 * minusarr[2] );
                    }
                    else {
                        dir.set( Math.random() * 10, Math.random() * 10, Math.random() * 10 );
                    }
                    rdir.push(dir);
                }

                self = this;

            },


            render: function(){

                 
                setTimeout( self.render, 16 );

                if( V3D.ms1_1arrpos === 99 && endsequence > 0 ){
                    if ( V3D.ms2_1arrpos === 0 || V3D.ms2_1arrpos === 99) {
                        endsequence --;
                        var currentLevel = x982y + 1;
                        document.getElementById('level'+currentLevel+'Img').style.display = 'block';
                    }
                }
                if( endsequence == 0 ){                            
                    //console.log('end of level');
                    self.levelGen();
                }
                if ( endsequence < 0 ) {
                    endsequence ++;
                }
                if( endsequence == -1 ){                            
                   // console.log('reset level');
                    self.levelGen(1);
                }
            
                worldcount += 0.00001;

                // change to live: remove
               //var pause = 1;

              if( !pause && V3D.startRender == numobj ){  

                    if ( start3render ) {
                        self.threejsrender();
                        start3render = 0;
                    }
                    // reset bodies to dispose array
                    var btd = [];
                    world.step();


                    if( dronelaunch < dronelaunchTime && dronelaunch != -1  ) {
                        dronelaunch += 0.1;
                    }
                    else {
                        dronelaunch = 0;
                    }


                    if(firstRender != 0){
                        if( firstRender.ms1 && x982y !== 3 ) {                         
                           bodys[firstRender.ms1].body.setupMass(0x2);
                        }
                        if( firstRender.ms2  ) {
                            bodys[firstRender.ms2].body.setupMass(0x2);
                        }
                        firstRender = 0;
                        document.getElementById('loadingScreen').style.display = 'none'; 
                        if ( startlevel ) {
                            document.getElementById('level1Img').style.display = 'block';
                            level1imgCnt ++; 
                        }
                    }
                    if(level1imgCnt > 0 && level1imgCnt < 100){
                        level1imgCnt ++; 
                    }
                    if(level1imgCnt === 100){
                        document.getElementById('level1Img').style.display = 'none';
                        level1imgCnt == 0;
                    }


                    anibincnt == 5 ? anibincnt = 0 : anibincnt += 1;


                   if(!containerMesh){
                       firstRender = { ms1: 0, ms2: 0 };
                       var dist = v3d.tvec();
                       var astcount = 0;
                       // var planetlistnum = 0;                             
                       // make sure the two mesh and body array match
                           // container to hold three.js objects
                            for(var b = 0; b < bodys.length; b++){
                                for(var i =0; i < v3d.scene.children.length ; i++){
                                    if(bodys[b].name == v3d.scene.children[i].name ){
                                            meshs.push(v3d.scene.children[i]);
                                            if(bodys[b].name == 'ms1' || bodys[b].name == 'ms2'){

                                                var q = v3d.msla(bodys[b].body);
                                                bodys[b].body.setQuaternion(q);
                                                if ( startlevel ) {
                                                    v3d.scene.add( v3d.addPlane( 'engineGlow' ));
                                                    v3d.eg = v3d.scene.children[ v3d.scene.children.length - 1 ]; 
                                                } 

                                                // if ( bodys[b].name == 'ms2'){
                                                //     var q = v3d.tquat();
                                                //     var vector1 = v3d.tvec(0,1,0);
                                                //     q.setFromAxisAngle(vector1, 1.57);
                                            

                                                //     var q2 = v3d.tquat();
                                                //     var vector2 = v3d.tvec(0,0,1);
                                                //     q2.setFromAxisAngle(vector2, 0.75);
                                                //     q.multiply(q2);
                                            

                                                //     bodys[b].body.setQuaternion(q);

                                                // }



                                                // remove
                                                // for(var n=0; n < v3d.scene.children.length; n++){
                                                //     if(v3d.scene.children[n].name == 'mothershipbb1' && bodys[b].body.name == 'ms1'){
                                                //         v3d.scene.children[n].quaternion.set( q.x,q.y,q.z,q.w); 
                                                //     }
                                                //      if(v3d.scene.children[n].name == 'mothershipbb2' && bodys[b].body.name == 'ms2'){
                                                //         v3d.scene.children[n].quaternion.set( q.x,q.y,q.z,q.w); 
                                                //     }
                                                // }



                                                if( bodys[b].name == 'ms1'){
                                                    firstRender.ms1 = b;
                                                }
                                                else {
                                                    firstRender.ms2 = b;
                                                }

                                            }
                                            break;
                                    }
                                    var planet = planetlist.indexOf(bodys[b].name);
                                    if(v3d.scene.children[i].name == 'planets') {
                                        if( planet != -1 ) {

                                            meshs.push( v3d.scene.children[i].children[planet]);

                                        }
                                    }
                                    if(v3d.scene.children[i].name == 'drones') {
                                        v3d.dronenum = i;
                                    }
                                    if(v3d.scene.children[i].name == 'containerMesh'){
                                        var contmeshnum = i;
                                    }
                                    if(v3d.scene.children[i].name == 'ms1'){
                                        v3d.ms1arrpos = i;
                                    }
                                    if(v3d.scene.children[i].name == 'ms2'){
                                        v3d.ms2arrpos = i;
                                    }
                                    if(v3d.scene.children[i].name == 'ms1_1'){
                                        V3D.ms1_1arrpos = i;
                                    }
                                    if(v3d.scene.children[i].name == 'ms2_1'){
                                        if( mslist.indexOf('ms2') != -1) {
                                            V3D.ms2_1arrpos = i;
                                        }
                                    }   
                                }
                                if ( bodys[b].name.match( 'astgroup' ) ) {
                                    meshs.push( V3D.asteroids.children[ astcount ] );
                                    astcount ++;
                                }
                            }

                            v3d.scene.children[v3d.ms1arrpos].children[0].add(V3D.ms1phaser);
                            dist.subVectors(v3d.planetpos, v3d.scene.children[v3d.ms1arrpos].position );
                            ms1len = dist.length();
                            ms1len -= halfdiamplanet; // minus half the diameter of the planet
                            v3d.ms1pos.set(v3d.scene.children[v3d.ms1arrpos].position.x,v3d.scene.children[v3d.ms1arrpos].position.y,v3d.scene.children[v3d.ms1arrpos].position.z);
                            V3D.raycastarr.push(v3d.scene.children[v3d.ms1arrpos]);
                            if( v3d.ms2arrpos ) {
                                v3d.scene.children[v3d.ms2arrpos].children[0].add(V3D.ms2phaser);
                                dist.subVectors(v3d.planetpos, v3d.scene.children[v3d.ms2arrpos].position );
                                ms2len = dist.length();
                                ms2len -= halfdiamplanet; // minus half the diameter of the planet
                                v3d.ms2pos.set( v3d.scene.children[v3d.ms2arrpos].position.x, v3d.scene.children[v3d.ms2arrpos].position.y , v3d.scene.children[v3d.ms2arrpos].position.z);
                                V3D.raycastarr.push(v3d.scene.children[v3d.ms2arrpos]);
                            }

                            V3D.raycastarr.push(v3d.scene.children[v3d.dronenum]);
                            for (var i = 0; i < V3D.asteroids.length; i++) {
                                V3D.asteroids[i]
                            }
                            for(var i = 1; i < v3d.scene.children[v3d.dronenum].children.length;i++){
                                meshs.push(v3d.scene.children[v3d.dronenum].children[i]);
                            }
                            v3d.containerMesh = v3d.scene.children[contmeshnum];
                            v3d.controls.target = v3d.containerMesh.position;
                            containerMesh = v3d.scene.children[contmeshnum];
                            meshNum = meshs.length;
                        }

                    
                        if(V3D.exdrone3.userData.active){
                            var i = V3D.exdrone3.children.length - 1;
                            while(i>0) {
                                    var points = v3d.expart();
                                    for(var p = 0; p < points.geometry.vertices.length; p++){
                                        points.geometry.vertices[p].x = V3D.exdrone3.children[i].position.x;
                                        points.geometry.vertices[p].y = V3D.exdrone3.children[i].position.y;
                                        points.geometry.vertices[p].z = V3D.exdrone3.children[i].position.z;
                                    }
                                    points.userData.timecreated = worldcount;
                                    V3D.grouppart.add(points);
                                V3D.exdrone3.children[i].geometry.dispose();
                                V3D.exdrone3.children[i].material.materials[0].dispose();
                                V3D.exdrone3.children[i].material.materials[1].dispose();
                                V3D.exdrone3.remove(V3D.exdrone3.children[i]);
                                i--;
                            }
                            V3D.exdrone3.userData.active = false;
                        }


                        if(V3D.exdrone2.userData.active){
                            var i = V3D.exdrone2.children.length - 1;
                            while(i>0) {
                                var exdrone = V3D.exdrone3.children[0].clone();
                                exdrone.position.set(V3D.exdrone2.children[i].position.x,V3D.exdrone2.children[i].position.y,V3D.exdrone2.children[i].position.z);
                                exdrone.quaternion.set(V3D.exdrone2.children[i].quaternion.x,V3D.exdrone2.children[i].quaternion.y,V3D.exdrone2.children[i].quaternion.z,V3D.exdrone2.children[i].quaternion.w);
                                exdrone.visible = true;
                                V3D.exdrone3.children.push(exdrone);
                                V3D.exdrone3.userData.active = true;
                                V3D.exdrone2.children[i].geometry.dispose();
                                V3D.exdrone2.children[i].material.materials[0].dispose();
                                V3D.exdrone2.children[i].material.materials[1].dispose();
                                V3D.exdrone2.remove(V3D.exdrone2.children[i]);
                                i--;
                            }
                            V3D.exdrone2.userData.active = false;
                        }


                        if(V3D.exdrone1.userData.active){
                            var i = V3D.exdrone1.children.length - 1;
                            while(i>0) {
                                    var exdrone = V3D.exdrone2.children[0].clone();
                                    exdrone.position.set(V3D.exdrone1.children[i].position.x,V3D.exdrone1.children[i].position.y,V3D.exdrone1.children[i].position.z);
                                    exdrone.quaternion.set(V3D.exdrone1.children[i].quaternion.x,V3D.exdrone1.children[i].quaternion.y,V3D.exdrone1.children[i].quaternion.z,V3D.exdrone1.children[i].quaternion.w);
                                    exdrone.visible = true;
                                    V3D.exdrone2.children.push(exdrone);
                                    V3D.exdrone2.userData.active = true;
                                    V3D.exdrone1.children[i].geometry.dispose();
                                    V3D.exdrone1.children[i].material.materials[0].dispose();
                                    V3D.exdrone1.children[i].material.materials[1].dispose();
                                    V3D.exdrone1.remove(V3D.exdrone1.children[i]);
                                    i--;
                            }
                            V3D.exdrone1.userData.active = false;
                        }

                    var n1, n2;
                    // var name1 = 'drone';
                    // var name2 = 'phaser';
                    var name3 = 'shp1';
                    var name4 = 'dphaser';
                    // var name5 = 'ms1';
                    // var name6 = 'ms2';
                    var contact = world.contacts;
                    while(contact!==null){
                        if(contact.body1 != null && contact.body2 != null){
                            n1 = contact.body1.name || ' ';
                            n2 = contact.body2.name || ' ';
                           // if((n1==name1 && n2==name2) || (n2==name1 && n1==name2)){ 
                             //  if(contact.touching) {
                                  // if(contact.shape1.proxy && contact.shape2.proxy){
                                  //      btd.push(contact.shape1.id);
                                //        btd.push(contact.shape2.id); 
                              //          world.removeContact(contact);
                                //   }
                              // }
                            //}
                            if((n1==name3 && n2==name4) || (n2==name3 && n1==name4)){
                                //console.log('r1' + r1 );
                                bodys[0].r1 -= 1;
                                if( bodys[0].r1 === 0){ 
                                    endsequence = -200; 

                                        document.getElementById('respawnImg').style.display = 'block';
                                        if( V3D.ms1_1arrpos === 99 && endsequence < 0 ){
                                            if ( V3D.ms2_1arrpos === 0 || V3D.ms2_1arrpos === 99) {
                                                var currentLevel = x982y + 1;
                                                document.getElementById('level'+currentLevel+'Img').style.display = 'none';
                                            }
                                        }
                                }
                            } 
                            //  if((n1==name2 && n2==name5) || (n2==name2 && n1==name5)){
                            //         ms1y = 1;
                            //         world.removeContact(contact);
                            // }
                            // if((n1==name2 && n2==name6) || (n2==name2 && n1==name6)){
                            //         ms2y = 1;
                            //          world.removeContact(contact);
                            // }

                        }
                        contact = contact.next;
                    }
                    for( var i = 0; i < V3D.grouppart.children.length; i++ ) {
                        if(worldcount - V3D.grouppart.children[i].userData.timecreated > 0.0008) {
                            V3D.grouppart.children[i].geometry.dispose();
                            V3D.grouppart.children[i].material.dispose();
                            V3D.grouppart.remove( V3D.grouppart.children[i] );
                        }
                        else {
                            var expart = V3D.grouppart.children[i].geometry.vertices;
                            for(var numarr = 0; numarr< expart.length; numarr++){
                                // var num = Math.random() * 10;
                                // if( numarr % 2 === 0 ){
                                //     num *= -1;
                                // }
                                 V3D.grouppart.children[i].geometry.vertices[numarr].x += Math.random() * 10;
                                 V3D.grouppart.children[i].geometry.vertices[numarr].y += Math.random() * 10;
                                 V3D.grouppart.children[i].geometry.vertices[numarr].z += Math.random() * 10;
                            }
                           V3D.grouppart.children[i].geometry.verticesNeedUpdate = true;
                        }
                    }
                    var i = planetexarr.length;
                    while( i --) {
                        if( worldcount - planetexarr[i].userData.timecreated > 0.0008 ) {
                            var exast = planetexarr[i].children;
                            var numex = exast.length; 
                            while( numex --) {
                                exast[numex].material.dispose;
                                exast[numex].geometry.dispose;
                                planetexarr[i].remove(exast[numex])
                            }  
                            v3d.scene.remove(planetexarr[i]) 
                            planetexarr.splice(i,1);
                        }
                        else {
                            var exast = planetexarr[i].children;
                            for(var numarr = 0; numarr< exast.length; numarr++){
                                exast[numarr].position.x += rdir[numarr].x;
                                exast[numarr].position.y += rdir[numarr].y;
                                exast[numarr].position.z += rdir[numarr].z;
                            }
                        }
                    }
                    
                    // change to live
                    // perf = world.performance.show();
                    // perfcont.innerHTML = perf;
                  

                   // var x, y, z, mesh, body;

                    var mesh, body;
                    var i = bodys.length;
                    while (i--){
                        body = bodys[i];
                        mesh = meshs[i];

                        // check if asteroid needs breaking down, destroying, or respawning
                        // change to live 
                        if ( v3d.scene.children[V3D.mesharrpos.planetGlow].material.uniforms.glowFloat.value > pex_t && endsequence > 0 ){
                        //if ( v3d.scene.children[V3D.mesharrpos.planetGlow].material.uniforms.glowFloat.value > 0.6 && endsequence > 0 ){

                            // radius is set in the module
                            var a123 = planetex.create( true, 250 );
                            a123.name = 'pex';
                            a123.userData.timecreated = worldcount + 0.001;
                            var planets = v3d.scene.children[ V3D.mesharrpos.pl ].children;
                            for ( var i = 0; i < planets.length; i++ ){
                                if( planets[i].name == planetexname ){
                                    planets[i].material.visible = false;
                                    a123.position.copy( planets[i].position);
                                }
                            }
                            document.getElementById('respawnImg').style.display = 'block';
                            endsequence = -200;
                            planetexarr.push( a123 );
                            v3d.scene.add( a123 );

                        }
                        if ( mesh.name.match( 'ast' ) ) {
                            if( mesh.userData.atbd ) {
                                v3d.playastex();
                                var m;
                                mesh.type == 'Group' ? m = asteroid.breakDown( mesh, body ) : m = 0;
                                if ( m ) {
                                    for (var astarrnum = 0; astarrnum < m.length; astarrnum++) {
                                        V3D.asteroids.add( m[ astarrnum ] );
                                        bodys[ bodysNum ] = new OIMO.Body( { move: true, name: m[ astarrnum ].name, noSleep: true, size: [ 30, 30, 30 ], pos: [ m[ astarrnum ].position.x, m[ astarrnum ].position.y, m[ astarrnum ].position.z ], type: 'cylinder', world: world } );
                                        bodysNum ++;
                                        meshs.push( m[ astarrnum ] );
                                        V3D.raycastarr.push( m[ astarrnum ] );
                                        var rnum = Math.random();
                                        if ( astarrnum ) { rnum *= -1; }
                                        bodys[ bodysNum - 1].body.linearVelocity.set( rnum, rnum, rnum );
                                        bodys[ bodysNum - 1].body.newRotation.set( rnum, rnum, rnum );
                                        if( mesh.children.length === 1) {
                                            var newmesh = mesh.children[0];
                                            newmesh.position.set( mesh.x, mesh.y, mesh.z);
                                            v3d.scene.add( newmesh );
                                            v3d.scene.remove( mesh )
                                            meshs[i] = newmesh;
                                            body.name = mesh.name;
                                            V3D.asteroids.add( meshs[i] );
                                        }
                                    }

                                }
                                if ( m === 0 ){

                                    bodys.splice(i,1);
                                    meshs.splice(i,1);
                                    mesh.geometry.dispose();
                                    mesh.material.dispose();
                                    V3D.asteroids.remove( mesh );
                                    for (var num = 0; num < V3D.raycastarr.length; num++) {
                                        if ( V3D.raycastarr[num].name == mesh.name ) {
                                            V3D.raycastarr.splice(num, 1);
                                        }
                                    }
                                    bodysNum -= 1;
                                    world.removeRigidBody(body.body);
                                    var a123 = planetex.create();
                                    a123.position.copy( mesh.position);
                                    a123.name = 'pex';
                                    a123.userData.timecreated = worldcount;
                                    v3d.scene.add( a123 );
                                    planetexarr.push( a123 );
                                    var gs = v3d.scene.children[V3D.mesharrpos.gs].children[0].clone();
                                    gs.position.copy( mesh.position );
                                    gs.visible = true;
                                    gs.userData.timealive = 0;
                                    v3d.scene.children[V3D.mesharrpos.gs].add(gs);
                                }

                            }
                            if( !v3d.boxworld.containsPoint( mesh.position ) ) {
                                var bpos = body.body.position;
                                bpos.multiplyScalar( -1 );
                                var point = [ 'x', 'y', 'z' ];
                                var pointnum = 3;
                                while( pointnum --) {
                                    
                                    if( bpos[ point[ pointnum ] ] > 150 || bpos[ point[ pointnum ] ] < -150 ) {
                                        bpos[ point[ pointnum ] ] < 0 ? bpos[ point[ pointnum ] ] = -149 : bpos[ point[ pointnum ] ] = 149 ;
                                    }

                                }

                                mesh.position.copy( bpos ).multiplyScalar( 100 );
                                console.log('outside world');
                            }

                       }




                        if( mesh.name == 'phaser' || mesh.name == 'dphaser' ) {

                            if( mesh.userData.timealive ){
                                if( worldcount - mesh.userData.timealive > 0.006 && mesh.name == 'dphaser' ){
                                    btd.push(bodys[i].body.shapes.id);
                                }
                                if( worldcount - mesh.userData.timealive > 0.000615 && mesh.name == 'phaser' ){
                                    btd.push(bodys[i].body.shapes.id);
                                }
                            }
                            else {
                                mesh.userData.timealive = worldcount;
                            }
                        }
                        // after lead drone is respawned need to wait befor it can be destroyed again
                        if ( mesh.userData.tbd < 0 ) {
                            mesh.userData.tbd += 1;
                        }
                        if(!body.getSleep()){ // if body didn't sleep
                            // apply rigidbody position and rotation to mesh
                            mesh.position.copy(body.getPosition());
                            mesh.quaternion.copy(body.getQuaternion());

                            if(body.name == 'shp1'){

                                containerMeshPrev.set(containerMesh.position.x,containerMesh.position.y, containerMesh.position.z);
                                containerMesh.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
                               var tmpPosX = (containerMesh.position.x - containerMeshPrev.x);
                               var tmpPosY = (containerMesh.position.y - containerMeshPrev.y);
                               var tmpPosZ = (containerMesh.position.z - containerMeshPrev.z); 



                                v3d.camera.position.x += tmpPosX;
                                v3d.camera.position.y += tmpPosY; 
                                v3d.camera.position.z += tmpPosZ;
                            }


                        } 

                        if( dronelaunch >= dronelaunchTime) {
                            var newld = 1;
                            while ( newld ){
                                if( bodys[newld].name == "drone" && !bodys[newld].ld && !bodys[newld].nrtm ) {
                                    bodys[newld].ld = 1;
                                    bodys[newld].nrtm = 1;
                                    newld = 0;
                                    dronelaunch = 0;
                                }
                                if ( newld == bodys.length - 1 ) {
                                    newld = 0;
                                    dronelaunch = -1;
                                }
                                if ( newld > 0 && newld < bodys.length ) {
                                    newld +=1;
                                }
                            }
                        }

                        if ( btd.indexOf(body.body.shapes.id) != -1 || mesh.userData.tbd == 1 ) {
                            if ( mesh.userData.tbd ) { 
                                v3d.playDroneEx();
                            }
                            if( body.ld ) {
                                var ms = {pos: []};
                                if ( body.ms == 'ms1' ) {
                                    ms.pos = [ v3d.ms1pos.x, v3d.ms1pos.y, v3d.ms1pos.z ];
                                }
                                if ( body.ms == 'ms2' ) {
                                   ms.pos = [ v3d.ms2pos.x, v3d.ms2pos.y, v3d.ms2pos.z ];
                                }
                                self.loadExdrone( mesh );
                                var pos = self.dronePos(ms);
                                body.body.position.set(pos[0]/100,pos[1]/100,pos[2]/100); 
                                mesh.userData.tbd = -2;
                            }
                            else {
                                bodys.splice(i,1);
                                meshs.splice(i,1);
                                var g = mesh.geometry;
                                var m = mesh.material;
                                g.dispose();
                                if( typeof(m.dispose) === 'undefined' ){                 
                                        self.loadExdrone( mesh );
                                        m.materials[0].dispose();
                                        m.materials[1].dispose();
                                        v3d.scene.children[v3d.dronenum].remove(mesh);

                                        numofdrone --;
                                        bodysNum --;

                                    }
                                else {
                                    m.dispose();
                                    if(mesh.name == 'phaser'){
                                         v3d.scene.children[V3D.mesharrpos.phasers].remove(mesh);
                                    }
                                    if(mesh.name = 'dphaser'){
                                        v3d.scene.children[V3D.mesharrpos.dphasers].remove(mesh);
                                        bodysNum --;
                                        meshNum --;
                                    }
                         
                                }
                                world.removeRigidBody(body.body);
                            }
                        
                        }
                        if(worldcount - mesh.userData.color > 0.0005 && worldcount - mesh.userData.color < 0.001 ){
                                mesh.children[0].material.color.setRGB(0.64,0.64,0.64);
                                mesh.userData.color = 0;
                        }
                        if(mesh.name == 'ms1' || mesh.name == 'ms2') {

                            if ( (x982y === 3 || x982y === 6) && mesh.name == 'ms1' ){ 
                                if ( body.body.position.x > 50 ) {
                                       msrotpct = -0.05;
                                       grad = -0.1;

                                   }
                                   if ( body.body.position.x < -50 ) {
                                        msrotpct = 0.05;
                                        grad = -0.1;
                                   }
                                    ms1prev.copy( body.body.position );
                                    body.body.position.x += msrotpct;
                                    body.body.position.y = 0;
                                    body.body.position.z = (grad * Math.pow( body.body.position.x, 2 ) + 50) /2;
                                    var q = v3d.msla(body.body);
                                    body.body.setQuaternion(q);
                                    var p = 4;
                                    var dist = v3d.tvec();
                                    ms1len = dist.subVectors(v3d.planetpos, v3d.scene.children[v3d.ms1arrpos].position ).length();
                                    ms1len -= halfdiamplanet; 
                                    ms1diff.subVectors( ms1prev, body.body.position );
                                    v3d.ms1pos.copy( mesh.position );


                                while( p-- ) {
                                    if ( V3D.ms1phaser.children[p] ) {            
                                        if( V3D.ms1phaser.children[p].scale.z * 20 < ms1len){
                                            V3D.ms1phaser.children[p].scale.z += 0.5;
                                            V3D.ms1phaser.children[p].position.z += 5;
                                        }
                                        else {
                                            v3d.scene.children[V3D.mesharrpos.planetGlow].material.visible = true;
                                        }
                                        if( V3D.ms1phaser.children[p].scale.z * 20 > ms1len){
                                            V3D.ms1phaser.children[p].scale.z -= 0.5;
                                            V3D.ms1phaser.children[p].position.z -= 5;
                                        }
                                    }

                                }
                            }
                            

                            if ( body.name == 'ms1' ) {
                                if( mesh.userData.msname != 'ms1_4'){
                                    mapel = mapel1;
                                    if(v3d.ms1y.y){
                                        mesh.children[0].material.color.setRGB(255,255,0);
                                        mesh.userData.color = worldcount;
                                        v3d.ms1y.y = 0;
                                        if(v3d.ms1y.t == pdown && V3D.ms1_1arrpos !== 99){
                                           meshs[i] = v3d.swapms(mesh);
                                        }
                                    }
                                }
                            } 
                            else {
                                if( mesh.userData.msname != 'ms2_4' ){
                                      mapel = mapel2;
                                    if(v3d.ms2y.y){
                                        mesh.children[0].material.color.setRGB(255,255,0);
                                        mesh.userData.color = worldcount;
                                        v3d.ms2y.y = 0;
                                        if(v3d.ms2y.t == pdown && V3D.ms2_1arrpos !== 99){
                                            meshs[i] = v3d.swapms(mesh, x982y);
                                        }
                                    }
                                }
                            }

                            mapcm.set(containerMesh.position.x, containerMesh.position.y, containerMesh.position.z);
                            mapms.set(mesh.position.x,mesh.position.y,mesh.position.z);
                                var percx = mapms.x - mapcm.x;
                                if(percx < 4000 && percx > -4000) {
                                    percx = ((percx + 4000)/8000) * 100;
                                    mapel.style.left = percx + '%'
                                }
                                 var percy = mapms.y - mapcm.y;
                                if(percy < 4000 && percy > -4000) {
                                    percy = ((percy + 4000)/8000) * 100;
                                    mapel.style.top = percy + '%'
                                  //  gmap.children[2].style.top = percy + '%';
                                }                                
                                var heading1 = v3d.getPlayerDir('forward',containerMesh.position);
                                var heading2 = v3d.tvec();
                                heading2.subVectors(mapms, mapcm).normalize();

                                body.name == 'ms1' ? anglems1 =  Math.acos(heading1.dot(heading2)) : anglems2 =  Math.acos(heading1.dot(heading2)) ;
                               var colorval;
                               if(anglems1 < 0.7 || anglems2 < 0.7) {
                                   gmap.className = 'divGreen';
                               }
                               else {
                                    gmap.className = 'divRed';
                               }

                        }
                        ///// TODO when meteors are added use this funct
                        if(body.name == "meteor") {
                            v3d.rotPlanetoid(body,mesh);
                        }

                    }
                    // change to live
                     //v3d.phaser();
                     ///////////////////////

                    if (endsequence >= 0) {
                        if(keys[ settingsarr[1] ] ){
                            v3d.addForce();
                        }
                        if(keys[ settingsarr[2] ] ){
                            v3d.minusForce();
                        }
                        if(keys[ settingsarr[0] ]){
                            v3d.phaser();
                        }
                        if( !keys[ settingsarr[0] ] ) {
                            v3d.phaseroff();
                        }
                        v3d.updateSightPos();
                    }
                    if ( endsequence < 0 ) {
                        v3d.sight.material.transparent = true;
                        v3d.sight.material.opacity = 0;

                    }
                    // update drones 
                    var db = {body:[],drone:[]};
                    for(var i=0;i<bodys.length;i++){
                        var dbody = bodys[i];
                        var drone = meshs[i];
                        if(dbody.name == 'drone') {
                            if( drone.userData.ld || dbody.ld ) {
                                if ( dbody.ld ) {
                                    drone.userData.ld = 1;
                                }
                                // change to live
                                var dphas = v3d.updateDrones( dbody, drone, dbody.ms );
                                if ( dphas ) {
                                    bodysNum ++;
                                    meshNum ++;
                                }
                            }
                            if ( !drone.userData.ld && !drone.userData.rtm) {
                                pddist.sub(containerMesh.position,meshs[i].position);
                                if(pddist.length() < 4500) {
                                    drone.userData.ld = 1;
                                }
                                else {
                                    dbody.body.linearVelocity.set(0,0,0);
                                    dbody.body.angularVelocity.set(0,0,0);
                                    if( x982y == 3 || x982y == 6 ) {
                                        dbody.body.position.subEqual( ms1diff );
                                    }
                                }
                            }
                        }
                    }
                    // update ms phasers
                    if ( x982y !== 3 ) {
                        var p = 4;
                        while(p--){
                            if ( x982y != 6 ) {
                                if(V3D.ms1phaser.children[p]){
                                    if( V3D.ms1phaser.children[p].scale.z * 20 < ms1len){
                                        V3D.ms1phaser.children[p].scale.z += 0.5;
                                        V3D.ms1phaser.children[p].position.z += 5;
                                    }
                                    else {
                                        v3d.scene.children[V3D.mesharrpos.planetGlow].material.visible = true;
                                    }
                                }
                            }
                            if(V3D.ms2phaser.children[p]){
                                if( V3D.ms2phaser.children[p].scale.z * 20 < ms2len ){
                                    V3D.ms2phaser.children[p].scale.z += 0.5;
                                    V3D.ms2phaser.children[p].position.z += 5; 
                                }
                                else {
                                    v3d.scene.children[V3D.mesharrpos.planetGlow].material.visible = true;
                                }
                            }
                        }
                    }

                }
            },

            threejsrender: function(){

                v3d.render();
                v3d.controls.update();
                requestAnimationFrame( self.threejsrender );

            },

            populate: function(data) {

                /////////////*********************////////////////
                /////////////*********************///////////////
                //////    if you update size here   /////////////
                //////     You must update size     /////////////
                //////      in the geomety          /////////////
                /////////////*********************///////////////
                /////////////*********************///////////////

                var obj;

                //add random drones
                var x, y, z, w, h, d, t;
                
                    x = 0;
                    z = 0;
                    y = 0;
                    w = h = d = 30 ;

                var spheres = [];
                var ms = [];
                numofdrone = 0;
                if(startlevel) {
                    // spheres = [{ type: 'sphere', size: [shp1r, shp1r, shp1r], pos:[0,0,0], move: true, noSleep: true, world: world, color: 0xffffff , wireframe: 'false', name:"shp1", transparent: 'true', opacity: 0},
                               // { type: 'sphere', size:[8, 8, 8], pos:[0,0,0], move: true, world: world, color: '#ff0000', wireframe: 'false',  name: 'containerMesh', transparent: 'false', opacity: 1, image:'cpv/cpv.obj', mtl:'cpv/cpv.mtl'}];
                            spheres = [{ type: 'sphere', size: [shp1r, shp1r, shp1r], pos:[0,0,0], move: true, noSleep: true, world: world, color: 0xffffff , wireframe: 'false', name:"shp1", transparent: 'true', opacity: 0, image:'cpv/cpv.obj', mtl:'cpv/cpv.mtl'},
                                { type: 'sphere', size:[8, 8, 8], pos:[0,0,0], move: true, world: world, color: '#ff0000', wireframe: 'false',  name: 'containerMesh', transparent: 'false', opacity: 1, image: 0  }];

                    if(!V3D.bincam) {
                        spheres[0].image = 0;
                        spheres[0].mtl = 0;
                    }

                   // add the sight
                   v3d.addLine();
                   // add the planet glow
                   v3d.addPlane( 'planetGlow' );

                }

                if( !startlevel && V3D.bincam ) {
                    V3D.startRender += 1;
                }
                // ms is only new before they are add to the global ms list
                var i = 0;
                while ( msTotal_list[i] ) {
                    if ( data[ msTotal_list[i] ]) {
                        data[ msTotal_list[i] ].new = 0;
                    }
                    i ++;
                }
                this.levelobj = data;

                numofast = this.levelobj.numofast;
                pex_t = this.levelobj.pex_t;

                pdown = this.levelobj.dow;
                v3d.pglowt = this.levelobj.pglowt;
                for( obj in  this.levelobj){
                    if( obj.charAt(0) == 'p' && obj != 'pglowt' && obj != 'pex_t' ) {
                        if(obj == 'planet1'){
                           halfdiamplanet = this.levelobj[obj].size[0]/2;
                           var pos = this.levelobj[obj].pos;
                           v3d.planetpos.set( pos[0], pos[1], pos[2] );
                        }
                        if ( this.levelobj[obj] !== 0 ) {
                            spheres.push(this.levelobj[obj]);
                        }
                    }
                    if(obj.charAt(0) == 'm'){
                        if ( this.levelobj[obj] !== 0 ) {
                            ms.push(this.levelobj[obj]);
                        }
                       // this.levelobj[obj].new = 0;
                    }
                    if(obj == 'drone') {
                        numofdrone= this.levelobj[obj];
                        totaldrones = this.levelobj[obj];
                    }
                }
                    

                // remove sphere planets for next level
                var i = v3d.scene.children[V3D.mesharrpos.pl].children.length;
                while(i--){
                    if(planetlist.indexOf( v3d.scene.children[V3D.mesharrpos.pl].children[i].name ) != -1) {
                        v3d.scene.children[V3D.mesharrpos.pl].children[i].material.visible = false;
                        // v3d.scene.children[V3D.mesharrpos.pl].children[i].material.transparent = true;
                        // v3d.scene.children[V3D.mesharrpos.pl].children[i].material.opacity = 0;
                    }
                }
                var i = bodys.length;
                while(i--){
                    if(planetlist.indexOf( bodys[i].name ) != -1){
                        world.removeRigidBody(bodys[i].body);
                        bodys.splice(i,1);
                        bodysNum -=1;
                    }
                }
                
                for( var i=0; i<spheres.length; i++) {
                    if(spheres[i].name != 'containerMesh'){
                        if( spheres[i].class == 'planet' && spheres[i].name.match('1') ){

                            v3d.scene.children[V3D.mesharrpos.planetGlow].position.set( spheres[i].pos[0], spheres[i].pos[1], spheres[i].pos[2] );
                            v3d.scene.children[ V3D.mesharrpos.planetGlow ].material.uniforms.glowFloat.value = this.levelobj.pglowt;
                            planetexname = spheres[i].name;

                        }
                        spheres[i].world = world;
                        bodys[bodysNum] = new OIMO.Body(spheres[i]);
                        if( planetlist.indexOf( spheres[i].name ) != -1 ){
                            var pos = planetlist.indexOf( spheres[i].name ); 
                            var planet = v3d.scene.children[V3D.mesharrpos.pl].children[pos];
                            // planet.material.transparent = false;
                            // planet.material.opacity = 1;
                            planet.material.visible = true;
                            planet.position.set( spheres[i].pos[0], spheres[i].pos[1], spheres[i].pos[2] );
                            if( planet.material.type == 'RawShaderMaterial') {
                                planet.material.uniforms.colvar1.value = Math.random();
                                planet.material.uniforms.colvar2.value = Math.random();
                                planet.material.needsUpdate = true;
                            }

                        }
                        if ( planetlist.indexOf( spheres[i].name ) == -1) {
                            v3d.addSphere(spheres[i]);
                            if( spheres[i].name != 'shp1'){
                                planetlist.push( spheres[i].name );
                            }
                        }
                        if( bodys[bodysNum].name == 'shp1' ){
                            // change to live
                            if ( startlevel ) { bodys[ bodysNum ].r1 = 15; } 
                            v3d.setBodys(bodys[bodysNum]);
                        }
                        bodysNum += 1;
                    }
                    if(spheres[i].name == 'containerMesh'){
                      v3d.addSphere(spheres[i]);
                    }
                }

                var k = ms.length;
                mslist = [];
                while(k--){
                    mslist.push(ms[k].name);
                    if ( msTotal_list.indexOf(ms[k].name) === -1 ) {
                        msTotal_list.push( ms[k].name);
                    }
                }
                for( var i=0; i<msTotal_list.length;i++){
                    if( ms[i] != undefined && ms[i].new ) {
                        v3d.addBox(ms[i]);
                        v3d.addBox({ "type": "box",
                                     "pos": ms[i].pos,
                                     "world": "world",
                                     "name": ms[i].name+"_1",
                                     "msname": ms[i].name+"_1",
                                     "image": "ms/"+ms[i].name+"_1.obj",
                                     "mtl": "ms/"+ms[i].name+".mtl"});

                        ms[i].new = 0;


                        var msphaser = {type: 'cylinder', name: 'ms'+(i+1)+'phaser', color: 0x0099ff}
                        v3d.addCylinder(msphaser);
                        var mapel;
                        ms[i].msname == 'ms1' ? mapel = mapel1 : mapel = mapel2;
                        ms[i].pos[0] > 0 ? mapel.style.left = '100%' : mapel.style.left = '0';
                    }
                    else {
                        var j = v3d.scene.children.length;
                        while(j--){
                             if( v3d.scene.children[j].name.substr(0,3) == msTotal_list[i] ){
                                if ( v3d.scene.children[j].userData.msname == msTotal_list[i] ) {
                                    if(  mslist.indexOf( v3d.scene.children[j].userData.msname ) != -1){
                                        v3d.scene.children[j].children[0].material.transparent = false;
                                        v3d.scene.children[j].children[0].material.opacity = 1;
                                        v3d.scene.children[j].position.set(ms[i].pos[0],ms[i].pos[1],ms[i].pos[2]);
                                        v3d.scene.children[j].name = v3d.scene.children[j].userData.msname;
                                        V3D.startRender += 1;
                                    }
                                    else {
                                        v3d.scene.children[j].children[0].material.transparent = true;
                                        v3d.scene.children[j].children[0].material.opacity = 0;
                                        v3d.scene.children[j].name = v3d.scene.children[j].userData.msname;
                                    }
                                    if( v3d.scene.children[j].userData.msname == 'ms1' ){
                                        var lg = V3D.ms1phaser.children;
                                        var msphaser = V3D.ms1phaser;
                                    }
                                    if( v3d.scene.children[j].userData.msname == 'ms2' ){
                                        var lg = V3D.ms2phaser.children;
                                        var msphaser = V3D.ms2phaser;
                                    }
                                    var laser = lg.length;
                                    while(laser--){
                                        var g = lg[laser].geometry;
                                        var m = lg[laser].material;
                                        g.dispose();
                                        m.dispose();
                                        msphaser.remove(lg[laser]);
                                    }
                                    
                                    if(  mslist.indexOf( v3d.scene.children[j].userData.msname ) != -1){
                                        v3d.scene.children[j].children[0].remove( msphaser )
                                        var msname = v3d.scene.children[j].userData.msname ;
                                        var msphaser = {type: 'cylinder', name: msname+'phaser', color: 0x0099ff}
                                        v3d.addCylinder(msphaser);
                                    }
                                }
                                else {
                                    v3d.scene.children[j].children[0].material.transparent = true;
                                    v3d.scene.children[j].children[0].material.opacity = 0;
                                    if ( ms[i] ) {
                                        v3d.scene.children[j].position.set(ms[i].pos[0],ms[i].pos[1],ms[i].pos[2]);
                                    }
                                    v3d.scene.children[j].name = v3d.scene.children[j].userData.msname;
                                }
                            }
                        }
                       // var msbb2 = { type: 'box', size:[700,300,700], pos:[0,0,-2000], move: true, world: world, color: 0xff0000, wireframe: 'false',  name: 'mothershipbb2', transparent: 'false', opacity: 0};
                       // v3d.addBox(msbb2);
                    }               
                }
                for(var numms=0; numms < ms.length; numms++ ){
                    ms[numms].world = world;

                    ms[numms].noSleep = true;

                    bodys[bodysNum] = new OIMO.Body(ms[numms]);
                    bodys[bodysNum].name = ms[numms].msname;
                    bodysNum += 1;
                }

                // create asteroids
                var count = 0;
                var dir = [ v3d.planetpos, v3d.tvec( ms[ 0 ].pos[0], ms[ 0 ].pos[ 1 ], ms[ 0 ].pos[ 2 ] ), v3d.tvec(0,0,0) ]; 
                var setastnum = [ 9, 7 , 5 , 3 , 2];
                for (var j = 0; j < numofast; j++) {
                    var ast = asteroid.create( setastnum[ count ] );
                    ast.name = 'astgroup' + j;
                    var x = this.randMinMax(-15000,15000);
                    var y = this.randMinMax(-15000,15000);
                    var z = this.randMinMax(-15000,15000);
                    ast.position.set( x, y, z );
                    v3d.scene.add( ast );
                    bodys[ bodysNum ] = new OIMO.Body( { move: true, name: 'astgroup'+j, noSleep: true, size: [ 70, 50 ], pos: [ x, y, z ], type: 'cylinder', world: world, density: 1000 } );
                    bodysNum ++;
                    var astdir = v3d.tvec();
                    var rot = Math.random();
                    astdir.subVectors( ast.position, dir[ this.randMinMax( 0, 2 ) ] ).normalize();
                    var magnitude = this.randMinMax( -20, -30);
                    astdir.multiplyScalar(  magnitude  );
                    bodys[ bodysNum -1 ].body.linearVelocity.addTime( astdir, world.timeStep);
                    bodys[ bodysNum -1 ].body.angularVelocity.set( Math.random(), Math.random(), Math.random(), Math.random());
                    if (  V3D.asteroids.children.length !== 0 && V3D.asteroids.children.length % 10 == 0 ){
                        count++;
                    }
                    V3D.asteroids.add( ast );
                }
                if ( startlevel ) { v3d.scene.add( V3D.asteroids ); }
                V3D.raycastarr.push( V3D.asteroids );


               var cylArr = [];
               var msnum = 0;
               var numofms = ms.length;
               var dpm = 0;
               var x,y,z =  0;

                if( x982y === 1 ) { var numofld = 8 }
                else {
                    var numofld = Math.round(numofdrone / (numofms * 4));
                }

                if( numofdroneleft != 0){
                    var dm =  v3d.scene.children[v3d.dronenum].children.length -1;
                    while( dm > numofdrone) {
                        var g = v3d.scene.children[v3d.dronenum].children[dm].geometry;
                        var m = v3d.scene.children[v3d.dronenum].children[dm].material;
                        v3d.scene.children[v3d.dronenum].remove( v3d.scene.children[v3d.dronenum].children[dm] );
                        dm -= 1;  
                    }
                    for( var i = 0; i < v3d.scene.children[v3d.dronenum].children.length; i++){
                        v3d.scene.children[v3d.dronenum].children[i].userData.ld = 0;
                    }
                    var i = bodys.length -1;
                    //numofdroneleft ++;
                    while(i-- && numofdroneleft > numofdrone) {
                        if(bodys[i].name == 'drone') {
                            bodys.splice(i,1);
                            bodysNum --;
                            numofdroneleft --;
                        }   
                    }
                    numofdrone -= numofdroneleft;
                    var i = bodys.length;
                    while(i--){                    
                        if( bodys[i].name == 'drone' ) {
                             var pos = this.dronePos(ms[0]);
                             bodys[i].body.position.set(pos[0]/100,pos[1]/100,pos[2]/100);


                            if ( !numofld ) {
                                bodys[i].ld = 0;
                                bodys[i].nrtm = 0;
                             }
                             if ( bodys[i].ld && bodys[i].nrtm && numofld != 0 ) {
                                numofld --;
                             }
                             bodys.push(bodys.splice(i,1)[0]);


                        }
                    }

               }
               for(var i=0;i<numofdrone;i++){

                    if(dpm < numofdrone/numofms){


                        var pos = this.dronePos(ms[msnum]);
                           // x += 0;
                           // y = 0;
                           //    z = -3500;

                        var droneobj= { type:'cylinder', size:[w,h,d], pos: pos, move: true, world:world, noSleep: true, color:'#66ff33', wireframe: 'false', name: 'drone', transparent: 'false', opacity: 1, image:'Free_Droid/bake.obj'};
                        if(i==0 && startlevel){ 
                            droneobj.pos = [10000,10000,10000];
                        }
                        else {
                            bodys[bodysNum] = new OIMO.Body(droneobj);
                            //bodys[bodysNum].drota = 0;
                            bodys[bodysNum].ms = ms[msnum].msname;
                            // nrtm : never return to ms
                            if ( numofld ) {
                                bodys[bodysNum].ld = 1;
                                bodys[bodysNum].nrtm = 1;
                                numofld -= 1;
                            }
                            if ( !numofld ) {
                                bodys[bodysNum].ld = 0;
                                bodys[bodysNum].nrtm = 0;
                            }

                            bodysNum += 1;
                            dpm +=1;
                        }
                        cylArr.push(droneobj);

                    }
                    else {
                        msnum +=1;
                        dpm = 0;
                        numofld = Math.round(numofdrone / (numofms * 4));
                        var pos = this.dronePos(ms[msnum]);
                        var droneobj= { type:'cylinder', size:[w,h,d], pos: pos, move: true, world:world, noSleep: true, color:'#66ff33', wireframe: 'false', name: 'drone', transparent: 'false', opacity: 1, image:'Free_Droid/bake.obj'};
                        bodys[bodysNum] = new OIMO.Body(droneobj);
                       // bodys[bodysNum].drota = 0;
                        bodys[bodysNum].ms = ms[msnum].msname;
                        bodysNum += 1;
                        cylArr.push(droneobj);
                    }
               }
               if(startlevel){
                   v3d.addCylinder(cylArr);
                   var exdrones = [{ type: 'cylinder', move: 'true', world: world, name: 'exdrone1', transparent: 'false', opacity: 1, image:'ani/exdrone1.obj',mtl:'images/ani/BaseMaterial_normal.png'},
                              { type: 'cylinder', move: 'true', world: world, name: 'exdrone2', transparent: 'false', opacity: 1, image:'ani/exdrone2.obj',mtl:'images/ani/BaseMaterial_normal.png'},
                              { type: 'cylinder', move: 'true', world: world, name: 'exdrone3', transparent: 'false', opacity: 1, image:'ani/exdrone3.obj',mtl:'images/ani/BaseMaterial_normal.png'}];
                   for(var i=0;i<exdrones.length;i++){
                      v3d.addCylinder(exdrones[i]);
                   }
                   // minus one drone so a drone is left to clone fromm
                   numofdrone -= 1;



                    // var phaser = { type: 'sphere', move: 'true', world: world, name:'phasers', transparent: 'false', opacity: 1, image:'phasers/phaser.obj', texture:'images/phasers/fb.jpg'};
                    // v3d.addSphere(phaser);



                    var dphaser = { type: 'sphere', move: 'true', world: world, name:'dphasers', transparent: 'false', opacity: 1, image:'phasers/dphaser.obj', texture:'images/phasers/bluefire.png'};
                    v3d.addSphere(dphaser);


                    if(V3D.bincam){
                        v3d.addPlane( 'laser' );
                    }
                }
                else {
                    V3D.startRender += 6;
                    // add next level drones to scene drones
                    for(var i=0;i < v3d.scene.children.length;i++){
                        if( v3d.scene.children[i].name == 'drones'){
                            var j = cylArr.length;
                            while(j--){
                                var tmpDrone = v3d.scene.children[i].children[0].clone();
                                tmpDrone.position.set(cylArr[j].pos[0], cylArr[j].pos[1], cylArr[j].pos[2]);
                                v3d.scene.children[i].add(tmpDrone);
                            }
                        }
                    }
                }
                if(numofdroneleft) {
                    numofdrone += numofdroneleft;
                }              

                // update V3D.startRender above if adding new objects
                numobj =  ms.length + 7;
                // numobj =  ms.length + 5;
                if(!V3D.bincam){ numobj -= 1};
                if(startlevel) {
                    this.render();
                }
            },
            dronePos: function(ms){

                var x = this.randMinMax(-1000,1000);
                var y = this.randMinMax(-1000,1000);
                var z = this.randMinMax(-1000,1000);

                x += ms.pos[0];
                y += ms.pos[1];
                z += ms.pos[2]; 
                return [x,y,z];
            },
            loadExdrone: function( drone ) {

                V3D.exdrone1.userData.active = true;
                var exdrone = V3D.exdrone1.children[0].clone();
                exdrone.position.set( drone.position.x, drone.position.y, drone.position.z);
                exdrone.quaternion.set( drone.quaternion.x, drone.quaternion.y, drone.quaternion.z, drone.quaternion.w);
                exdrone.visible = true;
                V3D.exdrone1.children.push(exdrone);

            },
            getObj: function(el) {

                   switch (el) {
                    case 'bodys':
                        return bodys;
                        break;
                    case 'containerMesh': 
                        return containerMesh;
                        break;
                    case 'shp1r': 
                        return shp1r;
                        break;
                    case 'v3d':
                        return v3d;
                        break;
                    case 'world':
                        return world;
                        break;
                    case 'keys':
                        return keys;
                        break;
                    case 'x982y':
                        return x982y;
                        break;
                    case 'endsequence':
                        return endsequence;
                        break;
                }

            },
            randMinMax: function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            isSleeping: function(name) {
                for(var i = 0; i<bodys.length;i++){
                    if(bodys[i].name == name){
                        return bodys[i].getSleep();
                    }
                }
            },
            gspause: function(val) {
                if(val != undefined){
                    pause = val;
                }
                else {
                    return pause;
                }
            },
            removegeomat: function( obj ) {

                if( obj.children.length !== 0 ) {
                    var meshnum = obj.children.length;
                    while( meshnum --) {
                        this.removegeomat(obj.children[ meshnum ]);
                         obj.remove( obj.children[ meshnum ] );
                    }
                }
                else {
                    if( obj.type == 'Mesh'){
                        obj.geometry.dispose();
                        obj.material.dispose();
                    }
                }
                
            },
            levelGen: function( restart ) {
                restart ? x982y = 1 : x982y += 1 ;
                V3D.x982y = x982y;
                for(var i = 0; i < v3d.scene.children.length; i++){
                    if( v3d.scene.children[i].userData.msname ){
                        if( v3d.scene.children[i].userData.msname == 'ms1_4'){
                            v3d.scene.children[i].children[0].material.color.setRGB(0,0,0);
                        }
                        else {
                            v3d.scene.children[i].children[0].material.color.setRGB(0.64,0.64,0.64);
                        }
                    }
                } 
                x982y === 3 || x982y === 6 ? v3d.eg.material.visible = true : v3d.eg.material.visible = false;
                v3d.scene.children[ V3D.mesharrpos.planetGlow ].material.visible = false;
                v3d.scene.children[ V3D.mesharrpos.planetGlow ].material.uniforms.glowFloat.value = this.levelobj.pglowt;
                // if(x982y === 2){
                //     x982y = 3;
                // }
                numofdroneleft = 0;
                var i = bodys.length;
                while(i--){
                    if( bodys[i].name == 'drone') {
                        numofdroneleft +=1;
                    }
                    if( bodys[i].name == 'dphaser' || bodys[i].name.match('ast') || bodys[i].name.match('ms')   ) {
                         world.removeRigidBody(bodys[i].body);
                         bodys.splice(i,1);
                         bodysNum -= 1;
                    }
                    // if( bodys[i] ) {
                    //     if( bodys[i].name.match('ms') ){
                    //         world.removeRigidBody(bodys[i].body);
                    //         bodys.splice(i,1);
                    //         bodysNum -= 1;
                    //     }
                    // }
                }
                this.removegeomat( V3D.asteroids );
                while(world.contacts!==null){
                    world.removeContact(world.contacts);
                }
                var i = V3D.dphasers.children.length-1;
                while(i>0){
                    var m = V3D.dphasers.children[i].material;
                    var g = V3D.dphasers.children[i].geometry;
                    g.dispose();
                    m.dispose();
                    V3D.dphasers.remove(V3D.dphasers.children[i]);
                    i--;

                }

                bodys[0].body.position.set(0,0,0);
                // change to live
                if ( restart ) {
                    bodys[0].r1 = 15000000000; 
                }
                startlevel = 0;
                v3d.ms1y.t = 0;
                v3d.ms2y.t = 0;
                v3d.ms1y.y = 0;
                v3d.ms2y.y = 0;
                dronelaunch = 0;
                V3D.startRender = 0;
                V3D.raycastarr = [];
                V3D.ms1_1arrpos = 0;
                V3D.ms2_1arrpos = 0;
                bodysNum = bodys.length;
                meshs = [];
                meshNum = 0;
                containerMesh = 0;
                dronelaunchTime -= 10;



                this.lgd(x982y);
                endsequence = 100;
                if ( restart ) {
                    document.getElementById('respawnImg').style.display = 'none';
                    v3d.sight.material.transparent = false;
                    v3d.sight.material.opacity = 1;
                    dronelaunchTime = 60;
                }
                else {
                    document.getElementById('level'+x982y+'Img').style.display = 'none';
                }
            },
            lgd: function(l) {

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                      self.populate( JSON.parse(this.responseText) );
                    }
                }
                xhttp.open("POST", url, true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send( 'l='+l );
            }
        }
    }
});

