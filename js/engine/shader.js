'use strict';

export async function createShader(gl, shaderPath){
	return Promise.all([
		fetch(shaderPath+'vs.glsl'),
		fetch(shaderPath+'fs.glsl'),
	]).then(results => {
		return Promise.all(results.map(r => r.text())).then(strings => {
			const program = createShaderProgram(gl, strings[0], strings[1]);
			return program;
		});
	});
}

function createShaderProgram(gl, vsSource, fsSource){
	const program = gl.createProgram();
	const vs = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fs = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
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
