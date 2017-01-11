define(['gameinit','v3d'], function(GAMEINIT,V3D){
	'use strict'

	return function(){
		var gameinit = new GAMEINIT;
		var v3d;
		var timestep = 1/60;






		return {

			init: function() {

				
				   var levels = gameinit.getObj('levels');
				     levels.push( {
									"1": {
										"planet1": {
											"class": "planet",
											"type": "sphere",
											"size": [750, 750, 750],
											"pos": [500, 10, -10000],
											"move": false,
											"world": "world",
											"color": "0x0000ff",
											"wireframe": false,
											"name": "mercury1",
											"transparent": false,
											"opacity": 1,
											"image": "planets/mercury.jpg"
										},
										"drone": 10,
										"ms1": {
											"type": "box",
											"size": [700, 300, 700],
											"pos": [-5000, 0, -2000],
											"move": true,
											"world": "world",
											"name": "ms1",
											"msname": "ms1",
											"transparent": true,
											"opacity": 0,
											"image": "ms/ms1.obj",
											"mtl": "ms/ms1.mtl",
											"new": 1
										}
									},
									"2": {
										"planet1": {
											"class": "planet",
											"type": "sphere",
											"size": [1000, 1000, 1000],
											"pos": [2000, 10, -8000],
											"move": false,
											"world": "world",
											"color": "0x0000ff",
											"wireframe": false,
											"name": "earth1",
											"transparent": false,
											"opacity": 1,
											"image": "planets/earth.jpg"
										},
										"planet2": {
											"class": "planet",
											"type": "sphere",
											"size": [500, 500, 500],
											"pos": [500, 10, 10000],
											"move": false,
											"world": "world",
											"color": "#0000ff",
											"wireframe": false,
											"name": "moon",
											"transparent": false,
											"opacity": 1,
											"image": "planets/moon.jpg"
										},
										"drone": 10,
										"ms1": {
											"type": "box",
											"size": [700, 300, 700],
											"pos": [8000, 0, -1000],
											"move": true,
											"world": "world",
											"name": "ms1",
											"msname": "ms1",
											"transparent": "false",
											"opacity": 0,
											"image": "ms/ms1.obj",
											"mtl": "ms/ms1.mtl",
											"new": 0
										}
									},
									"3": {
										"planet1": {
											"class": "planet",
											"type": "sphere",
											"size": [750, 750, 750],
											"pos": [500, 10, 10000],
											"move": false,
											"world": "world",
											"color": "0x0000ff",
											"wireframe": false,
											"name": "mercury1",
											"transparent": false,
											"opacity": 1,
											"image": "planets/mercury.jpg"
										},
										"planet2": {
											"class": "planet",
											"type": "sphere",
											"size": [500, 500, 500],
											"pos": [-1500, 100, -10000],
											"move": false,
											"world": "world",
											"color": "#0000ff",
											"wireframe": false,
											"name": "moon",
											"transparent": false,
											"opacity": 1,
											"image": "planets/moon.jpg"
										},
										"planet3": {
											"class": "planet",
											"type": "sphere",
											"size": [500, 500, 500],
											"pos": [2000, 100, -10000],
											"move": false,
											"world": "world",
											"color": "#0000ff",
											"wireframe": false,
											"name": "molten",
											"transparent": false,
											"opacity": 1,
											"image": "planets/molten.jpg"

										},
										"drone": 10,
										"ms1": {			
											"type": "box",
											"size": [700, 300, 700],
											"pos": [-5000, 0, 2000],
											"move": true,
											"world": "world",
											"name": "ms1",
											"msname": "ms1",
											"transparent": "false",
											"opacity": 0,
											"image": "ms/ms1.obj",
											"mtl": "ms/ms1.mtl",
											"new": 0
										},
										"ms2": {
											"type": "box",
											"size": [700, 300, 700],
											"pos": [5000, 0, 1000],
											"move": true,
											"world": "world",
											"name": "ms2",
											"msname": "ms2",
											"transparent": "false",
											"opacity": 0,
											"image": "ms/ms2.obj",
											"mtl": "ms/ms2.mtl",
											"new": 1
										}
									},
									"4": {
										"planet1": {
											"class": "planet",
											"type": "sphere",
											"size": [750, 750, 750],
											"pos": [500, 10, -10000],
											"move": false,
											"world": "world",
											"color": "0x0000ff",
											"wireframe": false,
											"name": "electric1",
											"transparent": false,
											"opacity": 1,
											"image": "planets/electric.jpg"
										},
										"planet2": {
											"class": "planet",
											"type": "sphere",
											"size": [450, 450, 450],
											"pos": [500, 100, 10100],
											"move": false,
											"world": "world",
											"color": "#0000ff",
											"wireframe": false,
											"name": "ice",
											"transparent": false,
											"opacity": 1,
											"image": "planets/ice.jpg"
										},
										"drone": 10,
										"ms1": {			
											"type": "box",
											"size": [700, 300, 700],
											"pos": [-5000, 0, 2000],
											"move": true,
											"world": "world",
											"name": "ms1",
											"msname": "ms1",
											"transparent": "false",
											"opacity": 0,
											"image": "ms/ms1.obj",
											"mtl": "ms/ms1.mtl",
											"new": 0
										},
										"ms2": {
											"type": "box",
											"size": [700, 300, 700],
											"pos": [8000, 0, 10000],
											"move": true,
											"world": "world",
											"name": "ms2",
											"msname": "ms2",
											"transparent": "false",
											"opacity": 0,
											"image": "ms/ms2.obj",
											"mtl": "ms/ms2.mtl",
											"new": 0
											//"new": 0
										}
									}
								});

				   // levels.push(JSON.parse(jsonlevels));


					window.oncontextmenu = function (){ return false; }
					window.addEventListener( 'resize', onWindowResize, false );


					v3d = gameinit.getObj('v3d');
					gameinit.createWorld(timestep);
					gameinit.populate();

							
				    v3d.initLight();
				    v3d.initPoints();		


				    this.x = v3d.w/2;
				    this.y = v3d.h/2;
				    this.shp1;
				    this.tarvec = v3d.tvec();
				    this.tarbody = 0;
				    this.chngdir = 0;
				    this.chngdiry = 0;
				    this.angleprev = 0;
				    this.setAxis = 1;
				    this.timestep = timestep;

				    this.lockcount = 0;
				    this.arrpos = [ 1,0,1,1,0,1 ,-1,0,-1,-1, 0,-1,-1,1, 1,-1,2,0, 2,2 ,0,2,-2,0, -2,-2, 0,-2,-2,2 ];
				    this.arrposcnt = 0;

		    		if( V3D.bincam){
						this.dnum = 7;
					}
					else {
						this.dnum = 8;
					}
				    var bodys = gameinit.getObj('bodys');
   					for(var i=0; i < bodys.length; i++) {
						if(bodys[i].name == 'shp1'){
							this.shp1 = bodys[i].body;
						}
					}
				    var self = this;

				    gameinit.oimoLoop();

				    setInterval( updateShip, 75 );
 
				    
					function onWindowResize(){
				    	v3d.camera.aspect = window.innerWidth / window.innerHeight;
				    	v3d.camera.fov = ( 360 / Math.PI ) * Math.atan( v3d.tanFOV * ( window.innerHeight / window.innerHeight ) );
				    	v3d.camera.updateProjectionMatrix();
				    	v3d.renderer.setSize( window.innerWidth, window.innerHeight );
				    	v3d.h = window.innerHeight;
				    	v3d.w = window.innerWidth;
					}


				    function updateShip() {
						function handleKeyDown ( event ) {

							//event.preventDefault();
							if( event.keyCode === 27) {
								var val = gameinit.gspause() ? 0: 1;
							    gameinit.gspause(val);
							}
							if ( event.keyCode == 70) {
								document.body.webkitRequestFullScreen();
							}
						};
						function getTar () {


							var bodys = gameinit.getObj('bodys');
							var dist = v3d.tvec();
							var minlen = 0;
							for(var i=0; i < bodys.length; i++) {

								if( bodys[i].name.match('ms')){
									var msnum = v3d.scene.children.length;
									while(msnum--){
										if(v3d.scene.children[msnum].userData.msname == bodys[i].name){
											var msyn = v3d.scene.children[msnum].children[0].children[0].children.length;
										}
									}
								}

								if( bodys[i].name == 'drone' || (bodys[i].name.match('ms') && msyn) ){
									dist.subVectors(self.shp1.position, bodys[i].body.position);
									var len = dist.length();
									if(len < minlen || minlen === 0 ){
										minlen = len;
										var tar = bodys[i].body.position;
										self.tarvec.set( tar.x, tar.y, tar.z);
										self.tarvec.multiplyScalar(100);
										if(bodys[i].name == 'drone'){
											for(var j=0; j< v3d.scene.children[self.dnum].children.length; j++){
												var drone = v3d.scene.children[self.dnum].children[j];
												if( self.tarvec.equals(drone.position) ){
													self.tarbody = drone;
												}
											}
										}
										if( bodys[i].name.match('ms') ) {
											for(var k=0; k< v3d.scene.children.length; k++){
												var ms = v3d.scene.children[k];
												if ( ms.userData.msname == bodys[i].name ){
													self.tarbody = ms;
												}
											}
										}
									}
								}

							}


						};
						function toScreenPosition(obj, camera, vec )
						{
							if ( obj ) { 
							    var vector = v3d.tvec();

							    var widthHalf = 0.5*v3d.w;
							    var heightHalf = 0.5*v3d.h;

							    obj.updateMatrixWorld();
							    vector.setFromMatrixPosition(obj.matrixWorld);
							}
							if ( vec ) {
								var vector = v3d.tvec();
								var widthHalf = 0.5*v3d.w;
							    var heightHalf = 0.5*v3d.h;
								vector.set(vec.x, vec.y, vec.z);
							}


						    vector.project(camera);

						    vector.x = ( vector.x * widthHalf ) + widthHalf;
						    vector.y = - ( vector.y * heightHalf ) + heightHalf;

						    return { 
						        x: vector.x,
						        y: vector.y
						    };

						};
						function reset(){
							self.tarvec = v3d.tvec();
						    self.tarbody = 0;
						    self.chngdir = 0;
						    self.chngdiry = 0;
						    self.angleprev = 0;
						    self.setAxis = 1;
						    self.lockcount = 0;
						}
						window.addEventListener( 'keydown', handleKeyDown, false );
						var es = gameinit.getObj('endsequence');
				    	if( es  < 100 ){
				    		//self.shp1;
						    reset();
						    self.shp1.position.set(0,0,0);
				    	}
				    	else {
				    		var containerMesh = gameinit.getObj('containerMesh');

				    		if(containerMesh){

				    			var keys = gameinit.getObj('keys');
				    			if( !keys[32]){
									keys[32] = 1;
								}

				    			if(self.chngdir == 99) {
				    				var target = 0;
				    				if( self.tarbody.name == 'drone' ) {
					    				for(var i = 0; i < v3d.scene.children[self.dnum].children.length; i++ ){
					    					if(self.tarbody.id == v3d.scene.children[self.dnum].children[i].id){
					    						target = 1;
					    					}
					    				}
					    			}
					    			if ( self.tarbody != 0 ){
						    			if( self.tarbody.name.match('ms') ){
						    				for(var i = 0; i < v3d.scene.children.length; i++ ){

						    					if( self.tarbody.userData.msname == v3d.scene.children[i].userData.msname){

						    						var msyn = v3d.scene.children[i].children[0].children[0].children.length;
						    						if( msyn ){ target = 1};

						    					}

						    				}
						    			}
						    		}
					    			if( !target ) {
					    				reset();
					    			}
				    			}

				    			if ( self.tarbody == 0){
									getTar();
								}

								self.shp1.linearVelocity.set(0,0,0);
								var ldh = v3d.tvec(self.tarvec.x, self.tarvec.y, self.tarvec.z);
								ldh.normalize();
								var len = ldh.length();
								ldh.multiplyScalar(0);

								self.shp1.linearVelocity.addTime(ldh, self.timestep); 
								var v1 = v3d.tvec();
								v1.subVectors(v3d.sight.position, v3d.containerMesh.position).normalize();


								var v2 = v3d.tvec();

								v2.subVectors(self.tarvec, v3d.containerMesh.position);
								v2.normalize();
								var dp = v1.dot(v2);
								dp = Math.acos(dp);
								var axis = v3d.tvec();
								axis.crossVectors(v1,v2);




								if(self.chngdir == 0 ) {
									if( axis.y < 0) { self.chngdir = -1}
									if( axis.y > 0) { self.chngdir = 1}
								}

								if( self.chngdir != 99 ) {
									if (self.chngdir > 0 && axis.y < 0 ){
										self.chngdir = 99;
									}
									if (self.chngdir < 0 && axis.y > 0){
										self.chngdir = 99;
									}
								}

									// if (axis.x != 0){
									// 	if  ( axis.x > -0.001 && axis.x < 0.001 ) {
									// 		self.chngdir = 99;
									// 	}
									// }





						    	var x,y;

								var perw = (v3d.w / 100) * 5;
								var perh = (v3d.h / 100) * 5;
								var perw10 = (v3d.w / 100) *10;
								var perh10 = (v3d.h / 100) * 10;
								var perwr = v3d.w - perw;
								var perwl = perw;
								var perhu = v3d.h - perh;
								var perhd = perh
								var perwr10 = v3d.w - perw10;
								var perwl10 = perw10;
								var perhu10 = v3d.h - perh10;
								var perhd10 = perh10



									// if(dp >= self.angleprev) {
									// 	if( self.angleprev != 0){
									// 		self.setAxis == 2 ? self.setAxis = 1 : self.setAxis = 2;
									// 	}
									// }

								if( axis.y > 0) {
									self.setAxis = 1;
								}
								if( axis.y < 0) {
									self.setAxis = -1;
								}

								if ( self.x < perwr && self.x > perwl ) {
									if ( self.x < perwr10 && self.x > perwl10){
										
										if( self.setAxis == 1) {
											self.x -=100;
										}
										else {
											self.x +=100;
										}

									}
									else {
										if( self.setAxis == 1) {
											self.x -=20;
										}
										else {
											self.x +=20;
										}
									}
								}
						    	

								if ( self.tarbody != 0 ){


									if( !V3D.bincam ) {
							    		var xy = toScreenPosition(self.tarbody, v3d.camera);

							    		// get sight screen xy pos for raycast;
							    		var sightxy = toScreenPosition(v3d.sight, v3d.camera);
							    		V3D.clientx = sightxy.x;
							    		V3D.clienty = sightxy.y;

							    	}
							    	if( V3D.bincam ) {
							    		var vector1 = v3d.tvec();
							    		var vector2 = v3d.tvec();

							    	//	vector2.subVectors( v3d.sight.position, v3d.containerMesh.position ).normalize();
							    	//	vector2.multiplyScalar(90);	

							    		vector1.subVectors( self.tarbody.position, v3d.containerMesh.position ).normalize();
							    		vector1.multiplyScalar(90);

							    		// vector2.subVectors( self.tarbody.position, v3d.containerMesh.position );
							    		// var len = vector2.length();
							    		// var vector3 = v3d.tvec();
							    		// vector3.subVectors( v3d.sight.position, v3d.containerMesh.position ).normalize();
							    		// vector3.multiplyScalar(len);


							    		var xy = toScreenPosition( 0, v3d.camera, vector1);
							    		var xy2 = toScreenPosition( self.tarbody, v3d.camera, 0 );
							    	}


						    		var angdif = self.angleprev - dp;
									if (angdif < 0){ angdif *= -1};
									if( self.chngdir == 99 ) {
										self.x = xy.x;
									}
									if( self.angleprev != 0 ){
										if ( (angdif >= 0 && angdif < 0.002) || (self.angleprev < dp) ) {
											self.y = xy.y;
										}
									}
								}

								if(V3D.bincam && self.chngdir == 99 ){

									if ( self.lockcount == 10 ){

										self.x += self.arrpos[self.arrposcnt];
										self.y += self.arrpos[self.arrposcnt+1];
										self.arrposcnt += 2;

									}
									if ( self.lockcount < 10 ){
										self.lockcount +=1 ;
									}

								}
								


						    	x = self.x;
						    	y = self.y;
						    	V3D.msePos.set( ( x / v3d.w ) * 2 - 1, - ( y / v3d.h ) * 2 + 1, 0.5 )


								if ( x > perwr ){
									if( y > v3d.h/2){
										v3d.startRot = {rot: 'dr'};
									}
									else {
										v3d.startRot = {rot: 'ur'};
									}
								}
								else if ( x < perwl ) {
									if( y > v3d.h/2){
										v3d.startRot = {rot: 'dl'};
									}
									else {
										v3d.startRot = {rot: 'ul'};
									}
								}
								else if ( y > perhu ) {
									if( x > v3d.w/2){
										v3d.startRot = {rot: 'dr'}; 
									}
									else {
										v3d.startRot = {rot: 'dl'};
									}
								}
								else if ( y < perhd ) {
									if( x > v3d.w/2){
										v3d.startRot = {rot: 'ur'}; 
									}
									else {
										v3d.startRot = {rot: 'ul'};
									}
								}
								else {
									v3d.startRot = {rot: 0};
								}

								self.angleprev = dp;
							}
					}

				}	

				//}
				// catch (err) {
				// 	document.getElementById('loadingScreen').style.display = 'none';
				// 	var errscreen = document.getElementById('errScreen')
				// 	errscreen.style.display = 'block';
				// 	errscreen.innerHTML = '<div id="errdiv">Sorry there has been an error ' + err.message + ' </div>';
				// }

			}

		}


	}
});