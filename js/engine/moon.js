// Icosphere generation inspired by Andreas Kahler
const {vec3} = glMatrix;

export function create_moon_model(gl){
	const positions_map = new Map();
	const positions = create_icosahedron_vertices();
	const indices = create_icosahedron_indices();

	// Subdivide icosahedron triangles
	for(let i = 0; i < 5; i++){
		const num_indices = indices.length;
		for(let j = 0; j < num_indices; j+=3){
			subdivide_triangle(positions, positions_map, indices, j+0, j+1, j+2);
		}
	}

	normalize_positions(positions);

	scale_positions(positions);

	const normals = calc_normals(positions, indices);

	// const memoryUsage = 32 * positions.length + 16 * indices.length;
	// console.log(`Using ${memoryUsage} bytes of memory`);
	// console.log(`Num vertices: ${positions.length/3}`);

	// Upload data to GPU as VAO
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
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

	return {
		vao,
		indices_buff,
		num_indices: indices.length,
	};
}

function create_icosahedron_vertices(){
	const t = (1 + Math.sqrt(5)) / 2;

	const positions = [
		-1,  t,  0,
		1,  t,  0,
		-1, -t,  0,
		1, -t,  0,

		0, -1,  t,
		0,  1,  t,
		0, -1, -t,
		0,  1, -t,

		t,  0, -1,
		t,  0,  1,
		-t,  0, -1,
		-t,  0,  1,
	];

	return positions;
}

function create_icosahedron_indices(){
	const indices = [
		0, 11, 5,
		0, 5, 1,
		0, 1, 7,
		0, 7, 10,
		0, 10, 11,

		1, 5, 9,
		5, 11, 4,
		11, 10, 2,
		10, 7, 6,
		7, 1, 8,

		3, 9, 4,
		3, 4, 2,
		3, 2, 6,
		3, 6, 8,
		3, 8, 9,

		4, 9, 5,
		2, 4, 11,
		6, 2, 10,
		8, 6, 7,
		9, 8, 1,
	];

	return indices;
}

function subdivide_triangle(positions, positions_map, indices, a, b, c){
	const d = get_middle_point(positions, positions_map, indices[c], indices[a]);
	const e = get_middle_point(positions, positions_map, indices[a], indices[b]);
	const f = get_middle_point(positions, positions_map, indices[b], indices[c]);

	indices.push(d, e, f);
	indices.push(e, indices[b], f);
	indices.push(d, f, indices[c]);
	
	indices[c] = indices[a];
	indices[b] = d;
	indices[a] = e;
}

function get_middle_point(positions, positions_map, v0, v1){
	const x = (positions[v0 * 3] + positions[v1 * 3]) / 2;
	const y = (positions[v0 * 3 + 1] + positions[v1 * 3 + 1]) / 2;
	const z = (positions[v0 * 3 + 2] + positions[v1 * 3 + 2]) / 2;
	const midpoint = vec3.fromValues(x, y, z);
	const midpoint_hash = hash_vector(midpoint);
	let index = positions_map.get(midpoint_hash);
	if(!index){
		positions.push(midpoint[0]);
		positions.push(midpoint[1]);
		positions.push(midpoint[2]);
		index = positions.length/3 - 1;
		positions_map.set(midpoint_hash, index);
	}
	return index;
}

function hash_vector(vec){
	return vec.toString();
}

function normalize_positions(positions){
	for(let i = 0; i < positions.length; i+=3){
		const l = vec3.create();
		vec3.normalize(l, vec3.fromValues(positions[i], positions[i+1], positions[i+2]));
		positions[i] = l[0];
		positions[i+1] = l[1];
		positions[i+2] = l[2];
	}
}

function scale_positions(positions){
	for(let i = 0; i < positions.length; i+=3){
		const pos = vec3.fromValues(positions[i], positions[i+1], positions[i+2]);
		const height = get_height_from_pos(pos);
		vec3.scale(pos, pos, height);
		positions[i] = pos[0];
		positions[i+1] = pos[1];
		positions[i+2] = pos[2];
	}
}

function cavity_shape(x){
	return x;
}

function rim_shape(x){

}

function get_height_from_pos(pos){
	const crater_pos = vec3.create();
	crater_pos[0] = 0;
	crater_pos[1] = 1;
	crater_pos[2] = 0;

	const distance_vec = vec3.create();

	vec3.sub(distance_vec, pos, crater_pos);
	const x = vec3.length(distance_vec);

	const height = cavity_shape(x);

	// return 5 + noise.perlin3(vec[0] * 2, vec[1] * 2, vec[2] * 2) + noise.perlin3(vec[0] * 5, vec[1] * 5, vec[2] * 5) * 0.5;
	// return 1 + Math.sin(pos[1] * 20) * 0.05;
	return height;

}

function calc_normals(positions, indices){
	const triangle_map = new Map();

	// Loop and fill hashmap of connected triangles for each vertex
	for(let i = 0; i < indices.length; i+=3){
		const i0 = indices[i];
		const i1 = indices[i+1];
		const i2 = indices[i+2];

		const v0 = vec3.fromValues(positions[i0*3], positions[i0*3+1], positions[i0*3+2]);
		const v1 = vec3.fromValues(positions[i1*3], positions[i1*3+1], positions[i1*3+2]);
		const v2 = vec3.fromValues(positions[i2*3], positions[i2*3+1], positions[i2*3+2]);

		const v0_hash = hash_vector(v0);
		const v1_hash = hash_vector(v1);
		const v2_hash = hash_vector(v2);

		const v0_triangle_array = triangle_map.get(v0_hash);
		const v1_triangle_array = triangle_map.get(v1_hash);
		const v2_triangle_array = triangle_map.get(v2_hash);

		if(!v0_triangle_array){
			triangle_map.set(v0_hash, [i0, i1, i2]);
		}else{
			v0_triangle_array.push(i0, i1, i2);
		}

		if(!v1_triangle_array){
			triangle_map.set(v1_hash, [i0, i1, i2]);
		}else{
			v1_triangle_array.push(i0, i1, i2);
		}

		if(!v2_triangle_array){
			triangle_map.set(v2_hash, [i0, i1, i2]);
		}else{
			v2_triangle_array.push(i0, i1, i2);
		}
	}

	// Loop through positions and calculate normals
	const normals = [];
	for(let i = 0; i < positions.length; i+=3){
		const pos = vec3.fromValues(positions[i], positions[i+1], positions[i+2]);
		const pos_hash = hash_vector(pos);
		const connected_triangle_indices = triangle_map.get(pos_hash);

		const local_normals = [];
		for(let j = 0; j < connected_triangle_indices.length; j+=3){
			const i0 = connected_triangle_indices[j];
			const i1 = connected_triangle_indices[j+1];
			const i2 = connected_triangle_indices[j+2];

			const v0 = vec3.fromValues(positions[i0*3], positions[i0*3+1], positions[i0*3+2]);
			const v1 = vec3.fromValues(positions[i1*3], positions[i1*3+1], positions[i1*3+2]);
			const v2 = vec3.fromValues(positions[i2*3], positions[i2*3+1], positions[i2*3+2]);

			const tri_normal = calc_triangle_normal(v0, v1, v2);

			local_normals.push(tri_normal);
		}

		// Loop through normals and add them all together
		const local_normals_sum = vec3.fromValues(0, 0, 0);
		for(let j = 0; j < local_normals.length; j++){
			vec3.add(local_normals_sum, local_normals_sum, local_normals[j]);
		}
		vec3.normalize(local_normals_sum, local_normals_sum);

		normals.push(local_normals_sum[0], local_normals_sum[1], local_normals_sum[2]);
	}

	return normals;
}

function calc_triangle_normal(v0, v1, v2){
	const A0 = vec3.create();
	const A1 = vec3.create();

	vec3.sub(A0, v1, v0);
	vec3.sub(A1, v2, v0);

	const normal = vec3.create();

	vec3.cross(normal, A0, A1);
	return normal;
}