export function init_cube_model(gl){
	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	// Creating the positions buffer
	const pos_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pos_buff);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
	const positions = [
		-1, -1, 1,
		-1, 1, 1,
		1, 1, 1,
		1, -1, 1,

		-1, -1, -1,
		-1, 1, -1,
		1, 1, -1,
		1, -1, -1,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	// Creating the indices buffer
	const indices_buff = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buff);
	const indices = [
		0, 1, 2, 0, 2, 3,
		4, 5, 1, 4, 1, 0,
		3, 2, 6, 3, 6, 7,
		1, 5, 6, 1, 6, 2,
		7, 6, 5, 7, 5, 4,
		4, 0, 7, 7, 0, 3,
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}
