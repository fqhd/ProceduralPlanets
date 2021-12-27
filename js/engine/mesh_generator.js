export function create_quad(gl){
	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	const positions = [
		-1, -1,
		-1, 1,
		1, 1,
		1, -1,
	];
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	const indices = [
		0, 2, 1, 0, 3, 2
	];
	const indices_buffer = create_indices_buffer(gl, indices);
	return {
		vao,
		indices_buffer,
	};
}

export function create_indices_buffer(gl, indices){
	const id = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, id);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
	return {
		id,
		num_indices: indices.length,
	};
}
