requirejs(['autoGame','gamecore','oimo','three','lib/objloader','socket_io','lib/tgaloader','lib/mtlloader','trackballcontrols','v3d','gameinit','main'],
        function (AUTOGAME,GAMECORE,OIMO, THREE, OBJLOADER, SOCKET_IO,TGALoader, MTLLoader,TRACKBALLCONTROLS, V3D, GAMEINIT, MAIN) {
            	

            	var main = new MAIN;
            	main.init();

            	var gc = new GAMECORE;
            	gc.start();

            	// change to live
            	// var autoGame = new AUTOGAME;
            	// autoGame.init();

        }
    );

