#version 300 es

#if(GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_uv;

layout (location = 0) out vec3 out_color;
layout (location = 1) out float out_depth;

uniform samplerCube cubemap;

void main(){
	out_color = texture(cubemap, pass_uv).rgb;
	out_depth = 100.0;
}