requirejs(['multi/autoGameMulti','oimo','three','lib/objloader','socket_io','lib/tgaloader','lib/mtlloader','lib/trackballcontrols','v3d','multi/gamecore','multi/gameinitmulti','multi/mainmulti'],
        function (AUTOGAMEMULTI,OIMO, THREE, OBJLOADER, SOCKET_IO,TGALoader, MTLLoader,TRACKBALLCONTROLS, V3D, GAMECORE, GAMEINITMULTI, MAINMULTI) {
            	

            	var main = new MAINMULTI;
            	main.init();

            	// change to live
            	// var autoGame = new AUTOGAMEMULTI;
            	// autoGame.init();

        }
    );

