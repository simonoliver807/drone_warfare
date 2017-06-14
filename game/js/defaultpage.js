"use strict";


//var url = 'http://localhost:9000/';
//var url = 'http://192.168.1.107:9000/';

var url = window.location.href;
// change to live 
// setting 0: accel, 1: deccel, 2: shoot, 3: in/out, 4: sfx, 5: stay logged in, 6: look sensitivity, 7: snd volume
var settingsarr = [ 32, 38, 40, 0, 1, 0, 2.5, 5];
//var settingsarr = [ 32, 38, 40, 1, 1, 0, 2.5, 5];
var currply	= { username: 0, password: '' };
var num_emails = 1;
document.getElementById('')


function xhrSuccess () { 
	this.callback.apply(this, this.arguments); 
}

function xhrError () { console.error(this.statusText); }

function loadFile (sURL, fCallback /*, argumentToPass1, argumentToPass2, etc. */) {
  var oReq = new XMLHttpRequest();
  oReq.callback = fCallback;
  oReq.arguments = Array.prototype.slice.call(arguments, 2);
  oReq.onload = xhrSuccess;
  oReq.onerror = xhrError;
  oReq.open("get", sURL, true);
  oReq.responseType = 'arraybuffer';
  oReq.send(null);
}


var audiocntxt;
var masterGain;
var sourceObj = {};
var sourcenum2 = 0;
var ismobile = 0;
var looksen = 0;
var self = this;
loadmobstyle();

function decodeSucc(data) {
	this.callback.apply(this. this.arguments)
}

function decodeErr() {
	console.error(this.statusText);
}

function bufferSound(msg) {

	var msg1 = msg;
	audiocntxt.decodeAudioData( this.response, function(data) {

		if ( data.duration > 2.0 && data.duration < 2.5) {
	 		var name = 'astex';
	 	}
	 	if ( data.duration > 9.1 && data.duration < 9.15) {
	 		var name = 'droneExpl';
	 	}
	 	if ( data.duration > 81.86 && data.duration < 81.88) {
	 		var name = 'droneAudio';
	 	}
	 	if ( data.duration > 14.1 && data.duration < 14.15) {
	 		var name = 'pdown';
	 	}
	 	if ( data.duration > 3 && data.duration < 3.1) {
	 		var name = 'thruster';
	 	}

		sourceObj[name].buffer = data;
		sourceObj[name].connect( audiocntxt.destination );
		sourcenum2 += 1;
		if( sourcenum2 === 4) {
			console.log('load all sounds');
		}

	});
}

var updatePages = (function () {

	var currentpage = { pagetc: 'dronewar1', classtc: 'dwli' };
	
	var disablePage = function( pagetc, classtc, newpage, newclass ) {

		var pagetc = document.getElementById( pagetc );
		pagetc.style.display = 'none';
		document.getElementById( classtc ).className = '';
		var newpage = document.getElementById( newpage );
		newpage.style.display = 'block';
		document.getElementById( newclass ).className = 'current-menu-item';
		
	}

	return {
		navFunc: function (event) {

			window.removeEventListener( 'keydown', glowBadge.updateBadge, false );
			var target = event.target;
			var hs_comm = 'block';
			if ( target.id.match('dwnav') ){
				disablePage( currentpage.pagetc, currentpage.classtc, 'dronewar1', 'dwli' );
				hs_comm = 'block';
				currentpage = { pagetc: 'dronewar1', classtc: 'dwli' }
			}	
			if ( target.id.match('wanav') ){
				disablePage( currentpage.pagetc, currentpage.classtc, 'web_app', 'wali' );
				hs_comm = 'block';
				currentpage = { pagetc: 'web_app', classtc: 'wali' }
			}
			if ( target.id.match('lnav') ){
				disablePage( 'login-page', currentpage.classtc, 'login-page', 'slli' );
				currentpage = { pagetc: 'login-page', classtc: 'slli' }
			}
			if ( target.id.match('snav') ){
				document.getElementById('lnav').style.display = 'none';
				document.getElementById('snav').style.display = 'block';
				disablePage( currentpage.pagetc, currentpage.classtc, 'settings', 'slli' );
				disablePage( 'dronewar1', 'dwli', 'settings', 'slli' );	
				disablePage( 'web_app', 'wali', 'settings', 'slli' );	
				hs_comm = 'none';
				window.addEventListener( 'keydown', glowBadge.updateBadge, false );
				currentpage = { pagetc: 'settings', classtc: 'slli' };

			}
			if ( target.id == 'titleLink' || target.id == 'bannerImg') {
				disablePage( currentpage.pagetc, currentpage.classtc, 'dronewar1', 'dwli' );
				hs_comm = 'block';
				currentpage = { pagetc: 'dronewar1', classtc: 'dwli' }
			}
			var comments1 = document.getElementById('post-187').style.display = hs_comm;
			var comments2 = document.getElementById('comments').style.display = hs_comm;
		}
	}

}());

document.getElementById('loadGame').addEventListener( 'click', initgame);
document.getElementById('loadMultiGame').addEventListener( 'click', initgame);
document.getElementById('startGame').addEventListener( 'click', initgame);
document.getElementById('sndfxbutton').addEventListener( 'click', setButton);
document.getElementById('insidesf').addEventListener( 'click', setButton);
document.getElementById('outsidesf').addEventListener( 'click', setButton);
document.getElementById('dwnav').addEventListener( 'click', updatePages.navFunc);
document.getElementById('wanav').addEventListener( 'click', updatePages.navFunc);
document.getElementById('lnav').addEventListener( 'click', updatePages.navFunc);
document.getElementById('snav').addEventListener( 'click', updatePages.navFunc);
document.getElementById('titleLink').addEventListener( 'click', updatePages.navFunc);
document.getElementById('bannerLink').addEventListener( 'click', updatePages.navFunc);
document.getElementById('menu-toggle').addEventListener( 'click', updateNav);
document.getElementById('message').addEventListener('click', loginAni);
document.getElementById('loginbutton').addEventListener('click', signup_in);
document.getElementById('shoot00').addEventListener('click', setsettings);
document.getElementById('fthrust10').addEventListener('click', setsettings);
document.getElementById('rthrust20').addEventListener('click', setsettings);
document.getElementById('pinside31').addEventListener('click', setsettings);
document.getElementById('poutside31').addEventListener('click', setsettings);
document.getElementById('sfxon42').addEventListener('click', setsettings);
document.getElementById('sfxoff42').addEventListener('click', setsettings);
document.getElementById('slin53').addEventListener('click', setsettings);
document.getElementById('slout53').addEventListener('click', setsettings);
document.getElementById('udset').addEventListener('click', updateSettings);
document.getElementById('looklevel1a').addEventListener('mousemove', lookSettings);
document.getElementById('looklevel1a').addEventListener('mouseover', lookSettings);
document.getElementById('looklevel1a').addEventListener('touchmove', lookSettings);
document.getElementById('looklevel1a').addEventListener('touchstart', lookSettings);
document.getElementById('looklevel1b').addEventListener('mousemove', lookSettings);
document.getElementById('looklevel1b').addEventListener('mouseover', lookSettings);
document.getElementById('looklevel1b').addEventListener('touchmove', lookSettings);
document.getElementById('looklevel1b').addEventListener('touchstart', lookSettings);
document.getElementById('sndlevel1a').addEventListener('mousemove', volumeSettings);
document.getElementById('sndlevel1a').addEventListener('mouseover', volumeSettings);
document.getElementById('sndlevel1a').addEventListener('touchmove', volumeSettings);
document.getElementById('sndlevel1a').addEventListener('touchstart', volumeSettings);
document.getElementById('sndlevel1b').addEventListener('mousemove', volumeSettings);
document.getElementById('sndlevel1b').addEventListener('mouseover', volumeSettings);
document.getElementById('sndlevel1b').addEventListener('touchmove', volumeSettings);
document.getElementById('sndlevel1b').addEventListener('touchstart', volumeSettings);

function loadmobstyle() {

	var n = navigator.userAgent;
	if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)) {
		if ( window.innerWidth == 568 || window.innerWidth == 320 ) {
			document.getElementById('mobilecss').href = 'style/i5.css'
	    }
	     if ( window.innerWidth == 667 || window.innerWidth == 375 ) {
	    	document.getElementById('mobilecss').href = 'style/i6.css'
	    }
	    if ( window.innerWidth == 1024 || window.innerWidth == 768 ) {
	    	document.getElementById('mobilecss').href = 'style/ipad.css'
	    }
	}   

}


function initgame( ev ) { 

	var isChrome = navigator.userAgent.match('Chrome');

	if( isChrome ) {
		audiocntxt = new AudioContext();
	}
	else {
		audiocntxt = new webkitAudioContext();
	}

	masterGain = audiocntxt.createGain();
	masterGain.connect(audiocntxt.destination);
	masterGain.gain.value = settingsarr[7]/10;
	sourceObj['astex'] = audiocntxt.createBufferSource();
	sourceObj['droneExpl'] = audiocntxt.createBufferSource();
	sourceObj['droneAudio'] = audiocntxt.createBufferSource();
	sourceObj['pdown'] = audiocntxt.createBufferSource();
	sourceObj['thruster'] = audiocntxt.createBufferSource();
	loadFile("audio/astex.wav", bufferSound, "loaded astex\n\n");
	loadFile("audio/droneExpl.wav", bufferSound, "loaded droneExpl\n\n");
	loadFile("audio/droneAudio.mp3", bufferSound, "loaded droneAudio\n\n");
	loadFile("audio/pdown.mp3", bufferSound, "loaded pdown\n\n");
	loadFile("audio/thrusters.wav", bufferSound, "loaded thrusters\n\n");

	var numpl;
	ev.target.id.match('loadMultiGame') ? numpl = 1 : numpl = 0;
	runGame(numpl);
}

function setsettings(ev) {

	var t = ev.target.id;
	var el = document.getElementsByClassName('list-group');
	var tnum = t.substring( t.length, t.length - 1);
	var childnode = el[ tnum ].children.length;
	var udset = document.getElementById('udset');
	if ( udset.style.display == 'none' ) {
		udset.style.display = 'block';
		document.getElementById('udsetoff').style.display = 'none';
	}
	while ( childnode-- ){
		el[ tnum ].children[ childnode ].style.backgroundColor = '';
	}
	if ( t.match('0') ){
		if ( glowBadge.el ){
			glowBadge.el.className =  'badge badge-default';
		}
	}
	if( t == 'shoot00') { 
		ev.target.style.backgroundColor = '#007acc';
		clearInterval( glowBadge.badgeInterval );
		glowBadge.setBadge( document.getElementById('sbut') );
	}
	if( t == 'fthrust10') { 
		ev.target.style.backgroundColor = '#007acc';
		clearInterval( glowBadge.badgeInterval );
		glowBadge.setBadge( document.getElementById('fbut') );
	}
	if( t == 'rthrust20') { 
		ev.target.style.backgroundColor = '#007acc';
		clearInterval( glowBadge.badgeInterval );
		glowBadge.setBadge( document.getElementById('rbut') );
	}
	if( t == 'pinside31') { 
		ev.target.style.backgroundColor = '#007acc';
		document.getElementById('ibut').className = 'badge badge-color';
		document.getElementById('obut').className = 'badge badge-default';
		settingsarr[3] = 0;
	}
	if( t == 'poutside31') { 
		ev.target.style.backgroundColor = '#007acc';
		document.getElementById('obut').className = 'badge badge-color';
		document.getElementById('ibut').className = 'badge badge-default';
		settingsarr[3] = 1;
	}
	if( t == 'sfxon42') { 
		ev.target.style.backgroundColor = '#007acc';
		document.getElementById('sfxonbut').className = 'badge badge-color';
		document.getElementById('sfxoffbut').className = 'badge badge-default';
		settingsarr[4] = 1;
	}
	if( t == 'sfxoff42') { 
		ev.target.style.backgroundColor = '#007acc';
		document.getElementById('sfxoffbut').className = 'badge badge-color';
		document.getElementById('sfxonbut').className = 'badge badge-default';
		settingsarr[4] = 0;
	}
	if( t == 'slin53') { 
		ev.target.style.backgroundColor = '#007acc';
		document.getElementById('slinbut').className = 'badge badge-color';
		document.getElementById('sloutbut').className = 'badge badge-default';
		settingsarr[5] = 1;
	}
	if( t == 'slout53') { 
		ev.target.style.backgroundColor = '#007acc';
		document.getElementById('sloutbut').className = 'badge badge-color';
		document.getElementById('slinbut').className = 'badge badge-default';
		settingsarr[5] = 0;
	}
}

var glowBadge = (function () {

	var glow = 1;

	return {
			setBadge: function ( el ) {
				this.el = el;
				self = this;

				this.badgeInterval = setInterval( function(){

					if ( glow ) {
						self.el.className = 'badge badge-color';
						glow = 0;
					}
					else {
						self.el.className = 'badge badge-default';
						glow = 1;
					}

				}, 250)
			},
			updateBadge: function ( ev ) {
				ev.preventDefault();
				var key = 0;
				if ( settingsarr.indexOf( ev.keyCode ) === -1 ) {
					if ( ev.keyCode == 32) {
						key = 'spc';
					}
					if ( ev.keyCode == 37 ) {
						key = 'left';
					}
					if ( ev.keyCode == 38) {
						key = 'up';
					}
					if ( ev.keyCode == 39 ) {
						key = 'right';
					}
					if ( ev.keyCode == 40 ) {
						key = 'down';
					}
					if ( key ) {
						self.el.innerHTML = key;
					}
					else {
						self.el.innerHTML = ev.key;
					}
					var num = self.el.parentElement.id.substring( self.el.parentElement.id.length - 2, self.el.parentElement.id.length - 1 );
					settingsarr[ num ] = ev.keyCode;
				}
				console.log( settingsarr );

			}
		}

})();

function signup_in ( ev ) {

	ev.preventDefault();
	var usrname = document.getElementById('usrname').value;
	var psswrd = document.getElementById('psswrd').value;
	var emailinput = document.getElementById('emailinput').value;
	var loginbutton = document.getElementById('loginbutton');
	var this_post = 0;
	// if ( loginbutton.innerHTML == 'login' && usrname && psswrd) { this_post = 1; }
	// if ( loginbutton.innerHTML == 'create' && usrname && psswrd && emailinput) { this_post = 1; }
	// if ( this_post ) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {

		    	if( this.responseText.match('{') ) { 

		    		var data = JSON.parse( this.responseText );
		   			loadUser(data);

		    	}
		    	else {
		    		document.getElementById('valmess').innerHTML = this.responseText;
		    	}   
		    }

		}
		xhttp.open("POST", url, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send( 'username='+usrname+'&password='+psswrd+'&email='+emailinput+'&settings='+settingsarr );
	
}
function loadUser (data, initialload) {

	document.getElementById('navusr').innerHTML = 'Welcome ' + data.username + ' |';

	var key = '';
	settingsarr = data.settings.split(',').map( function( num ) { return ~~num; } );
	document.getElementById('inoutss').style.display = 'none';
	document.getElementById('usercont').style.display = 'none';
	document.getElementById('sndfxbutrow').style.display = 'none';
	document.getElementById('adjgamevol').style.display = 'none';
	document.getElementById('adjlooksen').style.display = 'none';

	for ( var i = 0; i < 3; i++ ){
		key = '';
		if ( i == 0 ){ var el = document.getElementById('sbut'); }
		if ( i == 1 ){ var el = document.getElementById('fbut'); }
		if ( i == 2 ){ var el = document.getElementById('rbut'); }
		if ( settingsarr[i] == 32) {
			key = 'spc';
		}
		if ( settingsarr[i] == 37 ) {
			key = 'left';
		}
		if ( settingsarr[i] == 38) {
			key = 'up';
		}
		if ( settingsarr[i] == 39 ) {
			key = 'right';
		}
		if ( settingsarr[i] == 40 ) {
			key = 'down';
		}
		if ( key ) {
			el.innerHTML = key;
		}
		else {
			el.innerHTML = String.fromCharCode( settingsarr[i] ).toLowerCase();
		}
	}
	if ( !settingsarr[ 3 ] ) {
		document.getElementById('pinside31').style.backgroundColor = '#007acc';
		document.getElementById('ibut').className = 'badge badge-color';
	}
	if ( settingsarr[ 3 ] ) {
		document.getElementById('poutside31').style.backgroundColor = '#007acc';
		document.getElementById('obut').className = 'badge badge-color';
	}
	if ( settingsarr[ 4 ] ) {
		document.getElementById('sfxon42').style.backgroundColor = '#007acc';
		document.getElementById('sfxonbut').className = 'badge badge-color';
	}
	if ( !settingsarr[ 4 ] ) {
		document.getElementById('sfxoff42').style.backgroundColor = '#007acc';
		document.getElementById('sfxoffbut').className = 'badge badge-color';
	}
	if ( settingsarr[ 5 ] ) {
		document.getElementById('slin53').style.backgroundColor = '#007acc';
		document.getElementById('slinbut').className = 'badge badge-color';
	}
	if ( !settingsarr[ 5 ] ) {
		document.getElementById('slout53').style.backgroundColor = '#007acc';
		document.getElementById('sloutbut').className = 'badge badge-color';
	}
	var ll2b = document.getElementById('looklevel2b');
	var sl2b = document.getElementById('sndlevel2b');
	ll2b.style.width = settingsarr[6] + '0%';
	document.getElementById('looksensvalb').innerHTML = settingsarr[6];
	sl2b.style.width = settingsarr[7] + '0%';
	document.getElementById('sndfxvalb').innerHTML = settingsarr[7];
	document.getElementById( 'looklevel1b' ).style.marginBottom = '28px'; 
	document.getElementById( 'sndlevel1b' ).style.marginBottom = '28px'; 
	ll2b.style.backgroundColor = 'rgb(0, 122, 204)'; 
	sl2b.style.backgroundColor = 'rgb(0, 122, 204)'; 
	if( ismobile ) { 		
		document.getElementById( 'conset' ).style.display = 'none';
		document.getElementById( 'consethead' ).style.display = 'none';
	}
	else {
		document.getElementById( 'adjlooksenb' ).style.display = 'none';
		document.getElementById( 'adjlookhead' ).style.display = 'none';
		looksen = settingsarr[7];
		settingsarr[7] = 10;
	}

	currply = { id: data.id, username: data.username, password: data.password };
	updatePages.navFunc({ target: { id: 'snav'}});
	if ( initialload ) {
		updatePages.navFunc({ target: { id: 'dwnav'}});
	}
}

function updateSettings (ev) {

	ev.preventDefault();
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {

	    	if (this.readyState == 4 && this.status == 200) {

		    	if( this.responseText.match('{') ) { 

		    		var data = JSON.parse( this.responseText );
		    		settingsarr = data.settings.split(',').map( function( num ) { return ~~num; } );
		    	}
		    	else {
		    		document.getElementById('valmess').innerHTML = this.responsetext;
		    	}   
		    }
		    else {
		    	document.getElementById('valmess').innerHTML = 'Sorry this was a problem, please try again.'
		    }
	    	
	    }
	}
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	if ( !ismobile ) {
		settingsarr[7] = looksen;
	}
	xhttp.send( 'id=' + currply.id + '&settings='+settingsarr + '&username='+ currply.username );
	var udset = document.getElementById('udset');
	udset.style.display = 'none';
	udsetoff.style.display = 'block';	
	if ( !ismobile ) {
		settingsarr[7] = 10;
	}
}

document.getElementById('commentsubmit').addEventListener( 'submit', function(event) { 

	event.preventDefault();
	document.getElementById('commentsubmit').disabled = true; 
	var name = document.getElementById('commentname').value;
	var comment = document.getElementById('textarea_1').value;


	var xhttp = new XMLHttpRequest();
	 xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	console.log(this.responseText);
	    }
	}
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send( 'name='+name+'&comment='+comment );
	var commentitem = document.getElementById('comnum1').cloneNode(true);
	commentitem.id = 'new_item';
	commentitem.getElementsByClassName('fn')[0].innerHTML = name;
	var monthNames = [
	  "January", "February", "March",
	  "April", "May", "June", "July",
	  "August", "September", "October",
	  "November", "December"
	];
	var date = new Date();
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	var fulldate =  monthNames[monthIndex];
	if (day == 1){ fulldate += ' 1st, '}
	else if (day == 2){ fulldate += ' 2nd, '}
	else if (day == 3){ fulldate += ' 3rd, '}
	else if (day == 31){ fulldate += ' 31st, '}
	else { fulldate += ' ' + day+'th, '}
	fulldate += '' + year;

	commentitem.getElementsByTagName('time')[0].innerHTML = fulldate;
	commentitem.getElementsByTagName('p')[0].innerHTML = comment;
	document.getElementsByClassName('comment-list')[0].appendChild(commentitem);

 });
function setButton(event) {
	var el = event.currentTarget;
	if ( el.id == 'insidesf' ) {
		settingsarr[ 3 ] = 0;
		document.getElementById('outsidesf').style.background = '#000000';
		el.style.background = '#4CAF50';
	}
	if (  el.id == 'outsidesf' ) {
		settingsarr[ 3 ] = 1;
		document.getElementById('insidesf').style.background = '#000000';
		el.style.background = '#4CAF50';
	}
	if ( el.id == 'sndfxbutton') {

		if ( currply.username === 0 ) {
			var sl2 = document.getElementById('sndlevel2a');
		} 
		else {
			var sl2 = document.getElementById('sndlevel2b');
		}

		if ( el.value == 'on' ) {
			 el.value = 'off';
			 el.style.background = '#000000';
			 settingsarr[4] = 0;
			 sl2.style.width = '0%'; 

		}
		else {
			el.value = 'on';
			el.style.background = '';
			settingsarr[4] = 1; 
			sl2.style.width = settingsarr[7] + '0%'; 
			document.getElementById('sndfxval').innerHTML = settingsarr[7];
		}
	}
}

function lookSettings( ev ) {

	ev.preventDefault();
	var t, x, ll2, looksensval, val = 0;
	if ( currply.username === 0 ) {
		t = document.getElementById('looklevel1a');
		ll2 = document.getElementById('looklevel2a');
		looksensval = document.getElementById( 'looksensval' )
	} 
	else {
		t = document.getElementById('looklevel1b');
		ll2 = document.getElementById('looklevel2b');
		looksensval = document.getElementById( 'looksensvalb' )

	}
	if ( ev.type == 'mousemove' || ev.type == 'mouseover' ) {
		x = ev.offsetX;
	}
	else {
		var rect = ev.touches[0].target.getBoundingClientRect();
		x = ev.touches[0].pageX - rect.left;
	}
	val = calcSliderVal( x, t.clientWidth, 0 );
	ll2.style.width = val + '0%';
	looksensval.innerHTML = val;
	val < 10 ? settingsarr[6] = val : settingsarr[6] = val;
}


function volumeSettings( ev ) {
	ev.preventDefault();
	var t, x, sl2, sndfxval, val = 0;
	if ( currply.username === 0 ) {
		t = document.getElementById('sndlevel1a');
		sl2 = document.getElementById('sndlevel2a');
		sndfxval = document.getElementById('sndfxval');
	} 
	else {
		t = document.getElementById('sndlevel1b');
		sl2 = document.getElementById('sndlevel2b');
		sndfxval = document.getElementById('sndfxvalb');
	}
	if ( ev.type == 'mousemove' || ev.type == 'mouseover' ) {
		x = ev.offsetX;
	}
	else {
		var rect = ev.touches[0].target.getBoundingClientRect();
		x = ev.touches[0].pageX - rect.left;
	}
	if ( settingsarr[4] ){
		settingsarr[7] = calcSliderVal( x, t.clientWidth, 1 );
		sl2.style.width = settingsarr[7] + '0%';
		sndfxval.innerHTML = settingsarr[7];
	}

}

function calcSliderVal( x, w , zero) {

	var val = 0
	if ( zero ) {
		if( x <= ( w * 0.03 ) ) {
			val = 0;
		}
		if( x > ( w * 0.03 ) && x <= ( w * 0.1 ) ) {
			val = 1;
		}
	}
	else {
		if( x <= ( w * 0.1 ) ) {
			val = 1;
		}
	}
	if( x > ( w * 0.1 ) && x <= ( w * 0.2 )  ) {
		val = 2;
	}
	if( x > ( w * 0.2 ) && x <= ( w * 0.3 )  ) {
		val = 3;
	}
	if( x > ( w * 0.3 ) && x <= ( w * 0.4 )  ) {
		val = 4;
	}
	if( x > ( w * 0.4 ) && x <= ( w * 0.5 )  ) {
		val = 5;
	}
	if( x > ( w * 0.5 ) && x <= ( w * 0.6 )  ) {
		val = 6;
	}
	if( x > ( w * 0.6 ) && x <= ( w * 0.7 )  ) {
		val = 7;
	}
	if( x > ( w * 0.7 ) && x <= ( w * 0.8 )  ) {
		val = 8;
	}
	if( x > ( w * 0.8 ) && x <= ( w * 0.9 )  ) {
		val = 9;
	}
	if( x > ( w * 0.9 ) ) {
		val = 10;
	}
	return val;

}


function runGame(numpl) {

	var radios = document.getElementsByName('radio_3698130');

	for (var i = 0, length = radios.length; i < length; i++) {
	    if (radios[i].checked) {
	        
	       document.getElementById('insideship').value = radios[i].value;

	        break;
	    }
	}
	document.body.className += ' custom-background-image';
	var page = document.getElementById('page');
	page.style.display = 'none';
	var game = document.getElementById('game-content');	
	game.style.display = 'block';

	//******** minified change to live *************/////////
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = "js_min/require.js";
	if( numpl ) {
		s.setAttribute('data-main', 'js_min/configmulti.js');
	}
	else {
		s.setAttribute('data-main', 'js_min/config.js')
	}


	//******** unminified *************///////////
	// var s = document.createElement("script");
	// s.type = "text/javascript";
	// s.src = "js/require.js";
	// 	if( numpl ) {
	// 	s.setAttribute('data-main', 'js/configmulti.js');
	// }
	// else {
	// 	s.setAttribute('data-main', 'js/config.js')
	// }

	// if (window.screen.height < 768) {
	// 	document.getElementById('arrowmarginup').className += ' fa-1';
	// 	document.getElementById('arrowmargindown').className += ' fa-1';
	// }

	var head = document.getElementsByTagName("head")[0];
	head.appendChild(s);



}

function updateNav (event) {

	var navbar = document.getElementById('site-header-menu');
	var navbutclss = event.target.className;
	if ( navbutclss.match( 'toggled-on' ) ) {
		event.target.className = 'menu-toggle';
		navbar.className = 'site-header-menu '
	}
	if ( !navbutclss.match( 'toggled-on' ) ) {
		event.target.className = 'menu-toggle toggled-on';
		navbar.className = 'site-header-menu toggled-on'
	}


}
function loginAni () {

	var emailimput = document.getElementById('.emailinput');
	var messageel = document.getElementById('message');
	var loginButton = document.getElementById('loginbutton');
	if ( emailinput.className.match( 'showemail' ) ) {
		emailinput.className = 'hideemail';
		messageel.innerHTML = 'Not registered? <a href="#">Create an account</a>';
		loginButton.innerHTML = 'login';

	}
	else {
		emailinput.className = 'hideemail showemail';
		messageel.innerHTML = 'Already registered? <a href="#">Sign In</a>';
		loginButton.innerHTML = "create";
	}

}
	
window.onload = function() {
	var ios = parseFloat(
	('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
	.replace('undefined', '3_2').replace('_', '.').replace('_', '')
	) || 0;
	if ( ios && ios <= 10 ) {
		document.getElementById('loadMultiGame').className += ' disablea';
		document.getElementById('ios10dis').style.display = 'block';
	}

	var data = document.getElementById('consoleData');
	data = JSON.parse(data.value);
	for( var i = 0; i < data.length; i++ ) {
		var dataObj = data[i];
		console.log( '%c' + dataObj, 'background: #222; color: #bada55' );
	}
	var userdata = document.getElementById('userdata').value;
	 var n = navigator.userAgent;
	if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)) {
		ismobile = 1;
	}
	if ( userdata != '0' ) { 
		loadUser( JSON.parse( userdata ), 1 ); 
		document.getElementById( 'looklevel2b' ).style.backgroundColor = 'rgb(0, 122, 204)'; 
		document.getElementById( 'sndlevel2b' ).style.backgroundColor = 'rgb(0, 122, 204)'; 
		document.getElementById( 'looklevel1b' ).style.marginBottom = '28px'; 
		document.getElementById( 'sndlevel1b' ).style.marginBottom = '28px'; 
		if( ismobile ) { 		
			document.getElementById( 'conset' ).style.display = 'none';
			document.getElementById( 'consethead' ).style.display = 'none';
		}
		else {
			document.getElementById( 'adjlooksenb' ).style.display = 'none';
			document.getElementById( 'adjlookhead' ).style.display = 'none';
			looksen = settingsarr[7];
			settingsarr[7] = 10;
		}
	}
	else {
		document.getElementById('outsidesf').style.background = '#000000';
		if( !ismobile ) {
			document.getElementById( 'adjlooksen' ).style.display = 'none';
			looksen = settingsarr[7];
			settingsarr[7] = 10;
		}
	}


	// change to live
	//updatePages.navFunc( { target: { id: 'snav' }} );
}
window.onerror = function myErrorHandler(errormsg, url_e, l_no) {
	if ( num_emails <= 3) {
	    document.getElementById('container').style.display = 'none';
		var errscreen = document.getElementById('errScreen')
		errscreen.style.display = 'block';
		errscreen.innerHTML = '<div id="errdiv">Sorry drone war 1 is not available at this time </div>';
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", url, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send( 'errormsg=' + errormsg + '&url_e='+url_e + '&l_no='+ l_no + '&userdata=' + document.getElementById('userdata').value );
		num_emails ++;
	    return false;
	}
}


	
// change to live
//runGame(0);
//initgame();
//var page = { target: { id: 'wanav' } };
//navFunc(a);





