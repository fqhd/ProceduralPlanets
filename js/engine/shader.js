'use strict';

export async function load_shaders(gl){
	return await Promise.all([
		load_shader_from_dir(gl, '/res/shaders/model_shader/'),
		// load_shader_from_dir(gl, '/res/shaders/normal_entity_shader/'),
	]);
}

async function load_shader_from_dir(gl, shader_path){
	return Promise.all([
		fetch(shader_path+'vs.glsl'),
		fetch(shader_path+'fs.glsl'),
	]).then(async results => {
		return await Promise.all(results.map(r => r.text())).then(strings => {
			return {
				program: create_shader_program(gl, strings[0], strings[1]),
				uniform_locations: {},
			};
		});
	});
}

function create_shader_program(gl, vs_source, fs_source){
	const program = gl.createProgram();
	const vs = load_shader(gl, gl.VERTEX_SHADER, vs_source);
	const fs = load_shader(gl, gl.FRAGMENT_SHADER, fs_source);
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('Failed to link program');
	}

	return program;
}

function load_shader(gl, type, source){
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
