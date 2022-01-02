#version 300 es

layout(location = 0) in vec2 aPosition;

out vec2 pass_uv;

void main(){
	gl_Position = vec4(aPosition, 0.0, 1.0);
	pass_uv = (aPosition + vec2(1.0)) / 2.0;
}