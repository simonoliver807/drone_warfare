define(['THREE'], function(THREE) {


	return function () {

		var geometry;
		var material;
		var mesh;
	    var mtrfs;
	    var mtrvs;
	    var obj;
	    var radius = Math.random();
	    var t = 100;
  		var texture1;




		return {

			initMat: function( texture ) {

				texture ? texture1 = new THREE.TextureLoader().load( texture ) : texture1 = new THREE.TextureLoader().load( "images/planets/ice.jpg" );
				mtrfs = document.getElementById( 'mtrfs' ).textContent;
			    mtrvs = document.getElementById( 'mtrvs' ).textContent;
			    var uniforms = THREE.UniformsUtils.merge( [
                    THREE.UniformsLib[ 'lights' ]
                ])
                // var npv = randMinMax( 15, 20);
                var npv = 10;
            //    uniforms.texture = { type: 't', value: texture1 };
                uniforms.newPosVar = { type: 'f', value: npv };
                uniforms.rockcolor = { type: 'v3', value: new THREE.Vector3( 0, 0, 0 ) };
			    material = new THREE.RawShaderMaterial({
			        uniforms: uniforms,
			        vertexShader: mtrvs,
			        fragmentShader: mtrfs,
			        lights: true
			    })

			},

			create: function( radius ) {


		    	var group = new THREE.Group();
		    	var numofrocks = 20;
		    	radius = THREE.Math.randInt( radius, radius + 1);
		    	var detail = THREE.Math.randInt(0 , 1);
			    geometry = new THREE.DodecahedronGeometry( radius, detail );
			    var col = 1;
		    	while ( numofrocks-- ) {
			    	var mat = material.clone();

			    	if ( col == 1) {	mat.uniforms.rockcolor.value.set( 0.168, 0.156, 0); }
			    	if ( col == 2) {	mat.uniforms.rockcolor.value.set( 1.0, 0.0, 0.0 ); }
			    	if ( col == 3) {	mat.uniforms.rockcolor.value.set( 0.733, 0.164, 0.164 ); }
			    	if ( col == 4) {	mat.uniforms.rockcolor.value.set( 0.921, 0.949, 0.094 ); }
			    	if ( col == 5) {	mat.uniforms.rockcolor.value.set( 0.988, 0.874, 0.411 );  col = 0;}
			    	col ++;

			    	obj =  new THREE.Mesh( geometry, mat );
			    	var x = THREE.Math.randInt(1,10);
			    	var y = THREE.Math.randInt(1,10);
			    	var z = THREE.Math.randInt(1,10);

			    	obj.position.set( x, y, z);
			    	group.add( obj );
			    }
				return group;

			}

		}
	}




});