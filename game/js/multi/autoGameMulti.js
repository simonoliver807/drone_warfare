define(['multi/gameinitmulti','v3d'], function(GAMEINITMULTI,V3D){
	'use strict'

	return function(){
		var gameinit = new GAMEINITMULTI;
		var v3d;
		var timestep = 1/60;
		var ld;






		return {

			init: function() {


					window.oncontextmenu = function (){ return false; }
					window.addEventListener( 'resize', onWindowResize, false );
					window.addEventListener( 'keydown', handleKeyDown, false );


					v3d = gameinit.getObj('v3d');
					gameinit.createWorld(timestep);
					gameinit.lgd(1);


							
				    v3d.initLight();
				    v3d.initPoints();		


				    this.x = v3d.w/2;
				    this.y = v3d.h/2;
				    this.shp1 = 0;
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
				    this.bincount = 0;
				    this.retargetCnt = 0;

				    // set to not target drones
				    this.notDrone = 0;
				    // set to not target ms
				    this.notMS = 1;
				    // set to not target ld drones for pl2
				    this.notpl2 = 1;

				    // have pl2 look at pl1
				    this.pl2tpl1 = 0;

				    this.setld = 0;

				    this.setpl2rev = 1;


				    this.lv = 200;
				    this.dnum;
				    var self = this;
				    this.host = 0;
				    this.player = 0;
				    this.ms1d = 0;
				    this.ms2d = 0;



				    setInterval( checkBody, 10 );


				    function handleKeyDown ( event ) {

						//event.preventDefault();
						if( event.keyCode === 80) {
							var val = gameinit.gspause() ? 0: 1;
						    gameinit.gspause(val);
						}
						if ( event.keyCode == 70) {
							document.body.webkitRequestFullScreen();
						}
					};

				    function checkBody(){

				    	if ( !self.shp1 ) {
						    var bodys = gameinit.getObj('bodys');
						    if( bodys.length > 1 ) {
			   					for(var i=0; i < bodys.length; i++) {
									if(bodys[i].name == 'shp1'){
										self.shp1 = bodys[i].body;
										break;
									}
								}
							}
						}
						if ( !self.dnum ) {							
						    for( var i = 0; i < v3d.scene.children.length ; i++ ) {

						    	if ( v3d.scene.children[i].name == 'drones' ) {

						    		self.dnum = i;

						    	}

						    }
						 }
						if( self.shp1 && self.dnum ) {
							updateShip();
						}

				    }
 
				    
					function onWindowResize(){
				    	v3d.camera.aspect = window.innerWidth / window.innerHeight;
				    	v3d.camera.fov = ( 360 / Math.PI ) * Math.atan( v3d.tanFOV * ( window.innerHeight / window.innerHeight ) );
				    	v3d.camera.updateProjectionMatrix();
				    	v3d.renderer.setSize( window.innerWidth, window.innerHeight );
				    	v3d.h = window.innerHeight;
				    	v3d.w = window.innerWidth;
					}


				    function updateShip() {

						function getTar () {


							var bodys = gameinit.getObj('bodys');
							var dist = v3d.tvec();
							var minlen = 0;
							for(var i=0; i < bodys.length; i++) {

								if( bodys[i].name.match('ms')){
									var msnum = v3d.scene.children.length;
									while(msnum--){
										if(v3d.scene.children[msnum].name == bodys[i].name){
											if ( v3d.scene.children[msnum].children[0].children[0].children.length === 0 ) {
												msyn = 0;
												console.log('ms undefined in autogame'); 
											}
											else {
												//var msyn = v3d.scene.children[msnum].children[0].children[0].children.length;
												var msyn = 1;
											}
										}
									}
								}

								if( bodys[i].name == 'drone' || (bodys[i].name.match('ms') && msyn) ){
									dist.subVectors(self.shp1.position, bodys[i].body.position);
									var len = dist.length();
									if(len < minlen || minlen === 0 ){
										minlen = len;
										//var tar = v3d.tvec();
										//tar.set( bodys[i].body.position.x, bodys[i].body.position.y, bodys[i].body.position.z);
										self.tarvec.set( bodys[i].body.position.x, bodys[i].body.position.y, bodys[i].body.position.z);
										self.tarvec.multiplyScalar(100);
										if(bodys[i].name == 'drone' && !self.notDrone ){
											for(var j=0; j< v3d.scene.children[self.dnum].children.length; j++){
												var drone = v3d.scene.children[self.dnum].children[j];
												if( self.tarvec.equals(drone.position)  ){
													// so I can test ply1 update ld  
													if( self.setld && !bodys[i].ld ){ bodys[i].ld = self.setld; }
													if ( (self.notpl2 && bodys[i].ld === ld )  || !self.notpl2 ) {
														self.tarbody = drone;
													}
												}
											}
										}
										if(bodys[i].name == 'drone' && self.notDrone ){
											minlen = 0;
										}
										if( bodys[i].name.match('ms') && !self.notMS ) {
											for(var k=0; k< v3d.scene.children.length; k++){
												var ms = v3d.scene.children[k];
												if ( ms.name == bodys[i].name ){
													self.tarbody = ms;
												}
											}
										}
										if( bodys[i].name.match('ms') && self.notMS ) {
											minlen = 0;
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
						    self.retargetCnt = 0;
						    self.bincount = 0;
						}
					
						var es = gameinit.getObj('endsequence');
				    	if( es  < 100 ){
				    		//self.shp1;
						    reset();
						   // self.shp1.position.set(0,0,0);
				    	}
				    	else {
				    		var containerMesh = gameinit.getObj('containerMesh');

				    		if(containerMesh){



				    			var keys = gameinit.getObj('keys');
				    			if( !keys[32]){
									keys[32] = 1;
								}
								self.host = gameinit.getObj( 'host' );
								self.host ? ld = 1 : ld = 2;
	

				    			if(self.chngdir == 99) {
				    				var target = 0;
				    				if( self.tarbody.name == 'drone' ) {
					    				for(var i = 0; i < v3d.scene.children[self.dnum].children.length; i++ ){
					    					if(self.tarbody.id == v3d.scene.children[self.dnum].children[i].id){
					    						target = 1;
					    					}
					    				}
					    			}
					    			if( self.tarbody.name.match('ms') ){
					    				for(var i = 0; i < v3d.scene.children.length; i++ ){

					    					if( self.tarbody.userData.msname == v3d.scene.children[i].userData.msname){
					    						if( v3d.scene.children[i].children[0].children[0] ){
				    								var msyn = v3d.scene.children[i].children[0].children[0].children.length;
				    							}
				    							if( msyn ){ target = 1};
					    						// }
					    			// 			var msyn = 0;
					    			// 			var t = 0;
												// v3d.scene.children[i].userData.msname.match('ms1') ? t = v3d.ms1y.t : t = v3d.ms2y.t;
												// if ( t < 201 ){
												// 	target = 1;
												// }

					    					}

					    				}
					    			}


					    			if( !target ) {
					    				reset();
					    			}

					    			self.retargetCnt ++;

				    			}
				    			if ( self.pl2tpl1 && self.host === 0 ) {
			    					for ( var i = 0; i < v3d.scene.children.length; i++ ){			    					
			    						if ( v3d.scene.children[i].name == 'player2' ) {
				    						self.tarbody = v3d.scene.children[i]; 
				    						break;
				    					}
			    					}
			    				}
			    				if ( !self.host ) {

		    					    self.notDrone = 0;

				    				self.notMS = 1;

				    				self.notpl2 = 0;
				    				self.pl2tpl1 = 0;

				    				if ( self.setpl2rev ) {
				    					self.lv = -200;
				    				} 

			    				}
			    				if ( self.host ) {

			    					self.notDrone = 0;

				    				self.notMS = 0;

				    				self.notpl2 = 0;

			    				}
				    			if ( self.tarbody === 0){
									getTar();
								}
								if (self.retargetCnt == 100 && !self.pl2tpl1){
									getTar();
									self.retargetCnt = 0;
								}

								if ( self.bincount == 3) {
									self.shp1.linearVelocity.set(0,0,0);
									var ldh = v3d.tvec(self.tarbody.position.x,self.tarbody.position.y, self.tarbody.position.z);
									ldh.normalize();
									//var len = ldh.length();
									ldh.multiplyScalar(self.lv);
									self.shp1.linearVelocity.addTime(ldh, self.timestep); 
									self.bincount = 0;

								}
								else {
									self.bincount ++;
								}
								var v1 = v3d.tvec();
								v1.subVectors(v3d.sight.position, v3d.containerMesh.position).normalize();


								var v2 = v3d.tvec();


							if ( self.tarbody != 0 ){

								if ( self.tarbody.name.match('ms1') && V3D.x982y === 3) {
									for (var i = 0; i < v3d.scene.children.length; i++) {
										if( v3d.scene.children[i].name == 'ms1') {
											self.tarbody.position.copy( v3d.scene.children[i].position );
										}
									}
								}

								v2.subVectors(self.tarbody.position, v3d.containerMesh.position).normalize();
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

							    		vector1.subVectors( self.tarbody.position, v3d.containerMesh.position ).normalize();
							    		vector1.multiplyScalar(90);
							    		vector2.addVectors( vector1, v3d.containerMesh.position );

							    		var xy = toScreenPosition( 0, v3d.camera, vector2);
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

										if( self.arrposcnt < self.arrpos.length ){
											self.x += self.arrpos[self.arrposcnt];
											self.y += self.arrpos[self.arrposcnt+1];
											self.arrposcnt += 2;
										}
										else {
											self.arrposcnt = 0;
											self.lockcount = 0;
										}

									}
									if ( self.lockcount < 10 ){
										self.lockcount +=1 ;
									}

								}
								


						    	x = self.x;
						    	y = self.y;
						    	V3D.msePos.set( ( x / v3d.w ) * 2 - 1, - ( y / v3d.h ) * 2 + 1, 0.5 )

						    	V3D.pageX = x;
								V3D.pageY = y;

								if ( x > perwr ){
									v3d.startRot = 1;
								}
								else if ( x < perwl ) {
									v3d.startRot = 1;
								}
								else if ( y > perhu ) {
									v3d.startRot = 1;
								}
								else if ( y < perhd ) {
								 	v3d.startRot = 1;
								}
								else {
								 	v3d.startRot = 0;
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