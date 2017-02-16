// laserfs

#ifdef GL_ES
precision mediump float;
#endif

#define pi 3.14159265359;

uniform vec3 u_color1;
uniform vec3 u_color2;
varying vec2 vUv;


float ssdata( in vec2 minMax, in float stx) {

	return smoothstep( minMax.x, minMax.y, stx);

}


void main() {

	vec2 st = 1.0 * vUv;



	vec2 ml = vec2(0.0);
	ml =  vec2( step( 0.45, st.x ) - step( 0.55, st.x ) );
	ml = 1.0 - ml;
	float mlpct = ml.x * ml.y;



	vec2 middleGrad = vec2(0.0);
	 middleGrad.x = ssdata(vec2(0.1, 0.45), st.x);
	 middleGrad.y = ssdata(vec2(0.1, 0.45), 1.0 - st.x);
	float pct = middleGrad.x * middleGrad.y;


	vec3 color1 = vec3(0.0);
	color1.r = u_color1.r / 255.;
	color1.g = u_color1.g / 255.;
	color1.b = u_color1.b / 255.;
	vec3 color2 = vec3(0.0);
	color2.r = u_color2.r / 255.;
	color2.g = u_color2.g / 255.;
	color2.b = u_color2.b / 255.;


	color1 *= mlpct;

	if ( color1 == vec3(0.0) ) {
		//float c = 1.0;
		float c =  ssdata(vec2(0.45, 0.5), st.x) - ssdata(vec2(0.5, 0.55), st.x) ;
		float gradCentreColor = 1.0 - ( 0.25 * c);
		color1 = vec3( color2.r, color2.g, color2.b );
		color1 *= gradCentreColor;
		//color *= c;
	}

	gl_FragColor = vec4( color1, pct);
}