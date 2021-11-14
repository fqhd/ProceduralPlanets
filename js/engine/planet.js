export function create_planet_model(gl){
	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	const positions = [
		0, 0, 0,
		0, 1, 0,
		1, 1, 1,
	];

	const pos_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pos_buff);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	const indices = [
		0, 1, 2,
	];

	const indices_buff = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buff);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	return {
		vao,
		indices_buff,
		num_indices: indices.length,
	};
}