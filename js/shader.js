function getShader(gl){
	const vsource = `#version 300 es
		in vec2 pos;

		void main(){
			gl_Position = vec4(pos, 0.0, 1.0);
		}`;

	const fsource = `#version 300 es
		precision highp float;

		out vec4 fragColor;

        void main() {
            fragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`;

	return {
		program: createShaderProgram(gl, vsource, fsource),
	};
}

function createShaderProgram(gl, vsource, fsource){
	const program = gl.createProgram();
	const vs = loadShader(gl, gl.VERTEX_SHADER, vsource);
	const fs = loadShader(gl, gl.FRAGMENT_SHADER, fsource);
	return {
		program,
	};
}

function loadShader(gl, type, source){
	const vs = gl.createShader(type);
	gl.shaderSource(vs, source);
	gl.compileShader(vs);
	if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
		if(type == gl.VERTEX_SHADER){
			console.log('Failed to compile vertex shader');
		}else{
			console.log('Failed to compile fragment shader');
		}
	}
	return vs;
}
