#version 300 es

layout (location = 0) in vec3 aPosition;

out vec3 vPos;

uniform mat4 projection;
uniform mat4 view;
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
	vec3 pos = get_vertex(gl_VertexID);
	gl_Position = projection * view * vec4(pos, 1.0);

	vPos = pos;
}
