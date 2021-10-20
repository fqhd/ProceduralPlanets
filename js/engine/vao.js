'use strict';

export async function loadModelFromFile(gl, path){
	const response = await fetch(path);
	const text = await response.text();
	// TODO: Use loaded text array to create VAO
	// The hardcoded array is temporary to make sure the createVAO functions work
	const positions = [
		-0.5, -0.5,
		0, 0.5,
		0.5, -0.5,
	];
	const normals = [
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
	];
	const indices = [
		0, 1, 2,
	];
	const model = createModel(gl, positions, normals, indices);
	return model;
}

export function createModel(gl, positions, normals, indices){
	let vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	let posBuff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

	let normalBuff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

	let indicesBuff = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuff);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	return {
		vao,
		indicesBuff,
		numVertices: indices.length,
	};
}

export function drawModel(gl, model){
	gl.bindVertexArray(model.vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indicesBuff);
	gl.drawElements(gl.TRIANGLES, model.numVertices, gl.UNSIGNED_SHORT, 0);
}
