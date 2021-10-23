'use strict';

export async function load_model_from_file(gl, path){
	const response = await fetch(path);
	const text = await response.text();
	// TODO: Use loaded text array to create VAO
	// The hardcoded array is temporary to make sure the createVAO functions work
	const positions = [
		-0.5, -0.5, 0,
		0, 0.5, 0,
		0.5, -0.5, 0,
	];
	const normals = [
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
	];
	const indices = [
		0, 1, 2,
	];
	const model = create_model(gl, positions, normals, indices);
	return model;
}

export function create_model(gl, positions, normals, indices){
	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	const pos_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pos_buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

	const normal_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normal_buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

	const indices_buff = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buff);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	return {
		vao,
		indices_buff,
		num_indices: indices.length,
	};
}
