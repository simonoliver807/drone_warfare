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

    // float axis = st.y;

    // // if ( glowFloat < 0.9 ) {

    // //   axis = st.x;
    // //   axis = 1.0 - axis;

    // // }


    // // // vec2 glow = vec2(0.0);
    // // // if ( invertGrad < 0.5 ) {

    // // //   glow.x = ssdata(vec2(0.01, 0.5), 1.0 - axis);

    // // // }
    // // // else {

    // // //   glow.x = ssdata(vec2(0.01, 0.5), axis);

    // // // }

    vec2 middleGrad = vec2(0.0);
    middleGrad.x = ssdata(vec2(0.1, 0.6), st.x);
    middleGrad.y = ssdata(vec2(0.1, 0.6), 1.0 - st.x);
    float pct = middleGrad.x * middleGrad.y;

    vec3 color1 = vec3( 0.0, 0.0, 1.0 );

    gl_FragColor = vec4( color1 , pct );

}