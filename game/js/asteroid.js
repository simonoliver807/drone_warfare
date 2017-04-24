define(['THREE'], function(THREE) {


	return function () {

		var asterarr = [];
		var asteroid;
		var geometry;
		var m;
		var material;
		var mesh;
	    var mtrfs;
	    var mtrvs;
	    var obj;
	    var t = 100;
  		var texture1;



	    var randMinMax = function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
        }

		return {

			initMat: function( texture ) {

				texture ? texture1 = new THREE.TextureLoader().load( texture ) : texture1 = new THREE.TextureLoader().load( "images/planets/mercury.jpg" );
				mtrfs = document.getElementById( 'mtrfs' ).textContent;
			    mtrvs = document.getElementById( 'mtrvs' ).textContent;
			    var uniforms = THREE.UniformsUtils.merge( [
                    THREE.UniformsLib[ 'lights' ]
                ])
                var npv = randMinMax( 15, 20);
                var res = new THREE.Vector3( window.innerWidth , window.innerHeight );
                uniforms.camera = { type: 'v3', value: new THREE.Vector3( 0, 0, 20) };
    			uniforms.camdir = { type: 'v3', value: new THREE.Vector3( 0, 0, -1) };
    			uniforms.iResolution = { type: 'v2', value: res };
    			uniforms.lightdir = { type: 'v3', value: new THREE.Vector3( 0, 0, 1) };
    			uniforms.newPosVar = { type: 'f', value: npv };
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

			},

			create: function( shape, radius ) {

			//	this.astbody = 0;


				if( shape == 1 ) {
			        var w = randMinMax( 16, 64 );
			        var h = randMinMax( 16, 64 );
			        geometry = new THREE.SphereGeometry( radius, w, h );

			    }
			    if( shape == 2 ) {

			        var detail = randMinMax( 0, 3 );
			    //    geometry = new THREE.DodecahedronGeometry( radius, 1);
			    	
			    	this.radius = randMinMax( radius, radius + 10)
			    	geometry = new THREE.IcosahedronGeometry ( this.radius, detail );

			    }
			    var mat = material.clone();
			    mat.uniforms.rockcolor.value.set( 0.4, 0.4, 0.4 );
			    obj =  new THREE.Mesh( geometry, mat );



			    obj.userData.t = t;
				return obj;

			},

			breakDown: function( group, body ) {

				m = group.children.length; 

				if ( m === 3 || m === 2) {
					mesh = group.children[ m-1 ];
					group.remove( group.children[ m-1 ] );
					mesh.position.set( group.position.x -15, group.position.y, group.position.z);
					mesh.userData.t = t;
					mesh.userData.atbd = 0;

				}
				for (var i = 0; i < group.children.length; i++) {
					group.children[i].userData.t = t;
				}
				group.userData.atbd = 0;

				return mesh;

			}
		}
	}




});