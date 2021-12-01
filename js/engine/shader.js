export async function load_shaders(gl){
	return {
		entity_shader: await load_shader_from_dir(gl, 'res/shaders/entity_shader/'),
		skybox_shader: await load_shader_from_dir(gl, 'res/shaders/skybox_shader/'),
		planet_shader: await load_shader_from_dir(gl, 'res/shaders/planet_shader/'),
	};
}

export function bind_shader_tex_attribs(gl, shaders){
	const {entity_shader, skybox_shader} = shaders;

	// Normal Mapped Entity Shader
	gl.useProgram(entity_shader.program);
	set_uniform_i(gl, entity_shader, 'our_texture', 0);
	set_uniform_i(gl, entity_shader, 'our_normal_map', 1);

	// Skybox entity
	gl.useProgram(skybox_shader.program);
	set_uniform_i(gl, skybox_shader, 'cubemap', 0);
	
}

export function set_uniform_f(gl, shader, name, value){
	if(!shader.uniform_locations[name]){
		shader.uniform_locations[name] = gl.getUniformLocation(shader.program, name);
	}
	gl.uniform1f(shader.uniform_locations[name], value);
}

export function set_uniform_i(gl, shader, name, value){
	if(!shader.uniform_locations[name]){
		shader.uniform_locations[name] = gl.getUniformLocation(shader.program, name);
	}
	gl.uniform1i(shader.uniform_locations[name], value);
}

export function set_uniform_vec3(gl, shader, name, value){
	if(!shader.uniform_locations[name]){
		shader.uniform_locations[name] = gl.getUniformLocation(shader.program, name);
	}
	gl.uniform3fv(shader.uniform_locations[name], value);
}

export function set_uniform_mat4(gl, shader, name, value){
	if(!shader.uniform_locations[name]){
		shader.uniform_locations[name] = gl.getUniformLocation(shader.program, name);
	}
	gl.uniformMatrix4fv(shader.uniform_locations[name], false, value);
}

async function load_shader_from_dir(gl, shader_path){
    // Fetching shader files from path(directory)
    let responses = await Promise.all([
        fetch(shader_path+'vs.glsl'),
        fetch(shader_path+'fs.glsl'),
    ]).catch(() => console.error('Failed to catch get shader files from: ' + shader_path));

	// Converting shader file fetch requests into array of promises to convert them to text
	let shader_string_promises = responses.map(r => r.text());

	// Awaiting the promises
	let shader_strings = await Promise.all(shader_string_promises);

	// Creating a shader program from the promises
    return {
        program: create_shader_program(gl, shader_strings[0], shader_strings[1]),
        uniform_locations: {},
    };
}

function create_shader_program(gl, vs_source, fs_source){
	const program = gl.createProgram();
	const vs = create_shader(gl, gl.VERTEX_SHADER, vs_source);
	const fs = create_shader(gl, gl.FRAGMENT_SHADER, fs_source);
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('Failed to link program');
	}

	return program;
}

function create_shader(gl, type, source){
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
