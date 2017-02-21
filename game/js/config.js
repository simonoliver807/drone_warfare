requirejs(['autoGame','gamecore','oimo','three','objloader','socket_io','tgaloader','mtlloader','trackballcontrols','v3d','gameinit','main'],
        function (AUTOGAME,GAMECORE,OIMO, THREE, OBJLOADER, SOCKET_IO,TGALoader, MTLLoader,TRACKBALLCONTROLS, V3D, GAMEINIT, MAIN) {
            	

            	var main = new MAIN;
            	main.init();

            	// change to live
            	// var autoGame = new AUTOGAME;
            	// autoGame.init();

        }
    );

