#version 300 es

layout (location = 0) in vec2 aPosition;

out vec2 uv;

void main(){
	uv = aPosition;
	gl_Position = vec4(aPosition.xy, 0.0, 1.0);
}