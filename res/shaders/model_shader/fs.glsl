#version 300 es

#if(GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_tangent;
in vec3 pass_normal;
in vec2 pass_uv;

out vec4 out_color;

uniform sampler2D ourTexture;

const vec3 light_dir = vec3(5.0, 0.0, -1.0);

void main(){
	vec4 fragment_color = texture(ourTexture, pass_uv);
	float brightness = dot(normalize(light_dir), normalize(pass_normal));
	brightness = clamp(brightness, 0.2, 1.0);
	out_color = vec4(pass_tangent * brightness, 1.0);
}
