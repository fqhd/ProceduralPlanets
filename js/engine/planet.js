// Icosphere generation inspired by Andreas Kahler
const {vec3} = glMatrix;

export function create_planet_model(gl){
	const positions = [
		-0.5, -0.5, 0,
		0, 0.5, 0,
		0.5, -0.5, 0
	];

	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	const pos_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pos_buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);


	return {
		vao,
		num_vertices: positions.length/3
	};
}


