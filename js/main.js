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
		attribute vec2 aUV;

		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;

		varying lowp vec4 vColor;
		varying lowp vec2 vUV;

		void main() {
			gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
			vColor = aColor;
			vUV = aUV;
		}
	`;

	const fsSource = `
		varying lowp vec4 vColor;
		varying lowp vec2 vUV;

		uniform sampler2D uSampler;

		void main(){
			gl_FragColor = texture2D(uSampler, vUV);
		}
	`;

	const shader = initShader(gl, vsSource, fsSource);

	let positions = [
		0, 1, 0,
		0, 0, 0,
		1, 0, 0,

		0, 0, 1,
		0, 1, 0,
		1, 0, 0,

		0, 0, 1,
		0, 0, 0,
		0, 1, 0,

		0, 0, 0,
		0, 0, 1,
		1, 0, 0,
    ];
	positions = positions.map(pos => {return pos-0.5});

	const colors = [];
	for(let i = 0; i < positions.length / 3; i++){
		colors.push(...getRandomColor());
	}

	const uvs = [
		0, 1,
		0, 0,
		1, 0,

		0, 1,
		1, 0,
		0, 0,

		0, 1,
		0, 0,
		1, 0,

		0, 0,
		0, 1,
		1, 1
	];

	const ourBuffer = createVBO(gl, positions, colors, uvs);

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

		drawObject(gl, ourBuffer, shader);

		requestAnimationFrame(drawScene);
	}
	requestAnimationFrame(drawScene);
}

function getRandomColor(){
	return [Math.random(), Math.random(), Math.random(), 1];
}

function createVBO(gl, positions, colors, uvs, indices){
	const posBuff = gl.createBuffer(); // Position buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	const colorBuff = gl.createBuffer(); // Color buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	const uvBuff = gl.createBuffer(); // Texture coords buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

	const texture = createTexture(gl);

	return {
		posBuff,
		colorBuff,
		uvBuff,
		texture,
	};
}

function drawObject(gl, obj, shader){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.bindBuffer(gl.ARRAY_BUFFER, obj.posBuff);
	gl.vertexAttribPointer(shader.attribLocs.vertex, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shader.attribLocs.vertex);

	gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuff);
	gl.vertexAttribPointer(shader.attribLocs.color, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shader.attribLocs.color);

	gl.bindBuffer(gl.ARRAY_BUFFER, obj.uvBuff);
	gl.vertexAttribPointer(shader.attribLocs.uv, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shader.attribLocs.uv);

	gl.bindTexture(gl.TEXTURE_2D, obj.texture);

	gl.drawArrays(gl.TRIANGLES, 0, 12);
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
			color: gl.getAttribLocation(program, 'aColor'),
			uv: gl.getAttribLocation(program, 'aUV'),
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

function createTexture(gl){
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	const data = [
		0, 0, 255, 255, 255, 255, 0, 255,
		255, 255, 0, 255, 0, 0, 255, 255,
	];
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(data));
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

	return texture;
}

window.onload = init;
