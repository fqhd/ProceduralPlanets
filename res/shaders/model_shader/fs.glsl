#version 300 es

#if(GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_to_light_vector;
in vec3 pass_normal;
in vec2 pass_uv;

out vec4 out_color;

uniform sampler2D our_texture;
uniform sampler2D our_normal_map;
uniform vec3 light_color;


void main(){
	vec3 fragment_color = texture(our_texture, pass_uv).rgb;

	float brightness = dot(pass_to_light_vector, pass_normal);
	brightness = clamp(brightness, 0.2, 1.0);

	out_color = vec4(fragment_color * brightness, 1.0);
}
