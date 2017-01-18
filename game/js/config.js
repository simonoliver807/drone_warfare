requirejs(['oimo','three','objloader','socket_io','tgaloader','mtlloader','v3d','gameinit','main'],
        function (OIMO, THREE, OBJLOADER, SOCKET_IO,TGALoader, MTLLoader, V3D, GAMEINIT, MAIN) {
            	var main = new MAIN;
            	main.init();

        }
    );

