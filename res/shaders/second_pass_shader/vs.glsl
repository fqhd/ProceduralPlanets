#version 300 es

out vec3 pass_normal;
out vec3 pass_position;
out float pass_nmap_mix;

uniform mat4 projection;
uniform mat4 view;
uniform sampler2D sphere_texture;
uniform sampler2D vertex_data_texture;
uniform highp isampler2D indices_texture;

uniform int sphere_texture_width;
uniform int indices_texture_width;

ivec2 index_to_uv(int index, int width){
	int u = index % width;
	int v = index / width;

	return ivec2(u, v);
}

vec3 get_sphere_pos(int index) {
	ivec2 uv = index_to_uv(index, sphere_texture_width);

	return texelFetch(sphere_texture, uv, 0).xyz;
}

float get_scale(int index) {
	ivec2 uv = index_to_uv(index, sphere_texture_width);

	return texelFetch(vertex_data_texture, uv, 0).r;
}

float get_nmap_mix_factor(int index) {
	ivec2 uv = index_to_uv(index, sphere_texture_width);

	return texelFetch(vertex_data_texture, uv, 0).g;
}

int get_index(int index){
	ivec2 uv = index_to_uv(index, indices_texture_width);

	return texelFetch(indices_texture, uv, 0).r;
}

vec3 get_neighbouring_pos(int neighbouring_index){
	int index_in_texture = gl_VertexID * 10 + neighbouring_index;

	int pos_index = get_index(index_in_texture);
	vec3 position = get_sphere_pos(pos_index);
	float scale = get_scale(pos_index);
	return position * scale;
}

vec3 get_current_pos(){
	float scale = get_scale(gl_VertexID);
	vec3 pos = get_sphere_pos(gl_VertexID);
	return pos * scale;
}

vec3 calc_normal(vec3 a, vec3 b, vec3 c){
	vec3 a_b = b - a;
	vec3 a_c = c - a;
	vec3 normal = cross(a_b, a_c);
	return normalize(normal);
}

vec3 calc_tri_normal(vec3 curr_pos, int index){
	vec3 pos_1 = get_neighbouring_pos(index*2);
	vec3 pos_2 = get_neighbouring_pos(index*2+1);

	return calc_normal(curr_pos, pos_1, pos_2);
}

vec3 calc_average_normal(vec3 curr_pos){
	vec3 n;
	for(int i = 0; i < 5; i++){
		n += calc_tri_normal(curr_pos, i);
	}
	return normalize(n);
}

void main() {
	vec3 pos = get_current_pos();

	pass_normal = calc_average_normal(pos);
	pass_position = pos;
	pass_nmap_mix = get_nmap_mix_factor(get_index(gl_VertexID));

	gl_Position = projection * view * vec4(pos, 1.0);
}
