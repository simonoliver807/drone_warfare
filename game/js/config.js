requirejs(['autoGame','oimo','three','lib/objloader','lib/tgaloader','lib/mtlloader','trackballcontrols','v3d','gameinit','main'],
        function (AUTOGAME,OIMO,THREE, OBJLOADER,TGALoader, MTLLoader,TRACKBALLCONTROLS,V3D, GAMEINIT, MAIN) {
            	

            	var main = new MAIN;
            	main.init();

            	// change to live
            	// var autoGame = new AUTOGAME;
            	// autoGame.init();

        }
    );

