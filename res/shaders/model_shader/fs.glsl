#version 300 es

#if(GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_normal;

out vec4 out_color;

const vec3 light_dir = vec3(-10.0, 0.0, -0.5);

void main(){
	float brightness = dot(normalize(light_dir), normalize(pass_normal));
	brightness = clamp(brightness, 0.2, 1.0);
	out_color = vec4(vec3(0.0, 3.0, 8.0) * brightness, 1.0);
}
