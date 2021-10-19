class Shader {
	#gl;
	constructor(gl, vs_source, fs_source){
		this.#gl = gl;

		this.program = create_shader_program(gl, vs_source, fs_source);
	}

	use(){
		this.#gl.useProgram(this.program);
	}
}

function create_shader_program(gl, vs_source, fs_source){
	const program = gl.createProgram();
	const vs = load_shader(gl, gl.VERTEX_SHADER, vs_source);
	const fs = load_shader(gl, gl.FRAGMENT_SHADER, fs_source);
	gl.attachShader(gl.VERTEX_SHADER, vs);
	gl.attachShader(gl.FRAGMENT_SHADER, fs);
	gl.linkProgram(program);
	if(!gl.getProgramParamete(program, gl.LINK_STATUS)){
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

export default Shader;
