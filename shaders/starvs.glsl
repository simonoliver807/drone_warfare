// starvs vertex shader

uniform vec4 quat1;
varying vec2 vUv;



vec3 qrot(vec4 q, vec3 v){ 
	return v + 2.0*cross(q.xyz, cross(q.xyz,v) + q.w*v); 
} 
//rotate vector (alternative) vec3 qrot_2(vec4 q, vec3 v) { return v*(q.w*q.w - dot(q.xyz,q.xyz)) + 2.0*q.xyz*dot(q.xyz,v) + 2.0*q.w*cross(q.xyz,v); } 
//combine quaternions vec4 qmul(vec4 a, vec4 b) { return vec4(cross(a.xyz,b.xyz) + a.xyz*b.w + b.xyz*a.w, a.w*b.w - dot(a.xyz,b.xyz)); } 
//inverse quaternion vec4 qinv(vec4 q) { return vec4(-q.xyz,q.w); } 
//perspective project vec4 get_projection(vec3 v, vec4 pr) { return vec4( v.xy * pr.xy, v.z*pr.z + pr.w, -v.z); } 
//transform by Spatial forward vec3 trans_for(vec3 v, Spatial s) { return qrot(s.rot, v*s.pos.w) + s.pos.xyz; } 
//transform by Spatial inverse vec3 trans_inv(vec3 v, Spatial s) { return qrot( vec4(-s.rot.xyz, s.rot.w), (v-s.pos.xyz)/s.pos.w ); }


void main(){

	vec3 tempos = position;
	vec3 npos = qrot( quat1, position);
	tempos = tempos + npos;

	vUv = uv;
	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;

}