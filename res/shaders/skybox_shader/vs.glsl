#version 300 es

layout (location = 0) in vec3 aPosition;

out vec3 pass_uv;

uniform mat4 projection;
uniform mat4 view;

void main(){
	gl_Position = projection * view * vec4(aPosition, 1.0);
	pass_uv = aPosition;
}