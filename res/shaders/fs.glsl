#version 300 es

#if(GL_FRAGMENT_PRECISION_HIGH)
	precisium highp float;
#else
	precision mediump float;

out vec4 out_color;

void main(){
	out_color = vec4(1.0, 0.0, 0.0, 1.0);
}
