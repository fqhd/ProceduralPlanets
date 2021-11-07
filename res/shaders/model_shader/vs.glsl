#version 300 es

layout(location = 0) in vec3 a_pos;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec3 a_tangent;
layout(location = 3) in vec2 a_uv;

out vec3 pass_to_camera_vector;
out vec3 pass_to_light_vector;
out vec2 pass_uv;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform vec3 light_position;
uniform vec3 camera_position;

void main(){
	vec4 world_position = model * vec4(a_pos, 1.0);
	gl_Position = projection * view * world_position;

	// Calculating tangent matrix
	vec3 normal = normalize((model * vec4(a_normal, 0.0)).xyz);
	vec3 tangent = normalize((model * vec4(a_tangent, 0.0)).xyz);
	vec3 bitangent = normalize(cross(normal, tangent));

	mat3 tangent_space_matrix = mat3(
		tangent.x, bitangent.x, normal.x,
		tangent.y, bitangent.y, normal.y,
		tangent.z, bitangent.z, normal.z
	);

	pass_to_light_vector = tangent_space_matrix * (light_position - world_position.xyz);
	pass_to_camera_vector = tangent_space_matrix * (camera_position - world_position.xyz);
	pass_uv = a_uv;
}
