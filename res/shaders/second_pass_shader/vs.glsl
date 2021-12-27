#version 300 es

out vec3 vPos;

uniform mat4 projection;
uniform mat4 view;
uniform sampler2D sphere_texture;
uniform sampler2D scale_texture;

uniform int texture_width;

ivec2 index_to_uv(int index){
	int u = index % texture_width;
	int v = index / texture_width;

	return ivec2(u, v);
}

vec3 get_texture_vec3(sampler2D texture, int index) {
	ivec2 uv = index_to_uv(index);

	return texelFetch(texture, uv, 0).xyz;
}

float get_texture_f(sampler2D texture, int index) {
	ivec2 uv = index_to_uv(index);

	return texelFetch(texture, uv, 0).r;
}

void main() {
	float scale = get_texture_f(scale_texture, gl_VertexID);
	vec3 pos = get_texture_vec3(sphere_texture, gl_VertexID);
	gl_Position = projection * view * vec4(pos * scale, 1.0);
	vPos = pos;
}
