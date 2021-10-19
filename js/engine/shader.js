'use strict';

async function createShader(gl, vsPath, fsPath){
	let response = await fetch(vsPath);
	const vsCode = await response.json();

	response = await fetch(fsPath);
	const fsCode = await response.blob();

	const program = createShaderProgram(gl, vsCode, fsCode);

	return program;
}

async function

function createShaderProgram(gl, vsSource, fsSource){
	const program = gl.createProgram();
	const vs = load_shader(gl, gl.VERTEX_SHADER, vsSource);
	const fs = load_shader(gl, gl.FRAGMENT_SHADER, fsSource);
	gl.attachShader(gl.VERTEX_SHADER, vs);
	gl.attachShader(gl.FRAGMENT_SHADER, fs);
	gl.linkProgram(program);
	if(!gl.getProgramParamete(program, gl.LINK_STATUS)){
		console.error('Failed to link program');
	}

	return program;
}

function loadShader(gl, type, source){
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		if(type == gl.VERTEX_SHADER){
			console.error('Failed to compile vertex shader');
		}else{
			console.error('Failed to compile fragment shader');
		}
	}
	return shader;
}
