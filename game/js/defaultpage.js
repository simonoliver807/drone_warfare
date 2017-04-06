"use strict";


var url = 'http://192.168.1.92:9000/';
//var url = 'http://www.dronewar1.com'
var soundFX = 1; 
// change to live 



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

function decodeSucc(data) {
	this.callback.apply(this. this.arguments)
}
function decodeErr() {
	console.error(this.statusText);
}
function bufferSound(msg) {

	// console.log(msg);
	// responseArr.push( this.response );

	console.log(' load sounds ');
	var msg1 = msg;
	audiocntxt.decodeAudioData( this.response, function(data) {

	 	if ( data.duration > 3 && data.duration < 3.1) {
	 		var name = 'thruster';
	 	}
	 	if ( data.duration > 9.1 && data.duration < 9.15) {
	 		var name = 'droneExpl';
	 	}
		if ( data.duration > 14.1 && data.duration < 14.15) {
	 		var name = 'pdown';
	 	}
	 	if ( data.duration > 81.86 && data.duration < 81.88) {
	 		var name = 'droneAudio';
	 	}

		sourceObj[name].buffer = data;
		sourceObj[name].connect( audiocntxt.destination );
		sourcenum2 += 1;
		if( sourcenum2 === 4) {
			console.log('load all sounds');
		}

	});

	
}

document.getElementById('loadGame').addEventListener( 'click', initgame);
document.getElementById('loadMultiGame').addEventListener( 'click', initgame);
document.getElementById('startGame').addEventListener( 'click', initgame);
document.getElementById('sndfxbutton').addEventListener( 'click', setSoundFx);
document.getElementById('dwnav').addEventListener( 'click', navFunc);
document.getElementById('wanav').addEventListener( 'click', navFunc);
document.getElementById('titleLink').addEventListener( 'click', navFunc);
document.getElementById('bannerLink').addEventListener( 'click', navFunc);
document.getElementById('menu-toggle').addEventListener( 'click', updateNav);




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
	sourceObj['droneExpl'] = audiocntxt.createBufferSource();
	sourceObj['droneAudio'] = audiocntxt.createBufferSource();
	sourceObj['pdown'] = audiocntxt.createBufferSource();
	sourceObj['thruster'] = audiocntxt.createBufferSource();
	loadFile("audio/droneExpl.wav", bufferSound, "loaded droneExpl\n\n");
	loadFile("audio/droneAudio.mp3", bufferSound, "loaded droneAudio\n\n");
	loadFile("audio/pdown.mp3", bufferSound, "loaded pdown\n\n");
	loadFile("audio/thrusters.wav", bufferSound, "loaded thrusters\n\n");

	var numpl;
	ev.target.id.match('loadMultiGame') ? numpl = 1 : numpl = 0;

	//change to live
	runGame(numpl);
};
document.getElementById('commentsubmit').addEventListener( 'submit', function(event) { 

	event.preventDefault();
	document.getElementById('commentsubmit').disabled = true; 
	var name = document.getElementById('commentname').value;
	var comment = document.getElementById('textarea_1').value;


	var xhttp = new XMLHttpRequest();
	 xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
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
function setSoundFx(event) {
	var el = event.currentTarget;
	if ( el.value == 'on' ) {
		 el.value = 'off';
		 el.style.background = '#000000';
		 soundFX = 0; 

	}
	else {
		el.value = 'on';
		el.style.background = '#00b300';
		soundFX = 1; 
	}
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
	// s.setAttribute('data-main', 'js_min/config.js')


	//******** unminified *************/////////
	// var s = document.createElement("script");
	// s.type = "text/javascript";
	// s.src = "js/require.js";
	// change to live multi
	if( numpl ) {
		s.setAttribute('data-main', 'js/configmulti.js');
	}
	else {
		s.setAttribute('data-main', 'js/config.js')
	}
	if (window.screen.height < 768) {
		document.getElementById('arrowmarginup').className += ' fa-1';
		document.getElementById('arrowmargindown').className += ' fa-1';
	}

	var head = document.getElementsByTagName("head")[0];
	head.appendChild(s);



}
function navFunc(event) {

	var target = event.target;
	if ( target.id.match('dwnav') ){
		var dronewar1 = document.getElementById('dronewar1');
		dronewar1.style.display = 'block';
		document.getElementById('dwli').className = 'current-menu-item';
		var web_app = document.getElementById('web_app');
		web_app.style.display = 'none';
		document.getElementById('wali').className = ''
	}	
	if ( target.id.match('wanav') ){
		var dronewar1 = document.getElementById('dronewar1');
		dronewar1.style.display = 'none';
		document.getElementById('dwli').className = ''
		dronewar1.className = ''
		var web_app = document.getElementById('web_app');
		web_app.style.display = 'block';
		document.getElementById('wali').className = 'current-menu-item'
	}
	if ( target.id == 'titleLink' || target.id == 'bannerImg') {
		var page = { target: { id: 'dwnav' } };
		navFunc(page);
	}
	return false;

}
function updateNav (event) {

	var navbar = document.getElementById('site-header-menu');
	var navbutclss = event.target.className;
	if ( navbutclss.match( 'toggled-on' ) ) {
		event.target.className = 'menu-toggle';
		navbar.className = 'site-header-menu '
		//navbar.style.display = 'none';
	}
	if ( !navbutclss.match( 'toggled-on' ) ) {
		event.target.className = 'menu-toggle toggled-on';
		navbar.className = 'site-header-menu toggled-on'
		//navbar.style.display = 'block';
	}


}
(function() {
	var data = document.getElementById('consoleData');
	data = JSON.parse(data.value);
	for( var i = 0; i < data.length; i++ ) {
		var dataObj = data[i];
		console.log( '%c' + dataObj, 'background: #222; color: #bada55' );
	}

}) ();
// change to live
//runGame(1);
//initgame();
//var page = { target: { id: 'wanav' } };
//navFunc(a);






