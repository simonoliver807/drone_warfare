// starfs fragment shader

varying vec2 vUv;

  float circle(in vec2 _st, in float _radius){
  vec2 dist = _st-vec2(0.5);
	return 1. - smoothstep(_radius-(_radius*0.001),
                         _radius+(_radius*0.001),
                         dot(dist,dist)*4.0);
}


void main() {

	vec2 st = 1.0 * vUv;

    float pct = 0.0;
    pct = distance(st,vec2(0.5));

    vec3 color1 = vec3(circle(st,1.0));

    color1 *= vec3( 1., 1., 1.); 

    float alphachan = 1.0;
    if ( color1 == vec3(0.0) ) {
        alphachan = 0.0;
    }
    else {
      float x2 = pct*pct;
      float x4 = x2*x2;
      float x6 = x4*x2;
      
      float fa = ( 5.0/10.0);
      float fb = (18.0/10.0);
      float fc = (22.0/1.1);
      
      alphachan =  fa*x6 - fb*x4 + fc*x2;  
      alphachan = 1. - alphachan;
    }


    gl_FragColor = vec4( color1 , alphachan);

}