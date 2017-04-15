// planetGlowvs


precision highp float;
precision highp int;
uniform mat4 modelViewMatrix; // optional
uniform mat4 projectionMatrix; // optional
attribute vec3 position;
attribute vec2 uv;


//varying vec2 fragCoord;
varying vec2 vUv;

void main()	{

		vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
	
}