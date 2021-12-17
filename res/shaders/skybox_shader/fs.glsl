#version 300 es

#if(GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_uv;

out vec4 out_color;

uniform samplerCube cubemap;

void main(){
	out_color = texture(cubemap, pass_uv);
}