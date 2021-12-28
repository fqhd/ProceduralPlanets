#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec2 uv;

out float scale;

uniform sampler2D sphere_texture;
uniform float test_value;

void main() {
	vec3 pos = texture(sphere_texture, uv).rgb;
	scale = 1.0 + sin(pos.y * test_value) * 0.05;
}