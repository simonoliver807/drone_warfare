define(['gameinit','v3d'], function(GAMEINIT,V3D){
	'use strict'

	return function(){
		var gameinit = new GAMEINIT;
		var container = document.getElementById('container'); 

		var accel;
		var timestep = 1/60;
		var render;
		var v3d = gameinit.getObj('v3d');
		var phaser;

		// mousemove variables
		var x = 0;
		var y = 0; 
		var clientX = 0;
		var clientY = 0;
		var	perw = v3d.w * 0.01;
		var	perh = v3d.h * 0.01;
		var	perwr = v3d.w - perw;
		var	perwl = perw;
		var	perhu = v3d.h - perh;
		var	perhd = perh
		var newx = 0;
		var newy = 0;
		var xdir = 0;
		var ydir = 0;
		var looksens = 0;
		var setintcontrols = 0;
		var self;





		return {
			init: function(){
		// change to live
			try {
					window.oncontextmenu = function (){ return false; }
					window.addEventListener( 'resize', this.onWindowResize, false );

					accel = document.getElementById('accel');
					var ac = document.getElementById('accelCont');
					var tapaccel = document.getElementById('tapaccel');
					// var ach = ac.clientHeight/2;
					// var acw = ac.clientWidth * 0.01;
					// accel.style.top = ach+'px';
					// accel.style.right = acw + 'px';
					var mobcon = document.getElementById('mobcon')

					//v3d = gameinit.getObj('v3d');
					gameinit.createWorld(timestep);
					//gameinit.populate();
					gameinit.lgd(1);
					phaser = false;

							
				    v3d.initLight();
				    v3d.initPoints();	

				    if ( settingsarr[6] !== 10 ) {
				    	clientX = v3d.w / 2;
				    	clientY = v3d.h / 2;
				    	newx = v3d.w / 2;
				    	newy = v3d.h / 2;
		    		}

				    var n = navigator.userAgent;
				    if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)) {
				    	v3d.ismobile = true;
				    	this.loadMobileEvents(n);
				    	// if( n.match(/iPhone/i) && !window.navigator.standalone ) {
				    	// 	this.showPopup('isShowPopup');
				    	// }
				    }   
				    else {
				    	this.loadEvents();
				    }	

				}
				catch (err) {
					document.getElementById('loadingScreen').style.display = 'none';
					var errscreen = document.getElementById('errScreen')
					errscreen.style.display = 'block';
					errscreen.innerHTML = '<div id="errdiv">Sorry drone war 1 is not available at this time </div>';
				}
			},

			handleKeyDown: function( event ) {

				// change to live
			    //event.preventDefault();
			    // change to live
				if( event.keyCode === 80) {
					var val = gameinit.gspause() ? 0: 1;
				    gameinit.gspause(val);
				}
				// change to live
				if ( event.keyCode == 83) {
					var bodys = gameinit.getObj('bodys');
					bodys[0].body.linearVelocity.init();
				}
				if ( event.keyCode == 70) {
					document.body.webkitRequestFullScreen();
				}
				if ( settingsarr.indexOf( event.keyCode ) !== -1) {
					var keys = gameinit.getObj('keys');
					keys[event.which] = 1;
				}

			},
			handleKeyUp: function(event){

					var keys = gameinit.getObj('keys');
					keys[event.which] = 0;;
					if( event.keyCode == settingsarr[1] || event.keyCode == settingsarr[2] ) {
						if ( settingsarr[4] ) {
							v3d.thruster.stop();
							v3d.pThrust = 0;
						}
					}

			},
			handleMouseMove: function(event){

				if(V3D.mm === 0) { V3D.mm = 1 };

				if ( settingsarr[6] === 10 || event.target.id != 'mobcon'  ) {				
					if( event.target.id == 'mobcon') {
			    		x = ((event.pageX - mobcon.offsetLeft)/13)*100;
			    		y = ((event.pageY - mobcon.offsetTop )/13)*100; 
						clientX = x;
						clientY = y;
						V3D.clientx = x;
						V3D.clienty = y;
					}
					else {
						x = event.clientX;
						y = event.clientY;
						clientX = event.clientX;
						clientY = event.clientY;
						V3D.clientx = event.clientX;
						V3D.clienty = event.clientY;
					}
					

					V3D.msePos.set( ( x / v3d.w ) * 2 - 1, - ( y / v3d.h ) * 2 + 1, 0.5 )


					V3D.pageX = x;
					V3D.pageY = y;

					if ( clientX > perwr ){
						v3d.startRot = 1;
					}
					else if ( clientX < perwl ) {
						v3d.startRot = 1;
					}
					else if ( clientY > perhu ) {
						v3d.startRot = 1;
					}
					else if ( clientY < perhd ) {
					 	v3d.startRot = 1;
					}
					else {
					 	v3d.startRot = 0;
					}
				}
				else {

		    		newx = ((event.pageX - mobcon.offsetLeft)/13)*100;
		    		newy = ((event.pageY - mobcon.offsetTop )/13)*100; 
		    		if ( !setintcontrols ) {
						setintcontrols =  setInterval( this.updateLookSen, 16 );
					}

				}
			},
			updateLookSen: function() {


						xdir = ( newx / v3d.w ) * 2 - 1;
						ydir = - ( newy / v3d.h ) * 2 + 1;
						if ( clientX < v3d.w && clientX > 0 ) { clientX += settingsarr[6] * xdir; }
						if ( clientY < v3d.h && clientY > 0 ) { clientY += -settingsarr[6] * ydir; }
						if ( clientX >= v3d.w ) { clientX = v3d.w - 1; }
						if ( clientX <= 0 ) { clientX = 1; }
						if ( clientY >= v3d.h ) { clientY = v3d.h - 1; }
						if ( clientY <= 0 ) { clientY = 1; }
			    		V3D.msePos.set( ( clientX / v3d.w ) * 2 - 1, - ( clientY / v3d.h ) * 2 + 1, 0.5 );
						V3D.pageX = clientX;
						V3D.pageY = clientY;

						if ( clientX > perwr ){
							v3d.startRot = 1;
						}
						else if ( clientX < perwl ) {
							v3d.startRot = 1;
						}
						else if ( clientY > perhu ) {
							v3d.startRot = 1;
						}
						else if ( clientY < perhd ) {
						 	v3d.startRot = 1;
						}
						else {
						 	v3d.startRot = 0;
						}
		
			},
			// showPopup: function (type) {

			// 	var popup = document.getElementById('popup');
			// 	var orchng = 0;
			// 	if ( type == 'orchng' && popup.style.display == 'block') {

			// 		orchng = 1;

			// 	}
			// 	if ( type == 'isShowPopup' || orchng ) {
		 //    		var screen = document.body;
		 //    		popup.style.display = 'block';
		 //    		popup.style.top = Math.max(0, ((screen.clientHeight - popup.clientHeight) / 2) + screen.scrollTop) + "px";
		 //    		popup.style.left = Math.max(0, ((screen.clientWidth - popup.clientWidth) / 2) + screen.scrollLeft) + "px";
		 //    		document.getElementById('nothanks').addEventListener('click', this.showWebAppPage);
		 //    		document.getElementById('yesplease').addEventListener('click', this.showWebAppPage);
		 //    	}

			// },
			showWebAppPage: function (event) {
				if ( event.target.id.match('yesplease') ){
					
					if ( !gameinit.gspause() ) {
						gameinit.gspause( 1 );
					}
					document.getElementById('level1Img').style.display = 'none'
					document.getElementById('page').style.display = 'block';
					document.getElementById('game-content').style.display = 'none';
					var page = { target: { id: 'wanav' } };
					navFunc(page);
				}
				document.getElementById('popup').style.display = 'none';
			},
			loadEvents: function(){

				window.addEventListener( 'keydown', this.handleKeyDown, false );
				window.addEventListener( 'keyup', this.handleKeyUp, false );
				window.scrollTo(0, document.body.clientHeight);
				window.addEventListener('mousemove', this.handleMouseMove, false);

			},
			loadMobileEvents: function(n) {
				self = this;
				// window.addEventListener('orientationchange', function() {
				// 	console.log(event);
				// 	self.showPopup('orchng');
				// });
				mobcon.style.display = 'block';
				var keys = gameinit.getObj('keys');
		    	if( n.match(/iPhone/) ){
		    		if(!V3D.bincam){
		    			var pos = 0.1;
		    			v3d.camdist = 0.09;}    
		    		else {
		    			var pos = 5;
		    			v3d.camdist = 4.9;}
		    	}
		    	if( n.match(/iPad/) ){
		    		if(!V3D.bincam){
		    			var pos = 0.1;
		    			v3d.camdist = 0.09}    
		    		else {
		    			var pos = 7;
		    			v3d.camdist = 6.9;}
		    	}
		    	v3d.camera.position.z = pos;
		    	//v3d.sight.position.z = pos * -1;
		        v3d.tmpsightz = pos * -1;
		        v3d.tmpVCPprev = new v3d.tvec(0,0,pos);
		        // for the rotation
		    	var addforce = document.getElementById('addforce');
		    	var minusforce = document.getElementById('minusforce');
		    	addforce.style.display = 'block';
		    	minusforce.style.display = 'block';


		    	container.addEventListener('touchstart', handleStart, false);
		    	container.addEventListener('touchend', handleEnd, false);
		    	container.addEventListener('touchmove', handleMove, false);
		    	container.addEventListener('touchend', handleOut, false);
		    	var toucharr = [];
		    	function handleStart() {
		    		event.preventDefault();
		    		// if controls stop working in chrome again. it is because of the game auto load in default.js
		    		for(var i = 0; i< event.changedTouches.length; i++) {
		    			if( event.changedTouches[i].target.id == 'addforce' ){
		    				keys[ settingsarr[1] ] = 1;
		    			}
		    			if( event.changedTouches[i].target.id == 'minusforce' ){
		    				keys[ settingsarr[2] ] = 1;
		    			}
		    			if(event.changedTouches[i].target.id == 'gamecanvas'){
		    				if(!phaser){
		    					keys[ settingsarr[0] ] = 1;
		    					phaser = 1;
		    				}
		    				else {
		    					keys[ settingsarr[0] ] = 0;
		    					phaser = 0;
		    				}	
		    			}
		    		}

		    	}

		    	function handleEnd() {
		    		event.preventDefault();
		    		for(var i = 0; i< event.changedTouches.length; i++) {
		    			if(event.changedTouches[i].target.id == 'addforce'){
		    				keys[ settingsarr[1] ] = 0;
		    				if( settingsarr[4] ) {
			    				v3d.thruster.stop();
								v3d.pThrust = 0;
							}
		    			}
		    			if(event.changedTouches[i].target.id == 'minusforce' ){
		    				keys[ settingsarr[2] ] = 0;
		    				if( settingsarr[4] ) {
			    				v3d.thruster.stop();
								v3d.pThrust = 0;
							}
		    			}
		    			if(event.changedTouches[i].target.id == 'mobcon'){
		    				mobcon.style.opacity = '1';
		    			}
		    		}
		    	}
		    	function handleMove() {
		    		event.preventDefault();
		    		for(var i = 0; i< event.changedTouches.length; i++) {
		    			if(event.changedTouches[i].target.id == 'mobcon'){
		    				self.handleMouseMove(event.changedTouches[i]);
		    				mobcon.style.opacity = '0.1';
		    			}
		    		}
		    	}
		    	function handleOut() {
		    		event.preventDefault();
		    		if( setintcontrols ) {
		    			clearInterval( setintcontrols );
		    			setintcontrols = 0;
		    		}
		    	}
			},
			onWindowResize: function(){
		    	v3d.camera.aspect = window.innerWidth / window.innerHeight;
		    	v3d.camera.fov = ( 360 / Math.PI ) * Math.atan( v3d.tanFOV * ( window.innerHeight / window.innerHeight ) );
		    	v3d.camera.updateProjectionMatrix();
		    	v3d.renderer.setSize( window.innerWidth, window.innerHeight );
		    	v3d.h = window.innerHeight;
		    	v3d.w = window.innerWidth;

		    	v3d.controls.handleResize();

			}


		}
	}

});