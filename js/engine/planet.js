// Icosphere generation inspired by Andreas Kahler
const {vec3} = glMatrix;

import { deg_to_rad } from './utils.js';

export function create_planet_model(gl){
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

	const indices_buff = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buff);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

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
		const height = get_height_from_vec(pos);
		vec3.scale(pos, pos, height);
		positions[i] = pos[0];
		positions[i+1] = pos[1];
		positions[i+2] = pos[2];
	}
}

function get_height_from_vec(vec){
	return 5 + noise.perlin3(vec[0] * 2, vec[1] * 2, vec[2] * 2) + noise.perlin3(vec[0] * 5, vec[1] * 5, vec[2] * 5) * 0.5;
}