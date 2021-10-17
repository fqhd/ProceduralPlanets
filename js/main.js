'use strict';

const {mat4} = glMatrix;

function init(){
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
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);

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

	const shader = initShader(gl, vsSource, fsSource);

	let positions = [
		0, 0, 0,
		0, 1, 0,
		1, 1, 0,
		1, 0, 0,

		0, 0, 1,
		0, 1, 1,
		1, 1, 1,
		1, 0, 1,
    ];
	positions = positions.map(pos => {return pos-0.5});

	const colors = [];
	for(let i = 0; i < 8; i++){
		colors.push(...getRandomColor());
	}

	const indices = [
		0, 1, 2,
		0, 2, 3,

		5, 4, 6,
		4, 7, 6,

		1, 4, 5,
		0, 4, 1,

		6, 3, 2,
		7, 3, 6,

		6, 1, 5,
		2, 1, 6,

		4, 0, 7,
		7, 0, 3,
	];

	let ourBuffer = createVBO(gl, positions, colors, indices);

	function drawScene(currTime){
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Creating projection and view matrices
		gl.useProgram(shader.program);
		let proj = mat4.create();
		let view = mat4.create();

		proj = mat4.perspective(proj, 45, gl.canvas.clientWidth/gl.canvas.clientHeight, 0.1, 1000);
		view = mat4.translate(view, view, [0, 0, -6]);
		view = mat4.rotate(view, view, currTime*0.001, [0, 1, 0]);
		view = mat4.rotate(view, view, currTime*0.001, [1, 0, 0]);

		gl.uniformMatrix4fv(shader.uniformLocs.view, false, view);
		gl.uniformMatrix4fv(shader.uniformLocs.proj, false, proj);

		drawObject(gl, ourBuffer, shader, indices.length);

		requestAnimationFrame(drawScene);
	}
	requestAnimationFrame(drawScene);
}

function getRandomColor(){
	return [Math.random(), Math.random(), Math.random(), 1];
}

function createVBO(gl, positions, colors, indices){
	const posBuff = gl.createBuffer(); // Position buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	const colorBuff = gl.createBuffer(); // Color buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	const indicesBuff = gl.createBuffer(); // Color buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuff);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

	return {
		positions: posBuff,
		colors: colorBuff,
		indices: indicesBuff,
	};
}

function drawObject(gl, buffer, shader, length){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.positions);
	gl.vertexAttribPointer(shader.attribLocs.vertex, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shader.attribLocs.vertex);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.colors);
	gl.vertexAttribPointer(shader.attribLocs.color, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shader.attribLocs.color);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);

	gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_BYTE, 0);
}


function initShader(gl, vsSource, fsSource){
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

	return {
		program,
		attribLocs: {
			vertex: gl.getAttribLocation(program, 'aPosition'),
			color: gl.getAttribLocation(program, 'aColor')
		},
		uniformLocs: {
			view: gl.getUniformLocation(program, 'uModelViewMatrix'),
			proj: gl.getUniformLocation(program, 'uProjectionMatrix'),
		}
	};
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

window.onload = init;
