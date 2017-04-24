

	// mtrvs

	precision highp float;
	precision highp int;

	uniform mat4 modelViewMatrix; // optional
	uniform mat4 projectionMatrix; // optional
	uniform float newPosVar;
	attribute vec3 position;
	attribute vec3 normal;
	attribute vec2 uv;

	varying vec2 vUv;
	//varying vec3 vecNormal;
	varying vec3 vpos;
	// varying vec3 color2;
	varying vec3 lightdir;


	struct DirectionalLight {
		vec3 direction;
		vec3 color;
		float distance;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];


	float rand (in float _x) {
		return fract(sin(_x)*1e4);
	}

	void main()	{

		vUv = uv;
		//vecNormal = normal;
		vpos = position;
		lightdir = directionalLights[1].direction;




		vec3 vecNormal = ( modelViewMatrix * vec4( normal, 0.0 )).xyz;
		// color2.rgb += clamp(dot(-directionalLights[0].direction, vecNormal), 0.0, 1.0) * directionalLights[0].color;
		// for ( int i = 0; i < NUM_DIR_LIGHTS; i++) {
		// 	color2.rgb += clamp(dot(-directionalLights[i].direction, vecNormal), 0.0, 1.0) * directionalLights[i].color;
		// }


		float i = floor(position.x);  // integer
		float f = fract(position.x);  // fraction
		vec3 newPosition = vec3(0.0);
		float y = mix( rand(i), rand(i + 3.0), smoothstep( 0.0, 1.0, f) );
		newPosition.y += y * newPosVar;
		newPosition = position + newPosition ;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}	











// precision highp float;
// precision highp int;

// uniform mat4 modelViewMatrix; // optional
// uniform mat4 projectionMatrix; // optional
// uniform float newPosVar;
// attribute vec3 position;
// attribute vec3 normal;
// attribute vec2 uv;

// varying vec2 vUv;

// struct DirectionalLight {
// 	vec3 direction;
// 	vec3 color;
// 	float distance;
// };
// uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
// varying vec3 color2;


// float rand (in float _x) {
// 	return fract(sin(_x)*1e4);
// }

// void main()	{

// 	vUv = uv;

// 	vec3 vecNormal = ( modelViewMatrix * vec4( normal, 0.0 )).xyz;
// 	color2.rgb += clamp(dot(-directionalLights[0].direction, vecNormal), 0.0, 1.0) * directionalLights[0].color;
// 	for ( int i = 0; i < NUM_DIR_LIGHTS; i++) {
// 		color2.rgb += clamp(dot(-directionalLights[i].direction, vecNormal), 0.0, 1.0) * directionalLights[i].color;
// 	}


// 	float i = floor(position.x);  // integer
// 	float f = fract(position.x);  // fraction
// 	vec3 newPosition = vec3(0.0);
// 	float y = mix( rand(i), rand(i + 3.0), smoothstep( 0.0, 1.0, f) );
// 	newPosition.y += y * newPosVar;
// 	newPosition = position + newPosition ;
// 	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

// }	

