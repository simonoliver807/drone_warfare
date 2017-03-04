"use strict";

var oimocode = require('../multiserver/oimo');

module.exports = function () {   


    const OIMO = new oimocode;
    var exmesh = ['sight','hemlight','dirlight','containerMesh','points']
    var pause = 0;


    
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
    // var canvasCentreX = v3d.w/2;
    // var canvasCentreY = v3d.h/2;

    var containerMeshPrev;
    containerMeshPrev = new OIMO.Vec3(0,0,0);

    var pddist = new OIMO.Vec3();

    var perfcont;

    var anibincnt;

    // var mapcm = v3d.tvec(0,0,0);
    // var mapms = v3d.tvec(0,0,0);
    // var mapel1 = document.getElementById('mapms1');
    // var mapel2 = document.getElementById('mapms2');
    // var mapel;
    // var gmap = document.getElementById('gmap');
    var anglems1 = 1;
    var anglems2 = 1;

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

    // change to live
    // 250 for health maybe to high
    var health = 90; 
    
    var dronelaunch = 0;
    var level1imgCnt = 0;
    var pdown;
    var mslist = [];
    var dronelaunchTime = 60;

        return {

            createWorld: function(timestep){

                 // create oimo world contains all rigidBodys and joint.

                world = new OIMO.World( timestep, boardphase, Iterations, noStat );
                world.worldscale(100);
                world.gravity = new OIMO.Vec3(0, 0, 0);
                bodysNum = 0;
                // v3d.addPhaser = function(body, phaser) {
                //     bodys[bodys.length] = new OIMO.Body(body);
                //     meshs[meshs.length] = phaser;
                //     return bodys[bodys.length -1];
                // }
                containerMesh = 0;


                // change to live
               // perfcont = document.getElementById('perf');


                perf = 0;
                anibincnt = 1;
                endsequence = 100;
                self = this;


            },


            render: function(){

                world.step()

            },
            addpl: function() {

                var sphere = [{ type: 'sphere', size: [shp1r, shp1r, shp1r], pos:[ 20,0,-100 ], move: true, noSleep: true, world: world, name: 'player2' }];

                bodys[bodysNum] = new OIMO.Body(sphere[0]);
                bodys[bodysNum].inputs = [];
                bodysNum += 1;
                return bodys[bodysNum -1 ];

            },
            populate: function() {

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
                            spheres = [{ type: 'sphere', size: [shp1r, shp1r, shp1r], pos:[0,0,0], move: true, noSleep: true, world: world, name: 'player1' }];

                }
                var player1 = bodys[bodysNum] = new OIMO.Body(spheres[0]);
                bodys[bodysNum].inputs = [];
                bodysNum += 1;




                return player1;


            }
    }

    //         populate: function(data) {

    //             /////////////*********************////////////////
    //             /////////////*********************///////////////
    //             //////    if you update size here   /////////////
    //             //////     You must update size     /////////////
    //             //////      in the geomety          /////////////
    //             /////////////*********************///////////////
    //             /////////////*********************///////////////

    //             var obj;

    //             //add random drones
    //             var x, y, z, w, h, d, t;
                
    //                 x = 0;
    //                 z = 0;
    //                 y = 0;
    //                 w = h = d = 30 ;

    //             var spheres = [];
    //             var ms = [];
    //             numofdrone = 0;
    //             if(startlevel) {
    //                 // spheres = [{ type: 'sphere', size: [shp1r, shp1r, shp1r], pos:[0,0,0], move: true, noSleep: true, world: world, color: 0xffffff , wireframe: 'false', name:"shp1", transparent: 'true', opacity: 0},
    //                            // { type: 'sphere', size:[8, 8, 8], pos:[0,0,0], move: true, world: world, color: '#ff0000', wireframe: 'false',  name: 'containerMesh', transparent: 'false', opacity: 1, image:'cpv/cpv.obj', mtl:'cpv/cpv.mtl'}];
    //                         spheres = [{ type: 'sphere', size: [shp1r, shp1r, shp1r], pos:[0,0,0], move: true, noSleep: true, world: world, color: 0xffffff , wireframe: 'false', name:"shp1", transparent: 'true', opacity: 0, image:'cpv/cpv.obj', mtl:'cpv/cpv.mtl'},
    //                             { type: 'sphere', size:[8, 8, 8], pos:[0,0,0], move: true, world: world, color: '#ff0000', wireframe: 'false',  name: 'containerMesh', transparent: 'false', opacity: 1, image: 0  }];

    //                 if(!V3D.bincam) {
    //                     spheres[0].image = 0;
    //                     spheres[0].mtl = 0;
    //                 }

    //                // add the sight
    //                v3d.addLine();
    //                // add the planet glow
    //                v3d.addPlane( 'planetGlow' );

    //             }
    //             if( !startlevel && V3D.bincam ) {
    //                 V3D.startRender += 1;
    //             }
    //             // ms is only new before they are add to the global ms list
    //             var i = 0;
    //             while ( msTotal_list[i] ) {
    //                 if ( data[ msTotal_list[i] ]) {
    //                     data[ msTotal_list[i] ].new = 0;
    //                 }
    //                 i ++;
    //             }
    //             this.levelobj = data;



    //             pdown = this.levelobj.dow;
    //             v3d.pglowt = this.levelobj.pglowt;
    //             for( obj in  this.levelobj){
    //                 if( obj.charAt(0) == 'p' && obj != 'pglowt' ){
    //                     if(obj == 'planet1'){
    //                        halfdiamplanet = this.levelobj[obj].size[0]/2;
    //                        var pos = this.levelobj[obj].pos;
    //                        v3d.planetpos.set( pos[0], pos[1], pos[2] );
    //                     }
    //                     spheres.push(this.levelobj[obj]);
    //                 }
    //                 if(obj.charAt(0) == 'm'){
    //                     ms.push(this.levelobj[obj]);
    //                    // this.levelobj[obj].new = 0;
    //                 }
    //                 if(obj == 'drone') {
    //                     numofdrone= this.levelobj[obj];
    //                     totaldrones = this.levelobj[obj];
    //                 }
    //             }
                    

    //             // remove sphere planets for next level
    //             var i = v3d.scene.children[V3D.mesharrpos.pl].children.length;
    //             while(i--){
    //                 if(planetlist.indexOf( v3d.scene.children[V3D.mesharrpos.pl].children[i].name ) != -1) {
    //                     v3d.scene.children[V3D.mesharrpos.pl].children[i].material.visible = false;
    //                     // v3d.scene.children[V3D.mesharrpos.pl].children[i].material.transparent = true;
    //                     // v3d.scene.children[V3D.mesharrpos.pl].children[i].material.opacity = 0;
    //                 }
    //             }
    //             var i = bodys.length;
    //             while(i--){
    //                 if(planetlist.indexOf( bodys[i].name ) != -1){
    //                     world.removeRigidBody(bodys[i].body);
    //                     bodys.splice(i,1);
    //                     bodysNum -=1;
    //                 }
    //             }
                
    //             for( var i=0; i<spheres.length; i++) {
    //                 if(spheres[i].name != 'containerMesh'){
    //                     if( spheres[i].class == 'planet' && spheres[i].name.match('1') ){

    //                         v3d.scene.children[V3D.mesharrpos.planetGlow].position.set( spheres[i].pos[0], spheres[i].pos[1], spheres[i].pos[2] );

    //                     }
    //                     spheres[i].world = world;
    //                     bodys[bodysNum] = new OIMO.Body(spheres[i]);
    //                     if( planetlist.indexOf( spheres[i].name ) != -1 ){
    //                         var pos = planetlist.indexOf( spheres[i].name ); 
    //                         var planet = v3d.scene.children[V3D.mesharrpos.pl].children[pos];
    //                         // planet.material.transparent = false;
    //                         // planet.material.opacity = 1;
    //                         planet.material.visible = true;
    //                         planet.position.set( spheres[i].pos[0], spheres[i].pos[1], spheres[i].pos[2] );

    //                     }
    //                     if ( planetlist.indexOf( spheres[i].name ) == -1) {
    //                         v3d.addSphere(spheres[i]);
    //                         if( spheres[i].name != 'shp1'){
    //                             planetlist.push( spheres[i].name );
    //                         }
    //                     }
    //                     if( bodys[bodysNum].name == 'shp1' ){
    //                         v3d.setBodys(bodys[bodysNum]);
    //                     }
    //                     bodysNum += 1;
    //                 }
    //                 if(spheres[i].name == 'containerMesh'){
    //                   v3d.addSphere(spheres[i]);
    //                 }
    //             }

    //             var k = ms.length;
    //             mslist = [];
    //             while(k--){
    //                 mslist.push(ms[k].name);
    //                 if ( msTotal_list.indexOf(ms[k].name) === -1 ) {
    //                     msTotal_list.push( ms[k].name);
    //                 }
    //             }
    //             for( var i=0; i<msTotal_list.length;i++){
    //                 if( ms[i] != undefined && ms[i].new ) {
    //                     v3d.addBox(ms[i]);
    //                     v3d.addBox({ "type": "box",
    //                                  "pos": ms[i].pos,
    //                                  "world": "world",
    //                                  "name": ms[i].name+"_1",
    //                                  "msname": ms[i].name+"_1",
    //                                  "image": "ms/"+ms[i].name+"_1.obj",
    //                                  "mtl": "ms/"+ms[i].name+".mtl"});

    //                     ms[i].new = 0;


    //                     var msphaser = {type: 'cylinder', name: 'ms'+(i+1)+'phaser', color: 0x0099ff}
    //                     v3d.addCylinder(msphaser);
    //                     var mapel;
    //                     ms[i].msname == 'ms1' ? mapel = mapel1 : mapel = mapel2;
    //                     ms[i].pos[0] > 0 ? mapel.style.left = '100%' : mapel.style.left = '0';
    //                 }
    //                 else {
    //                     var j = v3d.scene.children.length;
    //                     while(j--){
    //                          if( v3d.scene.children[j].name.substr(0,3) == msTotal_list[i] ){
    //                             if ( v3d.scene.children[j].userData.msname == msTotal_list[i] ) {
    //                                 if(  mslist.indexOf( v3d.scene.children[j].userData.msname ) != -1){
    //                                     v3d.scene.children[j].children[0].material.transparent = false;
    //                                     v3d.scene.children[j].children[0].material.opacity = 1;
    //                                     v3d.scene.children[j].position.set(ms[i].pos[0],ms[i].pos[1],ms[i].pos[2]);
    //                                     v3d.scene.children[j].name = v3d.scene.children[j].userData.msname;
    //                                     V3D.startRender += 1;
    //                                 }
    //                                 else {
    //                                     v3d.scene.children[j].children[0].material.transparent = true;
    //                                     v3d.scene.children[j].children[0].material.opacity = 0;
    //                                     v3d.scene.children[j].name = v3d.scene.children[j].userData.msname;
    //                                 }
    //                                 if( v3d.scene.children[j].userData.msname == 'ms1' ){
    //                                     var lg = V3D.ms1phaser.children;
    //                                     var msphaser = V3D.ms1phaser;
    //                                 }
    //                                 if( v3d.scene.children[j].userData.msname == 'ms2' ){
    //                                     var lg = V3D.ms2phaser.children;
    //                                     var msphaser = V3D.ms2phaser;
    //                                 }
    //                                 var laser = lg.length;
    //                                 while(laser--){
    //                                     var g = lg[laser].geometry;
    //                                     var m = lg[laser].material;
    //                                     g.dispose();
    //                                     m.dispose();
    //                                     msphaser.remove(lg[laser]);
    //                                 }
                                    
    //                                 if(  mslist.indexOf( v3d.scene.children[j].userData.msname ) != -1){
    //                                     v3d.scene.children[j].children[0].remove( msphaser )
    //                                     var msname = v3d.scene.children[j].userData.msname ;
    //                                     var msphaser = {type: 'cylinder', name: msname+'phaser', color: 0x0099ff}
    //                                     v3d.addCylinder(msphaser);
    //                                 }
    //                             }
    //                             else {
    //                                 v3d.scene.children[j].children[0].material.transparent = true;
    //                                 v3d.scene.children[j].children[0].material.opacity = 0;
    //                                 if ( ms[i] ) {
    //                                     v3d.scene.children[j].position.set(ms[i].pos[0],ms[i].pos[1],ms[i].pos[2]);
    //                                 }
    //                                 v3d.scene.children[j].name = v3d.scene.children[j].userData.msname;
    //                             }
    //                         }
    //                     }
    //                    // var msbb2 = { type: 'box', size:[700,300,700], pos:[0,0,-2000], move: true, world: world, color: 0xff0000, wireframe: 'false',  name: 'mothershipbb2', transparent: 'false', opacity: 0};
    //                    // v3d.addBox(msbb2);
    //                 }               
    //             }
    //             for(var numms=0; numms < ms.length; numms++ ){
    //                 ms[numms].world = world;
    //                 bodys[bodysNum] = new OIMO.Body(ms[numms]);
    //                 bodys[bodysNum].name = ms[numms].msname;
    //                 bodysNum += 1;
    //             }

    //            var cylArr = [];
    //            var msnum = 0;
    //            var numofms = ms.length;
    //            var dpm = 0;
    //            var x,y,z =  0;

    //             if( x982y === 1 ) { var numofld = 8 }
    //             else {
    //                 var numofld = Math.round(numofdrone / (numofms * 4));
    //             }

    //             if( numofdroneleft != 0){
    //                 var dm =  v3d.scene.children[v3d.dronenum].children.length -1;
    //                 while( dm > numofdrone) {
    //                     var g = v3d.scene.children[v3d.dronenum].children[dm].geometry;
    //                     var m = v3d.scene.children[v3d.dronenum].children[dm].material;
    //                     v3d.scene.children[v3d.dronenum].remove( v3d.scene.children[v3d.dronenum].children[dm] );
    //                     dm -= 1;  
    //                 }
    //                 for( var i = 0; i < v3d.scene.children[v3d.dronenum].children.length; i++){
    //                     v3d.scene.children[v3d.dronenum].children[i].userData.ld = 0;
    //                 }
    //                 var i = bodys.length -1;
    //                 //numofdroneleft ++;
    //                 while(i-- && numofdroneleft > numofdrone) {
    //                     if(bodys[i].name == 'drone') {
    //                         bodys.splice(i,1);
    //                         bodysNum --;
    //                         numofdroneleft --;
    //                     }   
    //                 }
    //                 numofdrone -= numofdroneleft;
    //                 var i = bodys.length;
    //                 while(i--){                    
    //                     if( bodys[i].name == 'drone' ) {
    //                          var pos = this.dronePos(ms[0]);
    //                          bodys[i].body.position.set(pos[0]/100,pos[1]/100,pos[2]/100);


    //                         if ( !numofld ) {
    //                             bodys[i].ld = 0;
    //                             bodys[i].nrtm = 0;
    //                          }
    //                          if ( bodys[i].ld && bodys[i].nrtm && numofld != 0 ) {
    //                             numofld --;
    //                          }
    //                          bodys.push(bodys.splice(i,1)[0]);


    //                     }
    //                 }

    //            }
    //            for(var i=0;i<numofdrone;i++){

    //                 if(dpm < numofdrone/numofms){


    //                     var pos = this.dronePos(ms[msnum]);
    //                        // x += 0;
    //                        // y = 0;
    //                        //    z = -3500;

    //                     var droneobj= { type:'cylinder', size:[w,h,d], pos: pos, move: true, world:world, noSleep: true, color:'#66ff33', wireframe: 'false', name: 'drone', transparent: 'false', opacity: 1, image:'Free_Droid/bake.obj'};
    //                     if(i==0 && startlevel){ 
    //                         droneobj.pos = [10000,10000,10000];
    //                     }
    //                     else {
    //                         bodys[bodysNum] = new OIMO.Body(droneobj);
    //                         bodys[bodysNum].drota = 0;
    //                         bodys[bodysNum].ms = ms[msnum].msname;
    //                         // nrtm : never return to ms
    //                         if ( numofld ) {
    //                             bodys[bodysNum].ld = 1;
    //                             bodys[bodysNum].nrtm = 1;
    //                             numofld -= 1;
    //                         }
    //                         if ( !numofld ) {
    //                             bodys[bodysNum].ld = 0;
    //                             bodys[bodysNum].nrtm = 0;
    //                         }

    //                         bodysNum += 1;
    //                         dpm +=1;
    //                     }
    //                     cylArr.push(droneobj);

    //                 }
    //                 else {
    //                     msnum +=1;
    //                     dpm = 0;
    //                     numofld = Math.round(numofdrone / (numofms * 4));
    //                     var pos = this.dronePos(ms[msnum]);
    //                     var droneobj= { type:'cylinder', size:[w,h,d], pos: pos, move: true, world:world, noSleep: true, color:'#66ff33', wireframe: 'false', name: 'drone', transparent: 'false', opacity: 1, image:'Free_Droid/bake.obj'};
    //                     bodys[bodysNum] = new OIMO.Body(droneobj);
    //                     bodys[bodysNum].drota = 0;
    //                     bodys[bodysNum].ms = ms[msnum].msname;
    //                     bodysNum += 1;
    //                     cylArr.push(droneobj);
    //                 }
    //            }
    //            if(startlevel){
    //                v3d.addCylinder(cylArr);
    //                var exdrones = [{ type: 'cylinder', move: 'true', world: world, name: 'exdrone1', transparent: 'false', opacity: 1, image:'ani/exdrone1.obj',mtl:'images/ani/BaseMaterial_normal.png'},
    //                           { type: 'cylinder', move: 'true', world: world, name: 'exdrone2', transparent: 'false', opacity: 1, image:'ani/exdrone2.obj',mtl:'images/ani/BaseMaterial_normal.png'},
    //                           { type: 'cylinder', move: 'true', world: world, name: 'exdrone3', transparent: 'false', opacity: 1, image:'ani/exdrone3.obj',mtl:'images/ani/BaseMaterial_normal.png'}];
    //                for(var i=0;i<exdrones.length;i++){
    //                   v3d.addCylinder(exdrones[i]);
    //                }
    //                // minus one drone so a drone is left to clone fromm
    //                numofdrone -= 1;



    //                 // var phaser = { type: 'sphere', move: 'true', world: world, name:'phasers', transparent: 'false', opacity: 1, image:'phasers/phaser.obj', texture:'images/phasers/fb.jpg'};
    //                 // v3d.addSphere(phaser);



    //                 var dphaser = { type: 'sphere', move: 'true', world: world, name:'dphasers', transparent: 'false', opacity: 1, image:'phasers/dphaser.obj', texture:'images/phasers/bluefire.png'};
    //                 v3d.addSphere(dphaser);


    //                 if(V3D.bincam){
    //                     v3d.addPlane( 'laser' );
    //                 }
    //             }
    //             else {
    //                 V3D.startRender += 5;
    //                 // add next level drones to scene drones
    //                 for(var i=0;i < v3d.scene.children.length;i++){
    //                     if( v3d.scene.children[i].name == 'drones'){
    //                         var j = cylArr.length;
    //                         while(j--){
    //                             var tmpDrone = v3d.scene.children[i].children[0].clone();
    //                             tmpDrone.position.set(cylArr[j].pos[0], cylArr[j].pos[1], cylArr[j].pos[2]);
    //                             v3d.scene.children[i].add(tmpDrone);
    //                         }
    //                     }
    //                 }
    //             }
    //             if(numofdroneleft) {
    //                 numofdrone += numofdroneleft;
    //             }
    //             numobj =  ms.length + 6;
    //             // numobj =  ms.length + 5;
    //             if(!V3D.bincam){ numobj -= 1};
    //             if(startlevel) {
    //                 this.render();
    //             }
    //         },
    //         dronePos: function(ms){

    //             var x = this.randMinMax(-1000,1000);
    //             var y = this.randMinMax(-1000,1000);
    //             var z = this.randMinMax(-1000,1000);

    //             x += ms.pos[0];
    //             y += ms.pos[1];
    //             z += ms.pos[2]; 
    //             return [x,y,z];
    //         },
    //         loadExdrone: function( drone ) {

    //             V3D.exdrone1.userData.active = true;
    //             var exdrone = V3D.exdrone1.children[0].clone();
    //             exdrone.position.set( drone.position.x, drone.position.y, drone.position.z);
    //             exdrone.quaternion.set( drone.quaternion.x, drone.quaternion.y, drone.quaternion.z, drone.quaternion.w);
    //             exdrone.visible = true;
    //             V3D.exdrone1.children.push(exdrone);

    //         },
    //         getObj: function(el) {

    //                switch (el) {
    //                 case 'bodys':
    //                     return bodys;
    //                     break;
    //                 case 'containerMesh': 
    //                     return containerMesh;
    //                     break;
    //                 case 'shp1r': 
    //                     return shp1r;
    //                     break;
    //                 case 'v3d':
    //                     return v3d;
    //                     break;
    //                 case 'world':
    //                     return world;
    //                     break;
    //                 case 'keys':
    //                     return keys;
    //                     break;
    //                 case 'x982y':
    //                     return x982y;
    //                     break;
    //                 case 'endsequence':
    //                     return endsequence;
    //                     break;
    //             }

    //         },
    //         randMinMax: function(min, max) {
    //             return Math.floor(Math.random() * (max - min + 1)) + min;
    //         },
    //         isSleeping: function(name) {
    //             for(var i = 0; i<bodys.length;i++){
    //                 if(bodys[i].name == name){
    //                     return bodys[i].getSleep();
    //                 }
    //             }
    //         },
    //         gspause: function(val) {
    //             if(val != undefined){
    //                 pause = val;
    //             }
    //             else {
    //                 return pause;
    //             }
    //         },
    //         levelGen: function( restart ) {
    //             restart ? x982y = 1 : x982y += 1 ;
    //             V3D.x982y = x982y;
    //             for(var i = 0; i < v3d.scene.children.length; i++){
    //                 if( v3d.scene.children[i].userData.msname ){
    //                     if( v3d.scene.children[i].userData.msname == 'ms1_4'){
    //                         v3d.scene.children[i].children[0].material.color.setRGB(0,0,0);
    //                     }
    //                     else {
    //                         v3d.scene.children[i].children[0].material.color.setRGB(0.64,0.64,0.64);
    //                     }
    //                 }
    //             } 
    //             v3d.scene.children[V3D.mesharrpos.planetGlow].material.uniforms.glowFloat.value = 0.59;
    //             // if(x982y === 2){
    //             //     x982y = 3;
    //             // }
    //             numofdroneleft = 0;
    //             var i = bodys.length;
    //             while(i--){
    //                 if( bodys[i].name == 'drone') {
    //                     numofdroneleft +=1;
    //                 }
    //                 if( bodys[i].name == 'dphaser' ) {
    //                      world.removeRigidBody(bodys[i].body);
    //                      bodys.splice(i,1);
    //                      bodysNum -= 1;
    //                 }
    //                 if( bodys[i] ) {
    //                     if( bodys[i].name.match('ms') ){
    //                         world.removeRigidBody(bodys[i].body);
    //                         bodys.splice(i,1);
    //                         bodysNum -= 1;
    //                     }
    //                 }
    //             }
    //             while(world.contacts!==null){
    //                 world.removeContact(world.contacts);
    //             }
    //             var i = V3D.dphasers.children.length-1;
    //             while(i>0){
    //                 var m = V3D.dphasers.children[i].material;
    //                 var g = V3D.dphasers.children[i].geometry;
    //                 g.dispose();
    //                 m.dispose();
    //                 V3D.dphasers.remove(V3D.dphasers.children[i]);
    //                 i--;

    //             }
    //             bodys[0].body.position.set(0,0,0);
    //             startlevel = 0;
    //             v3d.ms1y.t = 0;
    //             v3d.ms2y.t = 0;
    //             v3d.ms1y.y = 0;
    //             v3d.ms2y.y = 0;
    //             dronelaunch = 0;
    //             // change to live
    //             //health = 100000000000000;
    //             health = 90;
    //             V3D.startRender = 0;
    //             V3D.raycastarr = [];
    //             V3D.ms1_1arrpos = 0;
    //             V3D.ms2_1arrpos = 0;
    //             bodysNum = bodys.length;
    //             meshs = [];
    //             meshNum = 0;
    //             containerMesh = 0;
    //             dronelaunchTime -= 10;



    //             this.lgd(x982y);
    //             endsequence = 100;
    //             if ( restart ) {
    //                 document.getElementById('respawnImg').style.display = 'none';
    //                 v3d.sight.material.transparent = false;
    //                 v3d.sight.material.opacity = 1;
    //                 dronelaunchTime = 60;
    //             }
    //             else {
    //                 document.getElementById('level'+x982y+'Img').style.display = 'none';
    //             }
    //         },
    //         lgd: function(l) {

    //             var xhttp = new XMLHttpRequest();
    //             xhttp.onreadystatechange = function() {
    //                 if (this.readyState == 4 && this.status == 200) {
    //                   self.populate( JSON.parse(this.responseText) );
    //                 }
    //             }
    //             xhttp.open("POST", url, true);
    //             xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //             xhttp.send( 'l='+l );
    //         }
    //     }
    // }
}

