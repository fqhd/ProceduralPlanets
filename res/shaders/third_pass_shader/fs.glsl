#version 300 es

#if(GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec2 pass_uv;

out vec4 out_color;

uniform sampler2D our_texture;

void main(){
	vec3 color = texture(our_texture, pass_uv).rrr;
	out_color = vec4(color, 1.0);
}