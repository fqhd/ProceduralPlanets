#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec2 uv;

out float scale;

uniform sampler2D sphere_texture;

void main() {
	vec3 pos = texture(sphere_texture, uv).rgb;
	scale = 1.0;
}