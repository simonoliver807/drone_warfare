// laserfs

#ifdef GL_ES
precision mediump float;
#endif

#define pi 3.14159265359;

uniform vec3 u_color;
varying vec2 vUv;


float ssdata( in vec2 minMax, in float stx) {

	return smoothstep( minMax.x, minMax.y, stx);

}


void main() {

	vec2 st = 1.0 * vUv;


	vec3 color1 = vec3(0.0);
	color1.r = u_color.r / 255.;
	color1.g = u_color.g / 255.;
	color1.b = u_color.b / 255.;

	vec2 bl = vec2(0.0);
	 bl.x = ssdata(vec2(0.1, 0.6), st.x);
	 bl.y = ssdata(vec2(0.1, 0.6), 1.0 - st.x);
	float pct = bl.x * bl.y;
	

	gl_FragColor = vec4( color1, pct ) ;


}