requirejs(['autoGame','oimo','three','lib/objloader','socket_io','lib/tgaloader','lib/mtlloader','trackballcontrols','v3d','multi/gamecore','multi/gameinitmulti','multi/mainmulti'],
        function (AUTOGAME,OIMO, THREE, OBJLOADER, SOCKET_IO,TGALoader, MTLLoader,TRACKBALLCONTROLS, V3D, GAMECORE, GAMEINITMULTI, MAINMULTI) {
            	

            	var main = new MAINMULTI;
            	main.init();

            	// change to live
            	// var autoGame = new AUTOGAME;
            	// autoGame.init();

        }
    );

