// engineGlowfs

precision highp float;
precision highp int;

#define pi 3.14159265359;
#define SHADER_NAME EngineGlow

uniform float glowFloat;
uniform float endpoint_roundness;
uniform float midpoint_roundness;
varying vec2 vUv;


float alpha = 1.0;


float CalcBlobIntensity( vec2 texture_coords, float endpoint_roundness, float midpoint_roundness, float vertebra_bias, float edge_softness )
{   
    float distance_to_axis = abs( texture_coords.x-0.5 )*2.0;
    float biased_vertebra_pos = abs( pow(texture_coords.y,vertebra_bias)-0.5 )*2.0;
    float vertebra_intensity = 1.0-pow( biased_vertebra_pos, midpoint_roundness );
    return pow(clamp( vertebra_intensity - pow( distance_to_axis, endpoint_roundness ), 0.0, 1.0 ), edge_softness );
}


void main() {

    vec2 position = vUv;

    float x = position.x*2.0;
    float y = position.y*2.0;

    float a = CalcBlobIntensity( vUv, endpoint_roundness, midpoint_roundness + glowFloat, 1.0, .9);

    alpha = smoothstep( 0.0, 1.0, a );

    vec3 color = vec3(a) * vec3(1.0, 0.0, 0.0);

   gl_FragColor = vec4( vec3( color ), alpha);



}