requirejs(['multi/autoGameMulti','asteroid', 'planetex', 'oimo','three', 'setRespawn',
            'lib/OBJLoader', 'socket_io','lib/TGALoader','lib/MTLLoader','lib/trackballcontrols','v3d',
		   'multi/gamecore','multi/gameinitmulti','multi/mainmulti'],
        function (
        	AUTOGAMEMULTI, ASTEROID, PLANETEX, OIMO, SETRESPAWN, THREE, OBJLOADER, 
        	SOCKET_IO,TGALoader, MTLLoader,TRACKBALLCONTROLS, V3D, 
        	GAMECORE, GAMEINITMULTI, MAINMULTI) {
            	

            	var main = new MAINMULTI;
            	main.init();

            	//change to live
            	// var autoGame = new AUTOGAMEMULTI;
            	// autoGame.init();

        }
    );

