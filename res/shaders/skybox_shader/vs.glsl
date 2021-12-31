#version 300 es

layout (location = 0) in vec3 aPosition;

out vec3 pass_position;

uniform mat4 projection;
uniform mat4 view;

void main(){
	pass_position = aPosition;

	vec4 pos = projection * view * vec4(aPosition, 1.0);
	gl_Position = pos.xyww;
}