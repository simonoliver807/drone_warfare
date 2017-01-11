define(['three'], function(THREE) {
'use strict';
var THREE;
var V3D = {};
V3D.ToRad = Math.PI/180;
V3D.ToDeg = 180 / Math.PI;
V3D.msePos = new THREE.Vector3(0,0,0);
V3D.startRender = 0;
V3D.bincam = 1;
V3D.exdrone1;
V3D.exdrone2;
V3D.exdrone3;
V3D.phasers;
V3D.dphasers;
V3D.mesharrpos = {phasers:0,dphasers:0,pl:0};
V3D.grouppart = new THREE.Object3D();
V3D.ms1phaser = new THREE.Group();
V3D.ms2phaser = new THREE.Group();
V3D.percom = document.getElementById('perCom');
V3D.mspdown = new Audio('audio/pdown.mp3');
V3D.dronewav = new Audio('audio/droneExpl.wav');
V3D.ms1_1arrpos = 0;
V3D.ms2_1arrpos = 0;
V3D.x982y= 1;
V3D.raycastarr = [];


// remove
V3D.clientx = 0;
V3D.clienty = 0;



V3D.View = function(h,v,d){
    
    var container = document.getElementById('container');
	this.w = container.clientWidth;
	this.h = container.clientHeight;
	this.id = 'container';

	this.init(h,v,d);
	this.initBasic();
    this.sight;

    this.startRot = { issleeping: 1, rot: 0, axis: new THREE.Vector3() };
    this.world;


}

V3D.View.prototype = {
    constructor: V3D.View,
    init:function(h,v,d){
    	this.clock = new THREE.Clock();
    	this.renderer = new THREE.WebGLRenderer({precision: "mediump", antialias:false});

        //this.renderer = new THREE.WebGLRenderer({ antialias:true });

    	this.renderer.setSize( this.w, this.h );
    	// this.renderer.setClearColor( 0x1d1f20, 1 );
     //    this.renderer.setPixelRatio( window.devicePixelRatio );
     //    this.renderer.autoClear = false;

        this.renderer.setClearColor( 0x000000, 1 );
        this.renderer.setPixelRatio( window.devicePixelRatio );
       this.renderer.autoClear = true;


    	// siolsite this.camera = new THREE.PerspectiveCamera( 60, this.w/this.h, 0.1, 2000 );
        this.camera = new THREE.PerspectiveCamera( 60, this.w/this.h, 0.1, 20000 );
        // this.camhelp = new THREE.CameraHelper( this.camera );
        this.camera.useQuarternion = true;
        this.tanFOV = Math.tan( ( ( Math.PI / 180 ) * this.camera.fov / 2 ) );

        
        // need to update both cam pos and tmpVCPprev here and for mobile
        var insideship = document.getElementById('insideship');
        if(insideship.value == 'clicked inside'){
            V3D.bincam = 0;
        }
        else {
            V3D.bincam = 1;
        }

        if( V3D.bincam ) {
            this.camera.position.z = 10;
            this.tmpVCPprev = new THREE.Vector3(0,0,10);
            this.camdist = 9.9;
            this.regulaterot = 0.1;
        }
        else {
            this.camera.position.z = 0.1;
            this.tmpVCPprev = new THREE.Vector3(0,0,0.1);
            this.camdist = 0.09;
            this.regulaterot = 0.01;
        }

        this.camera.matrixAutoUpdate = true;
        this.camAngle = -0.025;

        this.msechngdir;
        this.chngeindir = false;
        
        
    	this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        
        
        this.container = document.getElementById(this.id)
        this.renderer.domElement.id = 'gamecanvas'; 
        this.container.appendChild( this.renderer.domElement );

        this.miniMap = null;
        this.player = null;

       // this.raycaster = new THREE.Raycaster(this.camera.position, [0,1,0], 1, 100);
        this.raycaster = new THREE.Raycaster();


       // update sight vars
        this.matrixWorld = new THREE.Matrix4();
        this.matrix2 = new THREE.Matrix4();
        this.matrix3 = new THREE.Matrix4();
        this.cpn = new THREE.Vector3( 0, 0, 0 );
        this.len = 0;  
        this.cp = new THREE.Vector3();
        this.camdir = new THREE.Vector3();
        this.tusv = new THREE.Vector3();



        this.containerMesh = 0;
        this.camrot = new THREE.Vector3();
        this.pbrot = new THREE.Vector3();
        this.newsightpos = new THREE.Vector3();
        this.dir = new THREE.Vector3();
        this.bodys = [];
        this.velocity = 1;
        this.reverse = false;
        this.heading = new THREE.Vector3();
        this.shootStart = new THREE.Vector3();
        this.paobj = [[0,0],[1,8],[2,12],[3,15],[4,17],[5,19],[6,22],[7,24],[8,26],[9,28],[10,29],[11,30],[12,31],[13,33],[14,34],[15,35],[16,36],[17,37],[18,38],[19,39]];

        this.drota = 0;
        this.ldh = new THREE.Vector3(0,0,1);
        this.bincount = 0;
        this.dpcnt = 0;

        // applyRot() Vectors
        this.tmpCM = new THREE.Vector3();
        this.tmpVCP = new THREE.Vector3();
        this.rotaxis = new THREE.Vector3();
        this.rotdir = new THREE.Vector3();
        this.rottmpCM = new THREE.Vector3();
        this.up = new THREE.Vector3(0,1,0);

        this.addforce = false;
        this.minusforce = false;

        this.f = new THREE.Vector3();
        this.u = new THREE.Vector3();
        this.s = new THREE.Vector3();

        this.dronetex;

        V3D.grouppart.name = 'grouppart';
        this.scene.add(V3D.grouppart);

        this.ms1pos = new THREE.Vector3(0,0,0);
        this.ms2pos = new THREE.Vector3(0,0,0);
        this.distms = new THREE.Vector3(0,0,0);
        this.ms1arrpos = 0;
        this.ms2arrpos = 0;
        this.ms1y = { y: 0, t: 0};
        this.ms2y = { y: 0, t: 0};


        this.dronenum;
        this.laser;
        this.lraycaster = new THREE.Raycaster();

        this.rotplanetq = new THREE.Quaternion();

        this.planetpos = new THREE.Vector3(0,0,0);
        var pgroup = new THREE.Object3D();
        pgroup.name = 'planets';
        this.scene.add(pgroup);
        V3D.mesharrpos.pl = this.scene.children.length-1;

        this.mouse = new THREE.Vector2();



    },
    initLight:function(){

        var dirlight1  = new THREE.DirectionalLight( 0xffffff, 1.2 );
        dirlight1.position.set( 0, -1, 0 );
        dirlight1.name = 'dirlight';
        var dirlight2 = new THREE.DirectionalLight( 0xffffff, 1.2 );
        dirlight2.position.set( 0, 1, 0 );
        dirlight2.name = 'dirlight';

        this.scene.add( dirlight1 );
        this.scene.add( dirlight2 );

     // var hemlight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
     // this.scene.add( hemlight );

    },
    initPoints: function() {

        var particles = 1500;
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array( particles * 3 );

        for( var i = 0; i < positions.length; i++) {
            var x = this.randMinMax(-35000,35000);
            var y = this.randMinMax(-35000,35000);
            var z = this.randMinMax(-35000,35000);
            positions[ i ]     = x;
            positions[ i + 1 ] = y;
            positions[ i + 2 ] = z;
        }
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
      //  geometry.computeBoundingSphere();
        var points = new THREE.Points( geometry, new THREE.PointsMaterial( { size: 15, color: '#ffffff' } ) );

        points.name = 'points';
        this.scene.add( points );


    },



    
    expart: function() {

        var particles = 500;
        var geometry = new THREE.Geometry();
       // var positions = new Float32Array( particles * 3 );

        //geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        //geometry.computeBoundingSphere();
        for ( var i = 0; i < particles; i++){
            var avec = new THREE.Vector3(0,0,0);
            geometry.vertices.push(avec);
        }
        var points = new THREE.Points( geometry, new THREE.PointsMaterial( { size: 2, color: '#ffff00' } ) );
        points.name = 'points1';
        //points.visible = true;
        //points.geometry.attributes.position.setDynamic(true);

        return points;

    },





    render : function(){

         if( this.startRot.rot !== 0 && this.containerMesh != 0){ this.applyRot() };
    	this.renderer.render( this.scene, this.camera );

        if(V3D.bincam) {
            this.laser.material.transparent = true;
            this.laser.material.opacity = 0;
            this.laser.children[0].material.transparent = true;
            this.laser.children[0].material.opacity = 0;
        }
        else {
            this.sight.children[0].material.transparent = true;
            this.sight.children[0].material.opacity = 0;
        }


    },
    initBasic:function(){
        var geos = {};
        geos['boxTarget'] = new THREE.BoxGeometry(50,50,50);
        geos['containerMesh'] = new THREE.SphereGeometry(8);
      //  geos['cylTarget'] = new THREE.CylinderGeometry( 20, 20, 20 );
        geos['phaser'] = new THREE.SphereGeometry(0.5, 32, 32);
        geos['dphaser'] = new THREE.SphereGeometry(1, 32, 32);
        geos['mercelec1'] = new THREE.SphereBufferGeometry(750, 16, 12);
        geos['earth1'] = new THREE.SphereBufferGeometry(1000, 16, 12);
        geos['earth1'].applyMatrix( new THREE.Matrix4().makeRotationX( THREE.Math.degToRad( 23.5 ) ) );
        geos['shp1'] = new THREE.SphereGeometry(0.1)
        geos['sight'] = new THREE.BoxGeometry(15,15,0.5);
        geos['mothershipbb1'] = new THREE.BoxGeometry(700,300,700,10,10,10);
        geos['mothershipbb2'] = new THREE.BoxGeometry(1600,300,300,10,10,10);
        geos['moonice'] = new THREE.SphereGeometry(500, 16, 12);
        geos['molten'] = new THREE.SphereGeometry(570, 16, 12);
        geos['msphaser'] = new THREE.CylinderGeometry( 5, 5, 20 );
        geos['msphaser'].applyMatrix( new THREE.Matrix4().makeRotationX( THREE.Math.degToRad( 90 ) ) );

        geos['msphaser2'] = new THREE.CylinderGeometry( 5, 5, 20 );
        geos['msphaser2'].applyMatrix( new THREE.Matrix4().makeRotationX( THREE.Math.degToRad( 90 ) ) );

        geos['laser'] = new THREE.CylinderGeometry(0.06,0.06,5000);
        geos['laserglow'] = new THREE.CylinderGeometry(0.16,0.16,5000);

        

        this.geos = geos;

    },
    addBox: function(box){

        if(box.name.match('ms')){
            var texture = '';
           this.loadOBJ(texture,this.scene,box);
            return;
        }

        if(!box.image) {
             var material = new THREE.MeshBasicMaterial({ color: box.color, wireframe: box.wireframe, name: box.name, transparent: box.transparent, opacity: box.opacity });
            if(box.wireframe){ material.wireframe = true;}
        }

        var mesh = new THREE.Mesh( this.geos[box.name], material, box.name );
        mesh.position.set( box.pos[0], box.pos[1], box.pos[2] );

        if(mesh.name == 'mothershipbb1'){
            var axis = new THREE.Vector3(0,1,0);
            mesh.rotateOnAxis(axis, -0.55);
        }

        this.scene.add( mesh );

    },
    addCylinder: function(cylinder){

        if(cylinder.length > 0){
          var texture = this.loadTGA('images/Free_Droid/Materials/BaseMaterial_normal.tga');

          this.dronetex = texture;
          this.loadOBJ(texture,this.scene,cylinder);
          return;
        }
        if(cylinder.name == 'ms1phaser'){
             var material = new THREE.MeshBasicMaterial({ color: cylinder.color});
             var pos = [];
             //left top
             pos[3] = [275,45,130];
             // left bottom
             pos[2] = [228, -54, 128];
             //right top
             pos[1] = [-275, 51, 130];
             //right bottom
             pos[0] = [-228, -52, 128];
             var i = 0;
             while(i<4){
                var mesh = new THREE.Mesh( this.geos['msphaser'], material, cylinder.name  );
                mesh.position.set(pos[i][0],pos[i][1], pos[i][2]); 
                 V3D.ms1phaser.add(mesh);
                i++;
             }
             V3D.ms1phaser.name = 'ms1phaserg';
           // V3D.ms1phaser.position.set(0, 0, -100)
            //this.scene.add(V3D.ms1phaser);
             return;
        }
        if(cylinder.name == 'ms2phaser'){
             var material = new THREE.MeshBasicMaterial({ color: cylinder.color});
             var pos = [];
             
             //back right
            pos[2] = [-110,65,-70];

             // back left
             pos[0] = [90,62,-45];

              //front left
             pos[1] = [45,60,550];

             //front right
             pos[3] = [-70,60,550];
             var i = 0;
             while(i<4){
                var mesh = new THREE.Mesh( this.geos['msphaser2'], material, cylinder.name  );
                mesh.position.set(pos[i][0],pos[i][1], pos[i][2]); 
                V3D.ms2phaser.add(mesh);
                i++;
             }
             V3D.ms2phaser.name = 'ms2phaserg'

             return;
        }
        if(cylinder.name == 'laser'){

               var material = new THREE.MeshBasicMaterial({ color: cylinder.color, transparent: true, opacity: 0 });
               this.geos['laserglow'].applyMatrix( new THREE.Matrix4().makeRotationX( THREE.Math.degToRad( 90 ) ) );
               var glowmesh = new THREE.Mesh(this.geos['laserglow'], material, 'laserglow');


              var material = new THREE.MeshBasicMaterial({ color: cylinder.color, transparent: true, opacity: 0});
              this.geos[cylinder.name].applyMatrix( new THREE.Matrix4().makeRotationX( THREE.Math.degToRad( 90 ) ) );

              this.laser = new THREE.Mesh( this.geos[cylinder.name], material, cylinder.name  );
              this.laser.add(glowmesh);

              return;
        }
        else {
            this.loadOBJ(this.dronetex,this.scene,cylinder); 
        }

    },
    addSphere : function(sphere){
    
        // this.mats['sph'] = this.setMesh(color);
        if( sphere.class == 'planet'){

            var geometry;
            var setImage = 'images/'+sphere.image;
            var texture = new THREE.TextureLoader().load(setImage);
            var material = new THREE.MeshBasicMaterial({map:texture});
            if ( sphere.name == 'mercury1' || sphere.name == 'electric1') {
                geometry = this.geos['mercelec1'];
            }
            if ( sphere.name == 'moon' || sphere.name == 'ice') {
                geometry = this.geos['moonice'];
            }
            if ( geometry === undefined ){
                geometry = this.geos[sphere.name];
            }

            var mesh = new THREE.Mesh( geometry, material, sphere.name );
            mesh.position.set( sphere.pos[0], sphere.pos[1], sphere.pos[2] );
            this.scene.children[V3D.mesharrpos.pl].add( mesh );
        }
        if(sphere.name == 'containerMesh' && sphere.image != 0){
            var texture = '';
            var object = this.loadOBJ(texture,this.scene,sphere);
        }
        if(sphere.name == 'containerMesh' && sphere.image === 0) {
            var material = new THREE.MeshBasicMaterial({ color: sphere.color, wireframe: sphere.wireframe, name: sphere.name, transparent: sphere.transparent, opacity: sphere.opacity });
            var mesh = new THREE.Mesh( this.geos[sphere.name], material, sphere.name );
            mesh.position.set( sphere.pos[0], sphere.pos[1], sphere.pos[2] );
            this.scene.add( mesh );
        }
        if(sphere.name == 'phasers' || sphere.name == 'dphasers') {
            var texture = new THREE.TextureLoader().load(sphere.texture);
            this.loadOBJ(texture,this.scene,sphere);
        }
        if(sphere.name == 'shp1') {
            var material = new THREE.MeshBasicMaterial({ color: sphere.color, wireframe: sphere.wireframe, name: sphere.name, transparent: sphere.transparent, opacity: sphere.opacity });
            var mesh = new THREE.Mesh( this.geos[sphere.name], material, sphere.name );
            mesh.position.set( sphere.pos[0], sphere.pos[1], sphere.pos[2] );
            this.scene.add( mesh );
        }


        if(sphere.name == 'phaser') {
            var material = new THREE.MeshBasicMaterial({ color: sphere.color, wireframe: sphere.wireframe, name: sphere.name, transparent: sphere.transparent, opacity: sphere.opacity });
            var mesh = new THREE.Mesh( this.geos[sphere.name], material, sphere.name );
            mesh.position.set( sphere.pos[0], sphere.pos[1], sphere.pos[2] );
            this.scene.add( mesh );
        }

        
    },
    addLine : function() {


        var material = new THREE.LineBasicMaterial({
            color: 0x66ff33
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( -1, 1, 0 ),
            new THREE.Vector3( -2, 2, 0 ),
            new THREE.Vector3( 1, 1, 0 ),
            new THREE.Vector3( 2, 2, 0),
            new THREE.Vector3( -1, -1, 0 ),
            new THREE.Vector3( -2, -2, 0 ),
            new THREE.Vector3( 1, -1, 0 ),
            new THREE.Vector3( 2, -2, 0)
        );

        var mesh = new THREE.LineSegments( geometry, material );

        if(!V3D.bincam){

            var geometry = new THREE.CircleGeometry( 0.2, 8 );
            var material = new THREE.MeshBasicMaterial( { color: 0x0099ff} );
            var circle = new THREE.Mesh( geometry, material );
            mesh.add( circle );

        }
        mesh.name = 'sight';
        this.scene.add( mesh );

        this.sight = mesh;

    },
    gs_mse_pos: function (gs, pos){
        if(gs == 'get'){
            return this.sight.position;
        }
        else {
            this.sight.position.x = pos.x;
            this.sight.position.y = pos.y;
            this.sight.position.z = pos.z;


        }
    },
    getPlayerDir : function (direction, playerPos){

        var heading = new THREE.Vector3();
        if(direction == 'forward'){

            var retMse = this.gs_mse_pos('get');

            heading = heading.subVectors( retMse, playerPos );
        }
        else {
            heading = heading.subVectors( playerPos, this.gs_mse_pos('get') );
        }
        return heading.normalize();
    },
    updateSightPos: function () {

          // this.dir.set( V3D.msePos.x, V3D.msePos.y, 0.5 ).unproject( this.camera ).sub( this.camera.position ).normalize();

            this.cp.setFromMatrixPosition( this.camera.matrixWorld );
            this.len = this.cp.length();
            this.matrixWorld.copy(this.camera.matrixWorld);
            this.cpn.x = this.matrixWorld.elements[12];
            this.cpn.y = this.matrixWorld.elements[13];
            this.cpn.z = this.matrixWorld.elements[14];
            this.cpn.normalize()
            this.matrixWorld.setPosition(this.cpn);
            this.matrix2.multiplyMatrices( this.matrixWorld, this.matrix2.getInverse( this.camera.projectionMatrix ) );
            var tmpvecmse = new THREE.Vector3(V3D.msePos.x, V3D.msePos.y, 0.5);
            tmpvecmse.applyProjection(this.matrix2);
            this.dir.copy(tmpvecmse.sub(this.cpn).normalize());
            this.newsightpos.addVectors ( this.camera.position, this.dir.multiplyScalar( 100 ));
            this.sight.position.set(this.newsightpos.x, this.newsightpos.y, this.newsightpos.z);
        

            this.camdir.subVectors(this.camera.position, this.containerMesh.position).normalize();
            var q = new THREE.Quaternion();
            q.setFromAxisAngle( this.camdir, Math.PI/2 );
            this.sight.up.set(q.x, q.y, q.z);
        //     this.sight.lookAt(this.containerMesh.position);
        //    this.containerMesh.lookAt(this.sight.position);


//this.tusv.subVectors(this.sight.position,this.camera.position);
 //           var m = this.lookAtFunc(this.tusv, this.sight.up);
   //         this.sight.quaternion.setFromRotationMatrix( m );


            this.sight.quaternion.set(this.camera.quaternion.x,this.camera.quaternion.y,this.camera.quaternion.z, this.camera.quaternion.w)

            this.tusv.subVectors(this.sight.position,this.containerMesh.position);
            var m = this.lookAtFunc(this.tusv, this.up);
            this.containerMesh.quaternion.setFromRotationMatrix( m );            
            

    },
    applyRot: function () {


        this.rotdir.subVectors( this.camera.position, this.containerMesh.position);
        if (this.msechngdir === undefined){
            this.msechngdir = this.startRot.rot;  
        }
        if (this.msechngdir.charAt(0) !== this.startRot.rot.charAt(0)){
            this.chngeindir = true;
            this.msechngdir = this.startRot.rot;
        }

        if( (this.rotdir.y > -this.camdist && this.rotdir.y < this.camdist) || this.chngeindir){

            this.rotaxis.subVectors(this.tmpCM, V3D.msePos);

            this.rotaxis.z = 0;

            this.rotaxis.set ( this.rotaxis.y, this.rotaxis.x*-1, this.rotaxis.z );

            this.rotaxis.applyEuler(this.camera.rotation);
                
            this.tmpVCP.copy(this.tmpVCPprev);
            this.tmpVCP.applyAxisAngle( this.rotaxis, this.camAngle );

            this.tmpVCP.x -= this.tmpVCPprev.x;
            this.tmpVCP.y -= this.tmpVCPprev.y;
            this.tmpVCP.z -= this.tmpVCPprev.z;

            if(this.chngeindir){
                this.chngeindir = false; 
                if ( this.tmpVCPprev.y + this.tmpVCP.y > this.camdist ) {
                    this.tmpVCP.y = this.tmpVCPprev.y - (this.camdist - this.regulaterot);
                    this.tmpVCP.y *= -1;
                }
                else if ( this.tmpVCPprev.y + this.tmpVCP.y < -this.camdist ) {
                    this.tmpVCP.y = this.tmpVCPprev.y + (this.camdist - this.regulaterot);
                    this.tmpVCP.y *= -1;    
                }
            }
            this.tmpVCPprev.x += this.tmpVCP.x; 
            this.tmpVCPprev.y += this.tmpVCP.y;
            this.tmpVCPprev.z += this.tmpVCP.z;
            this.camrot.x = this.tmpVCP.x;
            this.camrot.y = this.tmpVCP.y;
            this.camrot.z = this.tmpVCP.z;
        }
        else {

            if(this.startRot.rot == 'ul' || this.startRot.rot == 'dl'){
                var camAngle = 0.025;
            }
            else {
                var camAngle = -0.025;
            }
            this.tmpVCP.copy(this.tmpVCPprev);
            this.tmpVCP.applyAxisAngle( this.up, camAngle );

            this.tmpVCP.x -= this.tmpVCPprev.x;
            this.tmpVCP.y -= this.tmpVCPprev.y;
            this.tmpVCP.z -= this.tmpVCPprev.z;


            this.tmpVCPprev.x += this.tmpVCP.x;
            this.tmpVCPprev.y += this.tmpVCP.y;
            this.tmpVCPprev.z += this.tmpVCP.z;

            this.camrot.x = this.tmpVCP.x;
            this.camrot.y = this.tmpVCP.y;
            this.camrot.z = this.tmpVCP.z;

        }
            
    },
    lookAtFunc: function(currdir,up) {

            var f;
            var u;
            var s;


                var m = new THREE.Matrix4;
                var te = m.elements;

                this.f = currdir.normalize();

                this.u.crossVectors( up, this.f ).normalize();

                this.s.crossVectors( this.f, this.u ).normalize();


                te[ 0 ] = this.u.x; te[ 4 ] = this.s.x; te[ 8 ] = this.f.x;
                te[ 1 ] = this.u.y; te[ 5 ] = this.s.y; te[ 9 ] = this.f.y;
                te[ 2 ] = this.u.z; te[ 6 ] = this.s.z; te[ 10 ] = this.f.z;

                return m;
    },
    addForce: function() {

        var rb = this.bodys[0].body;
        var heading = this.getPlayerDir('forward', this.containerMesh.position);  
        var chngeindir = heading.equals(this.heading); 
        if ( !chngeindir ) {
            this.heading.set(heading.x,heading.y,heading.z);
        }
        if(this.startRot.rot || !chngeindir || rb.linearVelocity.length() < 15){
            if(rb.linearVelocity.length() < 40){
                heading.multiplyScalar(25);
                rb.linearVelocity.addTime(heading , this.world.timeStep);
                if(rb.linearVelocity.length() > 40){
                    var count = -2;
                    while(rb.linearVelocity.length() > 40){
                        heading.multiplyScalar(count);
                        rb.linearVelocity.addTime(heading , this.world.timeStep);
                        count --;
                    }
                }
            }
        } 
        if( chngeindir ){
            if(rb.linearVelocity.length() < 40){
                heading.multiplyScalar(15);
                rb.linearVelocity.addTime(heading , this.world.timeStep);
            }
        }

        var perlv = ((rb.linearVelocity.length()/40)*100) - 5;
        accel.style.width = perlv + '%';
        if( rb.linearVelocity.length() < 5 && this.reverse ){
            this.reverse = false;
        }

        this.velocity = 1 + rb.linearVelocity.length() / 10;
        
    },
    minusForce: function() {

        var rb = this.bodys[0].body;
        var lv = new THREE.Vector3(rb.linearVelocity.x,rb.linearVelocity.y,rb.linearVelocity.z);
        var lengthlv = lv.length();
        if((lv.x == 0 && lv.y == 0 && lv.z == 0) || this.reverse) {
            var heading = this.getPlayerDir('reverse', this.containerMesh.position);
            if( lengthlv<40 ) { 
                heading.multiplyScalar( 15 );
                rb.linearVelocity.addTime(heading , this.world.timeStep);
                this.reverse = true;  }
            if(rb.linearVelocity.length() > 40){
                var count = -2;
                while(rb.linearVelocity.length() > 40){
                    heading.multiplyScalar(count);
                    rb.linearVelocity.addTime(heading , this.world.timeStep);
                    count --;
                }
            }
        }
        else {
            lv = lv.normalize();
            lv = lv.multiplyScalar( lengthlv -0.5 );
            rb.linearVelocity.copy( lv );
            if(lengthlv < 1) {
                this.reverse = true;
            }
        }

        var perlv = ((rb.linearVelocity.length()/40)*100) - 5;
        accel.style.width = perlv + '%';
        // if(this.velocity < 3){
            this.velocity = 1 + rb.linearVelocity.length() / 10;
        //}
    },
    phaser: function() {

        if(this.containerMesh.children.length == 5){
            this.containerMesh.add(this.laser);
           this.laser.position.z += 2500;
        }
        if(V3D.bincam){
            this.laser.material.opacity = 1;
            this.laser.material.transparent = false;
            this.laser.children[0].material.opacity = 0.5;
        }
        else {
            this.sight.children[0].material.transparent = false;
            this.sight.children[0].material.opacity = 1;
        }

        
        var ms1, ms2, ms1len, ms2len;
        ms1 = ms2 = -1;
        ms1len = ms2len = 0;
        if( !V3D.bincam ) {
            this.mouse.x = ( V3D.clientx / this.w ) * 2 - 1;
            this.mouse.y = - ( V3D.clienty / this.h ) * 2 + 1;
            this.lraycaster.setFromCamera( this.mouse, this.camera );
            var intersects = this.lraycaster.intersectObjects( V3D.raycastarr, true );
            for(var i=0; i < intersects.length; i++) {
                if( intersects[i].object.name == 'ms_Object007.001'){
                    if(!ms1len){
                        ms1 = i;
                        ms1len = intersects[i].distance;
                    }
                    if( ms1len && intersects[i].distance < ms1len ) {
                        ms1 = i;
                        ms1len = intersects[i].distance;
                    }
                }
                 if( intersects[i].object.name == 'DestroyerR_Destroyer_Untitled.000'){
                    if(!ms2len){
                        ms2 = i;
                        ms2len = intersects[i].distance;
                    }
                    if( ms2len && intersects[i].distance < ms2len ) {
                        ms2 = i;
                        ms2len = intersects[i].distance;
                    }
                }
            }
            for(var i=0; i < intersects.length; i++) {
                if( intersects[i].object.name == 'ms_Object007.001' && this.ms1y.y == 0) {
                     this.ms1y.y = 1;
                     this.ms1y.t += 1;
                }
                if( intersects[i].object.name == "DestroyerR_Destroyer_Untitled.000" && this.ms2y.y == 0) {
                     this.ms2y.y = 1;
                     this.ms2y.t += 1;
                }
                if( intersects[i].object.name == 'drone' && intersects[i].object.userData.tbd == 0  ) {
                    if( ms1 != -1) {
                        if ( intersects[ms1].distance > intersects[i].distance ) {
                            intersects[i].object.userData.tbd = 1;
                        }
                    }
                    if( ms2 != -1 ) {
                        if ( intersects[ms2].distance > intersects[i].distance ) {
                            intersects[i].object.userData.tbd = 1;
                        }
                    }
                    if( ms1 === -1 && ms2 === -1) {
                        intersects[i].object.userData.tbd = 1;
                    }
                   // put back this.playDroneEx();
                   this.playDroneEx();
                }
            }
        }
        if (V3D.bincam ){
            this.lraycaster.set( this.containerMesh.position, this.getPlayerDir( 'forward', this.containerMesh.position ) );
            var intersects = this.lraycaster.intersectObjects( V3D.raycastarr, true );
            for(var i=0; i < intersects.length; i++) {
                if( intersects[i].object.name == 'ms_Object007.001'){
                    if(!ms1len){
                        ms1 = i;
                        ms1len = intersects[i].distance;
                    }
                    if( ms1len && intersects[i].distance < ms1len ) {
                        ms1 = i;
                        ms1len = intersects[i].distance;
                    }
                }
                 if( intersects[i].object.name == 'DestroyerR_Destroyer_Untitled.000'){
                    if(!ms2len){
                        ms2 = i;
                        ms2len = intersects[i].distance;
                    }
                    if( ms2len && intersects[i].distance < ms2len ) {
                        ms2 = i;
                        ms2len = intersects[i].distance;
                    }
                }
            }
            for(var i=0; i < intersects.length; i++) {
                if( intersects[i].object.name == 'ms_Object007.001' && this.ms1y.y == 0) {
                    this.ms1y.y = 1;
                    this.ms1y.t += 1;
                }
                if( intersects[i].object.name == "DestroyerR_Destroyer_Untitled.000" && this.ms2y.y == 0) {
                     this.ms2y.y = 1;
                     this.ms2y.t += 1;
                }
                if( intersects[i].object.name == 'drone' && intersects[i].object.userData.tbd == 0  ) {
                    if( ms1 != -1) {
                        if ( intersects[ms1].distance > intersects[i].distance ) {
                            intersects[i].object.userData.tbd = 1;
                        }
                    }
                    if( ms2 != -1 ) {
                        if ( intersects[ms2].distance > intersects[i].distance ) {
                            intersects[i].object.userData.tbd = 1;
                        }
                    }
                    if( ms1 === -1 && ms2 === -1) {
                        intersects[i].object.userData.tbd = 1;
                    }
                   // put back this.playDroneEx();
                   this.playDroneEx();
                }
            }
        }

        // this.lraycaster.set(this.containerMesh.position, direction);
        // //lraycaster.set(cmnorm, direction);

        // var raycastdrone = this.lraycaster.intersectObjects( this.scene.children[this.dronenum].children);
        // if(raycastdrone.length && raycastdrone[0].object.userData.tbd == 0  ) {
        //     raycastdrone[0].object.userData.tbd = 1;
            // V3D.dronewav.pause();
            // V3D.dronewav.currentTime = 0;
            // setTimeout(function(){
            //     V3D.dronewav.play();
            // },20);
       // }
        // var raycastms1 = lraycaster.intersectObject(this.scene.children[this.ms1arrpos].children[0]);
        // if(raycastms1.length){
        //     this.ms1y.y = 1;
        //     this.ms1y.t += 1;
        // }


        // if ( this.scene.children[this.ms1arrpos].children[0].geometry.boundingSphere.radius < 2000 ) { 
        //     this.scene.children[this.ms1arrpos].children[0].geometry.boundingSphere.radius += 1000;
        // }

        // var mesh = this.scene.children[this.ms1arrpos].children[0];
        // var sphere = new THREE.Sphere();
        // sphere.copy( mesh.geometry.boundingSphere );
        // sphere.applyMatrix4( mesh.matrixWorld );
        // var hit = lraycaster.ray.distanceToPoint( sphere.center ) <= sphere.radius;
        // if( hit ){
        //     this.ms1y.y = 1;
        //     this.ms1y.t += 1;
        // }


        // if(this.ms2arrpos){
        //     var raycastms2 = this.lraycaster.intersectObject(this.scene.children[this.ms2arrpos].children[0]);
        //     if(raycastms2.length){
        //         this.ms2y.y = 1;
        //         this.ms2y.t += 1;
        //     }
        // }





        // var heading = this.getPlayerDir('forward', this.containerMesh.position);
        // var mag = 2000;
        // heading.x *= mag;
        // heading.y *= mag;
        // heading.z *= mag;

        // if( !V3D.bincam ){
        //     this.shootStart.subVectors( this.sight.position, this.containerMesh.position );
        //     this.shootStart.normalize();
        //     this.shootStart.multiplyScalar(50);
        //     this.shootStart.addVectors(this.shootStart, this.containerMesh.position);
        // }
        // else {
        //     this.shootStart.subVectors( this.containerMesh.position, this.camera.position );
        //     this.shootStart.normalize();
        //     this.shootStart.multiplyScalar(30);
        //     this.shootStart.addVectors(this.shootStart, this.containerMesh.position);
        // }
        
        // var phaser = V3D.phasers.children[0].clone();
        // phaser.visible = true;
        // phaser.position.set(this.shootStart.x, this.shootStart.y, this.shootStart.z);
        // V3D.phasers.children.push(phaser);


        // var body = { type: 'sphere', size: [1.5,1.5,1.5], pos: [this.shootStart.x, this.shootStart.y, this.shootStart.z], move: 'true', world: this.world, allowSleep: false, name:'phaser', restitution: 0, friction:0 };

        // var rb = this.addPhaser(body, phaser);
        // rb.body.linearVelocity.addTime(heading, this.world.timeStep);
        // var shplv = new THREE.Vector3( this.bodys[0].body.linearVelocity.x,this.bodys[0].body.linearVelocity.y,this.bodys[0].body.linearVelocity.z); 


        // shplv.normalize();
        // var len = this.bodys[0].body.linearVelocity.length();
        // if(len <= 16){
        //     var appvelmag = len * 0.75;
        // }
        // if(len > 16){
        //     appvelmag = len * 0.785; 
        // }
        // if(len > 18){
        //     appvelmag = len * 0.8; 
        // }
        // if(len >= 20){
        //     appvelmag = len * 0.75;
        // }
        // if(len >= 22){
        //     appvelmag = len * 0.8;
        // }
        // if(len > 30){
        //     appvelmag = len * 0.5;
        // }
        // console.log(len);
        // console.log(appvelmag); 


        // for(var i=0;i<this.paobj.length-1;i++){
        //     if( len > this.paobj[i][1] && len < this.paobj[i+1][1] ){
        //         var diff = this.paobj[i+1][1] - this.paobj[i][1];
        //         var appvelmag = ((len - this.paobj[i][1])/diff) + this.paobj[i][0] ;
        //     }
        // }
      //  shplv.multiplyScalar(len + appvelmag);
     //   rb.body.linearVelocity.addEqual(shplv);
    },
    playDroneEx: function() {

        V3D.dronewav.pause();
        V3D.dronewav.currentTime = 0;
        setTimeout(function(){
        V3D.dronewav.play();
        },20);


    },
    // updateDrones: function(db){
         updateDrones: function(dbody,drone,ms){



        /////////////////////////////////////
            // later level use getObjHeading/////
            // to predict heading of shp1 ////
            /// and adjust heading of drone ///
            ///////////////////////////////////

            var rb = dbody.body;

            if(!drone.userData.rtm){
                var rblv = rb.linearVelocity.length();
            //   console.log('velocity ' + rblv); 


                var correctvec = new THREE.Vector3(this.ldh.x,this.ldh.y,this.ldh.z).normalize();

                this.ldh.subVectors( this.containerMesh.position, drone.position );
                var dist = Math.round(this.ldh.length());
                // if(dist < 500){
                //     this.playaudio = 1;
                // }
                this.ldh.normalize()
                var m = this.lookAtFunc(this.ldh, this.up);
                var q = new THREE.Quaternion();
                q.setFromRotationMatrix( m );
                rb.setQuaternion(q);

                var angle = 2 * Math.acos(q.w);

                if( drone.userData.bincount === 0) {

                    if( this.drota != angle) {

                        var anglediff = this.drota - angle;
                        if( anglediff < 0 ) { anglediff *= -1; }
                        var mag = anglediff;
                        
                       if(anglediff <= 0.01) {
                            mag *= 100;
                        }
                        if(anglediff > 0.01 && anglediff <= 0.1) {
                            mag *= 100;
                        }
                        if(anglediff > 0.1 && anglediff < 1) {
                            mag *= 10;
                        }
                        if(anglediff > 1) {
                            mag;
                        }
                     //   console.log('mag ' + mag); 

                        correctvec.multiplyScalar(-mag);
                        rb.linearVelocity.addTime(correctvec, this.world.timeStep);
                        this.drota = angle;
                        //console.log(rb.linearVelocity); 
                      //  console.log('anglediff' + anglediff);

                    }
                }
                else {

                        if ( dist <= 1500 ) {

                            this.normalizelv( rb,3,this.ldh );

                        }
                        if (dist > 1500 && dist <= 4000) { 

                            this.normalizelv( rb,8,this.ldh );
                        
                        }
                        if (dist > 4000 && dist <= 10000 ) {

                            this.normalizelv( rb,11,this.ldh );

                        }
                        if (dist > 10000 ) {
                            this.ldh.multiplyScalar(15);
                            rb.linearVelocity.addTime(this.ldh, this.world.timeStep);  
                        }

                }
                var fr = 30 + (V3D.x982y * 25);
                if( drone.userData.dpcnt > 1000 & V3D.dphasers.children.length < fr) {
                    //var heading = new THREE.Vector3(this.ldh.x,this.ldh.y,this.ldh.z);
                    //heading.normalize;
                   // console.log(10 - this.ldh.length()); 

                    this.shootStart.subVectors( this.containerMesh.position, drone.position );
                    this.shootStart.normalize();
                    this.shootStart.addVectors(this.shootStart, drone.position);

                    var matrix = new THREE.Matrix4();
                    matrix.extractRotation( drone.matrix );

                    var heading = new THREE.Vector3( 0, 0, 1 );
                    heading = heading.applyProjection( matrix );
                    //var heading = new THREE.Vector3();
                    //heading.subVectors(this.containerMesh.position, this.shootStart)
                    //heading.normalize();
                   // var mag = 20 * ( 10 - this.ldh.length());
                   var mag = 2000;
                    heading.x *= mag;
                    heading.y *= mag;
                    heading.z *= mag;
                    //this.shootStart.normalize();
                  //  this.shootStart.addVectors(this.shootStart, drone.position);
                    var dphaser = V3D.dphasers.children[0].clone();
                    dphaser.position.set(this.shootStart.x, this.shootStart.y, this.shootStart.z);
                    dphaser.visible = true;
                    V3D.dphasers.add(dphaser);
                    var body = { type: 'sphere', size: [0.3,0.3,0.3], pos: [this.shootStart.x, this.shootStart.y, this.shootStart.z], move: 'true', world: this.world, name: 'dphaser' };
                    var rbdphaser = this.addPhaser(body, dphaser);
                    rbdphaser.body.linearVelocity.addTime(heading, this.world.timeStep);
                    drone.userData.dpcnt = this.randMinMax(0,1000);
                }
                else {
                    drone.userData.dpcnt +=1;
                }


                if(ms == 'ms1'){
                    this.distms.subVectors(this.ms1pos,drone.position);
                }
                if(ms == 'ms2') {
                    this.distms.subVectors(this.ms2pos,drone.position);
                }
                var len = this.distms.length();
                if(len > 12000 && !dbody.nrtm ){
                    drone.userData.rtm = 1;
                }
            }
            if(drone.userData.rtm){

                if(ms == 'ms1'){
                    this.distms.subVectors(this.ms1pos,drone.position);
                }
                if(ms == 'ms2') {
                    this.distms.subVectors(this.ms2pos,drone.position);
                }
                var len = this.distms.length();
                var self = this;
                if(len > 4000){
                    this.dronedist(1000, this.distms, rb);
                }
                if(len > 2800 && len <= 4000){
                    this.dronedist(50, this.distms, rb);
                }
                if( len > 2100 && len <= 2800) {
                    this.dronedist(30, this.distms, rb);
                }
                if ( len > 1100 && len <= 2100){
                    this.dronedist(10, this.distms, rb);
                }
                if( len <= 1100 ) {
                    drone.userData.rtm = 0;
                    drone.userData.ld = 0;
                }

            }
            drone.userData.bincount ? drone.userData.bincount = 0 : drone.userData.bincount = 1;

    },
    dronedist: function(val, distms, rb) {

        if( val == 1000 ) {
            rb.linearVelocity.set(0,0,0);
        }
        distms.normalize();
        distms.x *= val;
        distms.y *= val;
        distms.z *= val;
        //var lv = rb.linearVelocity.length();
        rb.linearVelocity.addTime(distms, this.world.timeStep);
     //   lv = rb.linearVelocity.length();

    },
    swapms: function(mesh) {

        if( mesh.name == 'ms1' ) {
            var currarrpos = this.ms1arrpos;
            var nextarrpos = V3D.ms1_1arrpos;
            var phaser = V3D.ms1phaser;
            var name = 'ms1';
        }
        if ( mesh.name == 'ms2' ) {
            var currarrpos = this.ms2arrpos;
            var nextarrpos = V3D.ms2_1arrpos;
            var phaser = V3D.ms2phaser;
            var name = 'ms2';
        }

            phaser.children[0].geometry.dispose();
            phaser.children[0].material.dispose();
            phaser.remove( phaser.children[0] );
            this.scene.children[currarrpos].children[0].material.transparent = true;
            this.scene.children[currarrpos].children[0].material.opacity = 0;
            this.scene.children[nextarrpos].children[0].material.transparent = false;
            this.scene.children[nextarrpos].children[0].material.opacity = 1;
            this.scene.children[nextarrpos].quaternion.copy( this.scene.children[this.ms1arrpos].quaternion );
            this.scene.children[currarrpos].name = this.scene.children[nextarrpos].name;
            this.scene.children[nextarrpos].name = name;
            currarrpos = nextarrpos;
            if( name == 'ms1'){ 
                this.ms1arrpos = nextarrpos;
                this.ms1y.t = 0;
                if ( phaser.children.length == 0) {
                    V3D.ms1_1arrpos = 99;
                }
            };
            if( name == 'ms2'){ 
                this.ms2arrpos = nextarrpos;
                this.ms2y.t = 0;
                if ( phaser.children.length == 0) {
                    V3D.ms2_1arrpos = 99;
                }
            };
            var i = this.scene.children.length;
            var loadnextms = 1;
            var num = this.scene.children[currarrpos].userData.msname.substr(-1);
            num = parseInt(num)+1;
            while(i--) {
                if( this.scene.children[i].userData.msname == this.scene.children[currarrpos].name+'_'+num ) {
                    loadnextms = 0;
                }
            }
            if(loadnextms){
                if ( this.scene.children[currarrpos].userData.msname.substr(-1) < 4) { 
                        this.addBox({ "type": "box",
                                     "pos": [-5000, 0, -2000],
                                     "world": "world",
                                     "name": this.scene.children[currarrpos].name+'_'+num,
                                     "msname": this.scene.children[currarrpos].name+'_'+num,
                                     "image": "ms/"+this.scene.children[currarrpos].name+"_"+num+".obj",
                                     "mtl": "ms/"+name+".mtl"});
                }
            }
            else {
                for(var i = nextarrpos; i < this.scene.children.length; i++){
                    if( this.scene.children[i].name.match(name+'_') ){
                        if( name == 'ms1' ) {
                            V3D.ms1_1arrpos = i;
                        }
                        if( name == 'ms2' ) {
                            V3D.ms2_1arrpos = i;
                        }
                        break;
                    }
                }
            }
        return this.scene.children[currarrpos];
    },
    normalizelv: function(rb, mag, ldh) {

        if( rb.linearVelocity.length() >= (mag + 1) ){
            rb.linearVelocity.normalize(rb.linearVelocity);
            rb.linearVelocity.multiplyScalar(mag);
        }
        ldh.multiplyScalar(mag);
        rb.linearVelocity.addTime( ldh, this.world.timeStep );  


    },
    getObjHeading: function(pos, rot) {
        
        return pos.applyQuaternion(rot).negate();

    },
    onProgress: function ( xhr ) {


//         V3D.objimage = 0;
// V3D.totalImg = 5;
// V3D.loadingScreen = document.getElementById('loadingScreen');

            

            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                V3D.percom.innerHTML = '  Current ' + Math.round(percentComplete, 2) + '% downloaded ';
            }

    },
    onError: function ( xhr ) { 

          //  console.log(xhr);

            var errscreen = document.getElementById('errScreen');
            errscreen.innerHTML = "<div id='errdiv'><p>"+ xhr.target.responseURL + "</p><p>"+xhr.target.statusText+"</p><p>"+xhr.target.status+"</p></div>";
            errscreen.style.display = "block";

    },
    loadTGA: function(texture) {
        // var onProgress = function ( xhr ) {
        //     if ( xhr.lengthComputable ) {
        //         var percentComplete = xhr.loaded / xhr.total * 100;
        //         console.log( Math.round(percentComplete, 2) + '% downloaded ' + xhr.srcElement.responseURL);
        //     }
        // };
        // var onError = function ( xhr ) { 
        //     console.log(xhr);
        // };
        var loader = new THREE.TGALoader();
        var texture = loader.load( texture, function( object) {
        }, V3D.View.prototype.onProgress, V3D.View.prototype.onError);
        return texture
    },
    loadOBJ: function(texture,scene,obj) {

        // var onProgress = function ( xhr ) {
        //     if ( xhr.lengthComputable ) {
        //         var percentComplete = xhr.loaded / xhr.total * 100;
        //         console.log( Math.round(percentComplete, 2) + '% downloaded ' + xhr.srcElement.responseURL );
        //     }
        // };
        // var onError = function ( xhr ) { 
        //     console.log(xhr);
        // };

        // if( obj[0] || obj.name.charAt(0) == 'e' || obj.name == 'phasers' || obj.name == 'dphasers' || obj.name == 'mothership') {
        if( obj[0] || obj.name.charAt(0) == 'e' || obj.name == 'phasers' || obj.name == 'dphasers') {
            if(obj[0]){ var image = obj[0].image;}
            else {var image = obj.image;}
            var loader = new THREE.OBJLoader( );
            loader.load( 'images/'+image, function ( object ) {

                object.traverse( function ( child ) {

                    if ( child instanceof THREE.Mesh ) {
                        if (child.material.type == 'MultiMaterial') { 
                            //child.material.materials[0] = new THREE.MeshBasicMaterial()
                            child.material.materials[0].map = texture; 
                        }
                        if (child.material.type == 'MeshPhongMaterial') { 
                            child.material.map = texture;} 
                    }

                } );

                if( obj[0] && obj[0].name == 'drone'){
                    for(var i=0;i<obj.length;i++){
                        if(i==0){
                            object.children[0].position.set(10000, 10000, 10000);
                            object.children[0].name = 'drone';
                            object.children[0].userData.dpcnt = 0;
                            object.children[0].userData.rtm = 0;
                            object.children[0].userData.ld = 0;
                            object.children[0].userData.tbd = 0;
                        }
                        else {
                            var tmpDrone = object.children[0].clone();
                            tmpDrone.position.set(obj[i].pos[0], obj[i].pos[1], obj[i].pos[2]);
                            tmpDrone.userData.dpcnt = V3D.View.prototype.randMinMax(0,1000);
                            object.add(tmpDrone);
                        }


                    }
                    object.name = 'drones';
                    scene.add(object);
                }
                if(object.name != 'drones') { object.name = obj.name ;}
                if(object.name == 'exdrone3'){
                    object.userData.active = false;
                    V3D.exdrone3 = object;
                    V3D.exdrone3.children[0].visible = false;
                    scene.add(V3D.exdrone3);
                }
                if(object.name == 'exdrone2'){
                    object.userData.active = false;
                    V3D.exdrone2 = object;
                    V3D.exdrone2.children[0].visible = false;
                    scene.add(V3D.exdrone2);
                }
                if(object.name == 'exdrone1'){
                    object.userData.active = false;
                    V3D.exdrone1 = object;
                    V3D.exdrone1.children[0].visible = false;
                    scene.add(V3D.exdrone1);
                }
                if(object.name == 'phasers'){
                    V3D.phasers = object;
                    V3D.phasers.children[0].visible = false;
                    V3D.phasers.children[0].name = 'phaser';
                    V3D.mesharrpos.phasers = scene.children.length;
                    scene.add(V3D.phasers);
                }
                if(object.name == 'dphasers'){
                    V3D.dphasers = object;
                    V3D.dphasers.children[0].visible = false;
                    V3D.dphasers.children[0].name = 'dphaser';
                    V3D.mesharrpos.dphasers = scene.children.length;
                    scene.add(V3D.dphasers);
                }
                V3D.startRender +=1;
            }, V3D.View.prototype.onProgress, V3D.View.prototype.onError);
        }
        else {

            var image = obj.image; 
            var mtl = obj.mtl;
         //   THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.load( 'images/'+mtl , function( materials ) {
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials( materials );
                objLoader.load( 'images/'+image, function ( object ) {
                    object.position.set(obj.pos[0], obj.pos[1], obj.pos[2]);
                    object.name = obj.name;
                    if(obj.msname){
                        object.userData.msname = obj.msname;
                    }
                    if(object.name.match('_')){
                        object.children[0].material.transparent = true;
                        object.children[0].material.opacity = 0;
                        if(object.name.match('_4')) {
                            object.children[0].material.color.setRGB(0,0,0);
                        }
                        if(V3D.ms1_1arrpos !== 99 && object.name.match('ms1')){
                            V3D.ms1_1arrpos = scene.children.length;
                        }
                        if(V3D.ms2_1arrpos !== 99 && object.name.match('ms2')){
                            V3D.ms2_1arrpos = scene.children.length;
                        }
                        if(object.name.substr(-1) >= 1){
                            V3D.startRender -= 1;
                        }

                    }
                    scene.add(object);
                    V3D.startRender +=1;
                }, V3D.View.prototype.onProgress, V3D.View.prototype.onError);
            });
        }
    },
    msla: function(ms) {
        var dir = new THREE.Vector3();
        var mspos = new THREE.Vector3( ms.position.x, ms.position.y, ms.position.z);
        mspos.multiplyScalar(100);
        dir.subVectors( this.planetpos, mspos);
        var m = this.lookAtFunc( dir, new THREE.Vector3(0,1,0));
        var q = new THREE.Quaternion();
        q.setFromRotationMatrix( m );
        return q;
    },
    rotPlanetoid: function(body,mesh){

        this.rotplanetq.setFromAxisAngle( new THREE.Vector3(0,1,0), 0.1);
        mesh.quaternion.multiply( this.rotplanetq );
        body.body.setQuaternion( mesh.quaternion );
        body.awake();

    },
    setBodys: function(rb){
        this.bodys.push(rb);
    },
    setWorld: function(world){
        this.world = world;
    },
    tvec: function(x,y,z) {
        return new THREE.Vector3(x,y,z);
    },
    tquat: function(x,y,z,w){
        return new THREE.Quaternion(x,y,z,w);
    },
    whcam: function() {
        var vFOV = this.camera.fov * Math.PI / 180;        // convert vertical fov to radians
        var height = 2 * Math.tan( vFOV / 2 ) * 300; // visible height

        var aspect = this.w / this.h;
        var width = height * aspect;   

        return {h: height,w: width};

    },
    randMinMax: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}


return V3D;

});

//----------------------------------
//  LOADER IMAGE/SEA3D
//----------------------------------

// POOL move to sea3D is more logical