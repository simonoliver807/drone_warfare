define([], function() {

"use strict";

	return function genRespawn( tt, droneShot, x982y ) {

		document.getElementById('respawnImg').style.display = 'block';
		document.getElementById('droneCount').style.display = 'block';
		document.getElementById('numDrone').innerHTML = droneShot;
		document.getElementById('numLevel').innerHTML = x982y ;
		var now = new Date();
		var millis = now.getTime() - tt;
		var minutes = Math.floor(millis / 60000);
		var seconds = ((millis % 60000) / 1000).toFixed(0);
		minutes = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
		document.getElementById('timeTaken').innerHTML = minutes;

	}

});