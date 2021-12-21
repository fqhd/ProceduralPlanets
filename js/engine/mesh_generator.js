export function create_moon_mesh(gl, positions, normals, mix_factors, indices){
	
	const memoryUsage = 4 * mix_factors.length + 4 * normals.length + 4 * positions.length + 4 * indices.length;
	console.log(`Using ${memoryUsage} bytes of memory`);
	console.log(`Num vertices: ${positions.length/3}`);

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

	const mix_factor_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mix_factor_buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mix_factors), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(2);
	gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 0, 0);

	const indices_buff = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buff);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

	return {
		vao,
		indices_buff,
		num_indices: indices.length,
	};
}