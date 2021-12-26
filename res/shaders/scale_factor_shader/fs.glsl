#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

out float scale;

uniform sampler2D sphere_texture;
uniform int sphere_texture_width;
uniform int sphere_texture_height;

vec3 get_vertex(int index) {
	int u = index % sphere_texture_width;
	int v = index / sphere_texture_width;

	ivec2 uv = ivec2(u, v);

	return texelFetch(sphere_texture, uv, 0).xyz;
}


void main() {
	// vec3 pos = get_vertex(gl_VertexID);
	scale = 1.0;
}