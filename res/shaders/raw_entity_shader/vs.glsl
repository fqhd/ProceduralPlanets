#version 300 es

layout(location = 0) in vec3 a_pos;
layout(location = 1) in vec3 a_normal;

out vec3 pass_normal;
out vec3 pass_to_camera_vector;
out vec3 pass_to_light_vector[2];

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform vec3 light_position[2];
uniform vec3 camera_position;

void main(){
	vec4 world_position = model * vec4(a_pos, 1.0);
	gl_Position = projection * view * world_position;

	// Calculating normal in world space
	pass_normal = normalize((model * vec4(a_normal, 0.0)).xyz);

	for(int i = 0; i < 2; i++){
		pass_to_light_vector[i] = light_position[i] - world_position.xyz;
	}
	pass_to_camera_vector = camera_position - world_position.xyz;
}
