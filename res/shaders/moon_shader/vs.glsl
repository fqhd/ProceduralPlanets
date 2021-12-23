#version 300 es

layout (location = 0) in vec3 aPosition;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in float color_mix_factor;

out vec3 pass_normal;
out vec3 pass_position;
out float pass_color_mix_factor;

uniform mat4 projection;
uniform mat4 view;

void main(){
	gl_PointSize = 3.0;
	gl_Position = projection * view * vec4(aPosition, 1.0);
	pass_normal = aNormal;
	pass_position = aPosition;
	pass_color_mix_factor = color_mix_factor;
}