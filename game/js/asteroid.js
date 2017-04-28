define(['THREE','lib/improvedNoise'], function(THREE,IMPROVEDNOISE) {


	return function () {

		var geo;
		var geometry;
		var m;
		var material;
		var mesh;
	    var mtrfs;
	    var mtrvs;
	    var newGroup;
	    var obj;
	    var radius;
	    var t = 5;
  		var texture1;
  		var groupSplit;
  		var inoise = new IMPROVEDNOISE;


		var ast;
		var astposarr = [];
		var astgroup;
		astposarr.push( [ [ 0,0,0 ], [ -10,-10 ,10], [ 10, -10, 10], [ -10, 10, 10 ], [ 10, 10, 10 ], [ -10,-10 ,-10], [ 10, -10, -10], [ -10, 10, -10 ], [ 10, 10, -10 ] ] );
		astposarr.push( [ [ 0,0,0 ], [ -10,-10 ,10], [ 10, -10, 10], [ -10, 10, 10 ], [ 10, 10, 10 ], [ 10, -10, -10], [ 10, 10, -10 ] ] );
		astposarr.push( [ [ 0,0,0 ], [ -10,-10 ,10], [ 10, -10, 10], [ -10, 10, 10 ], [ 10, 10, 10 ] ] );
		astposarr.push( [ [ -10,-10 ,10], [ 10, -10, 10], [ -10, 10, 10 ] ] );
		astposarr.push( [ [ -10,-10 ,10], [ 10, -10, 10] ] );
		var setastnum = [ 9, 7 , 5 , 3 , 2];
		var count = 0;


	    var randMinMax = function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
        }

		return {

			initMat: function( texture ) {

				groupSplit = { 9: [ 4, 3 ], 7: [ 2, 3], 5: [ 1, 2] };
				texture1 = new THREE.TextureLoader().load( "images/planets/mercury.jpg" );
				mtrfs = document.getElementById( 'mtrfs' ).textContent;
			    mtrvs = document.getElementById( 'mtrvs' ).textContent;
			    var uniforms = THREE.UniformsUtils.merge( [
                    THREE.UniformsLib[ 'lights' ]
                ])
                var res = new THREE.Vector3( window.innerWidth , window.innerHeight );
                uniforms.camera = { type: 'v3', value: new THREE.Vector3( 0, 0, 20) };
    			uniforms.camdir = { type: 'v3', value: new THREE.Vector3( 0, 0, -1) };

    			// may need. to upate on window resize
    			uniforms.iResolution = { type: 'v2', value: res };
    			uniforms.lightdir = { type: 'v3', value: new THREE.Vector3( 0, 0, 1) };
    			uniforms.newPosVar = { type: 'f', value: 0 };
    			uniforms.rockcolor = { type: 'v3', value: new THREE.Vector3() };
                uniforms.texture = { type: 't', value: texture1 };
                uniforms.texture.wrapS = THREE.RepeatWrapping;
                uniforms.texture.wrapT = THREE.RepeatWrapping;
			    material = new THREE.RawShaderMaterial({
			        uniforms: uniforms,
			        vertexShader: mtrvs,
			        fragmentShader: mtrfs,
			        lights: true
			    })
			    geometry = new THREE.DodecahedronGeometry( randMinMax( 35, 40 ), 0);
			    for (var i = 0; i < geometry.vertices.length; i++) {
			    	var data = inoise.noise( geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z );
			    	geometry.vertices[i].x += ( data * 5 ); 
			    	geometry.vertices[i].y += ( data * 5 ); 
			    	geometry.vertices[i].z += ( data * 5 ); 
			    }
			    geometry.verticesNeedUpdate = true;


			},

			create: function( astpergroup ) {



                    astgroup = new THREE.Group();
                    astgroup.userData.atbd = 0;
                    for (var k = 0; k < astpergroup; k++) {
                        
                        var mat = material.clone();
					    mat.uniforms.rockcolor.value.set( 0.4, 0.4, 0.4 );
					    mat.uniforms.newPosVar.value = randMinMax( 10, 30);
					    var obj =  new THREE.Mesh( geometry, mat );
					    obj.userData.t = t;
                        obj.position.set( astposarr[0][k][0], astposarr[0][k][1], astposarr[0][k][2] );
                        obj.name = 'astmesh' + '_' + k ;
                        astgroup.add( obj );
                    } 


					return astgroup;

			},

			breakDown: function( group, body ) {

				m = group.children.length; 
				var retarr = []
				newGroup = new THREE.Group();
				if ( m > 3) {
					mesh = group.children[ m-1 ];
					group.remove( group.children[ m-1 ] );
					newGroup.children = group.children.splice( groupSplit[ m ][ 0 ], groupSplit[ m ][ 1 ]);
					newGroup.name =  group.name + (~~group.name.substr( group.name.length -1 ) + 1);
					newGroup.userData.atbd = 0;
					newGroup.position.set( group.position.x + 15, group.position.y, group.position.z);
					for (var i = 0; i < newGroup.children.length; i++) {
						newGroup.children[i].userData.t = t;
						newGroup.children[i].parent = newGroup;
					}
					retarr.push( newGroup );
				}
				if ( m === 3 || m === 2) {
					mesh = group.children[ m-1 ];
					group.remove( group.children[ m-1 ] );

				}
				mesh.position.set( group.position.x -15, group.position.y, group.position.z);
				mesh.userData.t = t;
				mesh.userData.atbd = 0;
				retarr.push( mesh );
				for (var i = 0; i < group.children.length; i++) {
					group.children[i].userData.t = t;
				}
				group.userData.atbd = 0;

				return retarr;

			}
		}
	}




});