#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_normal;

out vec4 out_color;

const vec3 light_dir = vec3(0.0, 0.0, -1.0);

void main(){
	float brightness = dot(-light_dir, normalize(pass_normal));
	brightness = max(brightness, 0.1);

	vec3 obj_color = vec3(0.7, 0.2, 1.0);

	out_color = vec4(obj_color * brightness, 1.0);
}