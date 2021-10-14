function main(){
	// Querying the canvas from the DOM
	const canvas = document.getElementById('canvas');

	// Creating webgl context
	const gl = canvas.getContext('webgl');

	// Error checking(exiting if the context creation failed)
	if(gl === null){
		alert('Failed to initialize webgl. Your browser may not support it.');
		return;
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);


	const vsSource = `
		attribute vec4 aVertexPosition;

		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;

		void main() {
		gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		}
	`;

	const fsSource = `
		void main(){
			gl_FragColor = vec4(1, 0, 0, 1);
		}
	`;
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

	const shaderProgramInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
		},
		uniformLocations: {
			view: gl.getUniformLocations(shaderProgram, 'uModelViewMatrix'),
			view: gl.getUniformLocations(shaderProgram, 'uProjectionMatrix'),
		},
	};

	const positions = [
		-1.0,  1.0,
		1.0,  1.0,
		-1.0, -1.0,
		1.0, -1.0,
    ];

	ourBuffer = createBuffer(gl, positions);
	
}

function createBuffer(gl, positions){
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	return buffer;
}

function initShaderProgram(gl, vsSource, fsSource){
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		alert('Failed to link shaders to program');
		return null;
	}

	return program;
}

function loadShader(gl, type, source){
	// Creating the shader object
	const shader = gl.createShader(type);

	// Sending the source to the shader object
	gl.shaderSource(shader, source);

	// Compiling the shader
	gl.compileShader(shader);

	// Checking if the shader has been compiled properly
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		alert('Failed to compile shader!');
		return null;
	}

	return shader;
}

window.onload = main;
