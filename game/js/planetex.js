define(['three','lib/improvedNoise'], function(THREE,IMPROVEDNOISE) {


	return function () {

		var geo;
		var geometry;
		var geometry2;
		var material;
		var mesh;
	    var mtrfs;
	    var mtrvs;
	    var obj;
  		var texture1;
  		var inoise = new IMPROVEDNOISE;


  		 var createGeo = function ( radius ) {

			geo = new THREE.DodecahedronGeometry( radius, 0);
			for (var i = 0; i < geo.vertices.length; i++) {
				var data = inoise.noise( geo.vertices[i].x, geo.vertices[i].y, geo.vertices[i].z );
				geo.vertices[i].x += ( data * 5 ); 
				geo.vertices[i].y += ( data * 5 ); 
				geo.vertices[i].z += ( data * 5 ); 
			}
			geo.verticesNeedUpdate = true;
			return geo;

		}

		return {

			initMat: function( texture ) {

			    material = new THREE.MeshPhongMaterial( { reflectivity: 1 });
			    material.emissiveIntensity = 10;
			    geometry = createGeo( Math.random()*5 );
			    geometry2 = createGeo( 40 );
			    // geometry = new THREE.DodecahedronGeometry( Math.random()*5, 0);
			    // for (var i = 0; i < geometry.vertices.length; i++) {
			    // 	var data = inoise.noise( geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z );
			    // 	geometry.vertices[i].x += ( data * 5 ); 
			    // 	geometry.vertices[i].y += ( data * 5 ); 
			    // 	geometry.vertices[i].z += ( data * 5 ); 
			    // }
			    // geometry.verticesNeedUpdate = true;p

			},
			create: function( radius, numofrocks ) {


		    	var group = new THREE.Group();
		    	var numofrocks = numofrocks || 20;
			    var col = 1;
		    	while ( numofrocks-- ) {
			    	var mat = material.clone();
			    	var colora = new THREE.Color();
			    	if ( col == 1) {	colora.r = 0.168; colora.g = 0.156; colora.b = 0.0; }
			    	if ( col == 2) {	colora.r = 1.0; colora.g = 0.0; colora.b = 0.0; }
			    	if ( col == 3) {	colora.r = 0.733; colora.g = 0.164; colora.b = 0.164; }
			    	if ( col == 4) {	colora.r = 0.921; colora.g = 0.949; colora.b = 0.094; }
			    	if ( col == 5) {	colora.r = 0.988; colora.g = 0.874; colora.b = 0.411;  col = 0;}
			    	col ++;

			    	mat.color.set( colora );
			    	mat.emissive.set( colora );
			    	radius ? obj =  new THREE.Mesh( geometry2, mat ) : obj =  new THREE.Mesh( geometry, mat );
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