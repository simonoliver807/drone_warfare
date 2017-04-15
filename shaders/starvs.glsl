// starvs vertex shader

uniform vec4 quat1;
varying vec2 vUv;



vec3 qrot(vec4 q, vec3 v){ 
	return v + 2.0*cross(q.xyz, cross(q.xyz,v) + q.w*v); 
} 

void main(){

	vec3 tempos = position;
	vec3 npos = qrot( quat1, position);
	tempos = tempos + npos;

	vUv = uv;
	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;

}