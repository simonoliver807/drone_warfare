requirejs(['autoGame','oimo','three','objloader','socket_io','tgaloader','mtlloader','v3d','gameinit','main'],
        function (AUTOGAME,OIMO, THREE, OBJLOADER, SOCKET_IO,TGALoader, MTLLoader, V3D, GAMEINIT, MAIN) {
            	

            	var main = new MAIN;
            	main.init();

            	// change to live
            	// var autoGame = new AUTOGAME;
            	// autoGame.init();

        }
    );

