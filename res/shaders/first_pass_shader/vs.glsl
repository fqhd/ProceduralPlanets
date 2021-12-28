#version 300 es

layout (location = 0) in vec2 aPosition;

out vec2 uv;

void main(){
	uv = (aPosition + vec2(1.0)) / 2.0;
	gl_Position = vec4(aPosition.xy, 0.0, 1.0);
}