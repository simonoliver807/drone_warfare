//var url = 'http://localhost:9000/';
var url = 'http://grisly-scarecrow-29073.herokuapp.com'

var loadgame = document.getElementById('loadGame').addEventListener( 'click', function() { runGame(); });
var startgame = document.getElementById('startGame').addEventListener( 'click', function() { runGame(); });
var commentsForm = document.getElementById('commentsubmit').addEventListener( 'click', function() { 

	document.getElementById('commentsubmit').disabled = true; 
	var name = document.getElementById('commentname').value;
	var comment = document.getElementById('textarea_1').value;


	var xhttp = new XMLHttpRequest();
	 xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	      console.log('ready to send'); 
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
	//var day = date.getDate();
	var day = 31;
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

function runGame() {

	var radios = document.getElementsByName('radio_3698130');

	for (var i = 0, length = radios.length; i < length; i++) {
	    if (radios[i].checked) {
	        
	       document.getElementById('insideship').value = radios[i].value;

	        break;
	    }
	}
	var page = document.getElementById('page');
	page.style.display = 'none';
	var game = document.getElementById('game-content');	
	game.style.display = 'block';


	//******** minified *************/////////
	// var s = document.createElement("script");
	// s.type = "text/javascript";
	// s.src = "js_minified/require.js";
	// s.setAttribute('data-main', 'js_minified/config.js')


	//******** unminified *************/////////
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = "js/require.js";
	s.setAttribute('data-main', 'js/config.js')



	var head = document.getElementsByTagName("head")[0];
	head.appendChild(s);



}

runGame();