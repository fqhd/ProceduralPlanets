#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

out vec4 out_color;

void main(){
	out_color = vec4(1, 0.7, 1.0, 1.0);
}