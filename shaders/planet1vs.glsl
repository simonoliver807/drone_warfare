// planet1vs

precision highp float;
precision highp int;
uniform mat4 modelViewMatrix; // optional
uniform mat4 projectionMatrix; // optional
attribute vec3 position;
attribute vec2 uv;

//varying vec3 vecPos;
//varying vec3 vecNormal;

// #if NUM_DIR_LIGHTS > 0
// 	struct DirectionalLight {
// 		vec3 direction;
// 		vec3 color;
// 		int shadow;
// 		float shadowBias;
// 		float shadowRadius;
// 		vec2 shadowMapSize;
// 	};
// 	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
// #endif
struct DirectionalLight {
	vec3 direction;
	vec3 color;
	float distance;
};
uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
varying vec3 color2;


//varying vec2 fragCoord;
varying vec2 vUv;

void main()	{

		vUv = uv;
		float r = directionalLights[0].color.r;
    	float g = directionalLights[0].color.g;
		float b = directionalLights[0].color.b;


		// vecPos = ( modelViewMatrix * vec4( position, 1.0 )).xyz;
		// vecNormal = ( modelViewMatrix * vec4( normal, 0.0 )).xyz;
		// for ( int i = 0; i < NUM_DIR_LIGHTS; i++) {
		// 	color2.rgb += clamp(dot(-directionalLights[i].direction, vecNormal), 0.0, 1.0) * directionalLights[i].color;

		// }

		//gl_Position = projectionMatrix * modelViewMatrix * vec4(vecPos, 1.0);


     	color2 = vec3(r,g,b);
     	//color2 = vec3(r,1.0,0.0);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
        //fragCoord = position.xy;
	
}