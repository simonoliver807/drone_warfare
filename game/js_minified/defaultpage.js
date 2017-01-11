var loadgame = document.getElementById('loadGame').addEventListener( 'click', function(data) {

	// var form = document.getElementById('form1')
	// form.submit();

	runGame();


});

var startgame = document.getElementById('startGame').addEventListener( 'click', function(data) {

	runGame();


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
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = "js_minified/require.js";
	s.setAttribute('data-main', 'js_minified/config.js')
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(s);



}