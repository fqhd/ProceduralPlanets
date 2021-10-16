'use strict';

const {mat4} = glMatrix;

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

	// Setting opengl state
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	const vsSource = `
		attribute vec4 aPosition;
		attribute vec4 aColor;

		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;

		varying lowp vec4 vColor;

		void main() {
			gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
			vColor = aColor;
		}
	`;

	const fsSource = `
		varying lowp vec4 vColor;

		void main(){
			gl_FragColor = vColor;
		}
	`;

	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

	const shaderProgramInfo = {
		program: shaderProgram,
		attribLocs: {
			vertex: gl.getAttribLocation(shaderProgram, 'aPosition'),
			color: gl.getAttribLocation(shaderProgram, 'aColor')
		},
		uniformLocs: {
			view: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			proj: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
		},
	};

	const positions = [
		-1.0,  1.0,
		1.0,  1.0,
		-1.0, -1.0,
		1.0, -1.0,
    ];

	const colors = [
		1, 0, 0, 1,
		0, 1, 0, 1,
		0, 0, 1, 1,
		1, 1, 1, 1,
	];

	let ourBuffer = createBufferObject(gl, positions, colors);

	renderBuffer(gl, ourBuffer, shaderProgramInfo);
}

function createBufferObject(gl, positions, colors){
	const posBuff = gl.createBuffer(); // Position buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	const colorBuff = gl.createBuffer(); // Color buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	return {
		positions: posBuff,
		colors: colorBuff
	};
}

function renderBuffer(gl, buffer, shader){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Creating projection and view matrices
	gl.useProgram(shader.program);
	let proj = mat4.create();
	let view = mat4.create();

	proj = mat4.perspective(proj, 45, gl.canvas.clientWidth/gl.canvas.clientHeight, 0.1, 1000);
	view = mat4.translate(view, view, [0, 0, -6]);

	gl.uniformMatrix4fv(shader.uniformLocs.view, false, view);
	gl.uniformMatrix4fv(shader.uniformLocs.proj, false, proj);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.positions);
	gl.vertexAttribPointer(shader.attribLocs.vertex, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shader.attribLocs.vertex);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.colors);
	gl.vertexAttribPointer(shader.attribLocs.color, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shader.attribLocs.color);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

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
