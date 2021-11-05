#version 300 es

layout(location = 0) in vec3 a_pos;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec3 a_tangent;
layout(location = 3) in vec2 a_uv;

out vec3 pass_to_light_vector;
out vec3 pass_normal;
out vec2 pass_uv;

uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;
uniform vec3 light_position;

void main(){
	vec4 world_position = model * vec4(a_pos, 1.0);
	gl_Position = proj * view * world_position;

	pass_normal = (model * vec4(a_normal, 0.0)).xyz;
	pass_uv = a_uv;
	pass_to_light_vector = light_position - world_position.xyz;
}
