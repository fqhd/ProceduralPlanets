#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 vPos;

out vec4 out_color;

const vec3 light_dir = vec3(0.0, -1.0, -1.0);

void main(){
	vec3 normal = normalize(cross(dFdx(vPos), dFdy(vPos)));

	float brightness = dot(-normalize(light_dir), normalize(normal));
	brightness = max(brightness, 0.2);

	vec3 obj_color = vec3(1.0, 1.0, 1.0);

	out_color = vec4(obj_color * brightness, 1.0);
}