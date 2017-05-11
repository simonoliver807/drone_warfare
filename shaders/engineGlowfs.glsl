// engineGlowfs

precision highp float;
precision highp int;

#define pi 3.14159265359;

uniform float glowFloat;
varying vec2 vUv;


float ssdata( in vec2 minMax, in float stx) {

  return smoothstep( minMax.x, minMax.y, stx);

}



void main() {

	  vec2 st = 1.0 * vUv;

    vec2 middleGrad = vec2(0.0);
    middleGrad.x = ssdata(vec2(0.01, 0.99), st.x);
    middleGrad.y = ssdata(vec2(0.01, 0.99), 1.0 - st.x);
    float pct = middleGrad.x * middleGrad.y;

    vec3 color1 = vec3( 1.0, 0.0, 0.0 );

    gl_FragColor = vec4( color1 , pct );

}